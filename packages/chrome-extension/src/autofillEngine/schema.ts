import { z } from 'zod'
import type { ValueOf } from '../utils'

// Getting and serializing Inputs
// -------------------------------
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
  FILE: 'file',
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

// Categorizing Simple Inputs - these are inputs that we can handle without using the LLM autofilling engine
// -------------------------------

export const SimpleInputsEnum = {
  unknown: 'unknown',
  name: 'name',
  email: 'email',
  pronouns: 'pronouns',
  linkedin_profile: 'linkedin_profile',
  twitter_url: 'twitter_url',
  github_url: 'github_url',
  salary_expectations: 'salary_expectations',
  resume_upload: 'resume_upload',
} as const
export type SimpleInputsEnum = ValueOf<typeof SimpleInputsEnum>

export const CategorizedInputSchema = z.object({
  category: z.custom<SimpleInputsEnum>(),
  element: SerializedHtmlInputSchema,
})
export type CategorizedInput = z.infer<typeof CategorizedInputSchema>

export type MinifiedInput = {
  label: string | null
  name: string | null
  fieldType: string | null
  wholeQuestionLabel: string | null
  value: string | null
}

// Getting Autofill Values - the huge schema here defines all the data we save on users in the realtime db
// When changing these values, make sure to update the schema string in the backend as well
// ! ALL Schema values contributing to UserAutofillPreferencesSchema are strongly linked to the schema string in the backend
// TODO: Add a script to export this schema as json and import it into the backend, and vice versa
// -------------------------------

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
  hispanic_latino: z.enum(['yes', 'no', 'prefer_not_to_say']).optional(),
})

const VeteranStatusEnum = z.enum(['protected_veteran', 'not_veteran', 'prefer_not_to_say'])

const AuthorizationEnum = z
  .enum(['us_authorized', 'no_authorization'])
  .describe('Whether the user is legally authorized to work in the US')

const DisabilityEnum = z.enum(['disabled', 'enabled', 'prefer_not_to_say'])

const GenderEnum = z.enum(['man', 'woman', 'non_binary', 'other', 'prefer_not_to_say'])
const SexualOrientationEnum = z.enum([
  'heterosexual',
  'homosexual',
  'pansexual',
  'asexual',
  'queer',
  'prefer_not_to_say',
])
const TransgenderEnum = z.enum(['yes', 'no', 'prefer_not_to_say'])
const IdentitySchema = z.object({
  gender: GenderEnum.optional(),
  sexual_orientation: SexualOrientationEnum.optional(),
  pronouns: z.string().optional(),
  transgender: TransgenderEnum.optional(),
})

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
    yesNoAnswer: z.enum(['require_sponsorship', 'no_sponsorship']).optional(),
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
  veteran: VeteranStatusEnum.optional(),
  disability: DisabilityEnum.optional(),
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

// Autofill Instructions
// -------------------------------

// value can be a string or a boolean - string values are for text inputs or selects, boolean values are for radio buttons or checkboxes
export const AutofillInstructionSchema = z.object({
  input_text: z.string().optional(),
  value: z.union([z.string(), z.boolean()]),
  input_id: z.string(),
})
export const AutofillInstructionsSchema = z.array(AutofillInstructionSchema)

export type AutofillInstruction = z.infer<typeof AutofillInstructionSchema>

// Realtime DB
// -------------------------------

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
