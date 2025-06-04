// Essentially documents synonyms for each key - used when picking options from a select input
export const CANONICAL: { key: string; synonyms: string[] }[] = [
  {
    key: 'protected_veteran',
    synonyms: [
      'yes',
      'true',
      'i am a protected veteran',
      'veteran with protected status',
      'i identify as one or more classes of protected veteran',
    ],
  },
  {
    key: 'not_veteran',
    synonyms: ['no', 'false', 'i am not a protected veteran', 'non-protected veteran', 'not a vet'],
  },
  {
    key: 'man',
    synonyms: ['man', 'male', 'he', 'him', 'his'],
  },
  {
    key: 'woman',
    synonyms: ['woman', 'female', 'she', 'her', 'hers'],
  },
  {
    key: 'heterosexual',
    synonyms: ['heterosexual', 'straight'],
  },
  {
    key: 'homosexual',
    synonyms: ['homosexual', 'gay'],
  },
  {
    key: 'bisexual',
    synonyms: ['bisexual', 'pansexual'],
  },
  {
    key: 'disabled',
    synonyms: ['yes', 'disabled', 'i am disabled', 'i have a disability'],
  },
  {
    key: 'enabled',
    synonyms: ['no', 'not disabled', 'i do not have a disability'],
  },
  {
    key: 'us_authorized',
    synonyms: ['yes', 'true', 'i am authorized to work in the US'],
  },
  {
    key: 'no_authorization',
    synonyms: ['no', 'false', 'i am not authorized to work in the US'],
  },
  {
    key: 'prefer_not_to_say',
    synonyms: ['prefer not to say', 'i do not wish to answer', 'no answer', 'decline to state'],
  },
  {
    key: 'true',
    synonyms: ['true', 'yes'],
  },
  {
    key: 'false',
    synonyms: ['false', 'no'],
  },
  {
    key: 'linkedin',
    synonyms: ['linkedin', 'linkedin profile', 'job board', 'company website'],
  },
]
