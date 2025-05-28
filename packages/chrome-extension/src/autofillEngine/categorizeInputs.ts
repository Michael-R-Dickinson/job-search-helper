import {
  isNameInput,
  isEmailInput,
  isGenderInput,
  isVeteranStatusInput,
  isRaceEthnicityInput,
  isDisabilityInput,
  isPhoneInput,
  isCountryInput,
} from './inputCategoryPredicates'
import type { SerializedHtmlInput, ProcessedInput, CategorizedInput, InputCategory } from './schema'

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
    return { element: input, category, label: input.label }
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
