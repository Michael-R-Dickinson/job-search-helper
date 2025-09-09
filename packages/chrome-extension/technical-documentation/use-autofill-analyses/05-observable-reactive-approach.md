# Observable/Reactive Approach for useAutofillInputs

## Key Ideas

The current hook manages complex async data flows that would benefit from reactive programming patterns. By using observables (or similar reactive streams), we can model the autofill process as data flows that transform through operators, eliminating complex promise management and providing declarative data transformation. This approach treats state as streams of events that can be combined, transformed, and subscribed to.

**Benefits:**
- Declarative data flow transformation
- Automatic handling of async operations and backpressure
- Composable operators for complex logic
- Built-in error handling and retry mechanisms
- Elimination of race conditions through stream coordination
- Excellent for handling multiple async data sources

## State Management Strategy

### Live-Access Ref State
- Convert refs to observable sources (BehaviorSubject)
- Stream combinators handle coordination between different data sources
- Reactive state automatically updates when source streams emit

### React State Integration
- Custom hooks subscribe to observables and update React state
- Observables provide the "source of truth" for all async operations
- React state becomes a projection of observable state

### State Transitions
Data flows through observable pipelines with automatic state transitions:
```
pageLoad$ → elements$ → simpleInstructions$ → complexInstructions$ → executionResults$
```

## Implementation

### 1. Observable Data Sources

