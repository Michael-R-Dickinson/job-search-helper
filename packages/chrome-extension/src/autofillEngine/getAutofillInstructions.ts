import type { SerializedHtmlInput } from '../content/serializeInputsHtml'
import { SerializedHtmlInputSchema, type AutofillInstruction } from './schema'
import autofillInputsWithGemini from './geminiCategorizeInputs'

export const preprocessInputs = (inputs: SerializedHtmlInput[]): SerializedHtmlInput[] => {
  return inputs.map((input) => {
    return {
      ...input,
      label: input.label?.toLowerCase().trim().replace(/\*$/, '').trim() || null,
    }
  })
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
  const autofills = await autofillInputsWithGemini(preprocessedInputs)
  console.log('autofills', autofills)
  return autofills
}

export default getAutofillInstructions
