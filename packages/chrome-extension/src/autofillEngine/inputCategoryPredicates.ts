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
  // Exclude company/employer/org fields
  const companyPatterns = [
    'employer',
    'company',
    'organization',
    'org',
    'workplace',
    'employer_name',
    'company_name',
    'org_name',
    'organization_name',
    'work_company',
    'work_employer',
    'work_org',
    'work_organization',
  ]
  if (
    matchesPattern(input.label ?? undefined, companyPatterns) ||
    matchesPattern(input.name, companyPatterns) ||
    matchesPattern(input.placeholder, companyPatterns)
  ) {
    return false
  }
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

const isLocationInput = (input: SerializedHtmlInput): boolean => {
  // Patterns for all location subfields, including current location/city
  const patterns: Pattern[] = [
    'country',
    'nation',
    'location (country)',
    'country of residence',
    'nationality',
    'mailing address',
    'current mailing address',
    'mailing_address',
    'current_address',
    'city',
    'state',
    'province',
    'region',
    'postal code',
    'zipcode',
    'zip code',
    'zip',
    'postal',
    'city/town',
    'city or town',
    'town',
    'address line',
    'street',
    'street address',
    'home address',
    'residence',
    'residing city',
    'residing location',
    'home city',
    'home location',
    'city of residence',
    'location (current)',
    'current_residence',
    'current_city',
    'current_location',
    // Patterns from isCurrentLocationInput
    'current location',
    'current city',
    'current town',
    'present location',
    'present city',
    'present town',
    'where do you live',
    'where are you based',
    'where are you located',
  ]
  const autocompletePatterns: Pattern[] = [
    'country',
    'country-name',
    'address-level1',
    'address-level2',
    'address-level3',
    'address-line1',
    'address-line2',
    'address-line3',
    'postal-code',
    'city',
    'state',
    'province',
    'region',
    'zip',
    'zipcode',
    'postal',
    'address',
    'location',
    'residence',
    // Patterns from isCurrentLocationInput
    'address-level2',
    'city',
    'location',
    'residence',
  ]
  // Special handling for 'address' to avoid matching 'Email Address' or similar
  const isAddressField = (str: string | undefined) => {
    if (!str) return false
    const s = str.trim().toLowerCase()
    // Only match if it's exactly 'address', starts with 'address ' (not as a suffix), or is a known location phrase
    return (
      s === 'address' ||
      s.startsWith('address ') ||
      s === 'mailing address' ||
      s === 'street address' ||
      s === 'home address' ||
      s === 'current address'
    )
  }
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns) ||
    isAddressField(input.label ?? undefined) ||
    isAddressField(input.name) ||
    isAddressField(input.placeholder)
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

const isOtherWebsiteInput = (input: SerializedHtmlInput): boolean => {
  // Only match if the field is clearly labeled as 'other website', 'secondary website', etc.
  const otherWebsitePatterns: Pattern[] = [
    'other website',
    'secondary website',
    'alternate website',
    'additional website',
    'other web site',
    'other url',
    'secondary url',
    'alternate url',
    'additional url',
    'other portfolio',
    'secondary portfolio',
    'alternate portfolio',
    'additional portfolio',
    // Regexes for underscore/dash variants
    /other[_-]?website/i,
    /secondary[_-]?website/i,
    /alternate[_-]?website/i,
    /additional[_-]?website/i,
    /other[_-]?url/i,
    /secondary[_-]?url/i,
    /alternate[_-]?url/i,
    /additional[_-]?url/i,
    /other[_-]?portfolio/i,
    /secondary[_-]?portfolio/i,
    /alternate[_-]?portfolio/i,
    /additional[_-]?portfolio/i,
  ]
  return (
    matchesPattern(input.label ?? undefined, otherWebsitePatterns) ||
    matchesPattern(input.name, otherWebsitePatterns) ||
    matchesPattern(input.placeholder, otherWebsitePatterns)
  )
}

