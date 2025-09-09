# Reducer Pattern Approach for useAutofillInputs

## Key Ideas

The current hook manages multiple pieces of related state that update together in response to async operations. A reducer pattern centralizes all state updates in a single function, making state transitions predictable and eliminating the need for complex promise ref management. This approach treats the autofill process as a series of state transitions triggered by dispatched actions.

**Benefits:**
- Centralized state management with predictable updates
- Eliminates race conditions through sequential action processing
- Easier debugging with action logging
- Better performance by reducing re-renders
- Immutable state updates prevent accidental mutations

## State Management Strategy

### Live-Access Ref State
- Convert promise refs to state properties with loading flags
- Use useEffect to dispatch actions when async operations complete
- Maintain element refs separately for performance reasons

### React State Integration
- Single state object managed by useReducer
- Actions represent all possible state transitions
- Side effects handled in useEffect hooks that dispatch actions

### State Transitions
Actions drive all state changes in a predictable sequence:
```
PAGE_LOADING → ELEMENTS_DETECTED → FETCHING_STARTED → SIMPLE_FETCHED → COMPLEX_FETCHED → READY → FILLING → SUCCESS/ERROR
```

## Implementation

### State and Action Types

```typescript
type AutofillState = {
  // Loading states
  pageLoaded: boolean
  fetchStatus: AutofillFetchStatus
  fillingStatus: AutofillFillingStatus
  
  // Data
  elements: InputElement[]
  simpleInstructions: AutofillReadyInputArray
  complexInstructions: AutofillReadyInputArray
  resumeInstructions: AutofillReadyInputArray
  freeResponseInputs: InputElement[]
  unfilledInputs: InputInfo[]
  
  // Configuration
  usesIframes: boolean
  shouldFetchAutofills: boolean
  
  // Async operation tracking
  simpleInstructionsPending: boolean
  complexInstructionsPending: boolean
  autofillExecutionPending: boolean
  
  // Error handling
  error: string | null
}

type AutofillAction = 
  | { type: 'PAGE_LOADED'; elements: InputElement[] }
  | { type: 'START_FETCH_SIMPLE' }
  | { type: 'SIMPLE_INSTRUCTIONS_SUCCESS'; instructions: AutofillReadyInputArray }
  | { type: 'SIMPLE_INSTRUCTIONS_ERROR'; error: string }
  | { type: 'START_FETCH_COMPLEX' }
  | { type: 'COMPLEX_INSTRUCTIONS_SUCCESS'; instructions: AutofillReadyInputArray }
  | { type: 'COMPLEX_INSTRUCTIONS_ERROR'; error: string }
  | { type: 'START_AUTOFILL_EXECUTION' }
  | { type: 'AUTOFILL_EXECUTION_SUCCESS' }
  | { type: 'AUTOFILL_EXECUTION_ERROR'; error: string }
  | { type: 'IFRAME_AUTOFILL_COMPLETED' }
  | { type: 'RESET_ERROR' }
  | { type: 'UPDATE_UNFILLED_INPUTS'; inputs: InputInfo[] }
```

### Reducer Implementation

