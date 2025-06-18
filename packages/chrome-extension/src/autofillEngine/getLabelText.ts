import { getElementByAttributeDeep, querySelectorAllDeep } from '../utils/shadowDomUtils'

/**
 * Enhanced function to get label text for form elements with sophisticated detection
 * Handles various label patterns including:
 * - Explicit labels (for/id)
 * - Implicit labels (parent)
 * - Sibling label divs (like application-label class)
 * - Nearby headings and question text
 */
export const getLabelText = (el: HTMLElement): string | null => {
  // Try explicit label first
  if (el.id) {
    const explicitLabel = getElementByAttributeDeep<HTMLLabelElement>('for', el.id)
    if (explicitLabel) {
      const labelText = explicitLabel.textContent?.trim()
      if (labelText) return labelText
    }
  }

  // Try sibling label divs (for structures like application-label)
  const siblingLabel = findSiblingLabel(el)
  if (siblingLabel) return siblingLabel

  // Try implicit label (parent)
  let parent: HTMLElement | null = el.parentElement
  while (parent) {
    if (parent.tagName.toLowerCase() === 'label') {
      const labelText = parent.textContent?.trim()
      if (labelText) return labelText
    }

    // Check for label children in current parent
    for (const child of parent.children) {
      if (child.tagName.toLowerCase() === 'label') {
        const labelText = child.textContent?.trim()
        if (labelText) return labelText
      }
    }
    parent = parent.parentElement
  }

  // Try finding labels in ancestor containers
  const ancestorLabel = findAncestorLabel(el)
  if (ancestorLabel) return ancestorLabel

  return null
}

/**
 * Finds label text in sibling elements, particularly useful for structures where
 * the label is in a separate div with classes like "application-label"
 */
const findSiblingLabel = (el: HTMLElement): string | null => {
  let container: HTMLElement | null = el.parentElement

  // Search up to find a common container that might have label siblings
  let searchDepth = 0
  const maxSearchDepth = 3

  while (container && searchDepth < maxSearchDepth) {
    // Look for siblings with label-related classes
    const siblings = container.children

    for (const sibling of Array.from(siblings)) {
      if (sibling === el.parentElement) continue // Skip the element's own parent

      const classList = sibling.className?.toString().toLowerCase() || ''

      // Check for various label class patterns
      if (
        classList.includes('application-label') ||
        classList.includes('field-label') ||
        classList.includes('form-label') ||
        classList.includes('question-label') ||
        classList.includes('label')
      ) {
        const labelText = extractCleanLabelText(sibling as HTMLElement)
        if (labelText) return labelText
      }
    }

    // Also check the container itself for label classes
    const containerClassList = container.className?.toString().toLowerCase() || ''
    if (
      containerClassList.includes('application-label') ||
      containerClassList.includes('field-label') ||
      containerClassList.includes('form-label') ||
      containerClassList.includes('question-label')
    ) {
      const labelText = extractCleanLabelText(container)
      if (labelText) return labelText
    }

    container = container.parentElement
    searchDepth++
  }

  return null
}

/**
 * Finds label text in ancestor containers by looking for text content
 * that appears to be a question or label
 */
