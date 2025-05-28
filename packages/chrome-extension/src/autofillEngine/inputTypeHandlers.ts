import type { InputCategory, SerializedHtmlInput } from './schema'
import { z } from 'zod'
import type { AutofillInstruction } from './schema'

const nameAutofillPreference = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

// Determine if the input field is a first or last name, then use the userAutofillValue to fill the input
const nameHandler = (
  input: SerializedHtmlInput,
  userAutofillValue: object,
): AutofillInstruction => {
  const nameAutofill = nameAutofillPreference.parse(userAutofillValue)

  const firstName = nameAutofill.first_name
  const lastName = nameAutofill.last_name

  if (input.type === 'text' && input.name === 'first_name') {
    return { action: 'fill', value: firstName, id: input.id }
  }

  if (input.type === 'text' && input.name === 'last_name') {
    return { action: 'fill', value: lastName, id: input.id }
  }

  // no change
  return { action: 'fill', value: input.value, id: input.id }
}

// const addressHandler = (
//   input: ProcessedInput,
//   userAutofillValue: object
// ) => {
//   const addressAutofill = addressAutofillPreference.parse(userAutofillValue)
//   return addressAutofill.address
// }

const inputTypeHandlers: Partial<
  Record<
    InputCategory,
    (input: SerializedHtmlInput, userAutofillValue: object) => AutofillInstruction
  >
> = {
  name: nameHandler,
}

export { inputTypeHandlers }
