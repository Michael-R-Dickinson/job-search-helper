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
  // Allow TEXT, and potentially other field types if they behave like text inputs for names.
  // For now, keeping TEXT as the primary, but autocomplete can override.
  if (input.fieldType !== INPUT_TYPES.TEXT && !input.autocomplete) return false

  const namePatterns: Pattern[] = [
    'name', // General name
    /^fname|fir?st?[\s-]?name$/i, // first name, fname, firsname, firstname
    /^lname|la?st?[\s-]?name$/i, // last name, lname, lasname, lastname
    /^full[\s-]?name$|^legal[\s-]?name$/i, // full name, legal name
    'given name', // given name
    'family name', // family name
    'surname', // surname
    'middle name',
    'middle initial', // middle name/initial
    /^mi$/i, // common abbreviation for middle initial
    // Patterns for autocomplete values
    'honorific-prefix',
    'honorific-suffix',
    'nickname',
  ]

  const autocompletePatterns: Pattern[] = [
    /^name$/i, // Exact match for 'name'
    'honorific-prefix',
    'given-name',
    'additional-name',
    'family-name',
    'honorific-suffix',
    'nickname',
  ]

  return (
    matchesPattern(input.label ?? undefined, namePatterns) ||
    matchesPattern(input.name, namePatterns) ||
    matchesPattern(input.placeholder, namePatterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
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
    matchesPattern(input.label ?? undefined, emailPatterns) ||
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

  const genderPatterns: Pattern[] = ['gender', 'sex', 'gender identity']

  const autocompletePatterns: Pattern[] = ['sex', 'gender']

  return (
    matchesPattern(input.label ?? undefined, genderPatterns) ||
    matchesPattern(input.name, genderPatterns) ||
    matchesPattern(input.placeholder, genderPatterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
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
    matchesPattern(input.label ?? undefined, veteranPatterns) ||
    matchesPattern(input.name, veteranPatterns) ||
    matchesPattern(input.placeholder, veteranPatterns) ||
    matchesPattern(input.autocomplete, ['veteran', 'military_status'])
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
    matchesPattern(input.label ?? undefined, racePatterns) ||
    matchesPattern(input.name, racePatterns) ||
    matchesPattern(input.placeholder, racePatterns) ||
    matchesPattern(input.autocomplete, ['race', 'ethnicity'])
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
    matchesPattern(input.label ?? undefined, disabilityPatterns) ||
    matchesPattern(input.name, disabilityPatterns) ||
    matchesPattern(input.placeholder, disabilityPatterns) ||
    matchesPattern(input.autocomplete, ['disability', 'handicap_status'])
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
    matchesPattern(input.label ?? undefined, phonePatterns) ||
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
    'location (country)', // More specific label
    'country of residence',
    'nationality',
  ]

  const autocompletePatterns: Pattern[] = ['country', 'country-name']

  return (
    matchesPattern(input.label ?? undefined, countryPatterns) ||
    matchesPattern(input.name, countryPatterns) ||
    matchesPattern(input.placeholder, countryPatterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
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
