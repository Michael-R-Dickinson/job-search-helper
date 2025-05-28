import { getUserAutofillValues } from '../firebase/realtimeDB'
import categorizeInputs, { type CategorizedInput } from './categorizeInputs'
import type { SerializedHtmlInput } from './schema'

export interface AutofillReadyInput extends CategorizedInput {
  autofillValue: string | null
}

const getAutofillValues = async (
  inputs: SerializedHtmlInput[],
  userId: string,
): Promise<AutofillReadyInput[] | null> => {
  const categorizedInputs = categorizeInputs(inputs)
  console.log('categorizedInputs', categorizedInputs)
  const userAutofillPreferences = await getUserAutofillValues(userId)
  console.log('userAutofillPreferences', userAutofillPreferences)

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
