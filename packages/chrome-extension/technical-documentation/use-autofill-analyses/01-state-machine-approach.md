# State Machine Approach for useAutofillInputs

## Key Ideas

The current `useAutofillInputs` hook manages complex asynchronous workflows with multiple interdependent states. A state machine approach would model the autofill process as discrete states with well-defined transitions, eliminating the need for complex promise ref management and reducing state inconsistencies.

**Benefits:**
- Explicit state transitions prevent impossible states
- Clear separation between data fetching and UI states  
- Eliminates race conditions through sequential state management
- Predictable state flow makes debugging easier
- Automatic handling of loading/error states

## State Management Strategy

### Live-Access Ref State
- Convert promise refs to state machine context
- Use machine services for async operations
- Maintain input element refs outside the machine for performance

### React State Integration  
- Single `state` object from the machine replaces multiple useState calls
- Derived values computed from machine state
- Actions trigger state transitions instead of direct state updates

### State Transitions

```
IDLE → PAGE_LOADING → ELEMENTS_DETECTED → FETCHING_SIMPLE → FETCHING_COMPLEX → READY_TO_FILL → FILLING → SUCCESS/ERROR
```

## Implementation

### State Machine Definition

```typescript
import { createMachine, assign, fromPromise } from 'xstate'

type AutofillContext = {
  elements: InputElement[]
  simpleInstructions: AutofillReadyInputArray
  complexInstructions: AutofillReadyInputArray
  unfilledInputs: InputInfo[]
  freeResponseInputs: InputElement[]
  resumeInstructions: AutofillReadyInputArray
  usesIframes: boolean
  error?: string
}

type AutofillEvents = 
  | { type: 'PAGE_LOADED'; elements: InputElement[] }
  | { type: 'START_AUTOFILL' }
  | { type: 'START_RESUME_AUTOFILL'; resumeName: string }
  | { type: 'IFRAME_COMPLETED' }
  | { type: 'RETRY' }

const autofillMachine = createMachine({
  id: 'autofill',
  initial: 'pageLoading',
  context: {
    elements: [],
    simpleInstructions: new AutofillReadyInputArray([]),
    complexInstructions: new AutofillReadyInputArray([]),
    unfilledInputs: [],
    freeResponseInputs: [],
    resumeInstructions: new AutofillReadyInputArray([]),
    usesIframes: false,
  } as AutofillContext,
  
  states: {
    pageLoading: {
      on: {
        PAGE_LOADED: {
          target: 'elementsDetected',
          actions: assign({
            elements: ({ event }) => event.elements,
            usesIframes: ({ event }) => event.elements.length <= 3
          })
        }
      }
    },
    
    elementsDetected: {
      always: [
        { target: 'ready', guard: ({ context }) => context.usesIframes },
        { target: 'fetchingSimple' }
      ]
    },
    
    fetchingSimple: {
      invoke: {
        src: fromPromise(async ({ input: { elements } }) => {
          return await triggerGetSimpleAutofillValues(elements)
        }),
        input: ({ context }) => ({ elements: context.elements }),
        onDone: {
          target: 'fetchingComplex',
          actions: assign({
            simpleInstructions: ({ event }) => event.output,
            resumeInstructions: ({ event }) => event.output.getResumeAutofills(),
            freeResponseInputs: ({ event }) => event.output.getFreeResponseAutofills()
          })
        },
        onError: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error.message })
        }
      }
    },
    
    fetchingComplex: {
      invoke: {
        src: fromPromise(async ({ input: { elements, simpleInstructions } }) => {
          const complexInputs = elements.filter(
            el => !simpleInstructions.some(i => i.elementReferenceId === el.elementReferenceId) && 
                  el.isLLMAutofillable
          )
          return await triggerGetAutofillValues(complexInputs)
        }),
        input: ({ context }) => ({ 
          elements: context.elements, 
          simpleInstructions: context.simpleInstructions 
        }),
        onDone: {
          target: 'ready',
          actions: assign({
            complexInstructions: ({ event }) => event.output,
            unfilledInputs: ({ context, event }) => {
              const allInstructions = new AutofillReadyInputArray([
                ...context.simpleInstructions,
                ...event.output
              ])
              const filledIds = allInstructions.map(i => i.elementReferenceId)
              return context.elements.filter(el => 
                !filledIds.includes(el.elementReferenceId) && !!el.label
              )
            }
          })
        },
        onError: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error.message })
        }
      }
    },
    
    ready: {
      on: {
        START_AUTOFILL: 'filling',
        START_RESUME_AUTOFILL: 'fillingResume'
      }
    },
    
    filling: {
      invoke: {
        src: fromPromise(async ({ input: { simpleInstructions, complexInstructions } }) => {
          await sendMessageToIframes(eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES)
          await autofillInputElements(simpleInstructions, AutofillAnimationSpeeds.FAST)
          await autofillInputElements(complexInstructions, AutofillAnimationSpeeds.NONE)
          return { success: true }
        }),
        input: ({ context }) => ({
          simpleInstructions: context.simpleInstructions,
          complexInstructions: context.complexInstructions
        }),
        onDone: 'success',
        onError: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error.message })
        }
      }
    },
    
    fillingResume: {
      invoke: {
        src: fromPromise(async ({ input: { resumeInstructions, resumeName } }) => {
          await sendMessageToIframes(eventTypes.BEGIN_RESUME_AUTOFILL, { resumeName })
          resumeInstructions.setAutofillResumeUrl(resumeName)
          await autofillInputElements(resumeInstructions, AutofillAnimationSpeeds.NONE)
        }),
        input: ({ context, event }) => ({
          resumeInstructions: context.resumeInstructions,
          resumeName: event.resumeName
        }),
        onDone: 'success',
        onError: 'error'
      }
    },
    
    success: {
      entry: () => {
        returnCompletionMessage()
      },
      on: {
        START_AUTOFILL: 'filling',
        START_RESUME_AUTOFILL: 'fillingResume'
      }
    },
    
    error: {
      on: {
        RETRY: 'pageLoading'
      }
    }
  }
})
```

