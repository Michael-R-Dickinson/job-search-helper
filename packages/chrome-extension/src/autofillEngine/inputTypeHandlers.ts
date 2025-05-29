import { saveUserAutofillValue } from '../firebase/realtimeDB'
import type { CategorizedInput, InputCategory, UserAutofillPreferences } from './schema'
import type { AutofillInstruction } from './schema'

export abstract class InputCategoryHandler {
  constructor(userAutofillPreferences: UserAutofillPreferences) {}

  abstract getAutofillInstruction(input: CategorizedInput): AutofillInstruction
  abstract saveAutofillValue(input: CategorizedInput, userId: string): void
}

class NameHandler extends InputCategoryHandler {
  savedFirstName: string | undefined
  savedLastName: string | undefined

  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.savedFirstName = userAutofillPreferences.name?.first_name
    this.savedLastName = userAutofillPreferences.name?.last_name
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (input.element.fieldType === 'text' && input.label?.includes('first')) {
      return { action: 'fill', value: this.savedFirstName, id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'text' && input.label?.includes('last')) {
      return { action: 'fill', value: this.savedLastName, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    if (input.element.fieldType === 'text' && input.label?.includes('first')) {
      saveUserAutofillValue(userId, 'name/first_name', input.element.value)
    }
    if (input.element.fieldType === 'text' && input.label?.includes('last')) {
      saveUserAutofillValue(userId, 'name/last_name', input.element.value)
    }
  }
}

class DefaultHandler extends InputCategoryHandler {
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    return
  }
}

// Type for concrete handler constructors
interface InputCategoryHandlerConstructor {
  new (userAutofillPreferences: UserAutofillPreferences): InputCategoryHandler
}

const handlerClassMap: Partial<Record<InputCategory, InputCategoryHandlerConstructor>> = {
  name: NameHandler,
}

export default function getHandlerForInputCategory(
  category: InputCategory,
  userAutofillPreferences: UserAutofillPreferences,
): InputCategoryHandler {
  const HandlerClass = handlerClassMap[category]

  if (!HandlerClass) {
    return new DefaultHandler(userAutofillPreferences)
  }

  return new HandlerClass(userAutofillPreferences)
}
