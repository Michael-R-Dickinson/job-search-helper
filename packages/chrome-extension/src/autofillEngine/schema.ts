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

export const GenderEnum = z.enum(['male', 'female', 'non_binary', 'other', 'prefer_not_to_say'])
export const VeteranStatusEnum = z.enum(['yes', 'no', 'prefer_not_to_say'])
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
export const HispanicLatinoEnum = z.enum(['yes', 'no', 'prefer_not_to_say'])
export const DisabilityStatusEnum = z.enum(['yes', 'no', 'prefer_not_to_say'])
export const AuthorizationStatusEnum = z.enum(['yes', 'no'])
export const SponsorshipStatusEnum = z.enum(['yes', 'no'])

export const UserAutofillPreferencesSchema = z.object({
  name: z
    .object({
      first_name: z.string().optional(),
      last_name: z.string().optional(),
    })
    .optional(),
  email: z.string().optional(),
  gender: GenderEnum.optional(),
  veteran: VeteranStatusEnum.optional(),
  race_ethnicity: RaceEthnicityEnum.optional(),
  hispanic_latino: HispanicLatinoEnum.optional(),
  disability: DisabilityStatusEnum.optional(),
  phone: z
    .object({
      phoneNum: z.number().optional(),
      extension: z.string().optional(),
      type: z.enum(['mobile', 'landline']).optional(),
    })
    .optional(),
  location: z
    .object({
      country: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postal_code: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  authorization: AuthorizationStatusEnum.optional(),
  sponsorship: z
    .object({
      text: z.string().optional(),
      yesNoAnswer: z.boolean().optional(),
    })
    .optional(),
  school: z.string().optional(),
  degree: z.string().optional(),
  discipline: z.string().optional(),
  end_date_year: z.string().optional(),
  linkedin_profile: z.string().optional(),
  website: z.string().optional(),
  other_website: z.string().optional(),
  twitter_url: z.string().optional(),
  github_url: z.string().optional(),
  current_company: z.string().optional(),
  salary_expectations: z.string().optional(),
  position_discovery_source: z.string().optional(),
  current_job_title: z.string().optional(),
  referral_source: z.string().optional(),
  pronouns: z.string().optional(),
})
export type UserAutofillPreferences = z.infer<typeof UserAutofillPreferencesSchema>

const AutofillActionSchema = z.enum(['fill', 'clear', 'skip'])
export const AutofillInstructionSchema = z.object({
  action: AutofillActionSchema,
  value: z.string().optional(),
  id: z.string(),
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
