import { INPUT_ELEMENT_TYPES, type SerializedHtmlInput } from './schema'

type Pattern = string | RegExp

// Base pattern matching function
const matchesPattern = (str: string | undefined, patterns: Pattern[]): boolean => {
  if (!str) return false
  const lowerStr = str.toLowerCase()
  return patterns.some((pattern) =>
    typeof pattern === 'string' ? lowerStr.includes(pattern.toLowerCase()) : pattern.test(lowerStr),
  )
}

// Helper to check if input matches any of the given patterns
const matchesInputPatterns = (
  input: SerializedHtmlInput,
  patterns: Pattern[],
  autocompletePatterns: Pattern[] = [],
): boolean => {
  return !!(
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
  )
}

// Helper to check if input type matches any of the given types
const hasValidInputType = (
  input: SerializedHtmlInput,
  types: (typeof INPUT_ELEMENT_TYPES)[keyof typeof INPUT_ELEMENT_TYPES][],
): boolean => {
  return types.includes(input.fieldType)
}

// Name-related patterns
const namePatterns = [
  /^fname|fir?st?[\s_-]?name$/i, // First name variations (fname, firstname, first-name, first_name)
  /^lname|la?st?[\s_-]?name$/i, // Last name variations (lname, lastname, last-name, last_name)
  /^full[\s_-]?name$|^legal[\s_-]?name$/i, // Full/legal name variations
  /^middle[\s_-]?(name|initial)$|^mi$/i, // Middle name/initial variations
  /^name$|^given[\s_-]?name$|^family[\s_-]?name$|^surname$/i, // General name variations
  /enter.+name|name.+enter/i, // Placeholder variations like "Enter your name"
]

const nameAutocompletePatterns = [
  /^name$/i,
  'honorific-prefix',
  'given-name',
  'additional-name',
  'family-name',
  'honorific-suffix',
  'nickname',
]

// Company-related patterns
const companyPatterns = [
  /^(employer|company|organization|org|workplace)$/i, // Basic company terms
  /^(employer|company|organization|org|workplace)[\s_-]?name$/i, // Company name variations
  /^work[\s_-]?(employer|company|org|organization)$/i, // Work-related company terms
]

const isNameInput = (input: SerializedHtmlInput): boolean => {
  // Exclude company/employer/org fields
  if (matchesInputPatterns(input, companyPatterns)) {
    return false
  }

  // Allow TEXT, and potentially other field types if they behave like text inputs for names
  if (input.fieldType !== INPUT_ELEMENT_TYPES.TEXT && !input.autocomplete) return false

  return matchesInputPatterns(input, namePatterns, nameAutocompletePatterns)
}

// Email patterns
const emailPatterns = ['email', 'e-mail', 'mail', 'username', 'login', /^e[\s-]?mail$/i]

const isEmailInput = (input: SerializedHtmlInput): boolean => {
  if (!hasValidInputType(input, [INPUT_ELEMENT_TYPES.EMAIL, INPUT_ELEMENT_TYPES.TEXT])) return false

  return input.type === 'email' || matchesInputPatterns(input, emailPatterns, ['email'])
}

// LinkedIn patterns
const linkedinPatterns = [
  /^linkedin[\s_-]?(profile|url)?$/i, // LinkedIn variations
  /enter.+linkedin|linkedin.+enter/i, // Placeholder variations like "Enter your LinkedIn URL"
]

const isLinkedInProfileInput = (input: SerializedHtmlInput): boolean => {
  return matchesInputPatterns(input, linkedinPatterns)
}

// Twitter patterns
const twitterPatterns = [
  /^twitter[\s_-]?(url|handle|profile|link|username|user|account|id)?$/i, // Twitter variations
  /enter.+twitter|twitter.+enter/i, // Placeholder variations like "Enter your Twitter URL"
]

const isTwitterUrlInput = (input: SerializedHtmlInput): boolean => {
  if (!hasValidInputType(input, [INPUT_ELEMENT_TYPES.URL, INPUT_ELEMENT_TYPES.TEXT])) return false

  const autocompletePatterns: Pattern[] = ['twitter', 'twitter-url']

  return !!(
    matchesInputPatterns(input, twitterPatterns, autocompletePatterns) ||
    (input.type === 'url' &&
      ((input.name && input.name.toLowerCase().includes('twitter')) ||
        (input.label && input.label.toLowerCase().includes('twitter'))))
  )
}

// GitHub patterns
const githubPatterns = [
  /^github[\s_-]?(url|handle|profile|link|username|user|account|id)?$/i, // GitHub variations
  /enter.+github|github.+enter/i, // Placeholder variations like "Enter your GitHub URL"
]

const isGithubUrlInput = (input: SerializedHtmlInput): boolean => {
  if (!hasValidInputType(input, [INPUT_ELEMENT_TYPES.URL, INPUT_ELEMENT_TYPES.TEXT])) return false

  const autocompletePatterns: Pattern[] = ['github', 'github-url']

  return !!(
    matchesInputPatterns(input, githubPatterns, autocompletePatterns) ||
    (input.type === 'url' &&
      ((input.name && input.name.toLowerCase().includes('github')) ||
        (input.label && input.label.toLowerCase().includes('github'))))
  )
}

