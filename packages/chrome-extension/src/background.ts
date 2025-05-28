import { eventTypes } from './events'
import authenticate, { currentUser } from './auth/background'
import getAutofillValues from './autofillEngine/getAutofillValues'

console.log('Background script loaded')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === eventTypes.BEGIN_AUTHENTICATION_FLOW) {
    authenticate()
  }

  if (message.type === eventTypes.GET_AUTOFILL_VALUES) {
    if (!message.payload) throw new Error('No payload provided')

    const userId = currentUser?.uid
    if (!userId) throw new Error('No user ID found')

    console.log('Received GET_AUTOFILL_VALUES message', message.payload)
    return getAutofillValues(message.payload, userId)
  }
})
