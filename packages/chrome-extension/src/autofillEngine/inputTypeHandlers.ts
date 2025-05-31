import { saveUserAutofillValue } from '../firebase/realtimeDB'
import type {
  CategorizedInput,
  InputCategory,
  RealtimeDbSaveResult,
  UserAutofillPreferences,
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
    const label = input.label?.toLowerCase() || ''
    if (input.element.fieldType === 'text' && label.includes('first')) {
      return { action: 'fill', value: this.savedFirstName, id: input.element.elementReferenceId }
    }
    if (input.element.fieldType === 'text' && label.includes('last')) {
      return { action: 'fill', value: this.savedLastName, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    const label = input.label?.toLowerCase() || ''
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
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'email', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'gender', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'veteran', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'race_ethnicity', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'hispanic_latino', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'disability', input.element.value)
  }
}

class PhoneHandler extends InputCategoryHandler {
  phoneNum: number | undefined
  extension: string | undefined
  phoneType: 'mobile' | 'landline' | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.phoneNum = userAutofillPreferences.phone?.phoneNum
    this.extension = userAutofillPreferences.phone?.extension
    this.phoneType = userAutofillPreferences.phone?.type
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    const label = input.label?.toLowerCase() || ''
    const name = input.element.name?.toLowerCase() || ''
    const placeholder = input.element.placeholder?.toLowerCase() || ''

    // Detect extension field
    if (label.includes('ext') || name.includes('ext') || placeholder.includes('ext')) {
      if (this.extension) {
        return { action: 'fill', value: this.extension, id: input.element.elementReferenceId }
      }
      return { action: 'skip', id: input.element.elementReferenceId }
    }

    // Detect phone type field
    if (
      label.includes('type') ||
      name.includes('type') ||
      placeholder.includes('type') ||
      input.element.fieldType === 'select' ||
      input.element.fieldType === 'radio'
    ) {
      if (this.phoneType) {
        return { action: 'fill', value: this.phoneType, id: input.element.elementReferenceId }
      }
      return { action: 'skip', id: input.element.elementReferenceId }
    }

    // Default: phone number field
    return { action: 'fill', value: String(this.phoneNum), id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    const label = input.label?.toLowerCase() || ''
    const name = input.element.name?.toLowerCase() || ''
    const placeholder = input.element.placeholder?.toLowerCase() || ''

    // Detect extension field
    if (label.includes('ext') || name.includes('ext') || placeholder.includes('ext')) {
      return saveUserAutofillValue(userId, 'phone/extension', input.element.value)
    }

    // Detect phone type field
    if (
      label.includes('type') ||
      name.includes('type') ||
      placeholder.includes('type') ||
      input.element.fieldType === 'select' ||
      input.element.fieldType === 'radio'
    ) {
      // Only save if value is 'mobile' or 'landline'
      if (input.element.value === 'mobile' || input.element.value === 'landline') {
        return saveUserAutofillValue(userId, 'phone/type', input.element.value)
      }
    }

    // Default: phone number field
    // Remove all non-digit characters
    const digitsOnly = input.element.value.replace(/\D/g, '')
    return saveUserAutofillValue(userId, 'phone/phoneNum', digitsOnly)
  }
}

