import { INPUT_ELEMENT_TYPES, type SerializedHtmlInput } from './schema'

type Pattern = string | RegExp

// Helper function for case-insensitive string matching
const matchesPattern = (str: string | undefined, patterns: Pattern[]): boolean => {
  if (!str) return false
  const lowerStr = str.toLowerCase()
  return patterns.some((pattern) =>
    typeof pattern === 'string' ? lowerStr.includes(pattern.toLowerCase()) : pattern.test(lowerStr),
  )
}

const isNameInput = (input: SerializedHtmlInput): boolean => {
  // Allow TEXT, and potentially other field types if they behave like text inputs for names.
  // For now, keeping TEXT as the primary, but autocomplete can override.
  if (input.fieldType !== INPUT_ELEMENT_TYPES.TEXT && !input.autocomplete) return false

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

const isEmailInput = (input: SerializedHtmlInput): boolean => {
  if (input.fieldType !== INPUT_ELEMENT_TYPES.EMAIL && input.fieldType !== INPUT_ELEMENT_TYPES.TEXT)
    return false

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

const isGenderInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.RADIO &&
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT
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

const isVeteranStatusInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.RADIO &&
    input.fieldType !== INPUT_ELEMENT_TYPES.CHECKBOX &&
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT
  )
    return false

  const patterns: Pattern[] = [
    'veteran',
    'veteran status',
    'military',
    'armed forces',
    'service status',
    'military status',
    'veteran preference',
    'us military',
    'prior military',
    'former military',
    'veteran classification',
    'veteran question',
    'veteran self-identification',
  ]
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, ['veteran', 'military_status'])
  )
}

const isRaceEthnicityInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.RADIO &&
    input.fieldType !== INPUT_ELEMENT_TYPES.CHECKBOX &&
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT
  )
    return false

  const patterns: Pattern[] = [
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
    'are you hispanic/latino',
    'hispanic or latino',
    'ethnicity/hispanic',
    'ethnicity/latino',
    'ethnicity (hispanic or latino)',
    'ethnicity (hispanic)',
    'ethnicity (latino)',
  ]
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, ['race', 'ethnicity', 'hispanic', 'latino'])
  )
}

const isDisabilityInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.RADIO &&
    input.fieldType !== INPUT_ELEMENT_TYPES.CHECKBOX &&
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT
  )
    return false

  const patterns: Pattern[] = [
    'disability',
    'disabilities',
    'disabled',
    'ada',
    'disability status',
    'disclose disability',
    'disability disclosure',
    'accommodation',
    'assistance needed',
    'voluntary self-identification of disability',
    'disability question',
    'disability self-identification',
    'disability self id',
  ]
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, ['disability', 'handicap_status'])
  )
}

const isPhoneInput = (input: SerializedHtmlInput): boolean => {
  if (input.fieldType !== INPUT_ELEMENT_TYPES.TEL && input.fieldType !== INPUT_ELEMENT_TYPES.TEXT)
    return false

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

const isCountryInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT
  )
    return false

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

const isAuthorizationInput = (input: SerializedHtmlInput): boolean => {
  const patterns: Pattern[] = [
    'authorized to work',
    'legally authorized',
    'work in the us',
    'work authorization',
    'are you legally authorized to work in the us',
    'authorization',
    'work_authorization',
    'legal_authorization',
  ]
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns)
  )
}

const isSponsorshipInput = (input: SerializedHtmlInput): boolean => {
  const patterns: Pattern[] = [
    'require sponsorship',
    'future require sponsorship',
    'do you now or in the future require sponsorship',
    'sponsorship',
    'require_sponsorship',
  ]
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns)
  )
}

const isMailingAddressInput = (input: SerializedHtmlInput): boolean => {
  const patterns: Pattern[] = [
    'mailing address',
    'current mailing address',
    'address',
    'mailing_address',
    'current_address',
  ]
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns)
  )
}

const isSchoolInput = (input: SerializedHtmlInput): boolean => {
  const patterns: Pattern[] = ['school', 'university', 'college', 'institution']
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns)
  )
}

const isDegreeInput = (input: SerializedHtmlInput): boolean => {
  const patterns: Pattern[] = ['degree', 'qualification', 'credential']
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns)
  )
}

const isDisciplineInput = (input: SerializedHtmlInput): boolean => {
  const patterns: Pattern[] = ['discipline', 'major', 'field of study', 'concentration', 'field']
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns)
  )
}

const isEndDateYearInput = (input: SerializedHtmlInput): boolean => {
  const patterns: Pattern[] = [
    'end date year',
    'graduation year',
    'year completed',
    'end year',
    'end_year',
    'graduation_year',
    'year_completed',
  ]
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns)
  )
}

const isLinkedInProfileInput = (input: SerializedHtmlInput): boolean => {
  const patterns: Pattern[] = [
    'linkedin',
    'linkedin profile',
    'linkedin url',
    'linkedin_profile',
    'linkedin_url',
  ]
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns)
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
  isAuthorizationInput,
  isSponsorshipInput,
  isMailingAddressInput,
  isSchoolInput,
  isDegreeInput,
  isDisciplineInput,
  isEndDateYearInput,
  isLinkedInProfileInput,
}
