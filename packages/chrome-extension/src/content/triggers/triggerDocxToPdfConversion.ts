import z from 'zod'
import { eventTypes } from '../../events'

// Zod schemas for DOCX to PDF conversion validation
export const ConvertDocxToPdfResponseSchema = z.object({
  fileName: z.string(),
  public_url: z.string().url(),
})

export const ConvertDocxToPdfPayloadSchema = z.object({
  fileName: z.string(),
})

export const RuntimeConvertDocxToPdfMessageSchema = z.object({
  type: z.literal(eventTypes.CONVERT_DOCX_TO_PDF),
  payload: ConvertDocxToPdfPayloadSchema,
})

// Type exports
export type ConvertDocxToPdfResponse = z.infer<typeof ConvertDocxToPdfResponseSchema>
export type ConvertDocxToPdfPayload = z.infer<typeof ConvertDocxToPdfPayloadSchema>
export type RuntimeConvertDocxToPdfMessage = z.infer<typeof RuntimeConvertDocxToPdfMessageSchema>

const triggerDocxToPdfConversion = async (
  fileName: string,
): Promise<ConvertDocxToPdfResponse | null> => {
  console.log('Triggering DOCX to PDF conversion for:', fileName)

  // Create and validate payload
  const payload: ConvertDocxToPdfPayload = {
    fileName,
  }

  try {
    // Validate payload before sending
    const validatedPayload = ConvertDocxToPdfPayloadSchema.parse(payload)

    // Send conversion request to background script
    const response = await chrome.runtime.sendMessage({
      type: eventTypes.CONVERT_DOCX_TO_PDF,
      payload: validatedPayload,
    })

    // Validate the response from background script
    const validatedResponse = ConvertDocxToPdfResponseSchema.parse(response)

    console.log('Successfully validated DOCX to PDF conversion response:', validatedResponse)
    return validatedResponse
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      console.error('Validation error in DOCX to PDF conversion:', (error as any).issues)
    } else {
      console.error('Error during DOCX to PDF conversion:', error)
    }
    return null
  }
}

export default triggerDocxToPdfConversion
