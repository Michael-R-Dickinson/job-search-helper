import { getUserAutofillValues } from '../firebase/realtimeDB'
import { categorizeSimpleInputs } from './categorizeInputs'
import { preprocessInputs } from './getAutofillInstructions'
import getHandlerForInputCategory from './inputCategoryHandlers'
import {
  SerializedHtmlInputSchema,
  type AutofillInstruction,
  type SerializedHtmlInput,
} from './schema'

const getSimpleInputAutofillInstructions = async (
  inputs: SerializedHtmlInput[],
  userId: string,
): Promise<AutofillInstruction[] | null> => {
  const parseResult = SerializedHtmlInputSchema.array().safeParse(inputs)
  if (!parseResult.success) {
    throw new Error('Invalid input payload: ' + JSON.stringify(parseResult.error.format()))
  }

  const preprocessedInputs = preprocessInputs(inputs)
  const categorizedInputs = categorizeSimpleInputs(preprocessedInputs)
  console.log('categorizedInputs', categorizedInputs)
  const userAutofillPreferences = await getUserAutofillValues(userId)

  if (!userAutofillPreferences) return null

  console.log('categorizedInputs', categorizedInputs)
  return categorizedInputs.map((input) => {
    const handler = getHandlerForInputCategory(input.category, userAutofillPreferences)
    return handler.getAutofillInstruction(input)
  })
}

export default getSimpleInputAutofillInstructions
