import type { AutofillInstruction, SerializedHtmlInput } from '../../autofillEngine/schema'
import { fillSelectElement } from './selectMatching'
import { applyAutofill } from '../../autofillEngine/getAutofillInstructions'

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

export const autofillInputElements = async (
  autofillInstructions: AutofillInstruction[],
  serializedInputs: SerializedHtmlInput[],
  userId: string
): Promise<void> => {
  for (const instruction of autofillInstructions) {
    if (instruction.action === 'skip') continue;

    const element = document.querySelector<HTMLElement>(`[data-autofill-id="${instruction.id}"]`);
    if (!element) continue;

    // Find the original serialized input data for this instruction
    const originalInputData = serializedInputs.find(
      (input) => input.elementReferenceId === instruction.id
    );

    if (!originalInputData) {
      console.error('❌ Could not find original serialized input data for instruction:', instruction);
      continue;
    }

    // Check for the special resume upload instruction
    if (instruction.action === 'fill' && instruction.value === '__RESUME_FILE_UPLOAD__') {
      if (element instanceof HTMLInputElement) {
        console.log('📄 Found resume upload instruction, calling applyAutofill...');
        await applyAutofill(originalInputData, element, userId);
      } else {
        console.error('❌ Resume upload instruction found for non-input element:', element);
      }
      continue; // Skip the rest of the loop for this instruction
    }

    // Handle other input types
    if (element instanceof HTMLInputElement) {
      fillInputElement(element, instruction);
    } else if (element instanceof HTMLTextAreaElement) {
      fillTextAreaElement(element, instruction);
    } else if (element instanceof HTMLSelectElement) {
      const value = instruction.action === 'fill' ? (instruction.value ?? '') : '';
      fillSelectElement(element, value);
    } else if (element instanceof HTMLButtonElement) {
      fillButtonElement(element, instruction);
    }
  }
}
