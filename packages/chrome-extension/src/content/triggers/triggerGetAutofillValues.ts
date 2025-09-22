import { AutofillInstructionsSchema } from '../../autofillEngine/schema'
import { eventTypes } from '../../events'
import { AutofillReadyInputArray } from '../autofillReadyInput'
import type InputElement from '../input'

export const triggerGetSimpleAutofillValues = async (inputs: InputElement[]) => {
  const parsedInputs = inputs.map((input) => input.toSerializable().toSerialized())
  const response = await chrome.runtime.sendMessage({
    type: eventTypes.GET_SIMPLE_AUTOFILL_VALUES,
    payload: parsedInputs,
  })
  const parsedResponse = AutofillInstructionsSchema.safeParse(response)
  if (!parsedResponse.success) {
    console.error(
      'Received invalid SIMPLE autofill instructions response from background script:',
      parsedResponse.error,
    )

    throw new Error('Failed to parse autofill instructions')
  }

  return AutofillReadyInputArray.fromAutofillInstructions(parsedResponse.data)
}

const triggerGetAutofillValues = async (inputs: InputElement[]) => {
  const parsedInputs = inputs.map((input) => input.toSerializable().toSerialized())
  const response = await chrome.runtime.sendMessage({
    type: eventTypes.GET_AUTOFILL_VALUES,
    payload: parsedInputs,
  })
  const parsedResponse = AutofillInstructionsSchema.safeParse(response)
  if (!parsedResponse.success) {
    console.error(
      'Received invalid LLM autofill instructions response from background script:',
      parsedResponse.error,
    )

    throw new Error('Failed to parse autofill instructions')
  }

  return AutofillReadyInputArray.fromAutofillInstructions(parsedResponse.data)
}

export default triggerGetAutofillValues
