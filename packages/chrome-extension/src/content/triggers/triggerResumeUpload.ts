import { z } from 'zod'
import { eventTypes } from '../../events'
// Shared Zod schemas for resume upload validation
export const UploadResumeResponseSchema = z.object({
  message: z.string(),
  public_url: z.string(),
})

export const UploadResumePayloadSchema = z.object({
  fileData: z.array(z.number()),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  lastModified: z.number(),
})

export const RuntimeUploadResumeMessageSchema = z.object({
  type: z.literal(eventTypes.UPLOAD_RESUME),
  payload: UploadResumePayloadSchema,
})

// Type exports
export type UploadResumeResponse = z.infer<typeof UploadResumeResponseSchema>
export type UploadResumePayload = z.infer<typeof UploadResumePayloadSchema>
export type RuntimeUploadResumeMessage = z.infer<typeof RuntimeUploadResumeMessageSchema>

const triggerResumeUpload = async (file: File): Promise<string | null> => {
  console.log('Triggering resume upload', file)

  // Convert file to transferable format
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const fileData = Array.from(uint8Array)

  // Create and validate payload
  const payload: UploadResumePayload = {
    fileData,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    lastModified: file.lastModified,
  }

  try {
    // Validate payload before sending
    const validatedPayload = UploadResumePayloadSchema.parse(payload)

    // Send file data along with metadata needed to reconstruct File
    const response = await chrome.runtime.sendMessage({
      type: eventTypes.UPLOAD_RESUME,
      payload: validatedPayload,
    })

    // Validate the response from background script
    const validatedResponse = UploadResumeResponseSchema.parse(response)

    console.log('Successfully validated upload response:', validatedResponse)
    return validatedResponse.public_url
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      console.error('Validation error in resume upload:', (error as any).issues)
    } else {
      console.error('Error during resume upload:', error)
    }
    return null
  }
}

export default triggerResumeUpload
