import { type SerializedHtmlInput } from './schema'
import { SerializedHtmlInputSchema } from './schema'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import { categorizeInputs } from './categorizeInputs'
import getHandlerForInputCategory from './inputTypeHandlers'
import { preprocessInputs } from './getAutofillValues'

const saveAutofillValues = async (inputs: SerializedHtmlInput[], userId: string) => {
  // Validate all inputs using Zod
  const parseResult = SerializedHtmlInputSchema.array().safeParse(inputs)
  if (!parseResult.success) {
    throw new Error('Invalid input payload: ' + JSON.stringify(parseResult.error.format()))
  }

  const preprocessedInputs = preprocessInputs(inputs)
  const categorizedInputs = categorizeInputs(preprocessedInputs)
  const userAutofillPreferences = await getUserAutofillValues(userId)

  return categorizedInputs.map((input) => {
    const handler = getHandlerForInputCategory(input.category, userAutofillPreferences || {})
    return handler.saveAutofillValue(input, userId)
  })
}

export default saveAutofillValues