class LocationHandler extends InputCategoryHandler {
  location: UserAutofillPreferences['location']
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.location = userAutofillPreferences.location || {}
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    const label = input.label?.toLowerCase() || ''
    const name = input.element.name?.toLowerCase() || ''
    const placeholder = input.element.placeholder?.toLowerCase() || ''
    const autocomplete = input.element.autocomplete?.toLowerCase() || ''
    if (
      label.includes('country') ||
      name.includes('country') ||
      placeholder.includes('country') ||
      autocomplete.includes('country')
    ) {
      if (this.location?.country)
        return {
          action: 'fill',
          value: this.location.country,
          id: input.element.elementReferenceId,
        }
      return { action: 'skip', id: input.element.elementReferenceId }
    }
    if (
      label.includes('city') ||
      name.includes('city') ||
      placeholder.includes('city') ||
      autocomplete.includes('city')
    ) {
      if (this.location?.city)
        return { action: 'fill', value: this.location.city, id: input.element.elementReferenceId }
      return { action: 'skip', id: input.element.elementReferenceId }
    }
    if (
      label.includes('state') ||
      name.includes('state') ||
      placeholder.includes('state') ||
      autocomplete.includes('state') ||
      label.includes('province') ||
      name.includes('province') ||
      placeholder.includes('province') ||
      autocomplete.includes('province') ||
      label.includes('region') ||
      name.includes('region') ||
      placeholder.includes('region') ||
      autocomplete.includes('region')
    ) {
      if (this.location?.state)
        return { action: 'fill', value: this.location.state, id: input.element.elementReferenceId }
      return { action: 'skip', id: input.element.elementReferenceId }
    }
    if (
      label.includes('postal') ||
      name.includes('postal') ||
      placeholder.includes('postal') ||
      autocomplete.includes('postal') ||
      label.includes('zip') ||
      name.includes('zip') ||
      placeholder.includes('zip') ||
      autocomplete.includes('zip')
    ) {
      if (this.location?.postal_code)
        return {
          action: 'fill',
          value: this.location.postal_code,
          id: input.element.elementReferenceId,
        }
      return { action: 'skip', id: input.element.elementReferenceId }
    }
    // Only fall back to address for address-like fields
    if (
      label === 'address' ||
      name === 'address' ||
      placeholder === 'address' ||
      label.startsWith('address ') ||
      name.startsWith('address ') ||
      placeholder.startsWith('address ') ||
      label.endsWith(' address') ||
      name.endsWith(' address') ||
      placeholder.endsWith(' address') ||
      label.includes('mailing address') ||
      name.includes('mailing address') ||
      placeholder.includes('mailing address') ||
      label.includes('street address') ||
      name.includes('street address') ||
      placeholder.includes('street address') ||
      label.includes('home address') ||
      name.includes('home address') ||
      placeholder.includes('home address') ||
      label.includes('current address') ||
      name.includes('current address') ||
      placeholder.includes('current address')
    ) {
      if (this.location?.address)
        return {
          action: 'fill',
          value: this.location.address,
          id: input.element.elementReferenceId,
        }
      return { action: 'skip', id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    // Save to the correct subfield
    const label = input.label?.toLowerCase() || ''
    const name = input.element.name?.toLowerCase() || ''
    const placeholder = input.element.placeholder?.toLowerCase() || ''
    const autocomplete = input.element.autocomplete?.toLowerCase() || ''
    if (
      label.includes('country') ||
      name.includes('country') ||
      placeholder.includes('country') ||
      autocomplete.includes('country')
    ) {
      return saveUserAutofillValue(userId, 'location/country', input.element.value)
    }
    if (
      label.includes('city') ||
      name.includes('city') ||
      placeholder.includes('city') ||
      autocomplete.includes('city')
    ) {
      return saveUserAutofillValue(userId, 'location/city', input.element.value)
    }
    if (
      label.includes('state') ||
      name.includes('state') ||
      placeholder.includes('state') ||
      autocomplete.includes('state') ||
      label.includes('province') ||
      name.includes('province') ||
      placeholder.includes('province') ||
      autocomplete.includes('province') ||
      label.includes('region') ||
      name.includes('region') ||
      placeholder.includes('region') ||
      autocomplete.includes('region')
    ) {
      return saveUserAutofillValue(userId, 'location/state', input.element.value)
    }
    if (
      label.includes('postal') ||
      name.includes('postal') ||
      placeholder.includes('postal') ||
      autocomplete.includes('postal') ||
      label.includes('zip') ||
      name.includes('zip') ||
      placeholder.includes('zip') ||
      autocomplete.includes('zip')
    ) {
      return saveUserAutofillValue(userId, 'location/postal_code', input.element.value)
    }
    if (
      label.includes('address') ||
      name.includes('address') ||
      placeholder.includes('address') ||
      autocomplete.includes('address') ||
      label.includes('street') ||
      name.includes('street') ||
      placeholder.includes('street') ||
      autocomplete.includes('street')
    ) {
      return saveUserAutofillValue(userId, 'location/address', input.element.value)
    }
    // fallback: save to address
    return saveUserAutofillValue(userId, 'location/address', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'authorization', input.element.value)
  }
}

class SponsorshipHandler extends InputCategoryHandler {
  sponsorshipYesNo: boolean | undefined
  sponsorshipText: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.sponsorshipYesNo = userAutofillPreferences.sponsorship?.yesNoAnswer
    this.sponsorshipText = userAutofillPreferences.sponsorship?.text
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (
      input.element.fieldType === 'select' ||
      input.element.fieldType === 'radio' ||
      input.element.fieldType === 'checkbox'
    ) {
      if (typeof this.sponsorshipYesNo !== 'boolean')
        return { action: 'skip', id: input.element.elementReferenceId }
      return {
        action:
          input.element.fieldType === 'checkbox'
            ? this.sponsorshipYesNo
              ? 'fill'
              : 'clear'
            : 'fill',
        value: input.element.fieldType !== 'checkbox' ? String(this.sponsorshipYesNo) : undefined,
        id: input.element.elementReferenceId,
      }
    }
    if (input.element.fieldType === 'text') {
      if (!this.sponsorshipText) return { action: 'skip', id: input.element.elementReferenceId }
      return { action: 'fill', value: this.sponsorshipText, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    if (
      input.element.fieldType === 'select' ||
      input.element.fieldType === 'radio' ||
      input.element.fieldType === 'checkbox'
    ) {
      // Save to yesNoAnswer field (convert value to boolean)
      const boolValue = input.element.value === 'yes' || input.element.value === 'true'
      return saveUserAutofillValue(userId, 'sponsorship/yesNoAnswer', boolValue)
    } else if (input.element.fieldType === 'text') {
      // Save to text field
      return saveUserAutofillValue(userId, 'sponsorship/text', input.element.value)
    }
    return Promise.resolve({
      status: 'error',
      error: 'Failed to save sponsorship autofill value',
    })
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    console.log('saving school', input.element)
    return saveUserAutofillValue(userId, 'school', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'degree', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'discipline', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'end_date_year', input.element.value)
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
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'linkedin_profile', input.element.value)
  }
}

class WebsiteHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.website
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'website', input.element.value)
  }
}

class OtherWebsiteHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.other_website
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'other_website', input.element.value)
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
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
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
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'github_url', input.element.value)
  }
}

class CurrentCompanyHandler extends InputCategoryHandler {
  value: string | undefined
  constructor(userAutofillPreferences: UserAutofillPreferences) {
    super(userAutofillPreferences)
    this.value = userAutofillPreferences.current_company
  }
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    if (this.value) {
      return { action: 'fill', value: this.value, id: input.element.elementReferenceId }
    }
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return saveUserAutofillValue(userId, 'current_company', input.element.value)
  }
}

// Restore DefaultHandler for fallback
class DefaultHandler extends InputCategoryHandler {
  getAutofillInstruction(input: CategorizedInput): AutofillInstruction {
    return { action: 'skip', id: input.element.elementReferenceId }
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
    return { action: 'skip', id: input.element.elementReferenceId }
  }
  saveAutofillValue(input: CategorizedInput, userId: string): Promise<RealtimeDbSaveResult> {
    return Promise.resolve({ status: 'error', error: 'element value is empty' })
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
  authorization: AuthorizationHandler,
  sponsorship: SponsorshipHandler,
  location: LocationHandler,
  school: SchoolHandler,
  degree: DegreeHandler,
  discipline: DisciplineHandler,
  end_date_year: EndDateYearHandler,
  linkedin_profile: LinkedinProfileHandler,
  website: WebsiteHandler,
  other_website: OtherWebsiteHandler,
  twitter_url: TwitterUrlHandler,
  github_url: GithubUrlHandler,
  current_company: CurrentCompanyHandler,
  unknown: DefaultHandler,
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
