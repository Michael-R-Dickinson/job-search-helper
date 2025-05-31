import type { AutofillInstruction } from '../../autofillEngine/schema'
import { fillSelectElement } from './selectMatching'
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
