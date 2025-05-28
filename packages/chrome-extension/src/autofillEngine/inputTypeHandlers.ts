import type { CategorizedInput, InputCategory, UserAutofillPreferences } from './schema'
import type { AutofillInstruction } from './schema'

// Determine if the input field is a first or last name, then use the userAutofillValue to fill the input
const nameHandler = (
  input: CategorizedInput,
  userAutofillValue: UserAutofillPreferences,
): AutofillInstruction => {
  const firstName = userAutofillValue.name?.first_name
  const lastName = userAutofillValue.name?.last_name

  if (input.element.fieldType === 'text' && input.label?.includes('first')) {
    return { action: 'fill', value: firstName, id: input.element.elementReferenceId }
  }

  if (input.element.fieldType === 'text' && input.label?.includes('last')) {
    return { action: 'fill', value: lastName, id: input.element.elementReferenceId }
  }

  // no change
  return { action: 'skip', id: input.element.elementReferenceId }
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
