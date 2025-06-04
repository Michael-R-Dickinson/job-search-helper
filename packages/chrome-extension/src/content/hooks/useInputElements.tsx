import { useState, useEffect, useRef } from 'react'

export type ElementInfo =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLButtonElement

export interface InputInfo {
  element: ElementInfo
  label: string | null
  wholeQuestionLabel?: string | null
  elementReferenceId: string
}

function generateUniqueId(): string {
  return `af-${crypto.randomUUID()}`
}

const isCaptchaElement = (el: HTMLElement): boolean => {
  const id = el.id?.toLowerCase() ?? ''
  const name = el.getAttribute('name')?.toLowerCase() ?? ''
  const className = el.className?.toString().toLowerCase() ?? ''
  return [id, name, className].some((attr) => attr.includes('captcha'))
}

const isValidInputType = (input: HTMLInputElement): boolean => {
  const allowedTypes = [
    'text',
    'email',
    'password',
    'search',
    'tel',
    'url',
    'number',
    'checkbox',
    'radio',
    'button',
  ]
  return allowedTypes.includes(input.type)
}

const isElementEnabled = (el: ElementInfo): boolean => {
  const tag = el.tagName.toLowerCase()

  if (tag === 'input') {
    const input = el as HTMLInputElement
    const isReadOnlyAllowed = ['checkbox', 'radio', 'button'].includes(input.type)
    return !input.disabled && (isReadOnlyAllowed || !input.readOnly)
  }

  if (tag === 'textarea') {
    const textarea = el as HTMLTextAreaElement
    return !textarea.disabled && !textarea.readOnly
  }

  if (tag === 'select') {
    const select = el as HTMLSelectElement
    return !select.disabled
  }

  if (tag === 'button') {
    const button = el as HTMLButtonElement
    return !button.disabled
  }

  return true
}

const shouldIncludeElement = (el: ElementInfo): boolean => {
  // Check captcha
  if (isCaptchaElement(el)) return false

  // Check element-specific rules
  const tag = el.tagName.toLowerCase()
  if (tag === 'input') {
    const input = el as HTMLInputElement
    if (!isValidInputType(input)) return false
  }

  return isElementEnabled(el)
}

const getLabelText = (el: HTMLElement): string | null => {
  // Try explicit label first
  if (el.id) {
    const explicitLabel = document.querySelector<HTMLLabelElement>(`label[for="${el.id}"]`)
    if (explicitLabel) {
      return explicitLabel.textContent?.trim() ?? null
    }
  }

  // Try implicit label (parent)
  let parent: HTMLElement | null = el.parentElement
  while (parent) {
    if (parent.tagName.toLowerCase() === 'label') {
      return parent.textContent?.trim() ?? null
    }
    parent = parent.parentElement
  }

  return null
}

