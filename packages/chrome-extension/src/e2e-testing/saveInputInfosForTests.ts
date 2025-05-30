import type { InputInfo, ElementInfo } from '../content/hooks/useInputElements'
import { z } from 'zod'
export const SAVED_INPUT_INFOS_PATH = 'inputsTestCases.json'

// Schema for the serialized format
export const SerializedInputInfoSchema = z.object({
  label: z.string().nullable(),
  elementReferenceId: z.string(),
  outerHTML: z.string(),
})

export const SerializedInputInfoArraySchema = z.array(SerializedInputInfoSchema)
export type SerializedInputInfo = z.infer<typeof SerializedInputInfoSchema>

// Schema for the full test case object
export const InputInfosTestCaseSchema = z.object({
  sourceURL: z.string().optional(),
  inputData: SerializedInputInfoArraySchema,
})
export type InputInfosTestCase = z.infer<typeof InputInfosTestCaseSchema>

// Serialize InputInfo to a serializable array
export function serializeInputInfosForTest(inputInfos: InputInfo[]): SerializedInputInfo[] {
  return inputInfos.map((info) => ({
    label: info.label,
    elementReferenceId: info.elementReferenceId,
    outerHTML: info.element.outerHTML,
  }))
}

// Resurrect InputInfo from serialized array (for use in tests)
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
