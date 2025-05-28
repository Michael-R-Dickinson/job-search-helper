import type { SerializedInput } from '../content/triggerGetAutofillValues'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import categorizeInputs, { type CategorizedInput } from './categorizeInputs'

export interface AutofillReadyInput extends CategorizedInput {
  autofillValue: string | null
}

const getAutofillValues = async (
  inputs: SerializedInput[],
  userId: string,
): Promise<AutofillReadyInput[] | null> => {
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
