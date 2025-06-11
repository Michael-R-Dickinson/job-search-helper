import { eventTypes } from '../events'

type UploadResumeResponse = {
  message: string
  public_url: string
}

const triggerResumeUpload = async (file: File): Promise<string | null> => {
  console.log('Triggering resume upload', file)

  // Convert file to transferable format
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const fileData = Array.from(uint8Array)

  // Send file data along with metadata needed to reconstruct File
  const response = (await chrome.runtime.sendMessage({
    type: eventTypes.UPLOAD_RESUME,
    payload: {
      fileData,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      lastModified: file.lastModified,
    },
  })) as UploadResumeResponse | null

  // Extract and return the public_url from the response
  return response?.public_url || null
}

export default triggerResumeUpload
