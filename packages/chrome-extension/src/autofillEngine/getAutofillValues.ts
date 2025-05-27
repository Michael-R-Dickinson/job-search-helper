import type { InputInfo } from '../content/hooks/useInputElements'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import categorizeInputs, { type CategorizedInput } from './categorizeInputs'

export interface AutofillReadyInput extends CategorizedInput {
  autofillValue: string | null
}

const getAutofillValues = async (
  inputs: InputInfo[],
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
