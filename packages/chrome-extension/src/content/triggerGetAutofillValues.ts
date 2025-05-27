import { eventTypes } from '../events'
import type { InputInfo } from './hooks/useInputElements'

const triggerGetAutofillValues = (inputs: InputInfo[]) => {
  chrome.runtime.sendMessage({ type: eventTypes.GET_AUTOFILL_VALUES, payload: inputs })
}

export default triggerGetAutofillValues