```typescript
const initialState: AutofillState = {
  pageLoaded: false,
  fetchStatus: 'loading',
  fillingStatus: 'idle',
  elements: [],
  simpleInstructions: new AutofillReadyInputArray([]),
  complexInstructions: new AutofillReadyInputArray([]),
  resumeInstructions: new AutofillReadyInputArray([]),
  freeResponseInputs: [],
  unfilledInputs: [],
  usesIframes: false,
  shouldFetchAutofills: false,
  simpleInstructionsPending: false,
  complexInstructionsPending: false,
  autofillExecutionPending: false,
  error: null
}

const autofillReducer = (state: AutofillState, action: AutofillAction): AutofillState => {
  switch (action.type) {
    case 'PAGE_LOADED': {
      const usesIframes = action.elements.length <= 3
      const shouldFetchAutofills = action.elements.length > 3
      
      return {
        ...state,
        pageLoaded: true,
        elements: action.elements,
        usesIframes,
        shouldFetchAutofills,
        fetchStatus: shouldFetchAutofills ? 'loading' : 'fetched'
      }
    }
    
    case 'START_FETCH_SIMPLE':
      return {
        ...state,
        simpleInstructionsPending: true,
        error: null
      }
    
    case 'SIMPLE_INSTRUCTIONS_SUCCESS': {
      const instructions = action.instructions
      const resumeInstructions = instructions.getResumeAutofills()
      const freeResponseInputs = instructions.getFreeResponseAutofills()
      const specialInputs = [...freeResponseInputs, ...resumeInstructions]
      const filteredInstructions = instructions.exclude(specialInputs)
      
      return {
        ...state,
        simpleInstructions: filteredInstructions,
        resumeInstructions,
        freeResponseInputs,
        simpleInstructionsPending: false
      }
    }
    
    case 'SIMPLE_INSTRUCTIONS_ERROR':
      return {
        ...state,
        simpleInstructionsPending: false,
        fetchStatus: 'error',
        error: action.error
      }
    
    case 'START_FETCH_COMPLEX':
      return {
        ...state,
        complexInstructionsPending: true
      }
    
    case 'COMPLEX_INSTRUCTIONS_SUCCESS': {
      const complexInstructions = action.instructions
      const allInstructions = new AutofillReadyInputArray([
        ...state.simpleInstructions,
        ...complexInstructions
      ])
      
      // Calculate unfilled inputs
      const filledInputIds = allInstructions.map(i => i.elementReferenceId)
      const unfilledInputs = state.elements.filter((el, idx, self) => {
        const isUnfilled = !filledInputIds.includes(el.elementReferenceId) && !!el.label
        const isTextInput = 
          el.element instanceof HTMLInputElement || el.element instanceof HTMLTextAreaElement
        const isUnique = 
          idx === self.findIndex(i => cleanText(i.label || '') === cleanText(el.label || ''))
        
        return isUnfilled && isTextInput && isUnique
      })
      
      return {
        ...state,
        complexInstructions,
        unfilledInputs,
        complexInstructionsPending: false,
        fetchStatus: 'fetched'
      }
    }
    
    case 'COMPLEX_INSTRUCTIONS_ERROR':
      return {
        ...state,
        complexInstructionsPending: false,
        fetchStatus: 'error',
        error: action.error
      }
    
    case 'START_AUTOFILL_EXECUTION':
      return {
        ...state,
        fillingStatus: 'filling_inputs',
        autofillExecutionPending: true,
        error: null
      }
    
    case 'AUTOFILL_EXECUTION_SUCCESS':
      return {
        ...state,
        fillingStatus: 'success',
        autofillExecutionPending: false
      }
    
    case 'AUTOFILL_EXECUTION_ERROR':
      return {
        ...state,
        fillingStatus: 'error',
        autofillExecutionPending: false,
        error: action.error
      }
    
    case 'IFRAME_AUTOFILL_COMPLETED':
      return {
        ...state,
        fillingStatus: 'success'
      }
    
    case 'RESET_ERROR':
      return {
        ...state,
        error: null
      }
    
    case 'UPDATE_UNFILLED_INPUTS':
      return {
        ...state,
        unfilledInputs: action.inputs
      }
    
    default:
      return state
  }
}
```

### Hook Implementation

