import { AutofillInstructionsSchema, type SerializedHtmlInput, type AutofillInstruction } from '../autofillEngine/schema'
import { eventTypes } from '../events'
import type { InputInfo } from './hooks/useInputElements'
import { serializeInputsHtml } from './serializeInputsHtml'

const triggerGetAutofillValues = async (inputs: InputInfo[]): Promise<{ instructions: AutofillInstruction[], serializedInputs: SerializedHtmlInput[], userId: string }> => {
  const parsedInputs: SerializedHtmlInput[] = serializeInputsHtml(inputs)
  const response: { autofillInstructions: AutofillInstruction[], userId: string } = await chrome.runtime.sendMessage({
    type: eventTypes.GET_AUTOFILL_VALUES,
    payload: parsedInputs,
  })
  AutofillInstructionsSchema.parse(response.autofillInstructions);
  return { instructions: response.autofillInstructions, serializedInputs: parsedInputs, userId: response.userId };
}

export default triggerGetAutofillValues
