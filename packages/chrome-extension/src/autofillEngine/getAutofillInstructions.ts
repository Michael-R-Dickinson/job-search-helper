import {
  SerializedHtmlInputSchema,
  type AutofillInstruction,
  type MinifiedInput,
  type SerializedHtmlInput,
} from './schema'
import { autofillInstructionsQuery } from '../backendApi'

export const preprocessInputs = (inputs: SerializedHtmlInput[]): SerializedHtmlInput[] => {
  return inputs.map((input) => {
    return {
      ...input,
      label: input.label?.toLowerCase().trim().replace(/\*$/, '').trim() || null,
    }
  })
}

export const minifyInputs = (inputs: SerializedHtmlInput[]): MinifiedInput[] => {
  const minifiedInputs: MinifiedInput[] = inputs.map((input) => {
    return {
      label: input.label,
      name: input.name,
      fieldType: input.fieldType,
      wholeQuestionLabel: input.wholeQuestionLabel || null,
      value: input.value,
      id: input.elementReferenceId,
    }
  })
  return minifiedInputs
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
  const minifiedInputs = minifyInputs(preprocessedInputs)

  const autofills = await autofillInstructionsQuery(minifiedInputs, userId)
  console.log('autofills', autofills)
  return autofills
}

export default getAutofillInstructions
