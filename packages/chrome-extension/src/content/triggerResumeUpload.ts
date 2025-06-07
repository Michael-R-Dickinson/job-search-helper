import { eventTypes } from '../events'

const triggerResumeUpload = async (file: File) => {
  console.log('Triggering resume upload', file)

  // Convert file to transferable format
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const fileData = Array.from(uint8Array)

  // Send file data along with metadata needed to reconstruct File
  return chrome.runtime.sendMessage({
    type: eventTypes.UPLOAD_RESUME,
    payload: {
      fileData,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      lastModified: file.lastModified,
    },
  })
}

export default triggerResumeUpload