```typescript
import { BehaviorSubject, Subject, Observable, combineLatest, from, EMPTY } from 'rxjs'
import { 
  map, 
  switchMap, 
  catchError, 
  filter, 
  shareReplay, 
  withLatestFrom,
  tap,
  startWith,
  distinctUntilChanged
} from 'rxjs/operators'

// Core data streams
class AutofillObservables {
  // Input streams
  private elementsSubject = new BehaviorSubject<InputElement[]>([])
  private pageLoadedSubject = new BehaviorSubject<boolean>(false)
  private executeAutofillSubject = new Subject<void>()
  private executeResumeSubject = new Subject<string>()
  private iframeCompletedSubject = new Subject<void>()
  
  // Derived streams
  public elements$ = this.elementsSubject.asObservable()
  public pageLoaded$ = this.pageLoadedSubject.asObservable()
  
  // Configuration streams
  public usesIframes$ = this.elements$.pipe(
    map(elements => elements.length <= 3),
    distinctUntilChanged(),
    shareReplay(1)
  )
  
  public shouldFetchAutofills$ = this.elements$.pipe(
    map(elements => elements.length > 3),
    distinctUntilChanged(),
    shareReplay(1)
  )
  
  // Instruction fetching streams
  public simpleInstructions$ = combineLatest([
    this.elements$,
    this.pageLoaded$,
    this.shouldFetchAutofills$
  ]).pipe(
    filter(([elements, pageLoaded, shouldFetch]) => 
      elements.length > 0 && pageLoaded && shouldFetch
    ),
    switchMap(([elements]) => 
      from(triggerGetSimpleAutofillValues(elements)).pipe(
        catchError(error => {
          console.error('Error fetching simple instructions:', error)
          return EMPTY
        })
      )
    ),
    shareReplay(1)
  )
  
  // Process simple instructions to extract special tokens
  public processedSimpleInstructions$ = this.simpleInstructions$.pipe(
    map(instructions => {
      const resumeInstructions = instructions.getResumeAutofills()
      const freeResponseInputs = instructions.getFreeResponseAutofills()
      const specialInputs = [...freeResponseInputs, ...resumeInstructions]
      const filtered = instructions.exclude(specialInputs)
      
      return {
        instructions: filtered,
        resume: resumeInstructions,
        freeResponse: freeResponseInputs
      }
    }),
    shareReplay(1)
  )
  
  public complexInstructions$ = combineLatest([
    this.elements$,
    this.processedSimpleInstructions$
  ]).pipe(
    switchMap(([elements, simpleData]) => {
      const complexInputs = elements.filter(
        el => !simpleData.instructions.some(i => i.elementReferenceId === el.elementReferenceId) &&
              el.isLLMAutofillable
      )
      
      console.log('triggering complex inputs', complexInputs)
      
      if (complexInputs.length === 0) {
        return of(new AutofillReadyInputArray([]))
      }
      
      return from(triggerGetAutofillValues(complexInputs)).pipe(
        catchError(error => {
          console.error('Error fetching complex instructions:', error)
          return of(new AutofillReadyInputArray([]))
        })
      )
    }),
    shareReplay(1)
  )
  
  // Combined instruction data
  public allInstructions$ = combineLatest([
    this.processedSimpleInstructions$,
    this.complexInstructions$,
    this.elements$
  ]).pipe(
    map(([simpleData, complexInstructions, elements]) => {
      const allInstructions = new AutofillReadyInputArray([
        ...simpleData.instructions,
        ...complexInstructions
      ])
      
      // Calculate unfilled inputs
      const filledInputIds = allInstructions.map(i => i.elementReferenceId)
      const unfilledInputs = elements.filter((el, idx, self) => {
        const isUnfilled = !filledInputIds.includes(el.elementReferenceId) && !!el.label
        const isTextInput = 
          el.element instanceof HTMLInputElement || el.element instanceof HTMLTextAreaElement
        const isUnique = 
          idx === self.findIndex(i => cleanText(i.label || '') === cleanText(el.label || ''))
        
        return isUnfilled && isTextInput && isUnique
      })
      
      return {
        simple: simpleData.instructions,
        complex: complexInstructions,
        resume: simpleData.resume,
        freeResponse: simpleData.freeResponse,
        unfilled: unfilledInputs,
        all: allInstructions
      }
    }),
    shareReplay(1)
  )
  
  // Execution streams
  public autofillExecution$ = this.executeAutofillSubject.pipe(
    withLatestFrom(this.allInstructions$, this.fetchStatus$),
    switchMap(([_, instructions, fetchStatus]) => 
      from(this.executeAutofillSequence(instructions, fetchStatus)).pipe(
        map(resumeInstructions => ({ 
          type: 'success' as const, 
          resumeInstructions 
        })),
        catchError(error => 
          of({ type: 'error' as const, error })
        ),
        startWith({ type: 'loading' as const })
      )
    )
  )
  
  public resumeExecution$ = this.executeResumeSubject.pipe(
    withLatestFrom(this.allInstructions$),
    switchMap(([resumeName, instructions]) =>
      from(this.executeResumeAutofill(instructions.resume, resumeName)).pipe(
        map(() => ({ type: 'success' as const })),
        catchError(error => of({ type: 'error' as const, error })),
        startWith({ type: 'loading' as const })
      )
    )
  )
  
  // Status streams
  public fetchStatus$ = combineLatest([
    this.shouldFetchAutofills$,
    this.allInstructions$
  ]).pipe(
    map(([shouldFetch, instructions]) => {
      if (!shouldFetch) return 'fetched' as AutofillFetchStatus
      if (instructions.simple.length === 0 && instructions.complex.length === 0) {
        return 'loading' as AutofillFetchStatus
      }
      return 'fetched' as AutofillFetchStatus
    }),
    startWith('loading' as AutofillFetchStatus),
    distinctUntilChanged(),
    shareReplay(1)
  )
  
  public fillingStatus$ = combineLatest([
    this.autofillExecution$.pipe(startWith(null)),
    this.resumeExecution$.pipe(startWith(null)),
    this.iframeCompletedSubject.pipe(startWith(null))
  ]).pipe(
    map(([autofillResult, resumeResult, iframeCompleted]) => {
      if (autofillResult?.type === 'loading' || resumeResult?.type === 'loading') {
        return 'filling_inputs' as AutofillFillingStatus
      }
      if (autofillResult?.type === 'error' || resumeResult?.type === 'error') {
        return 'error' as AutofillFillingStatus
      }
      if (autofillResult?.type === 'success' || resumeResult?.type === 'success' || iframeCompleted) {
        return 'success' as AutofillFillingStatus
      }
      return 'idle' as AutofillFillingStatus
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )
  
  // Methods to emit events
  setElements(elements: InputElement[]) {
    this.elementsSubject.next(elements)
  }
  
  setPageLoaded() {
    this.pageLoadedSubject.next(true)
  }
  
  executeAutofill() {
    this.executeAutofillSubject.next()
  }
  
  executeResume(resumeName: string) {
    this.executeResumeSubject.next(resumeName)
  }
  
  iframeCompleted() {
    this.iframeCompletedSubject.next()
  }
  
  private async executeAutofillSequence(instructions: any, fetchStatus: AutofillFetchStatus) {
    // Send autofill messages to iframes
    await sendMessageToIframes(eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES)
    
    // Determine animation speed
    const loading = fetchStatus === 'loading'
    const animationSpeed = loading ? AutofillAnimationSpeeds.SLOW : AutofillAnimationSpeeds.FAST
    
    // Fill simple inputs
    console.log('filling simple inputs', instructions.simple)
    await autofillInputElements(instructions.simple, animationSpeed)
    
    // Fill complex inputs
    console.log('filling complex inputs', instructions.complex)
    await autofillInputElements(instructions.complex, AutofillAnimationSpeeds.NONE)
    
    returnCompletionMessage()
    
    // Return resume instructions
    return instructions.simple.filter(
      (instruction: any) => instruction.value === RESUME_UPLOAD_VALUE
    )
  }
  
  private async executeResumeAutofill(resumeInstructions: AutofillReadyInputArray, resumeName: string) {
    await sendMessageToIframes(eventTypes.BEGIN_RESUME_AUTOFILL, { resumeName })
    
    if (resumeInstructions.length > 0) {
      resumeInstructions.setAutofillResumeUrl(resumeName)
      await autofillInputElements(resumeInstructions, AutofillAnimationSpeeds.NONE)
    }
  }
}
```

### 2. React Hook Integration

