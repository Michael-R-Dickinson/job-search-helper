import {
  isNameInput,
  isEmailInput,
  isGenderInput,
  isVeteranStatusInput,
  isDisabilityInput,
  isPhoneInput,
  isRaceEthnicityInput,
  isAuthorizationInput,
  isSponsorshipInput,
  isSchoolInput,
  isDegreeInput,
  isDisciplineInput,
  isEndDateYearInput,
  isLinkedInProfileInput,
  isWebsiteInput,
  isOtherWebsiteInput,
  isTwitterUrlInput,
  isGithubUrlInput,
  isCurrentCompanyInput,
  isCurrentLocationInput,
  isLocationInput,
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
    else if (isLocationInput(input)) category = 'location'
    else if (isSchoolInput(input)) category = 'school'
    else if (isDegreeInput(input)) category = 'degree'
    else if (isDisciplineInput(input)) category = 'discipline'
    else if (isEndDateYearInput(input)) category = 'end_date_year'
    else if (isLinkedInProfileInput(input)) category = 'linkedin_profile'
    else if (isTwitterUrlInput(input)) category = 'twitter_url'
    else if (isGithubUrlInput(input)) category = 'github_url'
    else if (isOtherWebsiteInput(input)) category = 'other_website'
    else if (isWebsiteInput(input)) category = 'website'
    else if (isCurrentCompanyInput(input) && !isNameInput(input)) category = 'current_company'
    else if (isCurrentLocationInput(input) && !isLocationInput(input)) category = 'current_location'
    return {
      element: input,
      category,
      label: input.label,
      elementReferenceId: input.elementReferenceId,
    }
  })
}

export { categorizeInputs }
