import type { ElementInfo, InputInfo } from '../content/hooks/useInputElements'

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

interface CategorizedInput {
  element: ElementInfo
  category: InputCategory
}

const getFieldType = (el: ElementInfo): InputType => {
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

const preprocessInputs = (inputs: InputInfo[]): ProcessedInput[] => {
  return inputs.map((inputInfo) => {
    const { element, label: rawLabel } = inputInfo
    const processedLabel = rawLabel?.trim().toLowerCase() || ''
    const fieldType = getFieldType(element)

    let specificElementType = 'text' // Default for inputs, or general type
    const tagName = element.tagName.toLowerCase()

    if (tagName === 'input') {
      specificElementType = (element as HTMLInputElement).type?.toLowerCase() || 'text'
    } else if (tagName === 'select') {
      specificElementType = (element as HTMLSelectElement).type // e.g., "select-one", "select-multiple"
    } else if (tagName === 'textarea') {
      specificElementType = 'textarea'
    }

    // Common properties accessible on all three types
    const name = element.name || ''
    const id = element.id || ''
    const className = element.className || ''
    const value = element.value || ''
    const required = element.required || false

    // Properties that might not exist on all types, handle carefully
    let placeholder = ''
    if ('placeholder' in element) {
      placeholder = element.placeholder || ''
    }

    let autocomplete = ''
    if ('autocomplete' in element) {
      autocomplete = element.autocomplete || ''
    }

    return {
      element, // Original element
      label: processedLabel,
      fieldType,
      name,
      type: specificElementType, // Use the derived specific element type
      placeholder,
      autocomplete,
      id,
      className,
      value,
      required,
    } as ProcessedInput // Assert as ProcessedInput, ensure fields match
  })
}

const categorizeInputs = (inputs: InputInfo[]): CategorizedInput[] => {
  return preprocessInputs(inputs).map((input) => {
    if (isNameInput(input)) return { element: input.element, category: 'name' as const }
    if (isEmailInput(input)) return { element: input.element, category: 'email' as const }
    if (isGenderInput(input)) return { element: input.element, category: 'gender' as const }
    if (isVeteranStatusInput(input)) return { element: input.element, category: 'veteran' as const }
    if (isRaceEthnicityInput(input))
      return { element: input.element, category: 'race_ethnicity' as const }
    if (isDisabilityInput(input)) return { element: input.element, category: 'disability' as const }
    if (isPhoneInput(input)) return { element: input.element, category: 'phone' as const }
    if (isCountryInput(input)) return { element: input.element, category: 'country' as const }
    return { element: input.element, category: 'unknown' as const }
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
