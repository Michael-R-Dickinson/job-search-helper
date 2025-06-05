export const fillResumeUploadInput = async (inputElement: HTMLInputElement) => {
  // 1. Build a URL that points to the test‐resume PDF inside assets/
  const fileUrl = chrome.runtime.getURL('src/assets/VasdevYash-Resume.pdf')

  // 2. Fetch that PDF as a Blob
  const response = await fetch(fileUrl)
  const blob = await response.blob()

  // 3. Construct a File object (the name "test-resume.pdf" is arbitrary)
  const file = new File([blob], 'test-resume.pdf', { type: 'application/pdf' })

  // 4. Use DataTransfer API to simulate user‐selection of that file
  const dt = new DataTransfer()
  dt.items.add(file)

  // 5. Assign to the input element
  inputElement.files = dt.files
  console.log('inputElement.files', inputElement.files)

  // 6. Fire a "change" event so that any listener on this input sees it as filled
  inputElement.dispatchEvent(new Event('change', { bubbles: true }))
}
