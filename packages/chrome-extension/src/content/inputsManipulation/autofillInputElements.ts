import type { AutofillInstruction } from '../../autofillEngine/schema'
import { fillSelectElement } from './selectMatching'
const fillInputElement = (input: HTMLInputElement, instructionValue: string | boolean): void => {
  if (input.type === 'checkbox' || input.type === 'radio') {
    if (!(typeof instructionValue === 'boolean')) return

    const shouldCheck = instructionValue == true
    if (input.checked !== shouldCheck) {
      input.checked = shouldCheck
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  } else if (input.type === 'button') {
    if (instructionValue == true) {
      input.click()
    }
  } else {
    // Regular text inputs
    if (input.value !== instructionValue) {
      if (!(typeof instructionValue === 'string')) return

      input.value = instructionValue
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
}

const fillTextAreaElement = (
  textarea: HTMLTextAreaElement,
  instructionValue: string | boolean,
): void => {
  if (!(typeof instructionValue === 'string')) return

  if (textarea.value !== instructionValue) {
    textarea.value = instructionValue
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    textarea.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

// const fillButtonElement = (button: HTMLButtonElement, instruction: AutofillInstruction): void => {
//   if (instruction.action === 'fill') {
//     button.click()
//   }
// }

export const autofillInputElements = (autofillInstructions: AutofillInstruction[]): void => {
  autofillInstructions.forEach((instruction) => {
    const element = document.querySelector<HTMLElement>(
      `[data-autofill-id="${instruction.input_id}"]`,
    )
    if (!element) return

    const autofillValue = instruction.value

    if (element instanceof HTMLInputElement) {
      fillInputElement(element, autofillValue)
    } else if (element instanceof HTMLTextAreaElement) {
      fillTextAreaElement(element, autofillValue)
    } else if (element instanceof HTMLSelectElement) {
      fillSelectElement(element, autofillValue)
    }
    //  else if (element instanceof HTMLButtonElement) {
    //   fillButtonElement(element, autofillValue)
    // }
  })
}
