const findNearestInputElement = (element: HTMLElement): HTMLInputElement | null => {
  const parent = element.parentElement
  if (!parent) return null

  if (parent instanceof HTMLInputElement) {
    return parent
  }
  for (const child of parent.children) {
    if (child instanceof HTMLInputElement) {
      return child
    }
  }

  return findNearestInputElement(parent)
}

export const fillResumeUploadInput = async (inputElement: HTMLInputElement | HTMLButtonElement) => {
  let correctedInputElement: HTMLInputElement | null = null
  if (inputElement instanceof HTMLButtonElement) {
    correctedInputElement = findNearestInputElement(inputElement)
  } else {
    correctedInputElement = inputElement
  }
  if (correctedInputElement === null) return

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
  correctedInputElement.files = dt.files

  // 6. Fire a "change" event so that any listener on this input sees it as filled
  correctedInputElement.dispatchEvent(new Event('change', { bubbles: true }))
}