const isWebsiteInput = (input: SerializedHtmlInput): boolean => {
  if (isOtherWebsiteInput(input)) return false
  // Accept URL type or text fields with website patterns
  if (input.fieldType !== INPUT_ELEMENT_TYPES.URL && input.fieldType !== INPUT_ELEMENT_TYPES.TEXT)
    return false

  const websitePatterns: Pattern[] = [
    'website',
    'web site',
    'personal website',
    'portfolio',
    'site',
    'homepage',
    'home page',
    'url',
    'webpage',
    'web page',
    'company website',
    'company url',
    'business website',
    'business url',
    'profile url',
    'profile link',
    'website address',
    'web address',
    'site url',
    'site link',
    'website link',
    'personal url',
    'portfolio url',
    'portfolio site',
    'portfolio website',
  ]
  const autocompletePatterns: Pattern[] = ['url', 'website', 'homepage']
  return (
    input.type === 'url' ||
    matchesPattern(input.label ?? undefined, websitePatterns) ||
    matchesPattern(input.name, websitePatterns) ||
    matchesPattern(input.placeholder, websitePatterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
  )
}

const isTwitterUrlInput = (input: SerializedHtmlInput): boolean => {
  if (input.fieldType !== INPUT_ELEMENT_TYPES.URL && input.fieldType !== INPUT_ELEMENT_TYPES.TEXT)
    return false
  const patterns: Pattern[] = [
    'twitter',
    'twitter url',
    'twitter handle',
    'twitter profile',
    'twitter link',
    'twitter_username',
    'twitter_user',
    'twitter_profile',
    'twitter_handle',
    'twitteraccount',
    'twitter-account',
    'twitteruser',
    'twitter-user',
    'twitteraddress',
    'twitter address',
    'twitterid',
    'twitter id',
    '@twitter',
    'twitter.com',
    'twitter profile url',
    'twitter page',
  ]
  const autocompletePatterns: Pattern[] = ['twitter', 'twitter-url']
  return !!(
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns) ||
    (input.type === 'url' &&
      ((input.name && input.name.toLowerCase().includes('twitter')) ||
        (input.label && input.label.toLowerCase().includes('twitter'))))
  )
}

const isGithubUrlInput = (input: SerializedHtmlInput): boolean => {
  if (input.fieldType !== INPUT_ELEMENT_TYPES.URL && input.fieldType !== INPUT_ELEMENT_TYPES.TEXT)
    return false
  const patterns: Pattern[] = [
    'github',
    'github url',
    'github handle',
    'github profile',
    'github link',
    'github_username',
    'github_user',
    'github_profile',
    'github_handle',
    'githubaccount',
    'github-account',
    'githubuser',
    'github-user',
    'githubaddress',
    'github address',
    'githubid',
    'github id',
    'github.com',
    'github profile url',
    'github page',
  ]
  const autocompletePatterns: Pattern[] = ['github', 'github-url']
  return !!(
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns) ||
    (input.type === 'url' &&
      ((input.name && input.name.toLowerCase().includes('github')) ||
        (input.label && input.label.toLowerCase().includes('github'))))
  )
}

const isCurrentCompanyInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT
  )
    return false
  const patterns: Pattern[] = [
    'current company',
    'current employer',
    'employer',
    'company',
    'company name',
    'present employer',
    'present company',
    'workplace',
    'organization',
    'current workplace',
    'current organization',
    'current org',
    'employer name',
    'company (current)',
    'employer (current)',
    'company_name',
    'employer_name',
    'work company',
    'work employer',
    'work org',
    'work organization',
  ]
  const autocompletePatterns: Pattern[] = ['organization', 'company', 'employer']
  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
  )
}

const isSalaryExpectationsInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.NUMBER &&
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT
  )
    return false

  const patterns: Pattern[] = [
    'salary expectations',
    'salary expectation',
    'expected salary',
    'desired salary',
    'salary requirement',
    'salary requirements',
    'compensation expectations',
    'compensation expectation',
    'pay expectations',
    'pay expectation',
    'wage expectations',
    'wage expectation',
    'salary range',
    'expected compensation',
    'desired compensation',
    'salary desired',
    'compensation desired',
    'hourly rate',
    'annual salary',
    'starting salary',
    'target salary',
    'salary target',
    /salary[_-]?expectations?/i,
    /expected[_-]?salary/i,
    /desired[_-]?salary/i,
    /compensation[_-]?expectations?/i,
    /pay[_-]?expectations?/i,
    /wage[_-]?expectations?/i,
    /salary[_-]?range/i,
    /hourly[_-]?rate/i,
    /annual[_-]?salary/i,
    /starting[_-]?salary/i,
    /target[_-]?salary/i,
    /salary[_-]?target/i,
  ]

  const autocompletePatterns: Pattern[] = ['salary', 'compensation', 'wage', 'pay']

  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
  )
}

const isPositionDiscoverySourceInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXTBOX
  )
    return false

  const patterns: Pattern[] = [
    'how did you find out',
    'how did you hear about',
    'how did you learn about',
    'how did you discover',
    'where did you find',
    'where did you hear',
    'where did you learn',
    'source of position',
    'learned about this position',
    'discovered this position',
    'found this position',
    'heard about this position',
    'referral source',
    'job source',
    'application source',
    'position source',
    'job posting source',
    'discovery source',
    'find out about',
    'hear about',
    'learn about',
    'specific source',
    'source where you learned',
    /how.*find.*position/i,
    /how.*hear.*position/i,
    /how.*learn.*position/i,
    /how.*discover.*position/i,
    /where.*learn.*position/i,
    /source.*position/i,
    /position.*source/i,
    /referral[_-]?source/i,
    /job[_-]?source/i,
    /application[_-]?source/i,
    /discovery[_-]?source/i,
  ]

  const autocompletePatterns: Pattern[] = [
    'referral-source',
    'job-source',
    'application-source',
    'discovery-source',
  ]

  // Strong indicators that this is asking about HOW you found the position, not WHO referred you
  const strongPositionDiscoveryPatterns: Pattern[] = [
    'how did you find out about this position',
    'how did you learn about this position',
    'how did you hear about this position',
    'where did you find this position',
    'list the specific source where you learned about this position',
    'source where you learned about this position',
    'specific source where you learned',
    'learned about this position',
    'find out about this position',
    'hear about this position',
    'discover this position',
    'found this position',
  ]

  // If the label clearly indicates position discovery, match it regardless of other attributes
  if (matchesPattern(input.label ?? undefined, strongPositionDiscoveryPatterns)) {
    return true
  }

  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
  )
}

const isCurrentJobTitleInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT
  )
    return false

  const patterns: Pattern[] = [
    'current title',
    'job title',
    'position title',
    'current position',
    'current role',
    'role',
    'position',
    'title',
    'your title',
    'your current title',
    'your position',
    'your role',
    'current job title',
    'present title',
    'present position',
    'present role',
    'work title',
    'employment title',
    'professional title',
    /current[_-]?title/i,
    /job[_-]?title/i,
    /position[_-]?title/i,
    /current[_-]?position/i,
    /current[_-]?role/i,
    /current[_-]?job[_-]?title/i,
    /present[_-]?title/i,
    /present[_-]?position/i,
    /present[_-]?role/i,
    /work[_-]?title/i,
    /employment[_-]?title/i,
    /professional[_-]?title/i,
  ]

  const autocompletePatterns: Pattern[] = [
    'job-title',
    'position',
    'role',
    'title',
    'current-title',
    'current-position',
  ]

  // Exclude specific phrases that indicate it's not asking for your job title
  const excludePatterns: Pattern[] = [
    'page title',
    'document title',
    'website title',
    'site title',
    'article title',
    'blog title',
    'post title',
    'book title',
    'movie title',
    'song title',
    'album title',
    'mr.',
    'mrs.',
    'ms.',
    'dr.',
    'prof.',
    'honorific',
    // Exclude questions that use "position" or "role" but aren't asking for job title
    'about this position',
    'about this role',
    'for this role',
    'for this position',
    'how did you find out about this position',
    'how did you learn about this position',
    'how did you hear about this position',
    'where did you find this position',
    'salary expectations for this role',
    'what are your salary expectations for this role',
    'specific source where you learned about this position',
    'list the specific source where you learned about this position',
  ]

  const hasExcludedPattern =
    matchesPattern(input.label ?? undefined, excludePatterns) ||
    matchesPattern(input.name, excludePatterns) ||
    matchesPattern(input.placeholder, excludePatterns)

  if (hasExcludedPattern) return false

  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
  )
}

const isReferralSourceInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXTBOX
  )
    return false

  const patterns: Pattern[] = [
    'referred by',
    'who referred you',
    'who referred',
    'referral',
    'referrer',
    'referring employee',
    'employee referral',
    'referred by employee',
    'referred by current employee',
    'employee who referred',
    'name of referrer',
    'referral name',
    'referred by a current employee',
    'if you were referred',
    'list the employee',
    "employee's full name",
    'full name here',
    'current employee of',
    'referred to this job',
    'referred you to this position',
    'employee reference',
    'internal referral',
    'staff referral',
    'team member referral',
    /referred[_-]?by/i,
    /who[_-]?referred/i,
    /employee[_-]?referral/i,
    /referral[_-]?name/i,
    /referring[_-]?employee/i,
    /internal[_-]?referral/i,
    /staff[_-]?referral/i,
    /team[_-]?member[_-]?referral/i,
    /employee[_-]?reference/i,
  ]

  const autocompletePatterns: Pattern[] = [
    'referral',
    'referrer',
    'referred-by',
    'employee-referral',
    'referring-employee',
  ]

  // Exclude position discovery questions that aren't asking for WHO referred you
  const excludePatterns: Pattern[] = [
    'how did you find',
    'how did you hear',
    'how did you learn',
    'how did you discover',
    'where did you find',
    'where did you hear',
    'where did you learn',
    'list the specific source',
    'source where you learned',
    'learned about this position',
    'find out about this position',
    'hear about this position',
    'discover this position',
    'found this position',
    'job posting',
    'job board',
    'specific source',
    'source of position',
  ]

  const hasExcludedPattern =
    matchesPattern(input.label ?? undefined, excludePatterns) ||
    matchesPattern(input.placeholder, excludePatterns) ||
    matchesPattern(input.name, excludePatterns)

  if (hasExcludedPattern) return false

  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
    matchesPattern(input.autocomplete, autocompletePatterns)
  )
}

const isPronounsInput = (input: SerializedHtmlInput): boolean => {
  if (
    input.fieldType !== INPUT_ELEMENT_TYPES.TEXT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.SELECT &&
    input.fieldType !== INPUT_ELEMENT_TYPES.RADIO
  )
    return false

  const patterns: Pattern[] = [
    'pronouns',
    'preferred pronouns',
    'your pronouns',
    'what are your pronouns',
    'personal pronouns',
    'pronoun',
    'preferred pronoun',
    'gender pronouns',
    'pronouns (optional)',
    'pronouns optional',
    'preferred gender pronouns',
    'pronoun preference',
    'pronoun preferences',
    /pronouns?/i,
    /preferred[_-]?pronouns?/i,
    /personal[_-]?pronouns?/i,
    /gender[_-]?pronouns?/i,
    /pronoun[_-]?preference/i,
    /pronoun[_-]?preferences/i,
  ]

  const autocompletePatterns: Pattern[] = [
    'pronouns',
    'preferred-pronouns',
    'gender-pronouns',
    'personal-pronouns',
  ]

  return (
    matchesPattern(input.label ?? undefined, patterns) ||
    matchesPattern(input.name, patterns) ||
    matchesPattern(input.placeholder, patterns) ||
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
  isLocationInput,
  isAuthorizationInput,
  isSponsorshipInput,
  isSchoolInput,
  isDegreeInput,
  isDisciplineInput,
  isEndDateYearInput,
  isLinkedInProfileInput,
  isWebsiteInput,
  isOtherWebsiteInput,
  isTwitterUrlInput,
  isGithubUrlInput,
  isCurrentCompanyInput,
  isSalaryExpectationsInput,
  isPositionDiscoverySourceInput,
  isCurrentJobTitleInput,
  isReferralSourceInput,
  isPronounsInput,
}
