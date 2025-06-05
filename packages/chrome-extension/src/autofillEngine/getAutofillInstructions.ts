import type { SerializedHtmlInput } from '../content/serializeInputsHtml'
import { SerializedHtmlInputSchema, type AutofillInstruction } from './schema'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import { categorizeInputs } from './categorizeInputs'
import getHandlerForInputCategory from './inputCategoryHandlers'
import { isResumeUploadInput } from './inputCategoryPredicates'
import { handleResumeUpload } from './inputCategoryHandlers'

export const preprocessInputs = (inputs: SerializedHtmlInput[]): SerializedHtmlInput[] => {
  return inputs.map((input) => {
    return {
      ...input,
      label: input.label?.toLowerCase().trim().replace(/\*$/, '').trim() || null,
    }
  })
}

/**
 * Given a "SerializedHtmlInput" definition and its actual DOM <input> element,
 * decide which autofill handler to run.
 */
export const applyAutofill = async (
  inputData: SerializedHtmlInput,
  inputElement: HTMLInputElement,
  userId: string
) => {
  console.log('🔍 Checking input for resume upload:', {
    type: inputData.type,
    fieldType: inputData.fieldType,
    label: inputData.label,
    name: inputData.name,
    placeholder: inputData.placeholder
  });

  // 1) Check: is this a file‐upload that expects a resume?
  if (isResumeUploadInput(inputData)) {
    console.log('📄 Resume upload detected, attempting to handle...');
    try {
      await handleResumeUpload(inputElement);
      console.log('✅ Resume upload handled successfully');
    } catch (error) {
      console.error('❌ Error handling resume upload:', error);
    }
    return;
  }

  // Get the autofill instruction for this input
  const instruction = await getAutofillInstructions([inputData], userId);
  if (instruction && instruction.length > 0) {
    const { action, value } = instruction[0];
    if (action === 'fill' && value) {
      inputElement.value = value;
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

const getAutofillInstructions = async (
  inputs: SerializedHtmlInput[],
  userId: string,
): Promise<AutofillInstruction[] | null> => {
  // Validate all inputs using Zod
  const parseResult = SerializedHtmlInputSchema.array().safeParse(inputs)
  if (!parseResult.success) {
    throw new Error('Invalid input payload: ' + JSON.stringify(parseResult.error.format()))
  }

  const preprocessedInputs = preprocessInputs(inputs)
  const categorizedInputs = categorizeInputs(preprocessedInputs)
  const userAutofillPreferences = await getUserAutofillValues(userId)

  if (!userAutofillPreferences) return null

  console.log('categorizedInputs', categorizedInputs)
  return categorizedInputs.map((input) => {
    const handler = getHandlerForInputCategory(input.category, userAutofillPreferences)
    return handler.getAutofillInstruction(input)
  })
}

export default getAutofillInstructions
