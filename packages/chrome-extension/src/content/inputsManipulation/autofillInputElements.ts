import type { AutofillInstruction } from '../../autofillEngine/schema'
import type { ValueOf } from '../../utils'
import triggerPulseAnimation, { asyncScrollToElement } from './animateInputFilling'
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

const isBooleanString = (value: string): boolean => {
  const lowerCaseValue = value.toLowerCase()
  return lowerCaseValue === 'true' || lowerCaseValue === 'false'
}

const fillRadioOrCheckboxElement = (
  input: HTMLInputElement,
  instructionValue: boolean | string,
): void => {
  if (typeof instructionValue === 'string' && isBooleanString(instructionValue)) {
    instructionValue = instructionValue.toLowerCase() === 'true'
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

const getElementByReferenceId = (referenceId: string): HTMLElement | null => {
  return document.querySelector<HTMLElement>(`[data-autofill-id="${referenceId}"]`)
}

const getFirstFilledElement = (autofillInstructions: AutofillInstruction[]): HTMLElement | null => {
  const firstFilledElement = autofillInstructions.find(
    (instruction) => instruction.value !== null && instruction.value !== '',
  )
  return firstFilledElement ? getElementByReferenceId(firstFilledElement.input_id) : null
}

const fillElementWithInstructionValue = async (instruction: AutofillInstruction) => {
  const element = getElementByReferenceId(instruction.input_id)
  if (!element) return

  const autofillValue = instruction.value
  if (isSelectLikeElement(element)) {
    await fillSelectLikeElement(element, autofillValue, instruction?.input_text)
  } else if (element instanceof HTMLTextAreaElement) {
    fillTextAreaElement(element, autofillValue)
  } else if (isRadioOrCheckbox(element)) {
    fillRadioOrCheckboxElement(element, autofillValue)
  } else if (element instanceof HTMLInputElement) {
    fillTextInputElement(element, autofillValue)
  }
  triggerPulseAnimation(element)
  return element
}

export const AutofillAnimationSpeeds = {
  NONE: 0,
  FAST: 200,
  SLOW: 500,
}
export type AutofillingAnimationSpeed = ValueOf<typeof AutofillAnimationSpeeds>

export const autofillInputElements = async (
  autofillInstructions: AutofillInstruction[],
  animationSpeed: AutofillingAnimationSpeed = AutofillAnimationSpeeds.SLOW,
): Promise<void> => {
  // Scroll to the first filled element if we're using the slow scroll animation
  // Just for effect so they see the animation
  const firstElement = getFirstFilledElement(autofillInstructions)
  if (firstElement && animationSpeed) {
    await asyncScrollToElement(firstElement)
  }

  for (const instruction of autofillInstructions) {
    if (instruction.value === null || instruction.value === '') continue
    await fillElementWithInstructionValue(instruction)

    if (animationSpeed !== AutofillAnimationSpeeds.NONE) {
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
    }
  }
}
