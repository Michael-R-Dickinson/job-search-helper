import { autofillInstructionsQuery } from '../backendApi'
import type { SerializedHtmlInput } from './schema'

export type MinifiedInput = {
  label: string | null
  name: string | null
  fieldType: string | null
  wholeQuestionLabel: string | null
  value: string | null
}

const autofillInputsWithGemini = async (inputs: SerializedHtmlInput[]) => {
  const minifiedInputs: Partial<MinifiedInput>[] = inputs.map((input) => {
    return {
      label: input.label,
      name: input.name,
      fieldType: input.fieldType,
      wholeQuestionLabel: input.wholeQuestionLabel,
      value: input.value,
      id: input.elementReferenceId,
    }
  })
  const response = await autofillInstructionsQuery(minifiedInputs)
  return response
}

export default autofillInputsWithGemini
