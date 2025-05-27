import { INPUT_TYPES, type ProcessedInput } from './categorizeInputs'

type Pattern = string | RegExp

// Helper function for case-insensitive string matching
const matchesPattern = (str: string | undefined, patterns: Pattern[]): boolean => {
  if (!str) return false
  const lowerStr = str.toLowerCase()
  return patterns.some((pattern) =>
    typeof pattern === 'string' ? lowerStr.includes(pattern.toLowerCase()) : pattern.test(lowerStr),
  )
}

const isNameInput = (input: ProcessedInput): boolean => {
  if (input.fieldType !== INPUT_TYPES.TEXT) return false

  const namePatterns: Pattern[] = [
    'name',
    /^fname|[\s-]?first[\s-]?name$/i,
    /^lname|[\s-]?last[\s-]?name$/i,
    /^full[\s-]?name$|^legal[\s-]?name$/i,
    'given name',
    'family name',
    'surname',
    /^name[\s-]?prefix$|^prefix[\s-]?name$/i,
    /^name[\s-]?suffix$|^suffix[\s-]?name$/i,
  ]

  return (
    matchesPattern(input.label, namePatterns) ||
    matchesPattern(input.name, namePatterns) ||
    matchesPattern(input.placeholder, namePatterns)
  )
}

const isEmailInput = (input: ProcessedInput): boolean => {
  if (input.fieldType !== INPUT_TYPES.EMAIL && input.fieldType !== INPUT_TYPES.TEXT) return false

  const emailPatterns: Pattern[] = [
    'email',
    'e-mail',
    'mail',
    'username',
    'login',
    /^e[\s-]?mail$/i,
  ]

  return (
    input.type === 'email' ||
    matchesPattern(input.label, emailPatterns) ||
    matchesPattern(input.name, emailPatterns) ||
    matchesPattern(input.placeholder, emailPatterns) ||
    matchesPattern(input.autocomplete, ['email'])
  )
}

const isGenderInput = (input: ProcessedInput): boolean => {
  if (
    input.fieldType !== INPUT_TYPES.SELECT &&
    input.fieldType !== INPUT_TYPES.RADIO &&
    input.fieldType !== INPUT_TYPES.TEXT
  )
    return false

  const genderPatterns: Pattern[] = [
    'gender',
    'sex',
    'title',
    'salutation',
    'prefix',
    'honorific',
    /^title[\s-]?prefix$|^prefix[\s-]?title$/i,
  ]

  return (
    matchesPattern(input.label, genderPatterns) ||
    matchesPattern(input.name, genderPatterns) ||
    matchesPattern(input.placeholder, genderPatterns)
  )
}

const isVeteranStatusInput = (input: ProcessedInput): boolean => {
  if (
    input.fieldType !== INPUT_TYPES.SELECT &&
    input.fieldType !== INPUT_TYPES.RADIO &&
    input.fieldType !== INPUT_TYPES.CHECKBOX
  )
    return false

  const veteranPatterns: Pattern[] = [
    'veteran',
    'military',
    'armed forces',
    'service status',
    'veteran status',
    'military status',
    'veteran preference',
  ]

  return (
    matchesPattern(input.label, veteranPatterns) ||
    matchesPattern(input.name, veteranPatterns) ||
    matchesPattern(input.placeholder, veteranPatterns)
  )
}

const isRaceEthnicityInput = (input: ProcessedInput): boolean => {
  if (
    input.fieldType !== INPUT_TYPES.SELECT &&
    input.fieldType !== INPUT_TYPES.RADIO &&
    input.fieldType !== INPUT_TYPES.CHECKBOX
  )
    return false

  const racePatterns: Pattern[] = [
    'race',
    'ethnicity',
    'hispanic',
    'latino',
    'ethnic',
    'origin',
    'demographic',
    'minority',
    'race/ethnicity',
    'race-ethnicity',
    'race & ethnicity',
    'ethnic background',
    'racial background',
  ]

  return (
    matchesPattern(input.label, racePatterns) ||
    matchesPattern(input.name, racePatterns) ||
    matchesPattern(input.placeholder, racePatterns)
  )
}

const isDisabilityInput = (input: ProcessedInput): boolean => {
  if (
    input.fieldType !== INPUT_TYPES.SELECT &&
    input.fieldType !== INPUT_TYPES.RADIO &&
    input.fieldType !== INPUT_TYPES.CHECKBOX
  )
    return false

  const disabilityPatterns: Pattern[] = [
    'disability',
    'disabilities',
    'disabled',
    'handicap',
    'ada',
    'americans with disabilities',
    'disability status',
    'disclose disability',
    'disability disclosure',
    'accommodation',
    'assistance needed',
  ]

  return (
    matchesPattern(input.label, disabilityPatterns) ||
    matchesPattern(input.name, disabilityPatterns) ||
    matchesPattern(input.placeholder, disabilityPatterns)
  )
}

const isPhoneInput = (input: ProcessedInput): boolean => {
  if (input.fieldType !== INPUT_TYPES.TEL && input.fieldType !== INPUT_TYPES.TEXT) return false

  const phonePatterns: Pattern[] = [
    'phone',
    'telephone',
    'mobile',
    'cell',
    'contact number',
    'phone number',
    'tel',
    'mobile number',
    'cell phone',
    'phone-type',
    'phone type',
    'phone format',
    'phone category',
  ]

  return (
    input.type === 'tel' ||
    (input.type ? matchesPattern(input.type, ['tel', 'phone']) : false) ||
    matchesPattern(input.label, phonePatterns) ||
    matchesPattern(input.name, phonePatterns) ||
    matchesPattern(input.placeholder, phonePatterns) ||
    matchesPattern(input.autocomplete, ['tel', 'tel-'])
  )
}

const isCountryInput = (input: ProcessedInput): boolean => {
  if (input.fieldType !== INPUT_TYPES.SELECT && input.fieldType !== INPUT_TYPES.TEXT) return false

  const countryPatterns: Pattern[] = [
    'country',
    'nation',
    'residence',
    'country of residence',
    'nationality',
    'country code',
    'country of origin',
  ]

  return (
    matchesPattern(input.label, countryPatterns) ||
    matchesPattern(input.name, countryPatterns) ||
    matchesPattern(input.placeholder, countryPatterns) ||
    matchesPattern(input.autocomplete, ['country', 'country-name'])
  )
}

export {
  isNameInput,
  isEmailInput,
  isGenderInput,
  isVeteranStatusInput,
  isRaceEthnicityInput,
  isDisabilityInput,
  isPhoneInput,
  isCountryInput,
}
