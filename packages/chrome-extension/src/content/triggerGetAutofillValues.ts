import type { SerializedHtmlInput } from '../autofillEngine/schema'
import { eventTypes } from '../events'
import type { InputInfo } from './hooks/useInputElements'
import { serializeInputsHtml } from './serializeInputsHtml'

const triggerGetAutofillValues = (inputs: InputInfo[]) => {
  const parsedInputs: SerializedHtmlInput[] = serializeInputsHtml(inputs)
  chrome.runtime.sendMessage({ type: eventTypes.GET_AUTOFILL_VALUES, payload: parsedInputs })
}

export default triggerGetAutofillValues
