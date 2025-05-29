import { eventTypes } from './events'
import authenticate, { currentUser } from './auth/background'
import getAutofillValues from './autofillEngine/getAutofillValues'
import saveAutofillValues from './autofillEngine/saveAutofillValues'

console.log('Background script loaded')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === eventTypes.BEGIN_AUTHENTICATION_FLOW) {
    authenticate()
  }

  if (message.type === eventTypes.GET_AUTOFILL_VALUES) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')

    getAutofillValues(message.payload, userId).then((autofillInstructions) => {
      console.log(
        'autofillInstructions, before handing off to content script',
        autofillInstructions,
      )
      sendResponse(autofillInstructions)
    })
    return true
  }

  if (message.type === eventTypes.SAVE_AUTOFILL_VALUES) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')

    return saveAutofillValues(message.payload, userId)
  }
})
