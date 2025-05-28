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

export type AutofillInstruction = {
  action: string
  value: string | undefined
  id: string
}
