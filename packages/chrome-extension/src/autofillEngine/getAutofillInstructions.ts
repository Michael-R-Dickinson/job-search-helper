import type { SerializedHtmlInput } from '../content/serializeInputsHtml'
import { SerializedHtmlInputSchema, type AutofillInstruction } from './schema'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import { categorizeInputs } from './categorizeInputs'
import getHandlerForInputCategory from './inputCategoryHandlers'
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
  // const categorizedInputs = categorizeInputs(preprocessedInputs)
  const autofills = await autofillInputsWithGemini(inputs)
  console.log('autofills', autofills)
  return autofills
  // const userAutofillPreferences = await getUserAutofillValues(userId)

  // if (!userAutofillPreferences) return null

  // console.log('categorizedInputs', categorizedInputs)
  // return categorizedInputs.map((input) => {
  //   const handler = getHandlerForInputCategory(input.category, userAutofillPreferences)
  //   return handler.getAutofillInstruction(input)
  // })
}

export default getAutofillInstructions
