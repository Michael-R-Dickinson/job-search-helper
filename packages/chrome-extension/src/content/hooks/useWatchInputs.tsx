import { useEffect, useRef, useCallback } from 'react'

export type WatchableInputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export interface InputState {
  element: WatchableInputElement
  wasEmpty: boolean
  currentValue: string
  hasFocus: boolean
  hasBeenInteractedWith: boolean
  isReactSelect: boolean
  valueContainer?: Element | null
}

export interface UseWatchInputsOptions {
  /**
   * Array of input elements to watch
   */
  inputElements: WatchableInputElement[]
  /**
   * Callback called when an input is filled by the user and then unfocused
   */
  onInputFilled: (element: WatchableInputElement) => void
  /**
   * Debounce time in ms for value change detection (default: 100ms)
   */
  debounceMs?: number
}

/**
 * Hook that watches specific input elements for when users fill them and then unfocus them.
 * Robust against various form libraries and handles both direct user input
 * and programmatic value changes that occur during user interaction.
 * Supports custom select components including React Select and other library implementations.
 */
export function useWatchInputs({
  inputElements,
  onInputFilled,
  debounceMs = 100,
}: UseWatchInputsOptions): void {
  const inputStatesRef = useRef<Map<WatchableInputElement, InputState>>(new Map())
  const debounceTimersRef = useRef<Map<WatchableInputElement, NodeJS.Timeout>>(new Map())
  const observersRef = useRef<Map<WatchableInputElement, MutationObserver>>(new Map())

  const isValidInputElement = useCallback((element: WatchableInputElement): boolean => {
    // Skip disabled elements
    if (element.hasAttribute('disabled')) {
      return false
    }

    // Skip hidden inputs (but allow readonly for custom selects)
    if (element instanceof HTMLInputElement && element.type === 'hidden') {
      return false
    }

    // Skip captcha elements
    const id = element.id?.toLowerCase() ?? ''
    const name = element.getAttribute('name')?.toLowerCase() ?? ''
    const className = element.className?.toString().toLowerCase() ?? ''
    if ([id, name, className].some((attr) => attr.includes('captcha'))) {
      return false
    }

    return true
  }, [])

  const detectReactSelectInfo = useCallback((element: WatchableInputElement) => {
    if (!(element instanceof HTMLInputElement)) {
      return { isReactSelect: false, valueContainer: null }
    }

    // Check if this looks like a React Select input
    const hasSelectClasses =
      element.className.includes('select__input') || element.getAttribute('role') === 'combobox'

    if (!hasSelectClasses) {
      return { isReactSelect: false, valueContainer: null }
    }

    // Look for the value container (this is what changes between placeholder and single-value)
    let current: Element | null = element
    let attempts = 0
    const maxAttempts = 10

    while (current && attempts < maxAttempts) {
      // Look for the value container that holds both placeholder and single-value
      const valueContainer = current.querySelector('.select__value-container')
      if (valueContainer) {
        return { isReactSelect: true, valueContainer }
      }

      current = current.parentElement
      attempts++
    }

    return { isReactSelect: false, valueContainer: null }
  }, [])

  const getCurrentValue = useCallback((element: WatchableInputElement): string => {
    const state = inputStatesRef.current.get(element)

    // For React Select components, get value from the value container
    if (state?.isReactSelect && state.valueContainer) {
      // Look for single-value element (when selected)
      const singleValue = state.valueContainer.querySelector('.select__single-value')
      if (singleValue) {
        return singleValue.textContent?.trim() || ''
      }

      // If no single-value, check if there's a placeholder (means not selected)
      const placeholder = state.valueContainer.querySelector('.select__placeholder')
      if (placeholder) {
        return '' // Placeholder means no selection
      }

      // Fallback: look for any text content that's not a placeholder
      const allText = state.valueContainer.textContent?.trim() || ''
      if (allText && !allText.toLowerCase().includes('select') && !allText.includes('...')) {
        return allText
      }

      return ''
    }

    // For regular elements
    if (element instanceof HTMLSelectElement) {
      return element.value || ''
    }
    if (element instanceof HTMLInputElement && element.type === 'checkbox') {
      return element.checked ? 'true' : ''
    }
    if (element instanceof HTMLInputElement && element.type === 'radio') {
      return element.checked ? element.value || 'true' : ''
    }
    // For all other inputs (including custom selects), use the value
    return element.value || ''
  }, [])

  const isInputFilled = useCallback(
    (element: WatchableInputElement): boolean => {
      const value = getCurrentValue(element)

      if (
        element instanceof HTMLInputElement &&
        (element.type === 'checkbox' || element.type === 'radio')
      ) {
        return element.checked
      }

      return value.trim().length > 0
    },
    [getCurrentValue],
  )

  const getInputState = useCallback(
    (element: WatchableInputElement): InputState => {
      const existing = inputStatesRef.current.get(element)
      if (existing) {
        return existing
      }

      const reactSelectInfo = detectReactSelectInfo(element)
      const currentValue = getCurrentValue(element)
      const state: InputState = {
        element,
        wasEmpty: !isInputFilled(element),
        currentValue,
        hasFocus: document.activeElement === element,
        hasBeenInteractedWith: false,
        isReactSelect: reactSelectInfo.isReactSelect,
        valueContainer: reactSelectInfo.valueContainer,
      }

      inputStatesRef.current.set(element, state)
      return state
    },
    [detectReactSelectInfo, getCurrentValue, isInputFilled],
  )

  const updateInputState = useCallback(
    (element: WatchableInputElement, updates: Partial<InputState>): void => {
      const current = getInputState(element)
      const updated = { ...current, ...updates }
      inputStatesRef.current.set(element, updated)
    },
    [getInputState],
  )

  const checkIfShouldTriggerCallback = useCallback(
    (element: WatchableInputElement): void => {
      const state = getInputState(element)

      // Only trigger if:
      // 1. The input was initially empty
      // 2. The user has interacted with it
      // 3. It's now filled
      // 4. It's not currently focused (user has moved away)
      if (
        state.wasEmpty &&
        state.hasBeenInteractedWith &&
        isInputFilled(element) &&
        !state.hasFocus
      ) {
        onInputFilled(element)
        // Reset the state to prevent multiple triggers
        updateInputState(element, {
          wasEmpty: false,
          hasBeenInteractedWith: false,
        })
      }
    },
    [getInputState, isInputFilled, onInputFilled, updateInputState],
  )

  const handleValueChange = useCallback(
    (element: WatchableInputElement): void => {
      const currentValue = getCurrentValue(element)
      const state = getInputState(element)

      // Update current value
      updateInputState(element, { currentValue })

      // If the input has focus OR if value changed significantly, mark as interacted
      // This helps with custom selects that might not follow standard focus patterns
      const previousValue = state.currentValue
      const valueChanged = currentValue !== previousValue

      if (state.hasFocus || valueChanged) {
        updateInputState(element, { hasBeenInteractedWith: true })
      }

      // Debounce the check to handle rapid value changes
      const existingTimer = debounceTimersRef.current.get(element)
      if (existingTimer) {
        clearTimeout(existingTimer)
      }

      const timer = setTimeout(() => {
        checkIfShouldTriggerCallback(element)
        debounceTimersRef.current.delete(element)
      }, debounceMs)

      debounceTimersRef.current.set(element, timer)
    },
    [getCurrentValue, getInputState, updateInputState, checkIfShouldTriggerCallback, debounceMs],
  )

  const handleFocus = useCallback(
    (event: Event): void => {
      const element = event.target as WatchableInputElement
      if (!isValidInputElement(element)) return

      updateInputState(element, { hasFocus: true })
    },
    [isValidInputElement, updateInputState],
  )

  const handleBlur = useCallback(
    (event: Event): void => {
      const element = event.target as WatchableInputElement
      if (!isValidInputElement(element)) return

      updateInputState(element, { hasFocus: false })

      // Check immediately on blur
      setTimeout(() => checkIfShouldTriggerCallback(element), 0)
    },
    [isValidInputElement, updateInputState, checkIfShouldTriggerCallback],
  )

  const handleInput = useCallback(
    (event: Event): void => {
      const element = event.target as WatchableInputElement
      if (!isValidInputElement(element)) return

      handleValueChange(element)
    },
    [isValidInputElement, handleValueChange],
  )

  const handleChange = useCallback(
    (event: Event): void => {
      const element = event.target as WatchableInputElement
      if (!isValidInputElement(element)) return

      handleValueChange(element)
    },
    [isValidInputElement, handleValueChange],
  )

  // Additional event handlers for custom components
  const handleClick = useCallback(
    (event: Event): void => {
      const element = event.target as WatchableInputElement
      if (!isValidInputElement(element)) return

      // Mark as interacted when clicked (important for custom selects)
      updateInputState(element, { hasBeenInteractedWith: true })

      // Check for value changes after click (in case it's a custom select)
      setTimeout(() => handleValueChange(element), 10)
    },
    [isValidInputElement, updateInputState, handleValueChange],
  )

  const handleKeyDown = useCallback(
    (event: Event): void => {
      const element = event.target as WatchableInputElement
      if (!isValidInputElement(element)) return

      // Mark as interacted on key presses
      updateInputState(element, { hasBeenInteractedWith: true })
    },
    [isValidInputElement, updateInputState],
  )

  // Custom event handler for libraries that might use custom events
  const handleCustomChange = useCallback(
    (event: Event): void => {
      const element = event.target as WatchableInputElement
      if (!isValidInputElement(element)) return

      updateInputState(element, { hasBeenInteractedWith: true })
      handleValueChange(element)
    },
    [isValidInputElement, updateInputState, handleValueChange],
  )

  const setupReactSelectObserver = useCallback(
    (element: WatchableInputElement, state: InputState): void => {
      if (!state.isReactSelect || !state.valueContainer) return

      // Set up MutationObserver to watch for changes in the value container
      // This will catch when placeholder gets replaced with single-value or vice versa
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            // DOM structure changed, check if we should trigger callback
            handleValueChange(element)
          }
        })
      })

      observer.observe(state.valueContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      })

      observersRef.current.set(element, observer)
    },
    [handleValueChange],
  )

  const setupElementListeners = useCallback(
    (element: WatchableInputElement): void => {
      // Standard events
      element.addEventListener('focus', handleFocus, { passive: true })
      element.addEventListener('blur', handleBlur, { passive: true })
      element.addEventListener('input', handleInput, { passive: true })
      element.addEventListener('change', handleChange, { passive: true })

      // Additional events for custom components
      element.addEventListener('click', handleClick, { passive: true })
      element.addEventListener('keydown', handleKeyDown, { passive: true })

      // Custom events that some libraries might use
      element.addEventListener('select', handleCustomChange, { passive: true })

      // Initialize state and set up React Select observer if needed
      const state = getInputState(element)
      setupReactSelectObserver(element, state)
    },
    [
      handleFocus,
      handleBlur,
      handleInput,
      handleChange,
      handleClick,
      handleKeyDown,
      handleCustomChange,
      getInputState,
      setupReactSelectObserver,
    ],
  )

  const removeElementListeners = useCallback(
    (element: WatchableInputElement): void => {
      // Remove all event listeners
      element.removeEventListener('focus', handleFocus)
      element.removeEventListener('blur', handleBlur)
      element.removeEventListener('input', handleInput)
      element.removeEventListener('change', handleChange)
      element.removeEventListener('click', handleClick)
      element.removeEventListener('keydown', handleKeyDown)
      element.removeEventListener('select', handleCustomChange)

      // Clean up MutationObserver
      const observer = observersRef.current.get(element)
      if (observer) {
        observer.disconnect()
        observersRef.current.delete(element)
      }

      // Clean up state and timers
      inputStatesRef.current.delete(element)
      const timer = debounceTimersRef.current.get(element)
      if (timer) {
        clearTimeout(timer)
        debounceTimersRef.current.delete(element)
      }
    },
    [
      handleFocus,
      handleBlur,
      handleInput,
      handleChange,
      handleClick,
      handleKeyDown,
      handleCustomChange,
    ],
  )

  useEffect(() => {
    // Filter and setup valid elements
    const validElements = inputElements.filter(isValidInputElement)
    const currentElements = new Set<WatchableInputElement>(validElements)

    // Setup listeners for new elements
    validElements.forEach((element) => {
      if (!inputStatesRef.current.has(element)) {
        setupElementListeners(element)
      }
    })

    // Remove listeners for elements that are no longer in the list
    for (const [element] of inputStatesRef.current) {
      if (!currentElements.has(element)) {
        removeElementListeners(element)
      }
    }

    // Cleanup function
    return () => {
      // Remove all listeners when component unmounts or dependencies change
      for (const [element] of inputStatesRef.current) {
        removeElementListeners(element)
      }

      // Clear any remaining timers
      for (const timer of debounceTimersRef.current.values()) {
        clearTimeout(timer)
      }
      debounceTimersRef.current.clear()

      // Clear any remaining observers
      for (const observer of observersRef.current.values()) {
        observer.disconnect()
      }
      observersRef.current.clear()
    }
  }, [inputElements, isValidInputElement, setupElementListeners, removeElementListeners])
}
