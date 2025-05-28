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
  fieldType: z.string(),
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
  | 'disability'
  | 'phone'
  | 'country'
  | 'unknown'

export const CategorizedInputSchema = z.object({
  category: z.custom<InputCategory>(),
  label: z.string().nullable(),
  element: SerializedHtmlInputSchema,
})

export type CategorizedInput = z.infer<typeof CategorizedInputSchema>

export const UserAutofillPreferencesSchema = z.object({
  name: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
  email: z.string().optional(),
  gender: z.string().optional(),
  veteran: z.string().optional(),
  race_ethnicity: z.string().optional(),
  disability: z.string().optional(),
  phone: z.string().optional(),
})
export type UserAutofillPreferences = z.infer<typeof UserAutofillPreferencesSchema>

const AutofillActionSchema = z.enum(['fill', 'clear', 'skip'])
export const AutofillInstructionSchema = z.object({
  action: AutofillActionSchema,
  value: z.string().optional(),
  id: z.string(),
})

export type AutofillInstruction = z.infer<typeof AutofillInstructionSchema>
