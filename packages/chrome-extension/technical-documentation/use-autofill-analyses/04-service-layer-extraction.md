# Service Layer Extraction for useAutofillInputs

## Key Ideas

The current hook mixes business logic, async operations, and React state management. By extracting the complex promise and async logic into dedicated service classes, we can create a cleaner separation between data layer operations and React component concerns. This approach moves all business logic out of React hooks into testable service classes while keeping the hook focused purely on state management.

**Benefits:**
- Clear separation between business logic and React concerns
- Highly testable service classes independent of React
- Better error handling and retry logic
- Easier to mock for testing
- Reusable across different components or contexts
- Simplified hook logic focused only on state management

## State Management Strategy

### Live-Access Ref State
- Services maintain their own internal state and caching
- React state only tracks high-level status and results
- No more promise refs - services handle async coordination internally

### React State Integration
- Hook subscribes to service events/callbacks
- State updates triggered by service completion
- Clean separation between service data and UI state

### State Transitions
Services coordinate complex async workflows while hooks handle simple state transitions:
```
Service Layer: Complex async coordination
Hook Layer: Simple status updates (loading → success/error)
```

## Implementation

### 1. AutofillInstructionService - Instruction Management

```typescript
type InstructionServiceEvents = {
  simpleInstructionsLoaded: (instructions: AutofillReadyInputArray) => void
  complexInstructionsLoaded: (instructions: AutofillReadyInputArray) => void
  allInstructionsReady: (result: {
    simple: AutofillReadyInputArray
    complex: AutofillReadyInputArray
    resume: AutofillReadyInputArray
    freeResponse: InputElement[]
    unfilled: InputInfo[]
  }) => void
  error: (error: Error, phase: 'simple' | 'complex') => void
}

class AutofillInstructionService {
  private elements: InputElement[] = []
  private simpleInstructions: AutofillReadyInputArray = new AutofillReadyInputArray([])
  private complexInstructions: AutofillReadyInputArray = new AutofillReadyInputArray([])
  private pageLoadPromise: Promise<void> | null = null
  private isInitialized = false
  private events: Partial<InstructionServiceEvents> = {}
  
  constructor() {
    this.setupPageLoadPromise()
  }
  
  private setupPageLoadPromise() {
    let resolvePageLoad!: () => void
    this.pageLoadPromise = new Promise<void>((resolve) => {
      resolvePageLoad = resolve
    })
    this.resolvePageLoad = resolvePageLoad
  }
  
  private resolvePageLoad!: () => void
  
  on<K extends keyof InstructionServiceEvents>(
    event: K, 
    callback: InstructionServiceEvents[K]
  ) {
    this.events[event] = callback
  }
  
  private emit<K extends keyof InstructionServiceEvents>(
    event: K, 
    ...args: Parameters<InstructionServiceEvents[K]>
  ) {
    const callback = this.events[event]
    if (callback) {
      ;(callback as any)(...args)
    }
  }
  
  async initialize(elements: InputElement[]) {
    this.elements = elements
    this.isInitialized = true
    this.resolvePageLoad()
    
    const shouldFetch = elements.length > 3
    if (!shouldFetch) {
      this.emit('allInstructionsReady', {
        simple: this.simpleInstructions,
        complex: this.complexInstructions,
        resume: new AutofillReadyInputArray([]),
        freeResponse: [],
        unfilled: []
      })
      return
    }
    
    try {
      await this.fetchInstructions()
    } catch (error) {
      this.emit('error', error as Error, 'simple')
    }
  }
  
  private async fetchInstructions() {
    await this.pageLoadPromise
    
    // Fetch simple instructions
    try {
      const simpleInstructions = await triggerGetSimpleAutofillValues(this.elements)
      this.simpleInstructions = simpleInstructions
      this.emit('simpleInstructionsLoaded', simpleInstructions)
      
      // Process special tokens from simple instructions
      const { resume, freeResponse, filtered } = this.processSpecialTokens(simpleInstructions)
      this.simpleInstructions = filtered
      
      // Fetch complex instructions
      await this.fetchComplexInstructions(resume, freeResponse)
      
    } catch (error) {
      this.emit('error', error as Error, 'simple')
    }
  }
  
  private async fetchComplexInstructions(
    resumeInstructions: AutofillReadyInputArray,
    freeResponseInputs: InputElement[]
  ) {
    try {
      const complexInputs = this.elements.filter(
        el => !this.simpleInstructions.some(i => i.elementReferenceId === el.elementReferenceId) &&
              el.isLLMAutofillable
      )
      
      const complexInstructions = await triggerGetAutofillValues(complexInputs)
      this.complexInstructions = complexInstructions
      this.emit('complexInstructionsLoaded', complexInstructions)
      
      // Calculate unfilled inputs
      const allInstructions = new AutofillReadyInputArray([
        ...this.simpleInstructions,
        ...complexInstructions
      ])
      
      const unfilledInputs = this.calculateUnfilledInputs(allInstructions)
      
      this.emit('allInstructionsReady', {
        simple: this.simpleInstructions,
        complex: complexInstructions,
        resume: resumeInstructions,
        freeResponse: freeResponseInputs,
        unfilled: unfilledInputs
      })
      
    } catch (error) {
      this.emit('error', error as Error, 'complex')
    }
  }
  
  private processSpecialTokens(instructions: AutofillReadyInputArray) {
    const resume = instructions.getResumeAutofills()
    const freeResponse = instructions.getFreeResponseAutofills()
    const special = [...freeResponse, ...resume]
    const filtered = instructions.exclude(special)
    
    return { resume, freeResponse, filtered }
  }
  
  private calculateUnfilledInputs(allInstructions: AutofillReadyInputArray): InputInfo[] {
    const filledInputIds = allInstructions.map(i => i.elementReferenceId)
    
    return this.elements.filter((el, idx, self) => {
      const isUnfilled = !filledInputIds.includes(el.elementReferenceId) && !!el.label
      const isTextInput = 
        el.element instanceof HTMLInputElement || el.element instanceof HTMLTextAreaElement
      const isUnique = 
        idx === self.findIndex(i => cleanText(i.label || '') === cleanText(el.label || ''))
      
      return isUnfilled && isTextInput && isUnique
    })
  }
  
  getSimpleInstructions(): AutofillReadyInputArray {
    return this.simpleInstructions
  }
  
  getComplexInstructions(): AutofillReadyInputArray {
    return this.complexInstructions
  }
  
  getAllInstructions(): AutofillReadyInputArray {
    return new AutofillReadyInputArray([
      ...this.simpleInstructions,
      ...this.complexInstructions
    ])
  }
}
```

