import { useState, useEffect } from 'react'
import type { AutofillInstruction } from '../../autofillEngine/schema'
import { fillSelectElement } from '../utils/selectMatching'

export type ElementInfo =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLButtonElement

export interface InputInfo {
  element: ElementInfo
  label: string | null
  elementReferenceId: string
}

function generateUniqueId(): string {
  return `af-${crypto.randomUUID()}`
}

const isCaptchaElement = (el: HTMLElement): boolean => {
  const id = el.id?.toLowerCase() ?? ''
  const name = el.getAttribute('name')?.toLowerCase() ?? ''
  const className = el.className?.toString().toLowerCase() ?? ''
  return [id, name, className].some((attr) => attr.includes('captcha'))
}

const isValidInputType = (input: HTMLInputElement): boolean => {
  const allowedTypes = [
    'text',
    'email',
    'password',
    'search',
    'tel',
    'url',
    'number',
    'checkbox',
    'radio',
    'button',
  ]
  return allowedTypes.includes(input.type)
}

const isElementEnabled = (el: ElementInfo): boolean => {
  const tag = el.tagName.toLowerCase()

  if (tag === 'input') {
    const input = el as HTMLInputElement
    const isReadOnlyAllowed = ['checkbox', 'radio', 'button'].includes(input.type)
    return !input.disabled && (isReadOnlyAllowed || !input.readOnly)
  }

  if (tag === 'textarea') {
    const textarea = el as HTMLTextAreaElement
    return !textarea.disabled && !textarea.readOnly
  }

  if (tag === 'select') {
    const select = el as HTMLSelectElement
    return !select.disabled
  }

  if (tag === 'button') {
    const button = el as HTMLButtonElement
    return !button.disabled
  }

  return true
}

const shouldIncludeElement = (el: ElementInfo): boolean => {
  // Check captcha
  if (isCaptchaElement(el)) return false

  // Check element-specific rules
  const tag = el.tagName.toLowerCase()
  if (tag === 'input') {
    const input = el as HTMLInputElement
    if (!isValidInputType(input)) return false
  }

  return isElementEnabled(el)
}

const getLabelText = (el: HTMLElement): string | null => {
  // Try explicit label first
  if (el.id) {
    const explicitLabel = document.querySelector<HTMLLabelElement>(`label[for="${el.id}"]`)
    if (explicitLabel) {
      return explicitLabel.textContent?.trim() ?? null
    }
  }

  // Try implicit label (parent)
  let parent: HTMLElement | null = el.parentElement
  while (parent) {
    if (parent.tagName.toLowerCase() === 'label') {
      return parent.textContent?.trim() ?? null
    }
    parent = parent.parentElement
  }

  // For radio buttons, also check for fieldset legend
  if (el instanceof HTMLInputElement && el.type === 'radio') {
    // Look for a fieldset ancestor
    let ancestor: HTMLElement | null = el.parentElement
    while (ancestor) {
      if (ancestor.tagName.toLowerCase() === 'fieldset') {
        const legend = ancestor.querySelector('legend')
        if (legend) {
          return legend.textContent?.trim() ?? null
        }
        break
      }
      ancestor = ancestor.parentElement
    }
  }

  return null
}

/**
 * Custom React hook to find all user-fillable inputs, textareas, selects, buttons, and checkboxes on the page,
 * plus their labels, excluding:
 * - aria-hidden or opacity:0
 * - disabled or readOnly (where applicable)
 * - input types that aren't useful for autofill (hidden, etc.)
 * - elements whose id/name/class contains "captcha"
 */
export function useInputElements(): InputInfo[] {
  const [inputs, setInputs] = useState<InputInfo[]>([])

  useEffect(() => {
    const scanForElements = (): void => {
      const selector = 'input, textarea, select, button'
      const elements = document.querySelectorAll<ElementInfo>(selector)

      const filteredInputs: InputInfo[] = Array.from(elements)
        .filter(shouldIncludeElement)
        .map((el) => {
          const elementReferenceId = generateUniqueId()
          el.setAttribute('data-autofill-id', elementReferenceId)

          return {
            element: el,
            elementReferenceId,
            label: getLabelText(el as HTMLElement),
          }
        })

      setInputs(filteredInputs)
    }

    // Initial scan
    scanForElements()

    // Set up observer for dynamic content
    const observer = new MutationObserver(scanForElements)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return inputs
}

// Autofill functions
const fillInputElement = (input: HTMLInputElement, instruction: AutofillInstruction): void => {
  if (input.type === 'checkbox') {
    const shouldCheck = instruction.action === 'check'
    if (input.checked !== shouldCheck) {
      input.checked = shouldCheck
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  } else if (input.type === 'radio') {
    const shouldCheck = instruction.action === 'check'
    if (shouldCheck && !input.checked) {
      input.checked = true
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  } else if (input.type === 'button') {
    if (instruction.action === 'check') {
      input.click()
    }
  } else {
    // Regular text inputs
    const value = instruction.action === 'fill' ? (instruction.value ?? '') : ''
    if (input.value !== value) {
      input.value = value
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
}

const fillTextAreaElement = (
  textarea: HTMLTextAreaElement,
  instruction: AutofillInstruction,
): void => {
  const value = instruction.action === 'fill' ? (instruction.value ?? '') : ''
  if (textarea.value !== value) {
    textarea.value = value
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    textarea.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

const fillButtonElement = (button: HTMLButtonElement, instruction: AutofillInstruction): void => {
  if (instruction.action === 'fill') {
    button.click()
  }
}

export const autofillInputElements = (autofillInstructions: AutofillInstruction[]): void => {
  autofillInstructions.forEach((instruction) => {
    if (instruction.action === 'skip') return

    const element = document.querySelector<HTMLElement>(`[data-autofill-id="${instruction.id}"]`)
    if (!element) return

    if (element instanceof HTMLInputElement) {
      fillInputElement(element, instruction)
    } else if (element instanceof HTMLTextAreaElement) {
      fillTextAreaElement(element, instruction)
    } else if (element instanceof HTMLSelectElement) {
      const value = instruction.action === 'fill' ? (instruction.value ?? '') : ''
      fillSelectElement(element, value)
    } else if (element instanceof HTMLButtonElement) {
      fillButtonElement(element, instruction)
    }
  })
}