```typescript
import { useEffect, useState, useCallback } from 'react'
import { useSubscription } from 'use-subscription'

const useObservableState = <T>(observable: Observable<T>, defaultValue: T): T => {
  const [value, setValue] = useState<T>(defaultValue)
  
  useEffect(() => {
    const subscription = observable.subscribe(setValue)
    return () => subscription.unsubscribe()
  }, [observable])
  
  return value
}

const useAutofillInputs = () => {
  const elementsRef = useInputElements()
  const [observables] = useState(() => new AutofillObservables())
  
  // Subscribe to observable streams
  const allInstructions = useObservableState(observables.allInstructions$, {
    simple: new AutofillReadyInputArray([]),
    complex: new AutofillReadyInputArray([]),
    resume: new AutofillReadyInputArray([]),
    freeResponse: [],
    unfilled: [],
    all: new AutofillReadyInputArray([])
  })
  
  const fetchStatus = useObservableState(observables.fetchStatus$, 'loading' as AutofillFetchStatus)
  const fillingStatus = useObservableState(observables.fillingStatus$, 'idle' as AutofillFillingStatus)
  const usesIframes = useObservableState(observables.usesIframes$, false)
  
  // Handle page load
  useOnPageLoad(() => {
    observables.setElements(elementsRef.current)
    observables.setPageLoaded()
    console.log('Found inputs for autofill: ', elementsRef.current)
  }, 1000)
  
  // Handle iframe completion
  useEffect(() => {
    const onFrameMsg = (event: MessageEvent) => {
      if (event.data?.type === eventTypes.AUTOFILL_WITH_IFRAMES_COMPLETED) {
        observables.iframeCompleted()
      }
    }
    
    window.addEventListener('message', onFrameMsg)
    return () => window.removeEventListener('message', onFrameMsg)
  }, [observables])
  
  // Interface methods
  const executeAutofillSequence = useCallback(async () => {
    // Subscribe to the execution result and return the resume instructions
    return new Promise<AutofillReadyInputArray>((resolve, reject) => {
      const subscription = observables.autofillExecution$.subscribe({
        next: (result) => {
          if (result.type === 'success') {
            resolve(result.resumeInstructions)
            subscription.unsubscribe()
          } else if (result.type === 'error') {
            reject(result.error)
            subscription.unsubscribe()
          }
        },
        error: reject
      })
      
      observables.executeAutofill()
    })
  }, [observables])
  
  const executeResumeAutofill = useCallback(async (resumeName: string) => {
    return new Promise<void>((resolve, reject) => {
      const subscription = observables.resumeExecution$.subscribe({
        next: (result) => {
          if (result.type === 'success') {
            resolve()
            subscription.unsubscribe()
          } else if (result.type === 'error') {
            reject(result.error)
            subscription.unsubscribe()
          }
        },
        error: reject
      })
      
      observables.executeResume(resumeName)
    })
  }, [observables])
  
  const executeSaveFilledValues = useCallback(async () => {
    const filledInputs = elementsRef.current.filter(el => el.isLLMAutofillable)
    await triggerSaveFilledValues(filledInputs)
  }, [elementsRef])
  
  return {
    executeAutofillSequence,
    executeResumeAutofill,
    executeSaveFilledValues,
    unfilledInputs: allInstructions.unfilled,
    freeResponseInputs: allInstructions.freeResponse,
    fillingStatus,
    fetchStatus,
    usesIframes,
  }
}
```

### 3. Alternative with Custom Observable Hook

```typescript
// Custom hook for simpler observable integration without external dependencies
const useObservableValue = <T>(
  createObservable: () => Observable<T>,
  defaultValue: T,
  deps: any[] = []
): T => {
  const [value, setValue] = useState<T>(defaultValue)
  
  useEffect(() => {
    const observable = createObservable()
    const subscription = observable.subscribe(setValue)
    return () => subscription.unsubscribe()
  }, deps)
  
  return value
}

// Usage in hook
const useAutofillInputs = () => {
  const elementsRef = useInputElements()
  const [observables] = useState(() => new AutofillObservables())
  
  const allInstructions = useObservableValue(
    () => observables.allInstructions$,
    {
      simple: new AutofillReadyInputArray([]),
      complex: new AutofillReadyInputArray([]),
      resume: new AutofillReadyInputArray([]),
      freeResponse: [],
      unfilled: [],
      all: new AutofillReadyInputArray([])
    },
    [observables]
  )
  
  // ... rest of implementation
}
```

## Benefits of This Approach

1. **Declarative Data Flow**: Complex async logic expressed as observable pipelines
2. **Automatic Coordination**: Observables handle timing and dependencies automatically
3. **Error Handling**: Built-in error handling with operators like catchError
4. **Backpressure**: Automatic handling of fast producers and slow consumers
5. **Composability**: Easy to combine multiple data sources with operators
6. **Testing**: Observable streams are highly testable with marble testing
7. **Memory Management**: Automatic cleanup with proper subscription management

## Interface Preservation

The hook maintains the exact same external interface while internally using observable streams to manage all async state. The reactive approach provides more predictable data flow and better handling of complex async scenarios.

## Additional Benefits

- **Hot/Cold Observables**: Can handle both immediate values and async streams
- **Retry Logic**: Built-in retry mechanisms for failed operations
- **Throttling/Debouncing**: Easy to add rate limiting to user actions
- **Time-based Operations**: Built-in support for timeouts and delays
- **Multi-cast**: Share expensive operations across multiple subscribers