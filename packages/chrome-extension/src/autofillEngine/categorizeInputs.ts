import type { SerializedHtmlInput } from '../content/serializeInputsHtml'

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

// No need to parse HTML, just cast
const preprocessInputs = (inputs: SerializedHtmlInput[]): ProcessedInput[] => {
  return inputs.map((input) => input as ProcessedInput)
}

const categorizeInputs = (inputs: SerializedHtmlInput[]): CategorizedInput[] => {
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
