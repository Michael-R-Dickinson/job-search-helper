import { eventTypes } from '../events'

const beginAuthenticationFlow = () => {
  chrome.runtime.sendMessage({
    type: eventTypes.BEGIN_AUTHENTICATION_FLOW,
  })
}

export default beginAuthenticationFlow
