import { saveFilledInputsQuery } from '../backendApi'
import type { SerializableInputArray } from '../content/SerializableInput'

const saveFilledInputs = async (inputs: SerializableInputArray, userId: string) => {
  const minifiedInputs = inputs.toMinified()
  await saveFilledInputsQuery(minifiedInputs, userId)
}

export default saveFilledInputs
