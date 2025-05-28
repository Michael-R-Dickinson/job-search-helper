import type { SerializedInput } from '../content/triggerGetAutofillValues'

import {
  isNameInput,
  isEmailInput,
  isGenderInput,
  isVeteranStatusInput,
  isRaceEthnicityInput,
  isDisabilityInput,
  isPhoneInput,
  isCountryInput,
} from './inputCategories'

// Constants
export const INPUT_TYPES = {
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

type InputType = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES]

// Types
interface ProcessedInput {
  label: string | null
  html: string
  fieldType: InputType
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

interface CategorizedInput extends ProcessedInput {
  category: InputCategory
}

// Helper to parse html string and extract attributes
const parseHtmlInput = (input: SerializedInput): ProcessedInput => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(input.html, 'text/html')
  const el = doc.body.firstElementChild as HTMLElement | null
  // Defaults
  let fieldType: InputType = INPUT_TYPES.TEXT
  let name = ''
  let type = ''
  let placeholder = ''
  let autocomplete = ''
  let id = ''
  let className = ''
  let value = ''
  let required = false
  if (el) {
    const tag = el.tagName.toLowerCase()
    if (tag === 'select') fieldType = INPUT_TYPES.SELECT
    else if (tag === 'textarea') fieldType = INPUT_TYPES.TEXTBOX
    else if (tag === 'input') {
      type = (el.getAttribute('type') || 'text').toLowerCase()
      if (Object.values(INPUT_TYPES).includes(type as InputType)) {
        fieldType = type as InputType
      }
    }
    name = el.getAttribute('name') || ''
    id = el.getAttribute('id') || ''
    className = el.getAttribute('class') || ''
    value = el.getAttribute('value') || ''
    required = el.hasAttribute('required')
    placeholder = el.getAttribute('placeholder') || ''
    autocomplete = el.getAttribute('autocomplete') || ''
  }
  return {
    label: input.label,
    html: input.html,
    fieldType,
    name,
    type,
    placeholder,
    autocomplete,
    id,
    className,
    value,
    required,
  }
}

const preprocessInputs = (inputs: SerializedInput[]): ProcessedInput[] => {
  return inputs.map(parseHtmlInput)
}

const categorizeInputs = (inputs: SerializedInput[]): CategorizedInput[] => {
  return preprocessInputs(inputs).map((input) => {
    let category: InputCategory = 'unknown'
    if (isNameInput(input)) category = 'name'
    else if (isEmailInput(input)) category = 'email'
    else if (isGenderInput(input)) category = 'gender'
    else if (isVeteranStatusInput(input)) category = 'veteran'
    else if (isRaceEthnicityInput(input)) category = 'race_ethnicity'
    else if (isDisabilityInput(input)) category = 'disability'
    else if (isPhoneInput(input)) category = 'phone'
    else if (isCountryInput(input)) category = 'country'
    return { ...input, category }
  })
}

export type { ProcessedInput, InputCategory, CategorizedInput }

export {
  categorizeInputs as default,
  isNameInput,
  isEmailInput,
  isGenderInput,
  isVeteranStatusInput,
  isRaceEthnicityInput,
  isDisabilityInput,
  isPhoneInput,
  isCountryInput,
}
