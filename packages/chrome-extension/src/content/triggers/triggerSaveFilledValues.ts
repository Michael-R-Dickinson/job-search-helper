import { eventTypes } from '../../events'
import type InputElement from '../input'

const triggerSaveFilledValues = (inputs: InputElement[]) => {
  const parsedInputs = inputs.map((input) => input.toSerializable().toSerialized())
  console.log('serializedInputs', parsedInputs)
  return chrome.runtime.sendMessage({
    type: eventTypes.SAVE_AUTOFILL_VALUES,
    payload: parsedInputs,
  })
}

export default triggerSaveFilledValues
