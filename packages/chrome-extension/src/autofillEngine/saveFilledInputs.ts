import { type SerializedHtmlInput } from './schema'
import { SerializedHtmlInputSchema } from './schema'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import { categorizeInputs } from './categorizeInputs'
import getHandlerForInputCategory, { NoValueHandler } from './inputTypeHandlers'
import { preprocessInputs } from './getAutofillInstructions'

const saveFilledInputs = async (inputs: SerializedHtmlInput[], userId: string) => {
  // Validate all inputs using Zod
  const parseResult = SerializedHtmlInputSchema.array().safeParse(inputs)
  if (!parseResult.success) {
    throw new Error('Invalid input payload: ' + JSON.stringify(parseResult.error.format()))
  }

  const preprocessedInputs = preprocessInputs(inputs)
  const categorizedInputs = categorizeInputs(preprocessedInputs)
  const userAutofillPreferences = await getUserAutofillValues(userId)
  console.log('categorizedInputs', categorizedInputs)

  const results = await Promise.all(
    categorizedInputs.map((input) => {
      if (!input.element.value) {
        return new NoValueHandler(userAutofillPreferences || {}).saveAutofillValue(input, userId)
      }
      const handler = getHandlerForInputCategory(input.category, userAutofillPreferences || {})
      return handler.saveAutofillValue(input, userId)
    }),
  )

  return results
}

export default saveFilledInputs
