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

type InputElementType = (typeof INPUT_ELEMENT_TYPES)[keyof typeof INPUT_ELEMENT_TYPES]

// This matches the ProcessedInput type in categorizeInputs.ts
interface SerializedHtmlInput {
  label: string | null
  html: string
  fieldType: string
  name: string
  type: string
  placeholder: string
  autocomplete: string
  id: string
  className: string
  value: string
  required: boolean
}

// Types
interface ProcessedInput {
  label: string | null
  html: string
  fieldType: InputElementType
  name: string
  type: string
  placeholder: string
  autocomplete: string
  id: string
  className: string
  value: string
  required: boolean
}

type InputCategory =
  | 'name'
  | 'email'
  | 'gender'
  | 'veteran'
  | 'race_ethnicity'
  | 'disability'
  | 'phone'
  | 'country'
  | 'unknown'

interface CategorizedInput {
  category: InputCategory
  label: string | null
  element: ProcessedInput
}

type AutofillInstruction = {
  action: string
  value: string | undefined
  id: string
}

export type {
  InputElementType,
  InputCategory,
  SerializedHtmlInput,
  ProcessedInput,
  CategorizedInput,
  AutofillInstruction,
}