### 2. AutofillExecutionService - Execution Management

```typescript
type ExecutionServiceEvents = {
  executionStarted: () => void
  executionProgress: (phase: 'simple' | 'complex' | 'iframe') => void
  executionCompleted: (resumeInstructions: AutofillReadyInputArray) => void
  executionError: (error: Error) => void
}

class AutofillExecutionService {
  private events: Partial<ExecutionServiceEvents> = {}
  private isExecuting = false
  
  on<K extends keyof ExecutionServiceEvents>(
    event: K, 
    callback: ExecutionServiceEvents[K]
  ) {
    this.events[event] = callback
  }
  
  private emit<K extends keyof ExecutionServiceEvents>(
    event: K, 
    ...args: Parameters<ExecutionServiceEvents[K]>
  ) {
    const callback = this.events[event]
    if (callback) {
      ;(callback as any)(...args)
    }
  }
  
  async executeAutofillSequence(
    simpleInstructions: AutofillReadyInputArray,
    complexInstructions: AutofillReadyInputArray,
    isLoading: boolean
  ): Promise<AutofillReadyInputArray> {
    if (this.isExecuting) {
      throw new Error('Autofill execution already in progress')
    }
    
    this.isExecuting = true
    this.emit('executionStarted')
    
    try {
      // Send iframe messages
      this.emit('executionProgress', 'iframe')
      await sendMessageToIframes(eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES)
      
      // Execute simple inputs
      this.emit('executionProgress', 'simple')
      const animationSpeed = isLoading ? AutofillAnimationSpeeds.SLOW : AutofillAnimationSpeeds.FAST
      console.log('filling simple inputs', simpleInstructions)
      await autofillInputElements(simpleInstructions, animationSpeed)
      
      // Execute complex inputs
      this.emit('executionProgress', 'complex')
      console.log('filling complex inputs', complexInstructions)
      await autofillInputElements(complexInstructions, AutofillAnimationSpeeds.NONE)
      
      // Get resume instructions for return value
      const resumeInstructions = simpleInstructions.filter(
        instruction => instruction.value === RESUME_UPLOAD_VALUE
      )
      
      returnCompletionMessage()
      this.emit('executionCompleted', resumeInstructions)
      
      return resumeInstructions
      
    } catch (error) {
      this.emit('executionError', error as Error)
      throw error
    } finally {
      this.isExecuting = false
    }
  }
  
  async executeResumeAutofill(
    resumeInstructions: AutofillReadyInputArray,
    resumeName: string
  ): Promise<void> {
    try {
      await sendMessageToIframes(eventTypes.BEGIN_RESUME_AUTOFILL, { resumeName })
      
      if (resumeInstructions.length > 0) {
        resumeInstructions.setAutofillResumeUrl(resumeName)
        await autofillInputElements(resumeInstructions, AutofillAnimationSpeeds.NONE)
      }
    } catch (error) {
      console.error('Error during resume autofill:', error)
      throw error
    }
  }
  
  isCurrentlyExecuting(): boolean {
    return this.isExecuting
  }
}
```

### 3. IframeMonitoringService - Iframe Communication

