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
import type { SerializedHtmlInput, CategorizedInput, InputCategory } from './schema'

const categorizeInputs = (inputs: SerializedHtmlInput[]): CategorizedInput[] => {
  return inputs.map((input) => {
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

export { categorizeInputs }
