# Custom Hooks Decomposition for useAutofillInputs

## Key Ideas

The current `useAutofillInputs` hook handles too many responsibilities. By decomposing it into focused custom hooks, we can achieve better separation of concerns, improved testability, and clearer data flow. Each hook would manage a specific aspect of the autofill process while maintaining clear interfaces between them.

**Benefits:**
- Single responsibility for each hook
- Easier to test individual pieces of functionality
- Better reusability across components
- Clearer dependency relationships
- Reduced cognitive load for developers

## State Management Strategy

### Live-Access Ref State
- Each hook manages its own refs for its specific domain
- Shared refs passed as dependencies between hooks
- Clear ownership of each piece of state

### React State Integration
- Hooks expose only the state they own
- Higher-level hooks compose lower-level ones
- State updates flow through well-defined interfaces

### State Transitions
State flows through a pipeline of hooks, each handling specific transitions:
```
usePageLoad → useInputDetection → useAutofillInstructions → useAutofillExecution
```

## Implementation

### 1. usePageLoadDeferred - Page Load Management

```typescript
const usePageLoadDeferred = () => {
  const deferredRef = useRef<{
    promise: Promise<void>
    resolve: () => void
    isResolved: boolean
  } | null>(null)
  
  if (!deferredRef.current) {
    let resolveFn!: () => void
    const promise = new Promise<void>((resolve) => {
      resolveFn = resolve
    })
    deferredRef.current = { promise, resolve: resolveFn, isResolved: false }
  }
  
  const resolvePageLoad = useCallback(() => {
    if (!deferredRef.current?.isResolved) {
      deferredRef.current?.resolve()
      if (deferredRef.current) {
        deferredRef.current.isResolved = true
      }
    }
  }, [])
  
  return {
    pageLoadPromise: deferredRef.current.promise,
    resolvePageLoad,
    isPageLoaded: deferredRef.current.isResolved
  }
}
```

### 2. useIframeDetection - Iframe Usage Detection

```typescript
const useIframeDetection = (elements: InputElement[]) => {
  const [usesIframes, setUsesIframes] = useState(false)
  const [detectionComplete, setDetectionComplete] = useState(false)
  
  useEffect(() => {
    if (elements.length > 0) {
      const hasIframes = elements.length <= 3
      setUsesIframes(hasIframes)
      setDetectionComplete(true)
      
      if (hasIframes) {
        console.log('Detected iframe usage, limited input functionality')
      } else {
        console.log('Found inputs for autofill: ', elements)
      }
    }
  }, [elements])
  
  return { usesIframes, detectionComplete }
}
```

### 3. useAutofillInstructions - Instruction Fetching Logic

```typescript
type InstructionsState = {
  simple: AutofillReadyInputArray
  complex: AutofillReadyInputArray
  resume: AutofillReadyInputArray
  freeResponse: InputElement[]
  unfilledInputs: InputInfo[]
}

const useAutofillInstructions = (
  elements: InputElement[],
  pageLoadPromise: Promise<void>,
  shouldFetch: boolean
) => {
  const [instructions, setInstructions] = useState<InstructionsState>({
    simple: new AutofillReadyInputArray([]),
    complex: new AutofillReadyInputArray([]),
    resume: new AutofillReadyInputArray([]),
    freeResponse: [],
    unfilledInputs: []
  })
  
  const [fetchStatus, setFetchStatus] = useState<AutofillFetchStatus>('loading')
  
  const processSpecialTokens = useCallback((instructions: AutofillReadyInputArray) => {
    const resumeInstructions = instructions.getResumeAutofills()
    const freeResponseInputs = instructions.getFreeResponseAutofills()
    
    return {
      resume: resumeInstructions,
      freeResponse: freeResponseInputs,
      special: [...freeResponseInputs, ...resumeInstructions]
    }
  }, [])
  
  const calculateUnfilledInputs = useCallback((allInstructions: AutofillReadyInputArray) => {
    const filledInputIds = allInstructions.map(i => i.elementReferenceId)
    
    return elements.filter((el, idx, self) => {
      const isUnfilled = !filledInputIds.includes(el.elementReferenceId) && !!el.label
      const isTextInput = 
        el.element instanceof HTMLInputElement || el.element instanceof HTMLTextAreaElement
      const isUnique = 
        idx === self.findIndex(i => cleanText(i.label || '') === cleanText(el.label || ''))
      
      return isUnfilled && isTextInput && isUnique
    })
  }, [elements])
  
  useEffect(() => {
    if (!shouldFetch || elements.length === 0) return
    
    let isCancelled = false
    
    const fetchInstructions = async () => {
      try {
        await pageLoadPromise
        
        if (isCancelled) return
        
        // Fetch simple instructions
        const simpleInstructions = await triggerGetSimpleAutofillValues(elements)
        const simpleSpecial = processSpecialTokens(simpleInstructions)
        const simpleFiltered = simpleInstructions.exclude(simpleSpecial.special)
        
        if (isCancelled) return
        
        // Fetch complex instructions
        const complexInputs = elements.filter(
          el => !simpleInstructions.some(i => i.elementReferenceId === el.elementReferenceId) &&
                el.isLLMAutofillable
        )
        
        const complexInstructions = await triggerGetAutofillValues(complexInputs)
        const allInstructions = new AutofillReadyInputArray([
          ...simpleInstructions,
          ...complexInstructions
        ])
        
        const complexSpecial = processSpecialTokens(allInstructions)
        const complexFiltered = complexInstructions.exclude(complexSpecial.special)
        const unfilledInputs = calculateUnfilledInputs(allInstructions)
        
        if (isCancelled) return
        
        setInstructions({
          simple: simpleFiltered,
          complex: complexFiltered,
          resume: complexSpecial.resume,
          freeResponse: complexSpecial.freeResponse,
          unfilledInputs
        })
        setFetchStatus('fetched')
        
      } catch (error) {
        if (!isCancelled) {
          console.error('Error fetching autofill instructions:', error)
          setFetchStatus('error')
        }
      }
    }
    
    fetchInstructions()
    
    return () => {
      isCancelled = true
    }
  }, [elements, pageLoadPromise, shouldFetch, processSpecialTokens, calculateUnfilledInputs])
  
  return { instructions, fetchStatus }
}
```

