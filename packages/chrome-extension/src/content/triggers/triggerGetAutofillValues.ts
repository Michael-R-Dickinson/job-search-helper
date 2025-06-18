import { AutofillInstructionsSchema } from '../../autofillEngine/schema'
import { eventTypes } from '../../events'
import type InputElement from '../input'

export const triggerGetSimpleAutofillValues = async (inputs: InputElement[]) => {
  const parsedInputs = inputs.map((input) => input.toSerializable().toSerialized())
  const response = await chrome.runtime.sendMessage({
    type: eventTypes.GET_SIMPLE_AUTOFILL_VALUES,
    payload: parsedInputs,
  })
  const parsedResponse = AutofillInstructionsSchema.parse(response)
  return parsedResponse
}

const triggerGetAutofillValues = async (inputs: InputElement[]) => {
  const parsedInputs = inputs.map((input) => input.toSerializable().toSerialized())
  const response = await chrome.runtime.sendMessage({
    type: eventTypes.GET_AUTOFILL_VALUES,
    payload: parsedInputs,
  })
  const parsedResponse = AutofillInstructionsSchema.parse(response)
  return parsedResponse
}

export default triggerGetAutofillValues
