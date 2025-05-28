import { eventTypes } from '../events'
import type { InputInfo } from './hooks/useInputElements'

export type SerializedInput = {
  label: string | null
  html: string
}

const serializeInputs = (inputs: InputInfo[]): SerializedInput[] => {
  return inputs.map((input) => ({
    label: input.label,
    html: input.element.outerHTML,
  }))
}

const triggerGetAutofillValues = (inputs: InputInfo[]) => {
  const serializedInputs = serializeInputs(inputs)
  chrome.runtime.sendMessage({ type: eventTypes.GET_AUTOFILL_VALUES, payload: serializedInputs })
}

export default triggerGetAutofillValues