const findAncestorLabel = (el: HTMLElement): string | null => {
  let parent: HTMLElement | null = el.parentElement
  let searchDepth = 0
  const maxSearchDepth = 5

  while (parent && searchDepth < maxSearchDepth) {
    // Skip immediate label parents to avoid duplication
    if (parent.tagName.toLowerCase() !== 'label') {
      // Look for text content that appears to be a question
      const textContent = parent.textContent?.trim()
      if (textContent) {
        // Check if this looks like a question or label
        if (isLikelyQuestionText(textContent)) {
          const cleanText = extractCleanLabelText(parent)
          if (cleanText) return cleanText
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
    '.form-question',
  ]

  for (const selector of questionSelectors) {
    const headings = querySelectorAllDeep(selector)
    for (const heading of headings) {
      if (isElementNearby(el, heading as HTMLElement)) {
        const headingText = heading.textContent?.trim()
        if (headingText && isLikelyQuestionText(headingText)) {
          return extractCleanLabelText(heading as HTMLElement)
        }
      }
    }
  }

  return null
}

/**
 * Extracts clean label text from an element, removing common UI elements
 * like required indicators and extra whitespace
 */
const extractCleanLabelText = (element: HTMLElement): string | null => {
  let text = element.textContent?.trim() || ''

  if (!text) return null

  // Remove common required indicators
  text = text.replace(/[*✱★✯✰]/g, '').trim()

  // Remove common UI text that isn't part of the actual question
  const uiPhrases = [
    '\\(\\s*Required\\s*\\)',
    '\\(\\s*required\\s*\\)',
    '\\(\\s*Optional\\s*\\)',
    '\\(\\s*optional\\s*\\)',
    'Required',
    'required',
    'Optional',
    'optional',
  ]

  uiPhrases.forEach((phrase) => {
    text = text.replace(new RegExp(`\\s*${phrase}\\s*`, 'g'), ' ')
  })

  // Clean up extra whitespace and empty parentheses
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\(\s*\)/g, '') // Remove empty parentheses
    .trim()

  return text || null
}

/**
 * Determines if text content looks like a question or label
 */
const isLikelyQuestionText = (text: string): boolean => {
  const lowerText = text.toLowerCase()

  return (
    text.includes('?') ||
    lowerText.includes('tell us') ||
    lowerText.includes('describe') ||
    lowerText.includes('explain') ||
    lowerText.includes('please') ||
    lowerText.includes('enter') ||
    lowerText.includes('provide') ||
    lowerText.includes('upload') ||
    lowerText.includes('attach') ||
    lowerText.includes('select') ||
    lowerText.includes('choose') ||
    lowerText.includes('indicate') ||
    lowerText.includes('confirm') ||
    lowerText.includes('are you') ||
    lowerText.includes('do you') ||
    lowerText.includes('have you') ||
    lowerText.includes('will you') ||
    lowerText.includes('can you') ||
    lowerText.includes('would you')
  )
}

/**
 * Enhanced function to get broader question context for radio buttons and checkboxes
 */
export const getWholeQuestionLabel = (el: HTMLElement): string | null => {
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
      'JavaScript',
      'Python',
      'Domestic travel',
      'International travel',
    ]
    labelPhrases.forEach((phrase) => {
      cleaned = cleaned.replace(phrase, '').trim()
    })

    // Find and extract just the question part if there's a question mark
    const questionMatch = cleaned.match(/^[^?]*\?/)
    if (questionMatch) {
      cleaned = questionMatch[0].trim()
    } else {
      // If no question mark, try to find question patterns and stop at certain punctuation
      const questionPatterns = [
        /^(Please [^.!]*)/i,
        /^(Tell us [^.!]*)/i,
        /^(Describe [^.!]*)/i,
        /^(What [^.!]*)/i,
        /^(Do you [^.!]*)/i,
        /^(Are you [^.!]*)/i,
        /^(Have you [^.!]*)/i,
        /^(Will you [^.!]*)/i,
        /^(Can you [^.!]*)/i,
      ]

      for (const pattern of questionPatterns) {
        const match = cleaned.match(pattern)
        if (match) {
          cleaned = match[1].trim()
          break
        }
      }
    }

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
      // First, try to find specific question elements within this parent
      const questionElements = parent.querySelectorAll(
        '.question-text, .application-label, .field-label, .form-label, .question-label',
      )
      for (const questionEl of Array.from(questionElements)) {
        const questionText = extractCleanLabelText(questionEl as HTMLElement)
        if (questionText && isLikelyQuestionText(questionText)) {
          const immediateLabel = getLabelText(el)
          const cleanedText = cleanQuestionText(questionText, immediateLabel)
          if (cleanedText && cleanedText !== questionText) {
            return cleanedText
          }
          return questionText
        }
      }

      // If no specific question elements found, look for direct text content
      // but be more selective about which parent elements to consider
      const classList = parent.className?.toString().toLowerCase() || ''
      if (
        classList.includes('question') ||
        classList.includes('form-section') ||
        classList.includes('field-group') ||
        parent.tagName.toLowerCase().match(/^h[1-6]$/)
      ) {
        const textContent = parent.textContent?.trim()
        if (textContent) {
          const immediateLabel = getLabelText(el)
          const questionText = cleanQuestionText(textContent, immediateLabel)

          // Check if this looks like a question and is reasonably short
          if (questionText && isLikelyQuestionText(questionText) && questionText.length < 200) {
            return questionText
          }
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
    const headings = querySelectorAllDeep(selector)
    for (const heading of headings) {
      // Check if this heading is near our element (within reasonable DOM distance)
      if (isElementNearby(el, heading as HTMLElement)) {
        const headingText = heading.textContent?.trim()
        if (headingText && isLikelyQuestionText(headingText)) {
          return headingText
        }
      }
    }
  }

  return null
}

/**
 * Checks if two elements are nearby in the DOM structure
 */
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
