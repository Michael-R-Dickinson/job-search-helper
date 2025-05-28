import {
  isNameInput,
  isEmailInput,
  isGenderInput,
  isVeteranStatusInput,
  isDisabilityInput,
  isPhoneInput,
  isCountryInput,
  isRaceEthnicityInput,
  isAuthorizationInput,
  isSponsorshipInput,
  isMailingAddressInput,
  isSchoolInput,
  isDegreeInput,
  isDisciplineInput,
  isEndDateYearInput,
  isLinkedInProfileInput,
} from './inputCategoryPredicates'
import type { SerializedHtmlInput, CategorizedInput, InputCategory } from './schema'

const categorizeInputs = (inputs: SerializedHtmlInput[]): CategorizedInput[] => {
  return inputs.map((input) => {
    let category: InputCategory = 'unknown'
    if (isNameInput(input)) category = 'name'
    else if (isEmailInput(input)) category = 'email'
    else if (isPhoneInput(input)) category = 'phone'
    else if (isGenderInput(input)) category = 'gender'
    else if (isVeteranStatusInput(input)) category = 'veteran'
    else if (isDisabilityInput(input)) category = 'disability'
    else if (isRaceEthnicityInput(input)) category = 'race_ethnicity'
    else if (isAuthorizationInput(input)) category = 'authorization'
    else if (isSponsorshipInput(input)) category = 'sponsorship'
    else if (isMailingAddressInput(input)) category = 'mailing_address'
    else if (isSchoolInput(input)) category = 'school'
    else if (isDegreeInput(input)) category = 'degree'
    else if (isDisciplineInput(input)) category = 'discipline'
    else if (isEndDateYearInput(input)) category = 'end_date_year'
    else if (isLinkedInProfileInput(input)) category = 'linkedin_profile'
    else if (isCountryInput(input)) category = 'country'
    return {
      element: input,
      category,
      label: input.label,
      elementReferenceId: input.elementReferenceId,
    }
  })
}

export { categorizeInputs }
