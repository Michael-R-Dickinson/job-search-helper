import type { CategorizedInput, InputCategory, UserAutofillPreferences } from './schema'
import type { AutofillInstruction } from './schema'

// Determine if the input field is a first or last name, then use the userAutofillValue to fill the input
const nameHandler = (
  input: CategorizedInput,
  userAutofillValue: UserAutofillPreferences,
): AutofillInstruction => {
  const firstName = userAutofillValue.name?.first_name
  const lastName = userAutofillValue.name?.last_name

  if (input.element.type === 'text' && input.element.name === 'first_name') {
    return { action: 'fill', value: firstName, id: input.element.id }
  }

  if (input.element.type === 'text' && input.element.name === 'last_name') {
    return { action: 'fill', value: lastName, id: input.element.id }
  }

  // no change
  return { action: 'skip', id: input.element.id }
}

const inputCategoryHandler: Partial<
  Record<
    InputCategory,
    (input: CategorizedInput, userAutofillValue: UserAutofillPreferences) => AutofillInstruction
  >
> = {
  name: nameHandler,
}

export default inputCategoryHandler
