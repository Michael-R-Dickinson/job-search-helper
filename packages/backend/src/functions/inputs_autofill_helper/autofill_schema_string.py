# Probably should be shared between the chrome extension and the backend, but for now, as its just used in the prompt
# We just put it as a string here - THIS IS LINKED STRONGLY to the frontend schema.ts file and if both are not kept in sync,
# The autofill will break.

AUTOFILL_SCHEMA_STRING = """

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
  .describe('Authorization to work in the US')

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
"""
