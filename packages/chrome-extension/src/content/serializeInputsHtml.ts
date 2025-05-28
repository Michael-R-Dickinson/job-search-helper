import { INPUT_ELEMENT_TYPES, type SerializedHtmlInput } from '../autofillEngine/schema'
import type { InputInfo } from './hooks/useInputElements'

function getFieldType(el: Element): string {
  const tag = el.tagName.toLowerCase()
  if (tag === 'select') return INPUT_ELEMENT_TYPES.SELECT
  if (tag === 'textarea') return INPUT_ELEMENT_TYPES.TEXTBOX
  if (tag === 'input') {
    const type = (el as HTMLInputElement).type?.toLowerCase()
    if (type && Object.values(INPUT_ELEMENT_TYPES).includes(type as any)) {
      return type
    }
  }
  return INPUT_ELEMENT_TYPES.TEXT
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
    return {
      label: input.label,
      html: el.outerHTML,
      fieldType,
      name: (el as any).name || '',
      type,
      placeholder: (el as any).placeholder || '',
      autocomplete: (el as any).autocomplete || '',
      id: el.id || '',
      className: el.className || '',
      value: (el as any).value || '',
      required: !!(el as any).required,
    }
  })
}
