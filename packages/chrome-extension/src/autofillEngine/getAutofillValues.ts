import type { SerializedHtmlInput } from '../content/serializeInputsHtml'
import { SerializedHtmlInputSchema, type AutofillInstruction } from './schema'
import { getUserAutofillValues } from '../firebase/realtimeDB'
import { categorizeInputs } from './categorizeInputs'
import inputCategoryHandler from './inputTypeHandlers'

const preprocessInputs = (inputs: SerializedHtmlInput[]): SerializedHtmlInput[] => {
  return inputs.map((input) => {
    return {
      ...input,
      label: input.label?.toLowerCase().trim() || null,
    }
  })
}

const getAutofillValues = async (
  inputs: SerializedHtmlInput[],
  userId: string,
): Promise<AutofillInstruction[] | null> => {
  console.log('beginning autofill sequence, values:', inputs)
  // ! TESTING ONLY
  userId = 'testUserId'

  // Validate all inputs using Zod
  const parseResult = SerializedHtmlInputSchema.array().safeParse(inputs)
  if (!parseResult.success) {
    throw new Error('Invalid input payload: ' + JSON.stringify(parseResult.error.format()))
  }

  const preprocessedInputs = preprocessInputs(inputs)
  const categorizedInputs = categorizeInputs(preprocessedInputs)
  const userAutofillPreferences = await getUserAutofillValues(userId)

  console.log('user autofill preferences:', userAutofillPreferences)

  if (!userAutofillPreferences) return null

  return categorizedInputs.map((input) => {
    const handler = inputCategoryHandler[input.category]
    if (!handler) {
      return {
        action: 'skip',
        id: input.element.elementReferenceId,
      }
    }
    return handler(input, userAutofillPreferences)
  })
}

export default getAutofillValues
