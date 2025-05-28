import type { SerializedHtmlInput } from '../content/serializeInputsHtml'
import { SerializedHtmlInputSchema, type AutofillInstruction } from './schema'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import { categorizeInputs } from './categorizeInputs'
import inputCategoryHandler from './inputTypeHandlers'

const getAutofillValues = async (
  inputs: SerializedHtmlInput[],
  userId: string,
): Promise<AutofillInstruction[] | null> => {
  // Validate all inputs using Zod
  const parseResult = SerializedHtmlInputSchema.array().safeParse(inputs)
  if (!parseResult.success) {
    throw new Error('Invalid input payload: ' + JSON.stringify(parseResult.error.format()))
  }

  const categorizedInputs = categorizeInputs(inputs)
  const userAutofillPreferences = await getUserAutofillValues(userId)

  if (!userAutofillPreferences) return null

  return categorizedInputs.map((input) => {
    const handler = inputCategoryHandler[input.category]
    if (!handler)
      return {
        action: 'skip',
        id: input.element.elementReferenceId,
      }
    return handler(input, userAutofillPreferences)
  })
}

export default getAutofillValues
