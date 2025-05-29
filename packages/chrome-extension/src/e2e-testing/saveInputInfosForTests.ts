import type { InputInfo, ElementInfo } from '../content/hooks/useInputElements'
import { z } from 'zod'

// Schema for the serialized format
export const SerializedInputInfoSchema = z.object({
  label: z.string().nullable(),
  elementReferenceId: z.string(),
  outerHTML: z.string(),
})

export const SerializedInputInfoArraySchema = z.array(SerializedInputInfoSchema)

export type SerializedInputInfo = z.infer<typeof SerializedInputInfoSchema>

// Serialize InputInfo[] to a serializable array
export function serializeInputInfosForTest(inputInfos: InputInfo[]): SerializedInputInfo[] {
  return inputInfos.map((info) => ({
    label: info.label,
    elementReferenceId: info.elementReferenceId,
    outerHTML: info.element.outerHTML,
  }))
}

// Resurrect InputInfo[] from serialized array
export function resurrectInputInfosFromTest(serialized: SerializedInputInfo[]): InputInfo[] {
  return serialized.map((item) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = item.outerHTML
    const element = wrapper.firstElementChild as ElementInfo
    return {
      label: item.label,
      elementReferenceId: item.elementReferenceId,
      element,
    }
  })
}
