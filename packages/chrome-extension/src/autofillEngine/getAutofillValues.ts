import type { SerializedHtmlInput } from '../content/serializeInputsHtml'
import type { CategorizedInput } from './schema'
import { SerializedHtmlInputSchema } from './schema'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import { categorizeInputs } from './categorizeInputs'

export interface AutofillReadyInput extends CategorizedInput {
  autofillValue: string | null
}

const getAutofillValues = async (
  inputs: SerializedHtmlInput[],
  userId: string,
): Promise<AutofillReadyInput[] | null> => {
  // Validate all inputs using Zod
  const parseResult = SerializedHtmlInputSchema.array().safeParse(inputs)
  if (!parseResult.success) {
    throw new Error('Invalid input payload: ' + JSON.stringify(parseResult.error.format()))
  }

  const categorizedInputs = categorizeInputs(inputs)
  const userAutofillPreferences = await getUserAutofillValues(userId)

  if (!userAutofillPreferences) return null

  return categorizedInputs.map((input) => {
    const value = userAutofillPreferences[input.category]
    return {
      ...input,
      autofillValue: value || null,
    }
  })
}

export default getAutofillValues
