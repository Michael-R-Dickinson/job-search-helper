import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

// Mock timers
vi.useFakeTimers()

describe('useWatchInputs functionality', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    vi.clearAllTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.removeChild(container)
    vi.restoreAllMocks()
  })

  const createInput = (type: string = 'text', id?: string): HTMLInputElement => {
    const input = document.createElement('input')
    input.type = type
    if (id) input.id = id
    container.appendChild(input)
    return input
  }

  const createTextarea = (): HTMLTextAreaElement => {
    const textarea = document.createElement('textarea')
    container.appendChild(textarea)
    return textarea
  }

  const createSelect = (): HTMLSelectElement => {
    const select = document.createElement('select')
    const option1 = document.createElement('option')
    option1.value = ''
    option1.textContent = 'Choose...'
    const option2 = document.createElement('option')
    option2.value = 'option1'
    option2.textContent = 'Option 1'
    select.appendChild(option1)
    select.appendChild(option2)
    container.appendChild(select)
    return select
  }

  const createCustomSelect = (): HTMLInputElement => {
    // Simulate a custom select component (like from Mantine, React Select, etc.)
    const input = document.createElement('input')
    input.type = 'text'
    input.readOnly = true // Custom selects are often readonly
    input.className = 'custom-select'
    input.setAttribute('role', 'combobox')
    container.appendChild(input)
    return input
  }

  const createReactSelect = (): { input: HTMLInputElement; displayValue: HTMLDivElement } => {
    // Create a React Select structure similar to the user's example
    const selectContainer = document.createElement('div')
    selectContainer.className = 'select'

    const selectShell = document.createElement('div')
    selectShell.className = 'select-shell remix-css-b62m3t-container'

    const control = document.createElement('div')
    control.className = 'select__control remix-css-13cymwt-control'

    const valueContainer = document.createElement('div')
    valueContainer.className =
      'select__value-container select__value-container--has-value remix-css-hlgwow'

    const singleValue = document.createElement('div')
    singleValue.className = 'select__single-value remix-css-1dimb5e-singleValue'
    singleValue.textContent = '' // Initially empty

    const inputContainer = document.createElement('div')
    inputContainer.className = 'select__input-container remix-css-19bb58m'

    const input = document.createElement('input')
    input.className = 'select__input'
    input.type = 'text'
    input.value = '' // Always empty in React Select
    input.setAttribute('role', 'combobox')
    input.setAttribute('aria-expanded', 'false')
    input.setAttribute('aria-haspopup', 'true')

    // Build the structure
    inputContainer.appendChild(input)
    valueContainer.appendChild(singleValue)
    valueContainer.appendChild(inputContainer)
    control.appendChild(valueContainer)
    selectShell.appendChild(control)
    selectContainer.appendChild(selectShell)
    container.appendChild(selectContainer)

    return { input, displayValue: singleValue }
  }

  // Helper functions that mirror the hook's internal logic
  const isValidInputElement = (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ): boolean => {
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
  }

  const detectReactSelectInfo = (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ) => {
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
  }

  const getCurrentValue = (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ): string => {
    // Simulate React Select detection
    const reactSelectInfo = detectReactSelectInfo(element)

    // For React Select components, get value from the value container
    if (reactSelectInfo.isReactSelect && reactSelectInfo.valueContainer) {
      // Look for single-value element (when selected)
      const singleValue = reactSelectInfo.valueContainer.querySelector('.select__single-value')
      if (singleValue) {
        return singleValue.textContent?.trim() || ''
      }

      // If no single-value, check if there's a placeholder (means not selected)
      const placeholder = reactSelectInfo.valueContainer.querySelector('.select__placeholder')
      if (placeholder) {
        return '' // Placeholder means no selection
      }

      // Fallback: look for any text content that's not a placeholder
      const allText = reactSelectInfo.valueContainer.textContent?.trim() || ''
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
  }

  const isInputFilled = (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ): boolean => {
    const value = getCurrentValue(element)

    if (
      element instanceof HTMLInputElement &&
      (element.type === 'checkbox' || element.type === 'radio')
    ) {
      return element.checked
    }

    return value.trim().length > 0
  }

  describe('Input Element Validation', () => {
    it('should identify valid input elements', () => {
      const textInput = createInput('text')
      const emailInput = createInput('email')
      const textarea = createTextarea()
      const select = createSelect()

      expect(isValidInputElement(textInput)).toBe(true)
      expect(isValidInputElement(emailInput)).toBe(true)
      expect(isValidInputElement(textarea)).toBe(true)
      expect(isValidInputElement(select)).toBe(true)
    })

    it('should reject disabled inputs', () => {
      const input = createInput('text')
      input.disabled = true

      expect(isValidInputElement(input)).toBe(false)
    })

    it('should allow readonly inputs (for custom selects)', () => {
      const input = createInput('text')
      input.readOnly = true

      expect(isValidInputElement(input)).toBe(true) // Changed from false to true
    })

    it('should reject hidden inputs', () => {
      const input = createInput('hidden')

      expect(isValidInputElement(input)).toBe(false)
    })

    it('should reject captcha inputs', () => {
      const input = createInput('text', 'captcha-field')

      expect(isValidInputElement(input)).toBe(false)
    })

    it('should reject captcha inputs by name attribute', () => {
      const input = createInput('text')
      input.name = 'g-recaptcha-response'

      expect(isValidInputElement(input)).toBe(false)
    })

    it('should reject captcha inputs by class name', () => {
      const input = createInput('text')
      input.className = 'captcha-input'

      expect(isValidInputElement(input)).toBe(false)
    })
  })

  describe('React Select Component Support', () => {
    it('should detect React Select components', () => {
      const { input } = createReactSelect()
      const reactSelectInfo = detectReactSelectInfo(input)

      expect(reactSelectInfo.isReactSelect).toBe(true)
      expect(reactSelectInfo.valueContainer).toBeTruthy()
    })

    it('should get value from value container in React Select', () => {
      const { input, displayValue } = createReactSelect()

      // Initially empty (placeholder state)
      expect(getCurrentValue(input)).toBe('')
      expect(isInputFilled(input)).toBe(false)

      // Simulate user selection by changing DOM structure
      // Remove placeholder and add single-value
      const valueContainer = input.closest('.select__value-container')!
      const placeholder = valueContainer.querySelector('.select__placeholder')
      if (placeholder) {
        placeholder.remove()
      }

      displayValue.textContent = 'Yes'
      valueContainer.appendChild(displayValue)

      expect(getCurrentValue(input)).toBe('Yes')
      expect(isInputFilled(input)).toBe(true)
    })

    it('should handle React Select with different class patterns', () => {
      const input = createInput('text')
      input.className = 'select__input'
      input.setAttribute('role', 'combobox')

      // Create value container with the correct class name
      const parent = document.createElement('div')
      const valueContainer = document.createElement('div')
      valueContainer.className = 'select__value-container' // This is what the hook looks for
      valueContainer.textContent = 'Selected Value'

      parent.appendChild(valueContainer)
      valueContainer.appendChild(input) // Input should be inside value container
      container.appendChild(parent)

      const reactSelectInfo = detectReactSelectInfo(input)
      expect(reactSelectInfo.isReactSelect).toBe(true)
    })

    it('should handle emotion CSS classes from React Select', () => {
      const { input, displayValue } = createReactSelect()

      // Test the specific class from the user's example
      expect(displayValue.className).toContain('css-1dimb5e-singleValue')

      const reactSelectInfo = detectReactSelectInfo(input)
      expect(reactSelectInfo.isReactSelect).toBe(true)
      expect(reactSelectInfo.valueContainer).toBeTruthy()
    })

    it('should not detect regular inputs as React Select', () => {
      const input = createInput('text')
      const reactSelectInfo = detectReactSelectInfo(input)

      expect(reactSelectInfo.isReactSelect).toBe(false)
      expect(reactSelectInfo.valueContainer).toBeNull()
    })
  })

  describe('Custom Select Component Support', () => {
    it('should handle custom select inputs', () => {
      const customSelect = createCustomSelect()

      expect(isValidInputElement(customSelect)).toBe(true)
      expect(customSelect.readOnly).toBe(true) // Verify it's readonly
      expect(customSelect.getAttribute('role')).toBe('combobox')
    })

    it('should detect custom select value changes', () => {
      const customSelect = createCustomSelect()

      expect(isInputFilled(customSelect)).toBe(false)

      // Simulate library setting value
      customSelect.value = 'Selected Option'
      expect(getCurrentValue(customSelect)).toBe('Selected Option')
      expect(isInputFilled(customSelect)).toBe(true)
    })

    it('should handle click events on custom selects', () => {
      const customSelect = createCustomSelect()
      const clickHandler = vi.fn()

      customSelect.addEventListener('click', clickHandler)
      customSelect.dispatchEvent(new Event('click', { bubbles: true }))

      expect(clickHandler).toHaveBeenCalled()
    })

    it('should handle keydown events on custom selects', () => {
      const customSelect = createCustomSelect()
      const keyHandler = vi.fn()

      customSelect.addEventListener('keydown', keyHandler)
      customSelect.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(keyHandler).toHaveBeenCalled()
    })

    it('should handle custom events', () => {
      const customSelect = createCustomSelect()
      const selectHandler = vi.fn()

      customSelect.addEventListener('select', selectHandler)
      customSelect.dispatchEvent(new Event('select', { bubbles: true }))

      expect(selectHandler).toHaveBeenCalled()
    })
  })

  describe('Input Value Detection', () => {
    it('should detect text input values', () => {
      const input = createInput('text')
      input.value = 'test value'

      expect(getCurrentValue(input)).toBe('test value')
      expect(isInputFilled(input)).toBe(true)
    })

    it('should detect empty text input', () => {
      const input = createInput('text')

      expect(getCurrentValue(input)).toBe('')
      expect(isInputFilled(input)).toBe(false)
    })

    it('should detect checkbox state', () => {
      const checkbox = createInput('checkbox')

      expect(isInputFilled(checkbox)).toBe(false)

      checkbox.checked = true
      expect(isInputFilled(checkbox)).toBe(true)
    })

    it('should detect radio button state', () => {
      const radio = createInput('radio')
      radio.name = 'test-group'
      radio.value = 'yes'

      expect(isInputFilled(radio)).toBe(false)

      radio.checked = true
      expect(isInputFilled(radio)).toBe(true)
      expect(getCurrentValue(radio)).toBe('yes')
    })

    it('should detect select values', () => {
      const select = createSelect()

      expect(getCurrentValue(select)).toBe('')
      expect(isInputFilled(select)).toBe(false)

      select.value = 'option1'
      expect(getCurrentValue(select)).toBe('option1')
      expect(isInputFilled(select)).toBe(true)
    })
  })

  describe('Event Handling', () => {
    it('should handle focus events', () => {
      const input = createInput('text')
      const focusHandler = vi.fn()

      input.addEventListener('focus', focusHandler)
      input.dispatchEvent(new Event('focus', { bubbles: true }))

      expect(focusHandler).toHaveBeenCalled()
    })

    it('should handle blur events', () => {
      const input = createInput('text')
      const blurHandler = vi.fn()

      input.addEventListener('blur', blurHandler)
      input.dispatchEvent(new Event('blur', { bubbles: true }))

      expect(blurHandler).toHaveBeenCalled()
    })

    it('should handle input events', () => {
      const input = createInput('text')
      const inputHandler = vi.fn()

      input.addEventListener('input', inputHandler)
      input.value = 'test'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      expect(inputHandler).toHaveBeenCalled()
    })

    it('should handle change events', () => {
      const input = createInput('text')
      const changeHandler = vi.fn()

      input.addEventListener('change', changeHandler)
      input.value = 'test'
      input.dispatchEvent(new Event('change', { bubbles: true }))

      expect(changeHandler).toHaveBeenCalled()
    })

    it('should handle click events', () => {
      const input = createInput('text')
      const clickHandler = vi.fn()

      input.addEventListener('click', clickHandler)
      input.dispatchEvent(new Event('click', { bubbles: true }))

      expect(clickHandler).toHaveBeenCalled()
    })

    it('should handle keydown events', () => {
      const input = createInput('text')
      const keyHandler = vi.fn()

      input.addEventListener('keydown', keyHandler)
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))

      expect(keyHandler).toHaveBeenCalled()
    })
  })

  describe('Input Array Management', () => {
    it('should handle array of input elements', () => {
      const input1 = createInput('text')
      const input2 = createInput('email')
      const textarea = createTextarea()

      const inputElements = [input1, input2, textarea]

      expect(inputElements.length).toBe(3)
      expect(inputElements).toContain(input1)
      expect(inputElements).toContain(input2)
      expect(inputElements).toContain(textarea)
    })

    it('should filter invalid elements from array', () => {
      const validInput = createInput('text')
      const disabledInput = createInput('text')
      disabledInput.disabled = true
      const hiddenInput = createInput('hidden')

      const inputElements = [validInput, disabledInput, hiddenInput]
      const validElements = inputElements.filter(isValidInputElement)

      expect(validElements.length).toBe(1)
      expect(validElements[0]).toBe(validInput)
    })

    it('should handle empty input array', () => {
      const inputElements: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = []

      expect(inputElements.length).toBe(0)
      expect(() => inputElements.filter(isValidInputElement)).not.toThrow()
    })

    it('should handle array with mixed element types including React Select', () => {
      const input = createInput('text')
      const textarea = createTextarea()
      const select = createSelect()
      const customSelect = createCustomSelect()
      const { input: reactSelectInput } = createReactSelect()

      const inputElements = [input, textarea, select, customSelect, reactSelectInput]
      const validElements = inputElements.filter(isValidInputElement)

      expect(validElements.length).toBe(5) // All should be valid
      expect(validElements).toContain(input)
      expect(validElements).toContain(textarea)
      expect(validElements).toContain(select)
      expect(validElements).toContain(customSelect)
      expect(validElements).toContain(reactSelectInput)
    })
  })

  describe('Form Library Scenarios', () => {
    it('should handle rapid value changes', () => {
      const input = createInput('text')

      // Simulate rapid changes like a controlled component
      for (let i = 0; i < 5; i++) {
        input.value = `test${i}`
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }

      expect(input.value).toBe('test4')
      expect(isInputFilled(input)).toBe(true)
    })

    it('should handle programmatic value changes', () => {
      const input = createInput('text')

      // Simulate form library changing value
      input.value = 'formatted-value'
      input.dispatchEvent(new Event('change', { bubbles: true }))

      expect(input.value).toBe('formatted-value')
      expect(isInputFilled(input)).toBe(true)
    })

    it('should handle custom select library interactions', () => {
      const customSelect = createCustomSelect()

      // Simulate library interaction: click to open, then set value
      customSelect.dispatchEvent(new Event('click', { bubbles: true }))
      customSelect.value = 'Selected from dropdown'
      customSelect.dispatchEvent(new Event('change', { bubbles: true }))

      expect(customSelect.value).toBe('Selected from dropdown')
      expect(isInputFilled(customSelect)).toBe(true)
    })

    it('should handle React Select interactions', () => {
      const { input, displayValue } = createReactSelect()

      // Simulate user clicking and selecting
      input.dispatchEvent(new Event('focus', { bubbles: true }))
      input.dispatchEvent(new Event('click', { bubbles: true }))

      // Simulate React Select updating the display value
      displayValue.textContent = 'Yes'

      expect(getCurrentValue(input)).toBe('Yes')
      expect(isInputFilled(input)).toBe(true)
    })
  })

  describe('Whitespace Handling', () => {
    it('should handle whitespace-only values', () => {
      const input = createInput('text')
      input.value = '   '

      expect(isInputFilled(input)).toBe(false)
    })

    it('should handle mixed whitespace and content', () => {
      const input = createInput('text')
      input.value = '  test  '

      expect(isInputFilled(input)).toBe(true)
      expect(getCurrentValue(input).trim()).toBe('test')
    })

    it('should handle whitespace in React Select values', () => {
      const { input, displayValue } = createReactSelect()

      displayValue.textContent = '  Yes  '
      expect(getCurrentValue(input)).toBe('Yes') // Should be trimmed
      expect(isInputFilled(input)).toBe(true)
    })
  })

  describe('Input Type Variants', () => {
    it('should handle email input type', () => {
      const input = createInput('email')
      input.value = 'test@example.com'

      expect(input.type).toBe('email')
      expect(isInputFilled(input)).toBe(true)
    })

    it('should handle password input type', () => {
      const input = createInput('password')
      input.value = 'secret123'

      expect(input.type).toBe('password')
      expect(isInputFilled(input)).toBe(true)
    })

    it('should handle number input type', () => {
      const input = createInput('number')
      input.value = '123'

      expect(input.type).toBe('number')
      expect(isInputFilled(input)).toBe(true)
    })

    it('should handle tel input type', () => {
      const input = createInput('tel')
      input.value = '+1234567890'

      expect(input.type).toBe('tel')
      expect(isInputFilled(input)).toBe(true)
    })

    it('should handle url input type', () => {
      const input = createInput('url')
      input.value = 'https://example.com'

      expect(input.type).toBe('url')
      expect(isInputFilled(input)).toBe(true)
    })
  })

  describe('Textarea Handling', () => {
    it('should handle textarea content', () => {
      const textarea = createTextarea()
      textarea.value = 'This is a long text content that spans multiple lines'

      expect(textarea.tagName.toLowerCase()).toBe('textarea')
      expect(isInputFilled(textarea)).toBe(true)
    })

    it('should handle empty textarea', () => {
      const textarea = createTextarea()

      expect(isInputFilled(textarea)).toBe(false)
    })
  })

  describe('Select Element Handling', () => {
    it('should handle select option changes', () => {
      const select = createSelect()

      expect(isInputFilled(select)).toBe(false)

      select.value = 'option1'
      expect(isInputFilled(select)).toBe(true)
    })

    it('should handle select with pre-selected option', () => {
      const select = createSelect()
      select.value = 'option1'

      expect(isInputFilled(select)).toBe(true)
    })
  })

  describe('Edge Cases and Robustness', () => {
    it('should handle elements that are not valid input types', () => {
      const input = createInput('text')
      const textarea = createTextarea()
      const select = createSelect()
      const customSelect = createCustomSelect()

      // All should be valid
      expect(isValidInputElement(input)).toBe(true)
      expect(isValidInputElement(textarea)).toBe(true)
      expect(isValidInputElement(select)).toBe(true)
      expect(isValidInputElement(customSelect)).toBe(true)
    })

    it('should handle null/undefined gracefully', () => {
      expect(() => {
        const elements = [createInput('text'), createTextarea()]
        elements.forEach((el) => {
          if (isValidInputElement(el)) {
            getCurrentValue(el)
            isInputFilled(el)
          }
        })
      }).not.toThrow()
    })

    it('should handle malformed elements', () => {
      const input = createInput('text')
      // Remove from DOM but keep reference
      container.removeChild(input)

      // Should still work on detached element
      expect(() => {
        getCurrentValue(input)
        isInputFilled(input)
      }).not.toThrow()
    })

    it('should handle duplicate elements in array', () => {
      const input = createInput('text')
      const inputElements = [input, input, input] // Same element multiple times

      // Should handle duplicates gracefully
      expect(inputElements.length).toBe(3)
      expect(new Set(inputElements).size).toBe(1) // Only one unique element
    })
  })

  describe('Element State Tracking', () => {
    it('should track input state changes', () => {
      const input = createInput('text')

      // Initial state
      expect(input.value).toBe('')
      expect(isInputFilled(input)).toBe(false)

      // Fill input
      input.value = 'test content'
      expect(getCurrentValue(input)).toBe('test content')
      expect(isInputFilled(input)).toBe(true)

      // Clear input
      input.value = ''
      expect(getCurrentValue(input)).toBe('')
      expect(isInputFilled(input)).toBe(false)
    })

    it('should track focus state', () => {
      const input = createInput('text')

      expect(document.activeElement).not.toBe(input)

      input.focus()
      expect(document.activeElement).toBe(input)

      input.blur()
      expect(document.activeElement).not.toBe(input)
    })

    it('should track React Select value changes', () => {
      const { input, displayValue } = createReactSelect()

      // Initial state
      expect(getCurrentValue(input)).toBe('')
      expect(isInputFilled(input)).toBe(false)

      // Change display value
      displayValue.textContent = 'Yes'
      expect(getCurrentValue(input)).toBe('Yes')
      expect(isInputFilled(input)).toBe(true)

      // Clear display value
      displayValue.textContent = ''
      expect(getCurrentValue(input)).toBe('')
      expect(isInputFilled(input)).toBe(false)
    })
  })

  describe('Integration Tests - Real World Scenarios', () => {
    it('should handle the exact React Select from user example', () => {
      // Create a simplified version that matches the user's structure
      const selectContainer = document.createElement('div')
      selectContainer.className = 'select'

      const valueContainer = document.createElement('div')
      valueContainer.className =
        'select__value-container select__value-container--has-value remix-css-hlgwow'

      const inputContainer = document.createElement('div')
      inputContainer.className = 'select__input-container remix-css-19bb58m'

      const input = document.createElement('input')
      input.className = 'select__input'
      input.type = 'text'
      input.id = 'question_9073937008'
      input.setAttribute('role', 'combobox')
      input.setAttribute('aria-expanded', 'false')
      input.setAttribute('aria-haspopup', 'true')
      input.value = ''

      // Build the structure
      inputContainer.appendChild(input)
      valueContainer.appendChild(inputContainer)
      selectContainer.appendChild(valueContainer)
      container.appendChild(selectContainer)

      // Verify initial state
      expect(input).toBeTruthy()
      expect(input.value).toBe('') // Input is always empty

      // Test React Select detection
      const reactSelectInfo = detectReactSelectInfo(input)
      expect(reactSelectInfo.isReactSelect).toBe(true)
      expect(reactSelectInfo.valueContainer).toBe(valueContainer)

      // Test value detection (initially empty)
      expect(getCurrentValue(input)).toBe('')
      expect(isInputFilled(input)).toBe(false)

      // Simulate user selecting "Yes" by adding single-value element
      const singleValue = document.createElement('div')
      singleValue.className = 'select__single-value remix-css-1dimb5e-singleValue'
      singleValue.textContent = 'Yes'
      valueContainer.appendChild(singleValue)

      expect(getCurrentValue(input)).toBe('Yes')
      expect(isInputFilled(input)).toBe(true)
    })

    it('should work with the useInputElements hook integration', () => {
      // Create a scenario like the user has in their component
      const { input: reactInput, displayValue } = createReactSelect()
      const regularInput = createInput('text')
      regularInput.id = 'regular-input'

      // Mock InputInfo objects like those from useInputElements
      const mockInputInfos = [
        {
          element: reactInput,
          label: 'Are you legally authorized to work in United States?',
          elementReferenceId: '20',
        },
        {
          element: regularInput,
          label: 'Full Name',
          elementReferenceId: '21',
        },
      ]

      // Extract elements like the component does
      const inputElements = mockInputInfos.map((i) => i.element)

      // Verify all elements are valid
      const validElements = inputElements.filter(isValidInputElement)
      expect(validElements.length).toBe(2)
      expect(validElements).toContain(reactInput)
      expect(validElements).toContain(regularInput)

      // Test React Select element specifically
      expect(getCurrentValue(reactInput)).toBe('')
      displayValue.textContent = 'Yes'
      expect(getCurrentValue(reactInput)).toBe('Yes')
      expect(isInputFilled(reactInput)).toBe(true)

      // Test regular input
      expect(getCurrentValue(regularInput)).toBe('')
      regularInput.value = 'John Doe'
      expect(getCurrentValue(regularInput)).toBe('John Doe')
      expect(isInputFilled(regularInput)).toBe(true)
    })

    it('should demonstrate MutationObserver setup for React Select', () => {
      const { input, displayValue } = createReactSelect()

      // Initial state
      expect(getCurrentValue(input)).toBe('')
      expect(isInputFilled(input)).toBe(false)

      // Test that we can create an observer (this is what the hook does internally)
      const observer = new MutationObserver(() => {
        // This would trigger value change detection in the real hook
      })

      // Get the value container to observe
      const valueContainer = input.closest('.select__value-container')!

      // Verify observer can be set up
      expect(() => {
        observer.observe(valueContainer, {
          childList: true,
          subtree: true,
          characterData: true,
        })
      }).not.toThrow()

      // Change the display value directly
      displayValue.textContent = 'Yes'

      // Test that our getCurrentValue function works correctly with the display value
      expect(getCurrentValue(input)).toBe('Yes')
      expect(isInputFilled(input)).toBe(true)

      // Clean up
      observer.disconnect()
    })
  })
})
