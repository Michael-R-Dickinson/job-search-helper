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
  writeFreeResponseQuery,
} from './backendApi'
import type { UserDataResponse } from './content/triggers/triggerGetUserData'
import { UploadResumePayloadSchema } from './content/triggers/triggerResumeUpload'
import { ConvertDocxToPdfPayloadSchema } from './content/triggers/triggerDocxToPdfConversion'
import { WriteFreeResponsePayloadSchema } from './content/triggers/triggerWriteFreeResponse'
import { SerializableInputArray } from './content/SerializableInput'

console.log('Background script loaded')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === eventTypes.BEGIN_AUTHENTICATION_FLOW) {
    authenticate()
  }

  if (message.type === eventTypes.GET_SIMPLE_AUTOFILL_VALUES) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')

    const inputs = SerializableInputArray.fromSerialized(message.payload)

    getSimpleInputAutofillInstructions(inputs, userId).then((autofillInstructions) => {
      sendResponse(autofillInstructions)
    })
    return true
  }

  if (message.type === eventTypes.GET_AUTOFILL_VALUES) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')

    const inputs = SerializableInputArray.fromSerialized(message.payload)

    getAutofillInstructions(inputs, userId).then((autofillInstructions) => {
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

    const inputs = SerializableInputArray.fromSerialized(message.payload)

    saveFilledInputs(inputs, userId).then((results) => {
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

    // Validate the incoming payload
    const validatedPayload = ConvertDocxToPdfPayloadSchema.parse(message.payload)

    convertDocxToPdfQuery(validatedPayload.fileName, userId).then((response) => {
      sendResponse(response)
    })
    return true
  }

  if (message.type === eventTypes.WRITE_FREE_RESPONSE) {
    const userId = currentUser?.uid
    if (!message.payload) throw new Error('No payload provided')
    if (!userId) throw new Error('No user found')

    try {
      // Validate the incoming payload
      const validatedPayload = WriteFreeResponsePayloadSchema.parse(message.payload)

      writeFreeResponseQuery(
        validatedPayload.promptQuestion,
        validatedPayload.userAnswerSuggestion,
        validatedPayload.jobDescriptionLink,
        validatedPayload.resumeName,
        userId,
      ).then((response) => {
        sendResponse(response)
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Invalid payload for write free response:', error.errors)
        sendResponse(null)
      } else {
        console.error('Error processing write free response:', error)
        sendResponse(null)
      }
    }
    return true
  }

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
