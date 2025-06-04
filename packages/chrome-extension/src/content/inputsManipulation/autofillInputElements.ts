import type { AutofillInstruction } from '../../autofillEngine/schema'
import { fillSelectLikeElement, isSelectLikeElement } from './selectMatching'

const fillTextInputElement = (
  input: HTMLInputElement,
  instructionValue: string | boolean,
): void => {
  if (input.value !== instructionValue) {
    if (!(typeof instructionValue === 'string')) return

    input.value = instructionValue
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

const fillRadioOrCheckboxElement = (
  input: HTMLInputElement,
  instructionValue: boolean | string,
): void => {
  if (
    typeof instructionValue === 'string' &&
    (instructionValue === 'true' || instructionValue === 'false')
  ) {
    instructionValue = instructionValue === 'true'
  }

  const shouldCheck = instructionValue === true
  if (input.checked !== shouldCheck) {
    input.checked = shouldCheck
    input.dispatchEvent(new Event('change', { bubbles: true }))
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

const isRadioOrCheckbox = (element: HTMLElement): element is HTMLInputElement => {
  return (
    element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio')
  )
}
const isTextInput = (element: HTMLElement): element is HTMLInputElement => {
  return element instanceof HTMLInputElement && element.type === 'text'
}

const fillElementWithInstructionValue = async (instruction: AutofillInstruction) => {
  const element = document.querySelector<HTMLElement>(
    `[data-autofill-id="${instruction.input_id}"]`,
  )
  if (!element) return

  const autofillValue = instruction.value

  if (isSelectLikeElement(element)) {
    await fillSelectLikeElement(element, autofillValue, instruction?.input_text)
  } else if (element instanceof HTMLTextAreaElement) {
    fillTextAreaElement(element, autofillValue)
  } else if (isRadioOrCheckbox(element)) {
    fillRadioOrCheckboxElement(element, autofillValue)
  } else if (isTextInput(element)) {
    fillTextInputElement(element, autofillValue)
  }
  return element
}

export const autofillInputElements = async (
  autofillInstructions: AutofillInstruction[],
): Promise<void> => {
  for (const instruction of autofillInstructions) {
    await fillElementWithInstructionValue(instruction)
  }
}
