import { z } from 'zod'
import { eventTypes } from './events'
import authenticate, { currentUser } from './auth/background'
import getAutofillInstructions from './autofillEngine/getAutofillInstructions'
import saveFilledInputs from './autofillEngine/saveFilledInputs'
import getSimpleInputAutofillInstructions from './autofillEngine/getSimpleInputAutofillInstructions'
import {
  getResumesQuery,
  uploadResumeQuery,
  getTailoringQuestions,
  convertDocxToPdfQuery,
} from './backendApi'
import type { UserDataResponse } from './content/triggers/triggerGetUserData'
import { UploadResumePayloadSchema } from './content/triggers/triggerResumeUpload'
import { ConvertDocxToPdfPayloadSchema } from './content/triggers/triggerDocxToPdfConversion'

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

    try {
      // Validate the incoming payload
      const validatedPayload = UploadResumePayloadSchema.parse(message.payload)

      // Reconstruct File object from transferred data
      const { fileData, fileName, fileType, fileSize, lastModified } = validatedPayload
      const uint8Array = new Uint8Array(fileData)
      const file = new File([uint8Array], fileName, {
        type: fileType,
        lastModified: lastModified,
      })

      uploadResumeQuery(file, userId)
        .then((response) => {
          sendResponse(response)
        })
        .catch((error) => {
          console.error('Upload query failed:', error)
          sendResponse(null)
        })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Invalid payload for resume upload:', error.errors)
        sendResponse(null)
      } else {
        console.error('Error processing resume upload:', error)
        sendResponse(null)
      }
    }
    return true
  }

  if (message.type === eventTypes.CONVERT_DOCX_TO_PDF) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')

    console.log('Received DOCX to PDF conversion request', message.payload)

    // Validate the incoming payload
    const validatedPayload = ConvertDocxToPdfPayloadSchema.parse(message.payload)

    convertDocxToPdfQuery(validatedPayload.fileName, userId)
      .then((response) => {
        sendResponse(response)
      })
      .catch((error) => {
        console.error('DOCX to PDF conversion failed:', error)
        sendResponse(null)
      })
    return true
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === eventTypes.RETRIEVE_USER_DATA) {
    const userId = currentUser?.uid
    if (!userId) throw new Error('No user found')

    getResumesQuery(userId).then((resumes) => {
      const response: UserDataResponse = {
        userId,
        displayName: currentUser?.displayName,
        userResumes: resumes,
      }
      sendResponse(response)
    })

    return true
  }

  if (message.type === eventTypes.GET_TAILORING_QUESTIONS) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')

    const { fileName, linkedInJobUrl } = message.payload
    if (!fileName || !linkedInJobUrl) {
      throw new Error('fileName and linkedInJobUrl are required')
    }

    getTailoringQuestions(userId, fileName, linkedInJobUrl)
      .then((result) => {
        sendResponse(result)
      })
      .catch((error) => {
        console.error('Error getting tailoring questions:', error)
        sendResponse({ error: error.message })
      })

    return true
  }
})