// Pronouns patterns
const pronounsPatterns = [
  /^pronouns?$/i, // Basic pronouns terms
  /^preferred[\s_-]?(pronouns?|gender[\s_-]?pronouns?)$/i, // Preferred pronouns variations
  /^personal[\s_-]?pronouns?$/i, // Personal pronouns variations
  /^pronouns?[\s_-]?(optional|preference|preferences)$/i, // Optional pronouns variations
  /enter.+pronouns?|pronouns?.+enter/i, // Placeholder variations like "Enter your pronouns"
]

const pronounsAutocompletePatterns = [
  'pronouns',
  'preferred-pronouns',
  'gender-pronouns',
  'personal-pronouns',
]

const isPronounsInput = (input: SerializedHtmlInput): boolean => {
  if (
    !hasValidInputType(input, [
      INPUT_ELEMENT_TYPES.TEXT,
      INPUT_ELEMENT_TYPES.SELECT,
      INPUT_ELEMENT_TYPES.RADIO,
    ])
  )
    return false

  return matchesInputPatterns(input, pronounsPatterns, pronounsAutocompletePatterns)
}

// Other website patterns (secondary, alternate, etc.)
const otherWebsitePatterns = [
  /^(other|secondary|alternate|additional)[\s-]?(website|site|url|portfolio)$/i, // Other website variations
]

const isOtherWebsiteInput = (input: SerializedHtmlInput): boolean => {
  return matchesInputPatterns(input, otherWebsitePatterns)
}

// Website patterns
const websitePatterns = [
  /^(website|web[\s-]?site|site|url|webpage|web[\s-]?page)$/i, // Basic website terms
  /^(personal|portfolio)[\s-]?(website|site|url)$/i, // Personal website terms
  /^(company|business)[\s-]?(website|site|url)$/i, // Business website terms
]

const websiteAutocompletePatterns = ['url', 'website', 'homepage']

const isWebsiteInput = (input: SerializedHtmlInput): boolean => {
  if (isOtherWebsiteInput(input)) return false
  if (!hasValidInputType(input, [INPUT_ELEMENT_TYPES.URL, INPUT_ELEMENT_TYPES.TEXT])) return false

  return (
    input.type === 'url' ||
    matchesInputPatterns(input, websitePatterns, websiteAutocompletePatterns)
  )
}

// Salary patterns
const salaryPatterns = [
  /^(salary|compensation|pay|wage)[\s-]?(expectations?|requirement|requirements?)$/i, // Salary expectations variations
  /^(salary|compensation)[\s-]?range$/i, // Salary range variations
  /^(hourly[\s-]?rate|annual[\s-]?salary|starting[\s-]?salary|target[\s-]?salary)$/i, // Rate variations
]

const salaryAutocompletePatterns = ['salary', 'compensation', 'wage', 'pay']

const isSalaryExpectationsInput = (input: SerializedHtmlInput): boolean => {
  if (
    !hasValidInputType(input, [
      INPUT_ELEMENT_TYPES.TEXT,
      INPUT_ELEMENT_TYPES.NUMBER,
      INPUT_ELEMENT_TYPES.SELECT,
    ])
  )
    return false

  return matchesInputPatterns(input, salaryPatterns, salaryAutocompletePatterns)
}

const isResumeUploadInput = (input: SerializedHtmlInput): boolean => {
  // If it's explicitly a file input, consider it a resume upload input
  if (input.type === 'file') {
    return true
  }

  // Only consider BUTTON-type inputs (or TEXT/TEXTAREA if used for a URL/pasting)
  if (
    input.type !== 'button' &&
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT &&
    input.type !== 'textarea'
  ) {
    return false
  }

  // Common patterns when a form asks for a resume/CV
  const resumePatterns: Pattern[] = [
    'resume',
    'RESUME',
    'curriculum vitae',
    'cv',
    'upload resume',
    'attach resume',
    'upload your resume',
    'attach your resume',
    'resume_file',
    'resume_upload',
    'Resume/CV',
    'cv_upload',
    /\bresume\b/i,
    /\bcurriculum[\s-]?vitae\b/i,
    /\battach[\s-]?resume\b/i,
    // Add patterns for button text
    'Attach',
    'Upload',
    'Browse',
    'Select File',
    // Add patterns for textarea labels
    'Type or paste your Resume here',
    'Paste your resume here',
    'Enter your resume',
    'Resume/CV',
    'Resume/CV *',
  ]

  const labelMatch = matchesPattern(input.label ?? undefined, resumePatterns)
  const nameMatch = matchesPattern(input.name, resumePatterns)
  const placeholderMatch = matchesPattern(input.placeholder, resumePatterns)
  const wholeQuestionLabelMatch = matchesPattern(
    input.wholeQuestionLabel ?? undefined,
    resumePatterns,
  )

  const matches = labelMatch || nameMatch || placeholderMatch || wholeQuestionLabelMatch

  return matches
}

export {
  isNameInput,
  isEmailInput,
  isLinkedInProfileInput,
  isTwitterUrlInput,
  isGithubUrlInput,
  isPronounsInput,
  isOtherWebsiteInput,
  isWebsiteInput,
  isSalaryExpectationsInput,
  isResumeUploadInput,
}
