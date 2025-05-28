import type { InputCategory, SerializedHtmlInput, UserAutofillPreferences } from './schema'
import type { AutofillInstruction } from './schema'

// Determine if the input field is a first or last name, then use the userAutofillValue to fill the input
const nameHandler = (
  input: SerializedHtmlInput,
  userAutofillValue: UserAutofillPreferences,
): AutofillInstruction => {
  const firstName = userAutofillValue.name?.first_name
  const lastName = userAutofillValue.name?.last_name

  if (input.type === 'text' && input.name === 'first_name') {
    return { action: 'fill', value: firstName, id: input.id }
  }

  if (input.type === 'text' && input.name === 'last_name') {
    return { action: 'fill', value: lastName, id: input.id }
  }

  // no change
  return { action: 'fill', value: input.value, id: input.id }
}

const inputTypeHandlers: Partial<
  Record<
    InputCategory,
    (input: SerializedHtmlInput, userAutofillValue: UserAutofillPreferences) => AutofillInstruction
  >
> = {
  name: nameHandler,
}

export default inputTypeHandlers
