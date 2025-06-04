import { z } from 'zod'

// Constants
export const INPUT_ELEMENT_TYPES = {
  TEXT: 'text',
  SELECT: 'select',
  TEXTBOX: 'textbox',
  EMAIL: 'email',
  TEL: 'tel',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  NUMBER: 'number',
  DATE: 'date',
  PASSWORD: 'password',
  URL: 'url',
} as const

export type InputElementType = (typeof INPUT_ELEMENT_TYPES)[keyof typeof INPUT_ELEMENT_TYPES]

export const SerializedHtmlInputSchema = z.object({
  label: z.string().nullable(),
  wholeQuestionLabel: z.string().nullable().optional(),
  html: z.string(),
  fieldType: z.nativeEnum(INPUT_ELEMENT_TYPES),
  name: z.string(),
  type: z.string(),
  placeholder: z.string(),
  autocomplete: z.string(),
  id: z.string(),
  className: z.string(),
  value: z.string(),
  required: z.boolean(),
  checked: z.boolean().nullable().optional(),
  // A unique identifier we give to the input element to identify it in the DOM
  // This is used to match the input element to the autofill instruction in the frontend
  elementReferenceId: z.string(),
})

export type SerializedHtmlInput = z.infer<typeof SerializedHtmlInputSchema>

export type InputCategory =
  | 'name'
  | 'email'
  | 'gender'
  | 'veteran'
  | 'race_ethnicity'
  | 'hispanic_latino'
  | 'disability'
  | 'phone'
  | 'authorization'
  | 'sponsorship'
  | 'location'
  | 'school'
  | 'degree'
  | 'discipline'
  | 'end_date_year'
  | 'linkedin_profile'
  | 'website'
  | 'other_website'
  | 'twitter_url'
  | 'github_url'
  | 'current_company'
  | 'salary_expectations'
  | 'position_discovery_source'
  | 'current_job_title'
  | 'referral_source'
  | 'pronouns'
  | 'unknown'

export const CategorizedInputSchema = z.object({
  category: z.custom<InputCategory>(),
  label: z.string().nullable(),
  element: SerializedHtmlInputSchema,
})

export type CategorizedInput = z.infer<typeof CategorizedInputSchema>

const YesNoAbstainEnum = z.enum(['yes', 'no', 'prefer_not_to_say'])

const NameSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

export const RaceEthnicityEnum = z.enum([
  'asian',
  'black',
  'hispanic',
  'white',
  'native_american',
  'pacific_islander',
  'two_or_more',
  'other',
  'prefer_not_to_say',
])
const RaceSchema = z.object({
  race: RaceEthnicityEnum.optional(),
  hispanic_latino: YesNoAbstainEnum.optional(),
})

const GenderEnum = z.enum(['male', 'female', 'non_binary', 'other', 'prefer_not_to_say'])
const SexualOrientationEnum = z.enum([
  'straight|heterosexual',
  'gay|homosexual',
  'bisexual|pansexual',
  'asexual',
  'queer',
  'prefer_not_to_say',
])
const IdentitySchema = z.object({
  gender: GenderEnum.optional(),
  sexual_orientation: SexualOrientationEnum.optional(),
  pronouns: z.string().optional(),
  transgender: z.boolean().optional(),
})

const AuthorizationEnum = z.enum(['yes', 'no']).describe('Authorization to work in the US')

const JobSchema = z.object({
  current_company: z.string().optional(),
  current_title: z.string().optional(),
  start_date_year: z.string().optional(),
  end_date_year: z.string().optional(),
})

const EducationSchema = z.object({
  school: z.string().optional(),
  degree: z.string().optional(),
  discipline: z.string().optional(),
  end_date_year: z.string().optional(),
})

const PhoneTypeEnum = z.enum(['mobile', 'landline'])
const PhoneSchema = z.object({
  phoneNum: z.number().optional(),
  extension: z.string().optional(),
  type: PhoneTypeEnum.optional(),
})

const SponsorshipSchema = z
  .object({
    textAnswer: z.string().optional(),
    yesNoAnswer: z.boolean().optional(),
  })
  .describe(
    'Whether one will now or in the future require a visa sponsorship or a transfer for employment status',
  )

const LocationSchema = z.object({
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  address: z.string().optional(),
})

export const UserAutofillPreferencesSchema = z.object({
  name: NameSchema.optional(),
  email: z.string().optional(),
  linkedin_profile: z.string().optional(),
  website: z.string().optional(),
  other_website: z.string().optional(),
  twitter_url: z.string().optional(),
  github_url: z.string().optional(),
  salary_expectations: z.string().optional(),
  veteran: YesNoAbstainEnum.optional(),
  disability: YesNoAbstainEnum.optional(),
  authorization: AuthorizationEnum.optional(),
  race: RaceSchema.optional(),
  identity: IdentitySchema.optional(),
  job: JobSchema.optional(),
  education: EducationSchema.optional(),
  phone: PhoneSchema.optional(),
  sponsorship: SponsorshipSchema.optional(),
  location: LocationSchema.optional(),
})

export type UserAutofillPreferences = z.infer<typeof UserAutofillPreferencesSchema>

export const AutofillInstructionSchema = z.object({
  input_text: z.string().optional(),
  value: z.union([z.string(), z.boolean()]),
  input_id: z.string(),
})
export const AutofillInstructionsSchema = z.array(AutofillInstructionSchema)

export type AutofillInstruction = z.infer<typeof AutofillInstructionSchema>

export type RealtimeDbSaveResult =
  | {
      status: 'success'
      valuePath: string
      value: string | boolean
    }
  | {
      status: 'error'
      error: string
    }
