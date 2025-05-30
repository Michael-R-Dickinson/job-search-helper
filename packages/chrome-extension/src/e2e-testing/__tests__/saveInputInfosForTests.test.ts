import { describe, it, expect } from 'vitest'
import {
  serializeInputInfosForTest,
  resurrectInputInfosFromTest,
  SerializedInputInfoArraySchema,
} from '../saveInputInfosForTests'
import type { InputInfo } from '../../content/hooks/useInputElements'

function createMockInput(
  tag: 'input' | 'textarea' | 'select',
  attrs: Record<string, string> = {},
): HTMLElement {
  const el = document.createElement(tag)
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  return el
}

describe('InputInfo serialization utilities', () => {
  it('serializes and resurrects InputInfo[] correctly', () => {
    // Create mock InputInfo[]
    const inputInfos: InputInfo[] = [
      {
        label: 'First Name',
        elementReferenceId: 'af-1',
        element: createMockInput('input', {
          id: 'firstName',
          type: 'text',
          value: 'Alice',
        }) as HTMLInputElement,
      },
      {
        label: 'Bio',
        elementReferenceId: 'af-2',
        element: createMockInput('textarea', { id: 'bio', value: 'Hello' }) as HTMLTextAreaElement,
      },
      {
        label: null,
        elementReferenceId: 'af-3',
        element: createMockInput('select', { id: 'country' }) as HTMLSelectElement,
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
      expect(info.label).toBe(inputInfos[i].label)
      expect(info.elementReferenceId).toBe(inputInfos[i].elementReferenceId)
      expect(info.element.tagName).toBe(inputInfos[i].element.tagName)
      // Check that the element has the expected id
      expect(info.element.getAttribute('id')).toBe(inputInfos[i].element.getAttribute('id'))
    })
  })
})
