import { AutofillInstructionsSchema, type SerializedHtmlInput } from '../autofillEngine/schema'
import { eventTypes } from '../events'
import type { InputInfo } from './hooks/useInputElements'
import { serializeInputsHtml } from './serializeInputsHtml'

export const triggerGetSimpleAutofillValues = async (inputs: InputInfo[]) => {
  const parsedInputs: SerializedHtmlInput[] = serializeInputsHtml(inputs)
  const response = await chrome.runtime.sendMessage({
    type: eventTypes.GET_SIMPLE_AUTOFILL_VALUES,
    payload: parsedInputs,
  })
  const parsedResponse = AutofillInstructionsSchema.parse(response)
  return parsedResponse
}

const triggerGetAutofillValues = async (inputs: InputInfo[]) => {
  const parsedInputs: SerializedHtmlInput[] = serializeInputsHtml(inputs)
  const response = await chrome.runtime.sendMessage({
    type: eventTypes.GET_AUTOFILL_VALUES,
    payload: parsedInputs,
  })
  const parsedResponse = AutofillInstructionsSchema.parse(response)
  return parsedResponse
}

export default triggerGetAutofillValues
