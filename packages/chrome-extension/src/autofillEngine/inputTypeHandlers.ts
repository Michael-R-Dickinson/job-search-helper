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

class EmailHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.email
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    if (input.element.fieldType === 'email') {
      saveUserAutofillValue(userId, 'email', input.element.value)
    }
  }
}

class GenderHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.gender
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (!this.value) return { action: 'skip', id: input.element.elementReferenceId }
    if (input.element.fieldType === 'select' || input.element.fieldType === 'radio') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'checkbox') {
      // For checkboxes, value should be 'yes' or similar
      return {
        action: this.value === 'yes' ? 'fill' : 'clear',
        id: input.element.elementReferenceId,
      }
    }
    if (input.element.fieldType === 'text') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'gender', input.element.value)
  }
}

class VeteranHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.veteran
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (!this.value) return { action: 'skip', id: input.element.elementReferenceId }
    if (input.element.fieldType === 'select' || input.element.fieldType === 'radio') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'checkbox') {
      return {
        action: this.value === 'yes' ? 'fill' : 'clear',
        id: input.element.elementReferenceId,
      }
    }
    if (input.element.fieldType === 'text') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'veteran', input.element.value)
  }
}

class RaceEthnicityHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.race_ethnicity
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (!this.value) return { action: 'skip', id: input.element.elementReferenceId }
    if (input.element.fieldType === 'select' || input.element.fieldType === 'radio') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'checkbox') {
      return {
        action: this.value === 'yes' ? 'fill' : 'clear',
        id: input.element.elementReferenceId,
      }
    }
    if (input.element.fieldType === 'text') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'race_ethnicity', input.element.value)
  }
}

class HispanicLatinoHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.hispanic_latino
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (!this.value) return { action: 'skip', id: input.element.elementReferenceId }
    if (input.element.fieldType === 'select' || input.element.fieldType === 'radio') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'checkbox') {
      return {
        action: this.value === 'yes' ? 'fill' : 'clear',
        id: input.element.elementReferenceId,
      }
    }
    if (input.element.fieldType === 'text') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'hispanic_latino', input.element.value)
  }
}

class DisabilityHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.disability
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (!this.value) return { action: 'skip', id: input.element.elementReferenceId }
    if (input.element.fieldType === 'select' || input.element.fieldType === 'radio') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'checkbox') {
      return {
        action: this.value === 'yes' ? 'fill' : 'clear',
        id: input.element.elementReferenceId,
      }
    }
    if (input.element.fieldType === 'text') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'disability', input.element.value)
  }
}

class PhoneHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.phone
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'phone', input.element.value)
  }
}

class CountryHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.country
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'country', input.element.value)
  }
}

class AuthorizationHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.authorization
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (!this.value) return { action: 'skip', id: input.element.elementReferenceId }
    if (input.element.fieldType === 'select' || input.element.fieldType === 'radio') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'checkbox') {
      return {
        action: this.value === 'yes' ? 'fill' : 'clear',
        id: input.element.elementReferenceId,
      }
    }
    if (input.element.fieldType === 'text') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'authorization', input.element.value)
  }
}

class SponsorshipHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.sponsorship
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (!this.value) return { action: 'skip', id: input.element.elementReferenceId }
    if (input.element.fieldType === 'select' || input.element.fieldType === 'radio') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'checkbox') {
      return {
        action: this.value === 'yes' ? 'fill' : 'clear',
        id: input.element.elementReferenceId,
      }
    }
    if (input.element.fieldType === 'text') {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'sponsorship', input.element.value)
  }
}

class MailingAddressHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.mailing_address
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'mailing_address', input.element.value)
  }
}

class SchoolHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.school
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'school', input.element.value)
  }
}

class DegreeHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.degree
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'degree', input.element.value)
  }
}

class DisciplineHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.discipline
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'discipline', input.element.value)
  }
}

class EndDateYearHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.end_date_year
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'end_date_year', input.element.value)
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
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    saveUserAutofillValue(userId, 'linkedin_profile', input.element.value)
  }
}

// Add this handler for unknown
class UnknownHandler extends InputCategoryHandler {
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): void {
    return
  }
}

// Restore DefaultHandler for fallback
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
  email: EmailHandler,
  gender: GenderHandler,
  veteran: VeteranHandler,
  race_ethnicity: RaceEthnicityHandler,
  hispanic_latino: HispanicLatinoHandler,
  disability: DisabilityHandler,
  phone: PhoneHandler,
  country: CountryHandler,
  authorization: AuthorizationHandler,
  sponsorship: SponsorshipHandler,
  mailing_address: MailingAddressHandler,
  school: SchoolHandler,
  degree: DegreeHandler,
  discipline: DisciplineHandler,
  end_date_year: EndDateYearHandler,
  linkedin_profile: LinkedinProfileHandler,
  unknown: UnknownHandler,
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
