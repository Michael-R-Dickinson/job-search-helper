import type { InputInfo, ElementInfo } from '../content/hooks/useInputElements'
import { z } from 'zod'
export const SAVED_INPUT_INFOS_PATH = 'inputsTestCases.json'

// Schema for the serialized format (match SerializedHtmlInput)
export const SerializedInputInfoSchema = z.object({
  label: z.string().nullable(),
  html: z.string(),
  fieldType: z.string(),
  name: z.string(),
  type: z.string(),
  placeholder: z.string(),
  autocomplete: z.string(),
  id: z.string(),
  className: z.string(),
  value: z.string(),
  required: z.boolean(),
  elementReferenceId: z.string(),
  selectedText: z.string(),
})

export const SerializedInputInfoArraySchema = z.array(SerializedInputInfoSchema)
export type SerializedInputInfo = z.infer<typeof SerializedInputInfoSchema>

// Schema for the full test case object
export const InputInfosTestCaseSchema = z.object({
  sourceURL: z.string().optional(),
  inputData: SerializedInputInfoArraySchema,
})
export type InputInfosTestCase = z.infer<typeof InputInfosTestCaseSchema>

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

// Serialize InputInfo[] to a serializable array (capture all fields)
export function serializeInputInfosForTest(inputInfos: InputInfo[]): SerializedInputInfo[] {
  return inputInfos.map((info) => {
    const el = info.element
    let value = (el as any).value || ''
    let selectedText = ''
    if (el instanceof HTMLSelectElement) {
      const selectedOption = el.selectedOptions[0]
      if (selectedOption) {
        selectedText = selectedOption.text
        value = selectedOption.value
      }
    }
    // Fallback: extract visible value if value is empty
    if (!value) {
      value = extractDisplayedValue(el, (el as any).placeholder || '', info.label || '')
    }
    return {
      label: info.label,
      html: el.outerHTML,
      fieldType: (el as any).fieldType || '',
      name: (el as any).name || '',
      type: (el as any).type || '',
      placeholder: (el as any).placeholder || '',
      autocomplete: (el as any).autocomplete || '',
      id: el.id || '',
      className: el.className || '',
      value,
      required: !!(el as any).required,
      elementReferenceId: info.elementReferenceId,
      selectedText,
    } as any
  })
}

// Resurrect InputInfo[] from serialized array (restore all fields)
export function resurrectInputInfosFromTest(serialized: SerializedInputInfo[]): InputInfo[] {
  return serialized.map((item, idx) => {
    const html = item.html
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    const element = wrapper.firstElementChild as ElementInfo | null
    if (!element) {
      throw new Error(`Failed to resurrect element from html at index ${idx}: '${html}'`)
    }
    // Restore all relevant attributes
    if (element) {
      if ('value' in element && item.value !== undefined) (element as any).value = item.value
      if ('name' in element && item.name !== undefined) (element as any).name = item.name
      // Only set type for input elements
      if (element.tagName === 'INPUT' && item.type !== undefined) (element as any).type = item.type
      if ('placeholder' in element && item.placeholder !== undefined)
        (element as any).placeholder = item.placeholder
      if ('autocomplete' in element && item.autocomplete !== undefined)
        (element as any).autocomplete = item.autocomplete
      if ('required' in element && item.required !== undefined)
        (element as any).required = item.required
      if ('id' in element && item.id !== undefined) element.id = item.id
      if ('className' in element && item.className !== undefined) element.className = item.className
      // fieldType is not a DOM property, but we can store it as a data attribute if needed
      if (item.fieldType) element.setAttribute('data-field-type', item.fieldType)
      // For <select>, set the selected option by value
      if (element instanceof HTMLSelectElement && item.value !== undefined) {
        for (const opt of Array.from(element.options)) {
          opt.selected = opt.value === item.value
        }
      }
    }
    return {
      label: item.label,
      elementReferenceId: item.elementReferenceId,
      element,
    }
  })
}