const getWholeQuestionLabel = (el: HTMLElement): string | null => {
  // Only apply to radio buttons and checkboxes
  if (!(el instanceof HTMLInputElement) || !['radio', 'checkbox'].includes(el.type)) {
    return null
  }

  // For radio buttons, check fieldset legend first
  if (el.type === 'radio') {
    let ancestor: HTMLElement | null = el.parentElement
    while (ancestor) {
      if (ancestor.tagName.toLowerCase() === 'fieldset') {
        const legend = ancestor.querySelector('legend')
        if (legend) {
          const legendText = legend.textContent?.trim()
          // Make sure the legend text is different from the immediate label
          const immediateLabel = getLabelText(el)
          if (legendText && legendText !== immediateLabel) {
            return legendText
          }
        }
        break
      }
      ancestor = ancestor.parentElement
    }
  }

  // Function to clean up text by removing common option words and immediate label
  const cleanQuestionText = (text: string, immediateLabel: string | null): string => {
    let cleaned = text

    // Remove the immediate label if it exists
    if (immediateLabel && cleaned.includes(immediateLabel)) {
      cleaned = cleaned.replace(immediateLabel, '').trim()
    }

    // Remove common option words that often appear with radio buttons/checkboxes
    const optionWords = ['Yes', 'No', 'yes', 'no', 'true', 'false', 'True', 'False']
    optionWords.forEach((option) => {
      // Remove option words at the end or with surrounding spaces
      cleaned = cleaned.replace(new RegExp(`\\s*\\b${option}\\b\\s*`, 'g'), ' ')
    })

    // Handle concatenated option text like "NoYes", "YesNo", etc.
    cleaned = cleaned.replace(/\b(Yes|No|yes|no|True|False|true|false){2,}\b/g, '')

    // Remove common phrases that appear in labels but aren't part of the question
    const labelPhrases = [
      'I am authorized to work',
      'Check if yes',
      'Select if applicable',
      'Click to select',
    ]
    labelPhrases.forEach((phrase) => {
      cleaned = cleaned.replace(phrase, '').trim()
    })

    // Clean up extra whitespace and remove trailing punctuation that might be left
    cleaned = cleaned
      .replace(/\s+/g, ' ')
      .replace(/\s*[,;]\s*$/, '')
      .trim()

    return cleaned
  }

  // Look for broader question context in parent containers
  let parent: HTMLElement | null = el.parentElement
  let searchDepth = 0
  const maxSearchDepth = 5

  while (parent && searchDepth < maxSearchDepth) {
    // Skip the immediate label parent to avoid duplicating the immediate label
    if (parent.tagName.toLowerCase() !== 'label') {
      // Look for text content that appears to be a question
      const textContent = parent.textContent?.trim()
      if (textContent) {
        // Filter out the immediate label text to get the broader context
        const immediateLabel = getLabelText(el)
        const questionText = cleanQuestionText(textContent, immediateLabel)

        // Check if this looks like a question (contains question mark or common question patterns)
        if (
          questionText &&
          (questionText.includes('?') ||
            questionText.toLowerCase().includes('are you') ||
            questionText.toLowerCase().includes('do you') ||
            questionText.toLowerCase().includes('have you') ||
            questionText.toLowerCase().includes('will you') ||
            questionText.toLowerCase().includes('can you') ||
            questionText.toLowerCase().includes('please select') ||
            questionText.toLowerCase().includes('please indicate') ||
            questionText.toLowerCase().includes('please confirm'))
        ) {
          return questionText
        }
      }
    }
    parent = parent.parentElement
    searchDepth++
  }

  // Look for nearby headings or question text
  const questionSelectors = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    '[role="heading"]',
    '.question',
    '.field-label',
  ]

  for (const selector of questionSelectors) {
    const headings = document.querySelectorAll(selector)
    for (const heading of headings) {
      // Check if this heading is near our element (within reasonable DOM distance)
      if (isElementNearby(el, heading as HTMLElement)) {
        const headingText = heading.textContent?.trim()
        if (
          headingText &&
          (headingText.includes('?') ||
            headingText.toLowerCase().includes('are you') ||
            headingText.toLowerCase().includes('do you') ||
            headingText.toLowerCase().includes('have you') ||
            headingText.toLowerCase().includes('will you') ||
            headingText.toLowerCase().includes('can you'))
        ) {
          return headingText
        }
      }
    }
  }

  return null
}

const isElementNearby = (target: HTMLElement, candidate: HTMLElement): boolean => {
  // Check if the candidate is within a reasonable DOM distance from target
  let current: HTMLElement | null = target
  let searchDepth = 0
  const maxSearchDepth = 10

  // Search upwards in the DOM tree
  while (current && searchDepth < maxSearchDepth) {
    if (current.contains(candidate) || candidate.contains(current)) {
      return true
    }

    // Check siblings of current element
    const siblings = current.parentElement?.children
    if (siblings) {
      for (const sibling of Array.from(siblings)) {
        if (sibling === candidate || sibling.contains(candidate)) {
          return true
        }
      }
    }

    current = current.parentElement
    searchDepth++
  }

  return false
}

/**
 * Custom React hook to find all user-fillable inputs, textareas, selects, buttons, and checkboxes on the page,
 * plus their labels, excluding:
 * - aria-hidden or opacity:0
 * - disabled or readOnly (where applicable)
 * - input types that aren't useful for autofill (hidden, etc.)
 * - elements whose id/name/class contains "captcha"
 */
export function useInputElements(): InputInfo[] {
  const [inputs, setInputs] = useState<InputInfo[]>([])
  const idCounterRef = useRef(0)

  useEffect(() => {
    const scanForElements = (): void => {
      const selector = 'input, textarea, select, button'
      const elements = document.querySelectorAll<ElementInfo>(selector)

      const filteredInputs: InputInfo[] = Array.from(elements)
        .filter(shouldIncludeElement)
        .map((el) => {
          let elementReferenceId = el.getAttribute('data-autofill-id')
          if (!elementReferenceId) {
            elementReferenceId = idCounterRef.current.toString()
            el.setAttribute('data-autofill-id', elementReferenceId)
            idCounterRef.current++
          }

          const label = getLabelText(el as HTMLElement)
          const wholeQuestionLabel = getWholeQuestionLabel(el as HTMLElement)

          return {
            element: el,
            elementReferenceId,
            label,
            wholeQuestionLabel,
          }
        })

      // console.log('elements', filteredInputs)
      setInputs(filteredInputs)
    }

    // Initial scan
    scanForElements()

    // Set up observer for dynamic content
    const observer = new MutationObserver(scanForElements)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return inputs
}