```typescript
const useAutofillInputs = () => {
  const elementsRef = useInputElements()
  const [state, dispatch] = useReducer(autofillReducer, initialState)
  
  // Page load effect
  useOnPageLoad(() => {
    dispatch({ type: 'PAGE_LOADED', elements: elementsRef.current })
  }, 1000)
  
  // Simple instructions fetching effect
  useEffect(() => {
    if (!state.shouldFetchAutofills || !state.pageLoaded || state.simpleInstructionsPending) {
      return
    }
    
    let isCancelled = false
    
    const fetchSimpleInstructions = async () => {
      dispatch({ type: 'START_FETCH_SIMPLE' })
      
      try {
        const instructions = await triggerGetSimpleAutofillValues(state.elements)
        
        if (!isCancelled) {
          dispatch({ type: 'SIMPLE_INSTRUCTIONS_SUCCESS', instructions })
        }
      } catch (error) {
        if (!isCancelled) {
          dispatch({ 
            type: 'SIMPLE_INSTRUCTIONS_ERROR', 
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    }
    
    fetchSimpleInstructions()
    
    return () => {
      isCancelled = true
    }
  }, [state.shouldFetchAutofills, state.pageLoaded, state.simpleInstructionsPending])
  
  // Complex instructions fetching effect
  useEffect(() => {
    if (state.simpleInstructionsPending || 
        state.complexInstructionsPending || 
        state.simpleInstructions.length === 0) {
      return
    }
    
    let isCancelled = false
    
    const fetchComplexInstructions = async () => {
      dispatch({ type: 'START_FETCH_COMPLEX' })
      
      try {
        // Filter for complex inputs
        const complexInputs = state.elements.filter(
          el => !state.simpleInstructions.some(i => i.elementReferenceId === el.elementReferenceId) &&
                el.isLLMAutofillable
        )
        
        console.log('triggering complex inputs', complexInputs)
        const instructions = await triggerGetAutofillValues(complexInputs)
        
        if (!isCancelled) {
          dispatch({ type: 'COMPLEX_INSTRUCTIONS_SUCCESS', instructions })
        }
      } catch (error) {
        if (!isCancelled) {
          dispatch({ 
            type: 'COMPLEX_INSTRUCTIONS_ERROR', 
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    }
    
    fetchComplexInstructions()
    
    return () => {
      isCancelled = true
    }
  }, [state.simpleInstructionsPending, state.complexInstructionsPending, state.simpleInstructions])
  
  // Iframe monitoring
  useEffect(() => {
    const onFrameMsg = (event: MessageEvent) => {
      if (event.data?.type === eventTypes.AUTOFILL_WITH_IFRAMES_COMPLETED) {
        dispatch({ type: 'IFRAME_AUTOFILL_COMPLETED' })
      }
    }
    
    window.addEventListener('message', onFrameMsg)
    return () => window.removeEventListener('message', onFrameMsg)
  }, [])
  
  // Interface methods
  const executeAutofillSequence = useCallback(async () => {
    if (state.autofillExecutionPending) return
    
    dispatch({ type: 'START_AUTOFILL_EXECUTION' })
    
    try {
      // Send autofill messages to iframes
      await sendMessageToIframes(eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES)
      
      // Determine animation speed based on loading state
      const loading = state.fetchStatus === 'loading'
      const animationSpeed = loading ? AutofillAnimationSpeeds.SLOW : AutofillAnimationSpeeds.FAST
      
      // Fill simple inputs
      console.log('filling simple inputs', state.simpleInstructions)
      await autofillInputElements(state.simpleInstructions, animationSpeed)
      
      // Fill complex inputs
      console.log('filling complex inputs', state.complexInstructions)
      await autofillInputElements(state.complexInstructions, AutofillAnimationSpeeds.NONE)
      
      dispatch({ type: 'AUTOFILL_EXECUTION_SUCCESS' })
      returnCompletionMessage()
      
      // Return resume instructions for compatibility
      return state.simpleInstructions.filter(
        instruction => instruction.value === RESUME_UPLOAD_VALUE
      )
    } catch (error) {
      dispatch({ 
        type: 'AUTOFILL_EXECUTION_ERROR', 
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }, [state.autofillExecutionPending, state.fetchStatus, state.simpleInstructions, state.complexInstructions])
  
  const executeResumeAutofill = useCallback(async (resumeName: string) => {
    try {
      await sendMessageToIframes(eventTypes.BEGIN_RESUME_AUTOFILL, { resumeName })
      
      if (state.resumeInstructions.length > 0) {
        state.resumeInstructions.setAutofillResumeUrl(resumeName)
        await autofillInputElements(state.resumeInstructions, AutofillAnimationSpeeds.NONE)
      }
    } catch (error) {
      console.error('Error during resume autofill:', error)
      throw error
    }
  }, [state.resumeInstructions])
  
  const executeSaveFilledValues = useCallback(async () => {
    const filledInputs = state.elements.filter(el => el.isLLMAutofillable)
    await triggerSaveFilledValues(filledInputs)
  }, [state.elements])
  
  return {
    executeAutofillSequence,
    executeResumeAutofill,
    executeSaveFilledValues,
    unfilledInputs: state.unfilledInputs,
    freeResponseInputs: state.freeResponseInputs,
    fillingStatus: state.fillingStatus,
    fetchStatus: state.fetchStatus,
    usesIframes: state.usesIframes,
  }
}
```

## Benefits of This Approach

1. **Predictable State Updates**: All state changes go through the reducer
2. **Centralized Logic**: State transition logic is in one place
3. **Easy Debugging**: Action logging reveals exactly what happened
4. **Performance**: Fewer re-renders due to state batching
5. **Testability**: Reducer is pure function, easy to test
6. **Time Travel Debugging**: Can replay actions for debugging

## Interface Preservation

The hook maintains the same external interface while internally managing all state through the reducer. Components using this hook require no changes, but benefit from more predictable state management.