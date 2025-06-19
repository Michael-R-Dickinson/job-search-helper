import { type AutofillInstruction } from './schema'
import { autofillInstructionsQuery } from '../backendApi'
import type { SerializableInputArray } from '../content/SerializableInput'

const getAutofillInstructions = async (
  inputs: SerializableInputArray,
  userId: string,
): Promise<AutofillInstruction[] | null> => {
  const minifiedInputs = inputs.toMinified()
  const autofills = await autofillInstructionsQuery(minifiedInputs, userId)

  console.log('autofills', autofills)

  return autofills
}

export default getAutofillInstructions
