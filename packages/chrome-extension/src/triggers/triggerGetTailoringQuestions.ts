import { eventTypes } from '../events'
import type { QuestionsResponse } from '../backendApi'

interface GetTailoringQuestionsPayload {
  fileName: string
  linkedInJobUrl: string
}

interface GetTailoringQuestionsResponse {
  json?: QuestionsResponse
  status?: number
  statusText?: string
  error?: string
}

export const triggerGetTailoringQuestions = async (
  fileName: string,
  linkedInJobUrl: string,
): Promise<GetTailoringQuestionsResponse> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: eventTypes.GET_TAILORING_QUESTIONS,
        payload: {
          fileName,
          linkedInJobUrl,
        } as GetTailoringQuestionsPayload,
      },
      (response: GetTailoringQuestionsResponse) => {
        if (chrome.runtime.lastError) {
          console.error('Chrome runtime error:', chrome.runtime.lastError)
          resolve({ error: chrome.runtime.lastError.message })
          return
        }
        resolve(response)
      },
    )
  })
}
