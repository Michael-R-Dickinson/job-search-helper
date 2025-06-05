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
  isLocationInput,
  isSalaryExpectationsInput,
  isPositionDiscoverySourceInput,
  isCurrentJobTitleInput,
  isReferralSourceInput,
  isPronounsInput,
  isResumeUploadInput,
} from './inputCategoryPredicates'
import type { SerializedHtmlInput, CategorizedInput, InputCategory } from './schema'

const categorizeInputs = (inputs: SerializedHtmlInput[]): CategorizedInput[] => {
  return inputs.map((input) => {
    let category: InputCategory = 'unknown'
    if (isPositionDiscoverySourceInput(input)) category = 'position_discovery_source'
    else if (isReferralSourceInput(input)) category = 'referral_source'
    else if (isPronounsInput(input)) category = 'pronouns'
    else if (isCurrentJobTitleInput(input)) category = 'current_job_title'
    else if (isSalaryExpectationsInput(input)) category = 'salary_expectations'
    else if (isNameInput(input)) category = 'name'
    else if (isEmailInput(input)) category = 'email'
    else if (isGenderInput(input)) category = 'gender'
    else if (isVeteranStatusInput(input)) category = 'veteran'
    else if (isRaceEthnicityInput(input)) category = 'race_ethnicity'
    else if (isDisabilityInput(input)) category = 'disability'
    else if (isPhoneInput(input)) category = 'phone'
    else if (isSponsorshipInput(input)) category = 'sponsorship'
    else if (isAuthorizationInput(input)) category = 'authorization'
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
    else if (isCurrentCompanyInput(input)) category = 'current_company'
    else if (isResumeUploadInput(input)) category = 'resume_upload'
    return {
      element: input,
      category,
      label: input.label || '',
      elementReferenceId: input.elementReferenceId,
    }
  })
}

export { categorizeInputs }
