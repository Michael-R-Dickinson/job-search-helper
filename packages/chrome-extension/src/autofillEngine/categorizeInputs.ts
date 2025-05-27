import type { InputInfo } from '../content/hooks/useInputElements'

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

// Input type detection functions
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

// Types
interface ProcessedInput {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  fieldType: InputType
  label: string
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

const getFieldType = (
  el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): InputType => {
  const tag = el.tagName.toLowerCase()
  if (tag === 'select') return INPUT_TYPES.SELECT
  if (tag === 'textarea') return INPUT_TYPES.TEXTBOX
  if (tag === 'input') {
    const type = (el as HTMLInputElement).type?.toLowerCase()
    if (type && Object.values(INPUT_TYPES).includes(type as InputType)) {
      return type as InputType
    }
  }
  return INPUT_TYPES.TEXT
}

const preprocessInputs = (inputs: InputInfo[]) => {
  return inputs
    .map((input) => {
      const label = input.label?.trim().toLowerCase() || ''
      const element = input.element as HTMLInputElement
      const fieldType = getFieldType(element)

      return {
        ...input,
        label,
        fieldType,
        name: element.name || '',
        type: element.type || 'text',
        placeholder: element.placeholder || '',
        autocomplete: element.autocomplete || '',
        id: element.id || '',
        className: element.className || '',
        value: element.value || '',
        required: element.required || false,
      } as const
    })
    .filter(({ label }) => Boolean(label)) // Ensure we only keep inputs with non-empty labels
}

const categorizeInputs = (inputs: InputInfo[]): CategorizedInput[] => {
  return preprocessInputs(inputs).map((input) => {
    if (isNameInput(input)) return { ...input, category: 'name' as const }
    if (isEmailInput(input)) return { ...input, category: 'email' as const }
    if (isGenderInput(input)) return { ...input, category: 'gender' as const }
    if (isVeteranStatusInput(input)) return { ...input, category: 'veteran' as const }
    if (isRaceEthnicityInput(input)) return { ...input, category: 'race_ethnicity' as const }
    if (isDisabilityInput(input)) return { ...input, category: 'disability' as const }
    if (isPhoneInput(input)) return { ...input, category: 'phone' as const }
    if (isCountryInput(input)) return { ...input, category: 'country' as const }
    return { ...input, category: 'unknown' as const }
  })
}

// Export everything with type exports first
export type { ProcessedInput, InputCategory, CategorizedInput }

export {
  // Main function
  categorizeInputs as default,

  // Input type detection functions
  isNameInput,
  isEmailInput,
  isGenderInput,
  isVeteranStatusInput,
  isRaceEthnicityInput,
  isDisabilityInput,
  isPhoneInput,
  isCountryInput,

  // INPUT_TYPES is already exported at the declaration
}
