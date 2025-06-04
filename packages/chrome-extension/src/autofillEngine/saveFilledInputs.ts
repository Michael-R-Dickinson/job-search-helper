import { type SerializedHtmlInput } from './schema'
import { SerializedHtmlInputSchema } from './schema'
import { minifyInputs, preprocessInputs } from './getAutofillInstructions'
import { saveFilledInputsQuery } from '../backendApi'

const saveFilledInputs = async (inputs: SerializedHtmlInput[], userId: string) => {
  // Validate all inputs using Zod
  const parseResult = SerializedHtmlInputSchema.array().safeParse(inputs)
  if (!parseResult.success) {
    throw new Error('Invalid input payload: ' + JSON.stringify(parseResult.error.format()))
  }

  const preprocessedInputs = preprocessInputs(inputs)
  const minifiedInputs = minifyInputs(preprocessedInputs)
  await saveFilledInputsQuery(minifiedInputs, userId)
}

export default saveFilledInputs
