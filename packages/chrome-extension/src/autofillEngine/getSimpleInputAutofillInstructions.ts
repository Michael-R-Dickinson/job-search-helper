import { type SerializableInputArray } from '../content/SerializableInput'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import { categorizeSimpleInputs } from './categorizeInputs'
import getHandlerForInputCategory from './inputCategoryHandlers'
import { type AutofillInstruction } from './schema'

const getSimpleInputAutofillInstructions = async (
  inputs: SerializableInputArray,
  userId: string,
): Promise<AutofillInstruction[] | null> => {
  const categorizedInputs = categorizeSimpleInputs(inputs)
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