### Hook Implementation

```typescript
import { useMachine } from '@xstate/react'

const useAutofillInputs = () => {
  const elementsRef = useInputElements()
  const [state, send] = useMachine(autofillMachine)
  
  // Monitor iframe completion
  useMonitorIframeAutofills(() => {
    if (state.matches('filling')) {
      send({ type: 'IFRAME_COMPLETED' })
    }
  })
  
  // Handle page load
  useOnPageLoad(() => {
    send({ type: 'PAGE_LOADED', elements: elementsRef.current })
  }, 1000)
  
  // Interface methods
  const executeAutofillSequence = useCallback(async () => {
    send({ type: 'START_AUTOFILL' })
    
    // Return resume instructions for backward compatibility
    return state.context.simpleInstructions.filter(
      instruction => instruction.value === RESUME_UPLOAD_VALUE
    )
  }, [send, state.context.simpleInstructions])
  
  const executeResumeAutofill = useCallback((resumeName: string) => {
    send({ type: 'START_RESUME_AUTOFILL', resumeName })
  }, [send])
  
  const executeSaveFilledValues = useCallback(async () => {
    const filledInputs = elementsRef.current.filter(el => el.isLLMAutofillable)
    await triggerSaveFilledValues(filledInputs)
  }, [elementsRef])
  
  // Derived state for component interface
  return {
    executeAutofillSequence,
    executeResumeAutofill,
    executeSaveFilledValues,
    unfilledInputs: state.context.unfilledInputs,
    freeResponseInputs: state.context.freeResponseInputs,
    fillingStatus: state.matches('filling') ? 'filling_inputs' : 
                  state.matches('success') ? 'success' :
                  state.matches('error') ? 'error' : 'idle',
    fetchStatus: state.matches('fetchingSimple') || state.matches('fetchingComplex') ? 'loading' :
                state.matches('error') ? 'error' : 'fetched',
    usesIframes: state.context.usesIframes,
  }
}
```

## Benefits of This Approach

1. **Eliminates Race Conditions**: State machine ensures only one async operation at a time
2. **Clear Error Handling**: Each state can define its error transitions
3. **Testable**: State machines are highly testable with predictable transitions  
4. **Debuggable**: XState provides excellent dev tools for visualizing state
5. **Maintainable**: Adding new states/transitions is straightforward
6. **Type Safe**: Full TypeScript support with typed events and context

## Interface Preservation

The hook maintains the exact same external interface, with derived values computed from the machine state. Components using this hook require no changes.