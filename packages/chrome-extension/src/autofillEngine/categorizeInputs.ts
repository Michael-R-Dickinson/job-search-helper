import {
  isNameInput,
  isEmailInput,
  isLinkedInProfileInput,
  isTwitterUrlInput,
  isGithubUrlInput,
  isPronounsInput,
  isResumeUploadInput,
} from './inputCategoryPredicates'
import type { SerializedHtmlInput, CategorizedInput, SimpleInputsEnum } from './schema'

// Categorizes a number of simple inputs that we can handle without invoking the LLM autofilling engine
const categorizeSimpleInputs = (inputs: SerializedHtmlInput[]): CategorizedInput[] => {
  return inputs.map((input) => {
    let category: SimpleInputsEnum = 'unknown'
    if (isNameInput(input)) category = 'name'
    else if (isEmailInput(input)) category = 'email'
    else if (isPronounsInput(input)) category = 'pronouns'
    else if (isLinkedInProfileInput(input)) category = 'linkedin_profile'
    else if (isTwitterUrlInput(input)) category = 'twitter_url'
    else if (isGithubUrlInput(input)) category = 'github_url'
    else if (isResumeUploadInput(input)) category = 'resume_upload'
    // else if (isSalaryExpectationsInput(input)) category = 'salary_expectations'
    // else if (isOtherWebsiteInput(input)) category = 'other_website'
    // else if (isWebsiteInput(input)) category = 'website'
    return {
      element: input,
      category,
    }
  })
}

export { categorizeSimpleInputs }
