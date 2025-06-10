import {
  INPUT_ELEMENT_TYPES,
  type InputElementType,
  type SerializedHtmlInput,
} from '../autofillEngine/schema'
import type { InputInfo } from './hooks/useInputElements'

function getFieldType(el: Element): InputElementType {
  const tag = el.tagName.toLowerCase()
  if (tag === 'select') return INPUT_ELEMENT_TYPES.SELECT
  if (tag === 'textarea') return INPUT_ELEMENT_TYPES.TEXTBOX
  if (tag === 'input') {
    const type = (el as HTMLInputElement).type?.toLowerCase()
    if (type) {
      const validTypes = Object.values(INPUT_ELEMENT_TYPES)
      if (validTypes.includes(type as any)) {
        return validTypes.find((t) => t === type) as InputElementType
      }
    }
  }
  return INPUT_ELEMENT_TYPES.TEXT
}

// Helper to extract a visible value from nearby DOM if input value is empty
function extractDisplayedValue(el: Element, placeholder: string = '', label: string = ''): string {
  const valueClassFragments = [
    'single-value',
    'selected-value',
    'value-container',
    'current-value',
    'display-value',
    'option-selected',
  ]
  // Common placeholder-like values
  const placeholderVariants = [
    'select...',
    'choose...',
    'please select',
    'please choose',
    'select an option',
    'choose an option',
    'select a value',
    'choose a value',
    'select',
    'choose',
  ]
  function isPlaceholderLike(text: string) {
    const normalized = text.trim().toLowerCase()
    return placeholderVariants.some((variant) => normalized.startsWith(variant))
  }
  let current: Element | null = el
  for (let i = 0; i < 5 && current; i++) {
    for (const fragment of valueClassFragments) {
      const match = current.querySelector(`[class*="${fragment}"]`)
      if (match && match.textContent?.trim()) {
        const text = match.textContent.trim()
        // Check opacity (if available)
        let isLowOpacity = false
        try {
          const style = window.getComputedStyle(match as HTMLElement)
          if (style && style.opacity && parseFloat(style.opacity) < 0.5) {
            isLowOpacity = true
          }
        } catch (e) {
          // Ignore errors from getComputedStyle (e.g., if not attached to DOM)
        }
        // Ignore if matches placeholder, label, is very low opacity, or is a placeholder-like value
        if (
          text &&
          text.toLowerCase() !== placeholder.toLowerCase() &&
          text.toLowerCase() !== label.toLowerCase() &&
          !isLowOpacity &&
          !isPlaceholderLike(text)
        ) {
          return text
        }
      }
    }
    current = current.parentElement
  }
  // Fallback: first non-empty sibling text, not placeholder/label/low opacity/placeholder-like
  if (el.parentElement) {
    for (const sib of Array.from(el.parentElement.children)) {
      if (sib !== el && sib.textContent?.trim()) {
        const text = sib.textContent.trim()
        let isLowOpacity = false
        try {
          const style = window.getComputedStyle(sib as HTMLElement)
          if (style && style.opacity && parseFloat(style.opacity) <= 0.65) {
            isLowOpacity = true
          }
        } catch (e) {
          // Ignore errors from getComputedStyle (e.g., if not attached to DOM)
        }
        if (
          text.toLowerCase() !== placeholder.toLowerCase() &&
          text.toLowerCase() !== label.toLowerCase() &&
          !isLowOpacity &&
          !isPlaceholderLike(text)
        ) {
          return text
        }
      }
    }
  }
  return ''
}

const removeValuePrefixes = (value: string) => {
  // Remove prefixes like "string:" or "number:"
  return value.replace(/^string:|number:/, '')
}

export function serializeInputsHtml(inputs: InputInfo[]): SerializedHtmlInput[] {
  return inputs.map((input) => {
    const el = input.element
    const tag = el.tagName.toLowerCase()
    const fieldType = getFieldType(el)
    let type = 'text'
    if (tag === 'input') {
      type = (el as HTMLInputElement).type?.toLowerCase() || 'text'
    } else if (tag === 'select') {
      type = (el as HTMLSelectElement).type || 'select-one'
    } else if (tag === 'textarea') {
      type = 'textarea'
    }
    const placeholder = (el as any).placeholder || ''
    let value = (el as any).value || ''
    if (!value) {
      value = extractDisplayedValue(el, placeholder, input.label || '')
    }
    value = removeValuePrefixes(value)
    if (type === 'checkbox' || type === 'radio') {
      value = (el as any).checked.toString()
    }
    return {
      label: input.label,
      wholeQuestionLabel: input.wholeQuestionLabel,
      html: el.outerHTML,
      fieldType,
      name: (el as any).name || '',
      type,
      placeholder,
      autocomplete: (el as any).autocomplete || '',
      id: el.id || '',
      className: el.className || '',
      value,
      checked: (el as any).checked || false,
      required: !!(el as any).required,
      elementReferenceId: input.elementReferenceId,
    }
  })
}
