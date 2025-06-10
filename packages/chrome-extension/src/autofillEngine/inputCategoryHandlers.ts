import { saveUserAutofillValue } from '../firebase/realtimeDB'
import {
  type CategorizedInput,
  type RealtimeDbSaveResult,
  type UserAutofillPreferences,
  type SimpleInputsEnum,
} from './schema'
import type { AutofillInstruction } from './schema'

export abstract class InputCategoryHandler {
  constructor(userAutofillPreferences: UserAutofillPreferences) {}

  abstract getAutofillInstruction(input: CategorizedInput): AutofillInstruction
  abstract saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult>
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
    const label = input.element.label?.toLowerCase() || ''
    if (input.element.fieldType === 'text' && label.includes('first')) {
      return { value: this.savedFirstName || '', input_id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'text' && label.includes('last')) {
      return { value: this.savedLastName || '', input_id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'text' && label.includes('full')) {
      return {
        value: (this.savedFirstName || '') + ' ' + (this.savedLastName || ''),
        input_id: input.element.elementReferenceId,
      }
    }
    return { value: '', input_id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    const label = input.element.label?.toLowerCase() || ''
    if (input.element.fieldType === 'text' && label.includes('first')) {
      return saveUserAutofillValue(userId, 'name/first_name', input.element.value)
    }
    if (input.element.fieldType === 'text' && label.includes('last')) {
      return saveUserAutofillValue(userId, 'name/last_name', input.element.value)
    }
    return Promise.resolve({
      status: 'error',
      error: 'Failed to save name autofill value',
    })
  }
}

class EmailHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.email
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { value: this.value, input_id: input.element.elementReferenceId }
    }
    return { value: '', input_id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'email', input.element.value)
  }
}

class PronounsHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.identity?.pronouns
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { value: this.value, input_id: input.element.elementReferenceId }
    }
    return { value: '', input_id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'identity/pronouns', input.element.value)
  }
}

class LinkedinProfileHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.linkedin_profile
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { value: this.value, input_id: input.element.elementReferenceId }
    }
    return { value: '', input_id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'linkedin_profile', input.element.value)
  }
}

class TwitterUrlHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.twitter_url
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { value: this.value, input_id: input.element.elementReferenceId }
    }
    return { value: '', input_id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'twitter_url', input.element.value)
  }
}

class GithubUrlHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.github_url
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { value: this.value, input_id: input.element.elementReferenceId }
    }
    return { value: '', input_id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'github_url', input.element.value)
  }
}

class SalaryExpectationsHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.salary_expectations
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { value: this.value, input_id: input.element.elementReferenceId }
    }
    return { value: '', input_id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'salary_expectations', input.element.value)
  }
}

export const RESUME_UPLOAD_VALUE = '__RESUME_FILE_UPLOAD__'

class ResumeUploadHandler extends InputCategoryHandler {
  // You might add properties here if you were storing file data in the handler
  // For now, we'll simulate a blank file directly in the autofill logic

  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    // Return a special action that indicates we need to handle a file upload
    return {
      value: RESUME_UPLOAD_VALUE,
      input_id: input.element.elementReferenceId,
    }
  }

  saveAutofillValue(): Promise<RealtimeDbSaveResult> {
    return Promise.resolve({
      status: 'error',
      error: 'skipped_saving_file_input',
    })
  }
}

// Restore DefaultHandler for fallback
class DefaultHandler extends InputCategoryHandler {
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    return { value: '', input_id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return Promise.resolve({
      status: 'error',
      error: 'Unknown input category',
    })
  }
}

export class NoValueHandler extends InputCategoryHandler {
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    return { value: '', input_id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return Promise.resolve({ status: 'error', error: 'element value is empty' })
  }
}

// Type for concrete handler constructors
interface InputCategoryHandlerConstructor {
  new (userAutofillPreferences: UserAutofillPreferences): InputCategoryHandler
}

const handlerClassMap: Partial<Record<SimpleInputsEnum, InputCategoryHandlerConstructor>> = {
  name: NameHandler,
  email: EmailHandler,
  pronouns: PronounsHandler,
  linkedin_profile: LinkedinProfileHandler,
  twitter_url: TwitterUrlHandler,
  github_url: GithubUrlHandler,
  salary_expectations: SalaryExpectationsHandler,
  resume_upload: ResumeUploadHandler,
  unknown: DefaultHandler,
}

export default function getHandlerForInputCategory(
  category: SimpleInputsEnum,
  userAutofillPreferences: UserAutofillPreferences,
): InputCategoryHandler {
  const HandlerClass = handlerClassMap[category]

  if (!HandlerClass) {
    return new DefaultHandler(userAutofillPreferences)
  }

  return new HandlerClass(userAutofillPreferences)
}
