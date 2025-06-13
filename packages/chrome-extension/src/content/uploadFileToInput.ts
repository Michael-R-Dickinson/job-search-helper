import { RESUME_UPLOAD_VALUE } from '../autofillEngine/inputCategoryHandlers'

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

export const fillResumeUploadInput = async (
  inputElement: HTMLInputElement | HTMLButtonElement,
  value: string | boolean,
) => {
  if (typeof value !== 'string') return

  let correctedInputElement: HTMLInputElement | null = null
  if (inputElement instanceof HTMLButtonElement) {
    correctedInputElement = findNearestInputElement(inputElement)
  } else {
    correctedInputElement = inputElement
  }
  if (correctedInputElement === null) return

  const fileUrl = value.replace(RESUME_UPLOAD_VALUE, '')
  if (!fileUrl) return
  console.log('fileUrl', fileUrl)
  // 2. Fetch that PDF as a Blob
  const response = await fetch(fileUrl)
  const blob = await response.blob()

  const file = new File([blob], 'Resume.pdf', { type: 'application/pdf' })

  // 4. Use DataTransfer API to simulate user‐selection of that file
  const dt = new DataTransfer()
  dt.items.add(file)

  // 5. Assign to the input element
  correctedInputElement.files = dt.files

  // 6. Fire a "change" event so that any listener on this input sees it as filled
  correctedInputElement.dispatchEvent(new Event('change', { bubbles: true }))
}