```typescript
type IframeServiceEvents = {
  iframeCompleted: () => void
}

class IframeMonitoringService {
  private events: Partial<IframeServiceEvents> = {}
  private isListening = false
  
  constructor() {
    this.startListening()
  }
  
  on<K extends keyof IframeServiceEvents>(
    event: K, 
    callback: IframeServiceEvents[K]
  ) {
    this.events[event] = callback
  }
  
  private emit<K extends keyof IframeServiceEvents>(
    event: K, 
    ...args: Parameters<IframeServiceEvents[K]>
  ) {
    const callback = this.events[event]
    if (callback) {
      ;(callback as any)(...args)
    }
  }
  
  private handleMessage = (event: MessageEvent) => {
    if (event.data?.type === eventTypes.AUTOFILL_WITH_IFRAMES_COMPLETED) {
      this.emit('iframeCompleted')
    }
  }
  
  private startListening() {
    if (!this.isListening) {
      window.addEventListener('message', this.handleMessage)
      this.isListening = true
    }
  }
  
  stopListening() {
    if (this.isListening) {
      window.removeEventListener('message', this.handleMessage)
      this.isListening = false
    }
  }
}
```

### 4. Main Hook with Service Integration

```typescript
const useAutofillInputs = () => {
  const elementsRef = useInputElements()
  
  // Service instances
  const [instructionService] = useState(() => new AutofillInstructionService())
  const [executionService] = useState(() => new AutofillExecutionService())
  const [iframeService] = useState(() => new IframeMonitoringService())
  
  // React state - simplified to just track status and results
  const [fetchStatus, setFetchStatus] = useState<AutofillFetchStatus>('loading')
  const [fillingStatus, setFillingStatus] = useState<AutofillFillingStatus>('idle')
  const [usesIframes, setUsesIframes] = useState(false)
  const [instructions, setInstructions] = useState({
    simple: new AutofillReadyInputArray([]),
    complex: new AutofillReadyInputArray([]),
    resume: new AutofillReadyInputArray([]),
    freeResponse: [] as InputElement[],
    unfilled: [] as InputInfo[]
  })
  
  // Set up service event handlers
  useEffect(() => {
    // Instruction service events
    instructionService.on('simpleInstructionsLoaded', (simple) => {
      console.log('Simple instructions loaded:', simple)
    })
    
    instructionService.on('complexInstructionsLoaded', (complex) => {
      console.log('Complex instructions loaded:', complex)
    })
    
    instructionService.on('allInstructionsReady', (result) => {
      setInstructions({
        simple: result.simple,
        complex: result.complex,
        resume: result.resume,
        freeResponse: result.freeResponse,
        unfilled: result.unfilled
      })
      setFetchStatus('fetched')
    })
    
    instructionService.on('error', (error, phase) => {
      console.error(`Error in ${phase} instruction fetch:`, error)
      setFetchStatus('error')
    })
    
    // Execution service events
    executionService.on('executionStarted', () => {
      setFillingStatus('filling_inputs')
    })
    
    executionService.on('executionCompleted', () => {
      setFillingStatus('success')
    })
    
    executionService.on('executionError', (error) => {
      console.error('Execution error:', error)
      setFillingStatus('error')
    })
    
    // Iframe service events
    iframeService.on('iframeCompleted', () => {
      setFillingStatus('success')
    })
    
    return () => {
      iframeService.stopListening()
    }
  }, [instructionService, executionService, iframeService])
  
  // Handle page load and element detection
  useOnPageLoad(() => {
    const elements = elementsRef.current
    const usesIframes = elements.length <= 3
    setUsesIframes(usesIframes)
    
    console.log('Found inputs for autofill: ', elements)
    instructionService.initialize(elements)
  }, 1000)
  
  // Interface methods
  const executeAutofillSequence = useCallback(async () => {
    const isLoading = fetchStatus === 'loading'
    return await executionService.executeAutofillSequence(
      instructions.simple,
      instructions.complex,
      isLoading
    )
  }, [executionService, instructions.simple, instructions.complex, fetchStatus])
  
  const executeResumeAutofill = useCallback(async (resumeName: string) => {
    await executionService.executeResumeAutofill(instructions.resume, resumeName)
  }, [executionService, instructions.resume])
  
  const executeSaveFilledValues = useCallback(async () => {
    const filledInputs = elementsRef.current.filter(el => el.isLLMAutofillable)
    await triggerSaveFilledValues(filledInputs)
  }, [elementsRef])
  
  return {
    executeAutofillSequence,
    executeResumeAutofill,
    executeSaveFilledValues,
    unfilledInputs: instructions.unfilled,
    freeResponseInputs: instructions.freeResponse,
    fillingStatus,
    fetchStatus,
    usesIframes,
  }
}
```

## Benefits of This Approach

1. **Separation of Concerns**: Business logic completely separated from React
2. **Testability**: Services can be unit tested without React rendering
3. **Reusability**: Services can be used across different components
4. **Error Handling**: Centralized error handling within services
5. **Maintainability**: Complex logic isolated in focused classes
6. **Performance**: Reduced re-renders due to event-based updates

## Interface Preservation

The hook maintains the exact same interface while delegating all complex operations to services. Services handle coordination internally while the hook focuses solely on React state management and providing the component interface.