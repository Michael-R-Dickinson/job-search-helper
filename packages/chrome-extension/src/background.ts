import { eventTypes } from './events'
import authenticate, { currentUser } from './auth/background'
import getAutofillInstructions from './autofillEngine/getAutofillInstructions'
import saveFilledInputs from './autofillEngine/saveFilledInputs'
import getSimpleInputAutofillInstructions from './autofillEngine/getSimpleInputAutofillInstructions'
import { uploadResumeQuery } from './backendApi'

console.log('Background script loaded')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === eventTypes.BEGIN_AUTHENTICATION_FLOW) {
    authenticate()
  }

  if (message.type === eventTypes.GET_SIMPLE_AUTOFILL_VALUES) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')
    getSimpleInputAutofillInstructions(message.payload, userId).then((autofillInstructions) => {
      sendResponse(autofillInstructions)
    })
    return true
  }

  if (message.type === eventTypes.GET_AUTOFILL_VALUES) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')

    getAutofillInstructions(message.payload, userId).then((autofillInstructions) => {
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

    saveFilledInputs(message.payload, userId).then((results) => {
      sendResponse(results)
    })
    return true
  }

  if (message.type === eventTypes.UPLOAD_RESUME) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')

    console.log('recieved resume upload request', message.payload)

    // Reconstruct File object from transferred data
    const { fileData, fileName, fileType, fileSize, lastModified } = message.payload
    const uint8Array = new Uint8Array(fileData)
    const file = new File([uint8Array], fileName, {
      type: fileType,
      lastModified: lastModified,
    })

    uploadResumeQuery(file, userId)
  }
})
