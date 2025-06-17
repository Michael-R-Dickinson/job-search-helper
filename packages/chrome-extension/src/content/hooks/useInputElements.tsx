import { useEffect, useRef, type RefObject } from 'react'
import { querySelectorAllDeep, observeDeepMutations } from '../../utils/shadowDomUtils'
import { getLabelText, getWholeQuestionLabel } from '../../autofillEngine/getLabelText'

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

/**
 * Custom React hook to find all user-fillable inputs, textareas, selects, buttons, and checkboxes on the page,
 * plus their labels, excluding:
 * - aria-hidden or opacity:0
 * - disabled or readOnly (where applicable)
 * - input types that aren't useful for autofill (hidden, etc.)
 * - elements whose id/name/class contains "captcha"
 */
export function useInputElements(): RefObject<InputInfo[]> {
  const inputsRef = useRef<InputInfo[]>([])
  const idCounterRef = useRef(0)

  useEffect(() => {
    const scanForElements = (): void => {
      const selector = 'input, textarea, select, button'
      // Use shadow DOM aware query instead of regular document.querySelectorAll
      const elements = querySelectorAllDeep<ElementInfo>(selector)

      const filteredInputs: InputInfo[] = elements.filter(shouldIncludeElement).map((el) => {
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

      inputsRef.current = filteredInputs
    }

    // Initial scan
    scanForElements()

    // Set up shadow DOM aware observer for dynamic content
    const disconnect = observeDeepMutations(scanForElements)

    return disconnect
  }, [])

  return inputsRef
}
