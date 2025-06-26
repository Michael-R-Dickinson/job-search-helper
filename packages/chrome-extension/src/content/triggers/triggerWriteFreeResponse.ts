import z from 'zod/v4'
import { eventTypes } from '../../events'

// Zod schemas for write free response validation
export const WriteFreeResponseResponseSchema = z.object({
  content: z.string(),
})

export const WriteFreeResponsePayloadSchema = z.object({
  promptQuestion: z.string(),
  userAnswerSuggestion: z.string(),
  jobDescriptionLink: z.string().url(),
  resumeName: z.string().nullable(),
})

export const RuntimeWriteFreeResponseMessageSchema = z.object({
  type: z.literal(eventTypes.WRITE_FREE_RESPONSE),
  payload: WriteFreeResponsePayloadSchema,
})

// Type exports
export type WriteFreeResponseResponse = z.infer<typeof WriteFreeResponseResponseSchema>
export type WriteFreeResponsePayload = z.infer<typeof WriteFreeResponsePayloadSchema>
export type RuntimeWriteFreeResponseMessage = z.infer<typeof RuntimeWriteFreeResponseMessageSchema>

const triggerWriteFreeResponse = async (
  promptQuestion: string,
  userAnswerSuggestion: string,
  jobDescriptionLink: string,
  resumeName: string | null,
): Promise<WriteFreeResponseResponse | null> => {
  // Create and validate payload
  const payload: WriteFreeResponsePayload = {
    promptQuestion,
    userAnswerSuggestion,
    jobDescriptionLink,
    resumeName,
  }

  try {
    // Validate payload before sending
    const validatedPayload = WriteFreeResponsePayloadSchema.parse(payload)

    // Send request to background script
    const response = await chrome.runtime.sendMessage({
      type: eventTypes.WRITE_FREE_RESPONSE,
      payload: validatedPayload,
    })

    // Validate the response from background script
    const validatedResponse = WriteFreeResponseResponseSchema.parse(response)

    return validatedResponse
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      console.error('Validation error in write free response:', (error as any).issues)
    } else {
      console.error('Error during write free response:', error)
    }
    return null
  }
}

export default triggerWriteFreeResponse
