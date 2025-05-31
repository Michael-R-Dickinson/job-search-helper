import { eventTypes } from '../events'
import type { InputInfo } from './hooks/useInputElements'
import { serializeInputsHtml } from './serializeInputsHtml'

const triggerSaveFilledValues = (inputs: InputInfo[]) => {
  const serializedInputs = serializeInputsHtml(inputs)
  return chrome.runtime.sendMessage({
    type: eventTypes.SAVE_AUTOFILL_VALUES,
    payload: serializedInputs,
  })
}

export default triggerSaveFilledValues