### 4. useAutofillExecution - Execution Logic

```typescript
const useAutofillExecution = (instructions: InstructionsState) => {
  const [fillingStatus, setFillingStatus] = useState<AutofillFillingStatus>('idle')
  
  const executeSequence = useCallback(async () => {
    setFillingStatus('filling_inputs')
    
    try {
      // Send autofill messages to iframes
      await sendMessageToIframes(eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES)
      
      // Fill simple inputs first
      console.log('filling simple inputs', instructions.simple)
      await autofillInputElements(instructions.simple, AutofillAnimationSpeeds.FAST)
      
      // Fill complex inputs
      console.log('filling complex inputs', instructions.complex)
      await autofillInputElements(instructions.complex, AutofillAnimationSpeeds.NONE)
      
      setFillingStatus('success')
      returnCompletionMessage()
      
      // Return resume instructions for compatibility
      return instructions.simple.filter(
        instruction => instruction.value === RESUME_UPLOAD_VALUE
      )
    } catch (error) {
      console.error('Error during autofill execution:', error)
      setFillingStatus('error')
      throw error
    }
  }, [instructions])
  
  const executeResumeAutofill = useCallback(async (resumeName: string) => {
    try {
      await sendMessageToIframes(eventTypes.BEGIN_RESUME_AUTOFILL, { resumeName })
      
      const resumeInstructions = instructions.resume
      if (resumeInstructions.length > 0) {
        resumeInstructions.setAutofillResumeUrl(resumeName)
        await autofillInputElements(resumeInstructions, AutofillAnimationSpeeds.NONE)
      }
    } catch (error) {
      console.error('Error during resume autofill:', error)
      throw error
    }
  }, [instructions.resume])
  
  return {
    executeSequence,
    executeResumeAutofill,
    fillingStatus,
    setFillingStatus
  }
}
```

### 5. useIframeMonitoring - Iframe Communication

```typescript
const useIframeMonitoring = (onComplete: () => void) => {
  useEffect(() => {
    const onFrameMsg = (event: MessageEvent) => {
      if (event.data?.type === eventTypes.AUTOFILL_WITH_IFRAMES_COMPLETED) {
        onComplete()
      }
    }
    
    window.addEventListener('message', onFrameMsg)
    return () => window.removeEventListener('message', onFrameMsg)
  }, [onComplete])
}
```

### 6. Main Hook Composition

```typescript
const useAutofillInputs = () => {
  const elementsRef = useInputElements()
  const { pageLoadPromise, resolvePageLoad } = usePageLoadDeferred()
  const { usesIframes, detectionComplete } = useIframeDetection(elementsRef.current)
  
  const shouldFetchAutofills = elementsRef.current.length > 3
  const { instructions, fetchStatus } = useAutofillInstructions(
    elementsRef.current,
    pageLoadPromise,
    shouldFetchAutofills
  )
  
  const { executeSequence, executeResumeAutofill, fillingStatus, setFillingStatus } = 
    useAutofillExecution(instructions)
  
  // Handle page load event
  useOnPageLoad(() => {
    resolvePageLoad()
  }, 1000)
  
  // Monitor iframe completion
  const handleIframeComplete = useCallback(() => {
    setFillingStatus('success')
  }, [setFillingStatus])
  
  useIframeMonitoring(handleIframeComplete)
  
  // Save filled values utility
  const executeSaveFilledValues = useCallback(async () => {
    const filledInputs = elementsRef.current.filter(el => el.isLLMAutofillable)
    await triggerSaveFilledValues(filledInputs)
  }, [elementsRef])
  
  return {
    executeAutofillSequence: executeSequence,
    executeResumeAutofill,
    executeSaveFilledValues,
    unfilledInputs: instructions.unfilledInputs,
    freeResponseInputs: instructions.freeResponse,
    fillingStatus,
    fetchStatus,
    usesIframes,
  }
}
```

## Benefits of This Approach

1. **Single Responsibility**: Each hook has one clear purpose
2. **Testability**: Individual hooks can be tested in isolation
3. **Reusability**: Hooks can be reused in other contexts
4. **Maintainability**: Changes to one aspect don't affect others
5. **Readability**: Easier to understand what each piece does
6. **Debugging**: Issues can be isolated to specific hooks

## Interface Preservation

The main hook maintains the exact same interface through composition of smaller hooks. Each sub-hook manages its own concerns while contributing to the overall functionality.