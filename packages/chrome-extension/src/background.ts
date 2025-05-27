import { eventTypes } from './events'
import authenticate from './auth/background'

console.log('Background script loaded')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === eventTypes.BEGIN_AUTHENTICATION_FLOW) {
    authenticate()
    return true // Keep the message channel open for sendResponse
  }
})
