import { describe, it, expect } from 'vitest'
import {
  serializeInputInfosForTest,
  resurrectInputInfosFromTest,
  SerializedInputInfoArraySchema,
} from '../saveInputInfosForTests'
import type { InputInfo } from '../../content/hooks/useInputElements'

function createMockInput(
  tag: 'input' | 'textarea' | 'select',
  attrs: Record<string, string | boolean> = {},
): HTMLElement {
  const el = document.createElement(tag)
  Object.entries(attrs).forEach(([k, v]) => {
    if (typeof v === 'boolean') {
      if (v) (el as any)[k] = v
    } else {
      el.setAttribute(k, v)
      ;(el as any)[k] = v
    }
  })
  return el
}

describe('InputInfo serialization utilities', () => {
  it('serializes and resurrects InputInfo[] with all relevant fields', () => {
    // Create mock InputInfo[]
    const inputInfos: InputInfo[] = [
      {
        label: 'First Name',
        elementReferenceId: 'af-1',
        element: createMockInput('input', {
          id: 'firstName',
          type: 'text',
          value: 'Alice',
          name: 'firstName',
          placeholder: 'Enter first name',
          autocomplete: 'given-name',
          className: 'input-class',
          required: true,
        }) as HTMLInputElement,
      },
      {
        label: 'Bio',
        elementReferenceId: 'af-2',
        element: createMockInput('textarea', {
          id: 'bio',
          value: 'Hello',
          name: 'bio',
          placeholder: 'Enter bio',
          autocomplete: 'off',
          className: 'bio-class',
          required: false,
        }) as HTMLTextAreaElement,
      },
      {
        label: null,
        elementReferenceId: 'af-3',
        element: createMockInput('select', {
          id: 'country',
          name: 'country',
          className: 'select-class',
          required: true,
        }) as HTMLSelectElement,
      },
    ]

    // Serialize
    const serialized = serializeInputInfosForTest(inputInfos)
    // Validate with zod
    expect(() => SerializedInputInfoArraySchema.parse(serialized)).not.toThrow()

    // Resurrect
    const resurrected = resurrectInputInfosFromTest(serialized)
    expect(resurrected).toHaveLength(inputInfos.length)
    resurrected.forEach((info, i) => {
      const orig = inputInfos[i]
      const origEl = orig.element as any
      const el = info.element as any
      expect(info.label).toBe(orig.label)
      expect(info.elementReferenceId).toBe(orig.elementReferenceId)
      expect(info.element.tagName).toBe(orig.element.tagName)
      expect(info.element.getAttribute('id')).toBe(origEl.id)
      expect(info.element.className).toBe(origEl.className)
      expect(el.value).toBe(origEl.value)
      expect(el.name).toBe(origEl.name)
      expect(el.type).toBe(origEl.type)
      expect(el.placeholder).toBe(origEl.placeholder)
      expect(el.autocomplete).toBe(origEl.autocomplete)
      expect(el.required).toBe(!!origEl.required)
      // New: check html, fieldType
      expect(serialized[i].html).toBe(origEl.outerHTML)
      expect(serialized[i].fieldType).toBeDefined()
    })
  })
})
