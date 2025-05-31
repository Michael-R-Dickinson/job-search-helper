import { describe, it, expect } from 'vitest'
import {
  isNameInput,
  isEmailInput,
  isGenderInput,
  isVeteranStatusInput,
  isRaceEthnicityInput,
  isDisabilityInput,
  isPhoneInput,
  isAuthorizationInput,
  isSponsorshipInput,
  isSchoolInput,
  isDegreeInput,
  isDisciplineInput,
  isEndDateYearInput,
  isLinkedInProfileInput,
  isWebsiteInput,
  isTwitterUrlInput,
  isGithubUrlInput,
  isCurrentCompanyInput,
  isOtherWebsiteInput,
  isLocationInput,
  isSalaryExpectationsInput,
  isPositionDiscoverySourceInput,
  isCurrentJobTitleInput,
  isReferralSourceInput,
  isPronounsInput,
} from '../inputCategoryPredicates'
import { INPUT_ELEMENT_TYPES } from '../schema'

// Simple mock for HTMLInputElement
class MockInputElement {
  tagName = 'INPUT'
  type: string
  value: string
  checked: boolean
  selected: boolean

  constructor(type: string = 'text') {
    this.type = type
    this.value = ''
    this.checked = false
    this.selected = false
  }

  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true
  }
}

describe('Input Categorization Tests', () => {
  // Helper function to create a test input
  const createTestInput = (overrides: any = {}) => {
    const element = new MockInputElement(overrides.type || 'text')

    // Apply overrides to element
    if (overrides.element) {
      Object.assign(element, overrides.element)
    }

    return {
      fieldType: INPUT_ELEMENT_TYPES.TEXT,
      label: '',
      name: '',
      type: 'text',
      placeholder: '',
      autocomplete: '',
      id: '',
      className: '',
      value: '',
      required: false,
      element,
      ...overrides,
    }
  }

  describe('isNameInput', () => {
    it('should identify name inputs by label', () => {
      const input = createTestInput({ label: 'Full Name' })
      expect(isNameInput(input)).toBe(true)
    })

    it('should identify first name inputs', () => {
      const input = createTestInput({ name: 'first_name' })
      expect(isNameInput(input)).toBe(true)
    })

    it('should identify last name inputs', () => {
      const input = createTestInput({ placeholder: 'Enter your last name' })
      expect(isNameInput(input)).toBe(true)
    })

    it('should identify name prefix/suffix inputs', () => {
      const prefixInput = createTestInput({ name: 'name-prefix' })
      const suffixInput = createTestInput({ name: 'name_suffix' })
      expect(isNameInput(prefixInput)).toBe(true)
      expect(isNameInput(suffixInput)).toBe(true)
    })

    it('should not identify non-name inputs', () => {
      const input = createTestInput({ label: 'Email Address' })
      expect(isNameInput(input)).toBe(false)
    })
  })

  describe('isEmailInput', () => {
    it('should identify email inputs by type', () => {
      const input = createTestInput({ type: 'email' })
      expect(isEmailInput(input)).toBe(true)
    })

    it('should identify email inputs by label', () => {
      const input = createTestInput({ label: 'Email Address' })
      expect(isEmailInput(input)).toBe(true)
    })

    it('should identify email inputs by name', () => {
      const input = createTestInput({ name: 'user-email' })
      expect(isEmailInput(input)).toBe(true)
    })

    it('should identify email inputs by autocomplete', () => {
      const input = createTestInput({ autocomplete: 'email' })
      expect(isEmailInput(input)).toBe(true)
    })

    it('should not identify non-email inputs', () => {
      const input = createTestInput({ label: 'Phone Number' })
      expect(isEmailInput(input)).toBe(false)
    })
  })

  describe('isGenderInput', () => {
    it('should identify gender inputs by label', () => {
      const input = createTestInput({ label: 'Gender', fieldType: INPUT_ELEMENT_TYPES.SELECT })
      expect(isGenderInput(input)).toBe(true)
    })

    it('should identify sex inputs by name', () => {
      const input = createTestInput({ name: 'sex', fieldType: INPUT_ELEMENT_TYPES.RADIO })
      expect(isGenderInput(input)).toBe(true)
    })

    it('should not identify non-gender inputs', () => {
      const input = createTestInput({ label: 'Date of Birth', fieldType: INPUT_ELEMENT_TYPES.DATE })
      expect(isGenderInput(input)).toBe(false)
    })
  })

  describe('isVeteranStatusInput', () => {
    it('should identify veteran status inputs by label', () => {
      const input = createTestInput({
        label: 'Are you a veteran?',
        fieldType: INPUT_ELEMENT_TYPES.RADIO,
      })
      expect(isVeteranStatusInput(input)).toBe(true)
    })

    it('should identify military service inputs by name', () => {
      const input = createTestInput({
        name: 'military_service',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })
      expect(isVeteranStatusInput(input)).toBe(true)
    })

    it('should identify veteran preference inputs', () => {
      const input = createTestInput({
        placeholder: 'Veteran Preference',
        fieldType: INPUT_ELEMENT_TYPES.CHECKBOX,
      })
      expect(isVeteranStatusInput(input)).toBe(true)
    })
  })

  describe('isRaceEthnicityInput', () => {
    it('should identify race/ethnicity inputs by label', () => {
      const input = createTestInput({
        label: 'Race/Ethnicity',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })
      expect(isRaceEthnicityInput(input)).toBe(true)
    })

    it('should identify ethnicity inputs by name', () => {
      const input = createTestInput({
        name: 'ethnic_background',
        fieldType: INPUT_ELEMENT_TYPES.CHECKBOX,
      })
      expect(isRaceEthnicityInput(input)).toBe(true)
    })

    it('should identify multi-race selection inputs', () => {
      const input = createTestInput({
        label: 'Select all that apply (race/ethnicity)',
        fieldType: INPUT_ELEMENT_TYPES.CHECKBOX,
      })
      expect(isRaceEthnicityInput(input)).toBe(true)
    })
  })

  describe('isDisabilityInput', () => {
    it('should identify disability status inputs', () => {
      const input = createTestInput({
        label: 'Do you have a disability?',
        fieldType: INPUT_ELEMENT_TYPES.RADIO,
      })
      expect(isDisabilityInput(input)).toBe(true)
    })

    it('should identify accommodation request inputs', () => {
      const input = createTestInput({
        label: 'Request accommodation',
        fieldType: INPUT_ELEMENT_TYPES.CHECKBOX,
      })
      expect(isDisabilityInput(input)).toBe(true)
    })

    it('should identify disability type inputs', () => {
      const input = createTestInput({
        name: 'disability_type',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })
      expect(isDisabilityInput(input)).toBe(true)
    })
  })

  describe('isPhoneInput', () => {
    it('should identify phone inputs by type', () => {
      const input = createTestInput({ type: 'tel' })
      expect(isPhoneInput(input)).toBe(true)
    })

    it('should identify phone inputs by label', () => {
      const input = createTestInput({ label: 'Phone Number' })
      expect(isPhoneInput(input)).toBe(true)
    })

    it('should identify phone inputs by autocomplete', () => {
      const input = createTestInput({ autocomplete: 'tel' })
      expect(isPhoneInput(input)).toBe(true)
    })

    it('should identify mobile phone inputs', () => {
      const input = createTestInput({ name: 'mobile_phone' })
      expect(isPhoneInput(input)).toBe(true)
    })
  })

  describe('isLocationInput', () => {
    it('should identify country inputs', () => {
      const input = createTestInput({ label: 'Country', fieldType: INPUT_ELEMENT_TYPES.SELECT })
      expect(isLocationInput(input)).toBe(true)
      const input2 = createTestInput({
        autocomplete: 'country',
        fieldType: INPUT_ELEMENT_TYPES.TEXT,
      })
      expect(isLocationInput(input2)).toBe(true)
    })
    it('should identify city, state, postal code, and address inputs', () => {
      const city = createTestInput({ label: 'City' })
      const state = createTestInput({ label: 'State' })
      const postal = createTestInput({ label: 'Postal Code' })
      const address = createTestInput({ label: 'Address' })
      expect(isLocationInput(city)).toBe(true)
      expect(isLocationInput(state)).toBe(true)
      expect(isLocationInput(postal)).toBe(true)
      expect(isLocationInput(address)).toBe(true)
    })
    it('should identify location by autocomplete', () => {
      const input = createTestInput({ autocomplete: 'address-line1' })
      expect(isLocationInput(input)).toBe(true)
    })
    it('should not identify non-location fields', () => {
      const input = createTestInput({ label: 'Email Address' })
      expect(isLocationInput(input)).toBe(false)
    })
  })

  // Test for combination of patterns
  describe('Combination Tests', () => {
    it('should handle inputs with multiple identifying features', () => {
      const complexInput = createTestInput({
        label: 'Contact',
        name: 'user_phone',
        type: 'tel',
        placeholder: 'Enter phone number',
      })
      expect(isPhoneInput(complexInput)).toBe(true)
    })
  })

  describe('isAuthorizationInput', () => {
    it('should identify authorization to work in the US', () => {
      const input = createTestInput({ label: 'Are you legally authorized to work in the US?' })
      expect(isAuthorizationInput(input)).toBe(true)
    })

    it('should identify the specific user example', () => {
      const input = createTestInput({
        label: 'Are you legally authorized to work in the U.S. indefinitely?',
      })
      expect(isAuthorizationInput(input)).toBe(true)
    })

    it('should identify work authorization by name', () => {
      const input = createTestInput({ name: 'work_authorization' })
      expect(isAuthorizationInput(input)).toBe(true)
    })

    it('should identify various authorization patterns by label', () => {
      const labels = [
        'Authorized to work',
        'Legally authorized to work',
        'Are you authorized to work in the United States?',
        'Do you have authorization to work?',
        'Legal authorization to work',
        'Employment authorization',
        'Right to work',
        'Eligible to work in the US',
        'Legally permitted to work',
        'Work permit',
        'Employment eligibility',
        'Legally authorized to work indefinitely',
        'Authorized to work in the US indefinitely',
      ]

      labels.forEach((label) => {
        const input = createTestInput({ label })
        expect(isAuthorizationInput(input)).toBe(true)
      })
    })

    it('should identify authorization by name patterns', () => {
      const names = [
        'work_authorization',
        'legal_authorization',
        'employment_authorization',
        'authorized_work',
        'work_permit',
      ]

      names.forEach((name) => {
        const input = createTestInput({ name })
        expect(isAuthorizationInput(input)).toBe(true)
      })
    })

    it('should identify authorization by placeholder', () => {
      const placeholders = [
        'Are you legally authorized to work?',
        'Work authorization status',
        'Employment eligibility',
      ]

      placeholders.forEach((placeholder) => {
        const input = createTestInput({ placeholder })
        expect(isAuthorizationInput(input)).toBe(true)
      })
    })

    it('should identify authorization by wholeQuestionLabel', () => {
      const input = createTestInput({
        wholeQuestionLabel: 'Are you legally authorized to work in the United States indefinitely?',
      })
      expect(isAuthorizationInput(input)).toBe(true)
    })

    it('should not identify sponsorship questions as authorization', () => {
      const sponsorshipLabels = [
        'Do you now or will you in the future require sponsorship?',
        'Require immigration sponsorship',
        'Need visa sponsorship',
        'H-1B sponsorship required',
      ]

      sponsorshipLabels.forEach((label) => {
        const input = createTestInput({ label })
        expect(isAuthorizationInput(input)).toBe(false)
      })
    })

    it('should correctly differentiate between the specific user examples', () => {
      // This should be categorized as 'sponsorship'
      const sponsorshipInput = createTestInput({
        label:
          'Do you now, or will you in the future, require immigration sponsorship for work authorization (e.g., H-1B)? (If hired, verification will be required consistent with federal law.)*',
      })
      expect(isSponsorshipInput(sponsorshipInput)).toBe(true)
      expect(isAuthorizationInput(sponsorshipInput)).toBe(false)

      // This should be categorized as 'authorization'
      const authorizationInput = createTestInput({
        label: 'Are you legally authorized to work in the U.S. indefinitely?*',
      })
      expect(isAuthorizationInput(authorizationInput)).toBe(true)
      expect(isSponsorshipInput(authorizationInput)).toBe(false)
    })
  })

  describe('isSponsorshipInput', () => {
    it('should identify sponsorship requirement', () => {
      const input = createTestInput({ label: 'Do you now or in the future require sponsorship?' })
      expect(isSponsorshipInput(input)).toBe(true)
    })

    it('should identify the specific user example', () => {
      const input = createTestInput({
        label:
          'Do you now, or will you in the future, require immigration sponsorship for work authorization (e.g., H-1B)? (If hired, verification will be required consistent with federal law.)*',
      })
      expect(isSponsorshipInput(input)).toBe(true)
    })

    it('should identify various sponsorship patterns by label', () => {
      const labels = [
        'Require sponsorship',
        'Need sponsorship',
        'Require immigration sponsorship',
        'Need visa sponsorship',
        'Will you require sponsorship?',
        'Do you now or will you in the future require sponsorship?',
        'Do you require or will you require sponsorship?',
        'Immigration sponsorship',
        'Visa sponsorship',
        'H-1B sponsorship',
        'Sponsorship for work authorization',
        'Require immigration',
        'Need immigration',
        'Work visa required',
        'Employment visa needed',
        'Temporary work authorization',
        'H-1B required',
        'TN visa needed',
        'OPT status',
        'STEM OPT',
      ]

      labels.forEach((label) => {
        const input = createTestInput({ label })
        expect(isSponsorshipInput(input)).toBe(true)
      })
    })

    it('should identify sponsorship by name patterns', () => {
      const names = [
        'require_sponsorship',
        'need_sponsorship',
        'immigration_sponsorship',
        'visa_sponsorship',
        'h1b_required',
        'work_visa',
      ]

      names.forEach((name) => {
        const input = createTestInput({ name })
        expect(isSponsorshipInput(input)).toBe(true)
      })
    })

    it('should identify sponsorship by placeholder', () => {
      const placeholders = [
        'Do you require sponsorship?',
        'Sponsorship needed?',
        'Immigration sponsorship required',
      ]

      placeholders.forEach((placeholder) => {
        const input = createTestInput({ placeholder })
        expect(isSponsorshipInput(input)).toBe(true)
      })
    })

    it('should identify sponsorship by wholeQuestionLabel', () => {
      const input = createTestInput({
        wholeQuestionLabel:
          'Do you now, or will you in the future, require immigration sponsorship for work authorization (e.g., H-1B)?',
      })
      expect(isSponsorshipInput(input)).toBe(true)
    })

    it('should NOT identify authorization questions as sponsorship', () => {
      const authorizationLabels = [
        'Are you currently authorized to work?',
        'Are you legally authorized to work indefinitely?',
        'Authorized to work in the US indefinitely',
        'Currently authorized to work',
        'Presently authorized',
        'Permanent authorization',
        'Indefinite authorization',
        'Are you a US citizen?',
        'Do you have a green card?',
        'Permanent resident status',
      ]

      authorizationLabels.forEach((label) => {
        const input = createTestInput({ label })
        expect(isSponsorshipInput(input)).toBe(false)
      })
    })

    it('should handle regex patterns correctly', () => {
      const regexTestLabels = [
        'Will you require H-1B sponsorship?',
        'Need H1B visa?',
        'H_1B required',
        'Future require sponsorship for immigration',
        'Will need sponsorship in the future',
        'Require immigration assistance',
        'Need work visa support',
      ]

      regexTestLabels.forEach((label) => {
        const input = createTestInput({ label })
        expect(isSponsorshipInput(input)).toBe(true)
      })
    })

    it('should exclude current authorization when checking sponsorship', () => {
      // These should NOT be classified as sponsorship due to exclusion patterns
      const excludedLabels = [
        'Are you currently authorized to work and require sponsorship?', // Contains "currently authorized"
        'You are presently authorized but will you need sponsorship?', // Contains "presently authorized"
        'Authorized to work indefinitely or need sponsorship?', // Contains "authorized...indefinitely"
        'Do you have permanent authorization or require sponsorship?', // Contains "permanent authorization"
        'As a citizen, do you need sponsorship?', // Contains "citizen"
        'Permanent resident requiring sponsorship?', // Contains "permanent resident"
        'Green card holder needing sponsorship?', // Contains "green card"
      ]

      excludedLabels.forEach((label) => {
        const input = createTestInput({ label })
        expect(isSponsorshipInput(input)).toBe(false)
      })
    })

    it('should correctly differentiate between the specific user examples', () => {
      // This should be categorized as 'sponsorship'
      const sponsorshipInput = createTestInput({
        label:
          'Do you now, or will you in the future, require immigration sponsorship for work authorization (e.g., H-1B)? (If hired, verification will be required consistent with federal law.)*',
      })
      expect(isSponsorshipInput(sponsorshipInput)).toBe(true)
      expect(isAuthorizationInput(sponsorshipInput)).toBe(false)

      // This should be categorized as 'authorization'
      const authorizationInput = createTestInput({
        label: 'Are you legally authorized to work in the U.S. indefinitely?*',
      })
      expect(isAuthorizationInput(authorizationInput)).toBe(true)
      expect(isSponsorshipInput(authorizationInput)).toBe(false)
    })
  })

  describe('isSchoolInput', () => {
    it('should identify school/university', () => {
      const input = createTestInput({ label: 'School' })
      expect(isSchoolInput(input)).toBe(true)
      const input2 = createTestInput({ label: 'University' })
      expect(isSchoolInput(input2)).toBe(true)
    })
  })

  describe('isDegreeInput', () => {
    it('should identify degree', () => {
      const input = createTestInput({ label: 'Degree' })
      expect(isDegreeInput(input)).toBe(true)
    })
  })

  describe('isDisciplineInput', () => {
    it('should identify discipline/major', () => {
      const input = createTestInput({ label: 'Discipline' })
      expect(isDisciplineInput(input)).toBe(true)
      const input2 = createTestInput({ label: 'Major' })
      expect(isDisciplineInput(input2)).toBe(true)
    })
  })

  describe('isEndDateYearInput', () => {
    it('should identify end date year', () => {
      const input = createTestInput({ label: 'End date year' })
      expect(isEndDateYearInput(input)).toBe(true)
    })
  })

  describe('isLinkedInProfileInput', () => {
    it('should identify LinkedIn profile', () => {
      const input = createTestInput({ label: 'LinkedIn profile' })
      expect(isLinkedInProfileInput(input)).toBe(true)
    })
  })

  describe('isWebsiteInput', () => {
    it('should identify website inputs by type', () => {
      const input = createTestInput({ type: 'url', fieldType: INPUT_ELEMENT_TYPES.URL })
      expect(isWebsiteInput(input)).toBe(true)
    })
    it('should identify website inputs by label', () => {
      const input = createTestInput({ label: 'Personal Website' })
      expect(isWebsiteInput(input)).toBe(true)
    })
    it('should identify website inputs by name', () => {
      const input = createTestInput({ name: 'portfolio_url' })
      expect(isWebsiteInput(input)).toBe(true)
    })
    it('should identify website inputs by placeholder', () => {
      const input = createTestInput({ placeholder: 'Enter your homepage' })
      expect(isWebsiteInput(input)).toBe(true)
    })
    it('should identify website inputs by autocomplete', () => {
      const input = createTestInput({ autocomplete: 'url' })
      expect(isWebsiteInput(input)).toBe(true)
    })
    it('should not identify non-website inputs', () => {
      const input = createTestInput({ label: 'Email Address' })
      expect(isWebsiteInput(input)).toBe(false)
    })
  })

  describe('isTwitterUrlInput', () => {
    it('should identify twitter url by label', () => {
      const input = createTestInput({ label: 'Twitter URL' })
      expect(isTwitterUrlInput(input)).toBe(true)
    })
    it('should identify twitter url by name', () => {
      const input = createTestInput({ name: 'twitter_handle' })
      expect(isTwitterUrlInput(input)).toBe(true)
    })
    it('should identify twitter url by placeholder', () => {
      const input = createTestInput({ placeholder: 'Enter your Twitter profile' })
      expect(isTwitterUrlInput(input)).toBe(true)
    })
    it('should identify twitter url by autocomplete', () => {
      const input = createTestInput({ autocomplete: 'twitter' })
      expect(isTwitterUrlInput(input)).toBe(true)
    })
    it('should identify twitter url by type and name', () => {
      const input = createTestInput({ type: 'url', name: 'twitter' })
      expect(isTwitterUrlInput(input)).toBe(true)
    })
    it('should not identify non-twitter fields', () => {
      const input = createTestInput({ label: 'LinkedIn' })
      expect(isTwitterUrlInput(input)).toBe(false)
    })
  })

  describe('isGithubUrlInput', () => {
    it('should identify github url by label', () => {
      const input = createTestInput({ label: 'GitHub URL' })
      expect(isGithubUrlInput(input)).toBe(true)
    })
    it('should identify github url by name', () => {
      const input = createTestInput({ name: 'github_profile' })
      expect(isGithubUrlInput(input)).toBe(true)
    })
    it('should identify github url by placeholder', () => {
      const input = createTestInput({ placeholder: 'Enter your GitHub handle' })
      expect(isGithubUrlInput(input)).toBe(true)
    })
    it('should identify github url by autocomplete', () => {
      const input = createTestInput({ autocomplete: 'github-url' })
      expect(isGithubUrlInput(input)).toBe(true)
    })
    it('should identify github url by type and name', () => {
      const input = createTestInput({ type: 'url', name: 'github' })
      expect(isGithubUrlInput(input)).toBe(true)
    })
    it('should not identify non-github fields', () => {
      const input = createTestInput({ label: 'Portfolio' })
      expect(isGithubUrlInput(input)).toBe(false)
    })
  })

  describe('isCurrentCompanyInput', () => {
    it('should identify current company by label', () => {
      const input = createTestInput({ label: 'Current Company' })
      expect(isCurrentCompanyInput(input)).toBe(true)
    })
    it('should identify current company by name', () => {
      const input = createTestInput({ name: 'employer_name' })
      expect(isCurrentCompanyInput(input)).toBe(true)
    })
    it('should identify current company by placeholder', () => {
      const input = createTestInput({ placeholder: 'Enter your present employer' })
      expect(isCurrentCompanyInput(input)).toBe(true)
    })
    it('should identify current company by autocomplete', () => {
      const input = createTestInput({ autocomplete: 'organization' })
      expect(isCurrentCompanyInput(input)).toBe(true)
    })
    it('should not identify non-company fields', () => {
      const input = createTestInput({ label: 'School' })
      expect(isCurrentCompanyInput(input)).toBe(false)
    })
  })

  describe('isLocationInput for current location fields', () => {
    it('should identify current location by label', () => {
      const input = createTestInput({ label: 'Current Location' })
      expect(isLocationInput(input)).toBe(true)
    })
    it('should identify current location by name', () => {
      const input = createTestInput({ name: 'current_city' })
      expect(isLocationInput(input)).toBe(true)
    })
    it('should identify current location by placeholder', () => {
      const input = createTestInput({ placeholder: 'Where do you live?' })
      expect(isLocationInput(input)).toBe(true)
    })
    it('should identify current location by autocomplete', () => {
      const input = createTestInput({ autocomplete: 'city' })
      expect(isLocationInput(input)).toBe(true)
    })
    it('should not identify non-location fields', () => {
      const input = createTestInput({ label: 'Mailing Address' })
      expect(isLocationInput(input)).toBe(true)
    })
  })

  describe('isOtherWebsiteInput', () => {
    it('should identify other website by label', () => {
      const input = createTestInput({ label: 'Other Website' })
      expect(isOtherWebsiteInput(input)).toBe(true)
      expect(isWebsiteInput(input)).toBe(false)
    })
    it('should identify other website by name', () => {
      const input = createTestInput({ name: 'secondary_website' })
      expect(isOtherWebsiteInput(input)).toBe(true)
      expect(isWebsiteInput(input)).toBe(false)
    })
    it('should identify other website by placeholder', () => {
      const input = createTestInput({ placeholder: 'Enter your alternate website' })
      expect(isOtherWebsiteInput(input)).toBe(true)
      expect(isWebsiteInput(input)).toBe(false)
    })
    it('should not match regular website fields', () => {
      const input = createTestInput({ label: 'Personal Website' })
      expect(isOtherWebsiteInput(input)).toBe(false)
      expect(isWebsiteInput(input)).toBe(true)
    })
  })

  describe('isSalaryExpectationsInput', () => {
    it('should identify salary expectations by exact label match', () => {
      const input = createTestInput({ label: 'What are your salary expectations for this role?' })
      expect(isSalaryExpectationsInput(input)).toBe(true)
    })

    it('should identify salary expectations with core patterns', () => {
      const corePatterns = [
        'Salary Expectations',
        'Expected Salary',
        'Desired Salary',
        'Salary Requirements',
        'Compensation Expectations',
        'Pay Expectations',
        'Wage Expectations',
        'Salary Range',
        'Expected Compensation',
        'Hourly Rate',
        'Annual Salary',
        'Starting Salary',
        'Target Salary',
      ]

      corePatterns.forEach((pattern) => {
        const input = createTestInput({ label: pattern })
        expect(isSalaryExpectationsInput(input), `Failed for pattern: ${pattern}`).toBe(true)
      })
    })

    it('should identify salary expectations by name attribute', () => {
      const namePatterns = [
        'salary_expectations',
        'expected_salary',
        'desired_salary',
        'compensation_expectations',
        'salary-range',
        'hourly-rate',
        'annual-salary',
        'starting-salary',
      ]

      namePatterns.forEach((pattern) => {
        const input = createTestInput({ name: pattern })
        expect(isSalaryExpectationsInput(input), `Failed for name: ${pattern}`).toBe(true)
      })
    })

    it('should identify salary expectations by placeholder', () => {
      const placeholderPatterns = [
        'Enter your salary expectations',
        'Expected compensation range',
        'Desired hourly rate',
        'Target annual salary',
      ]

      placeholderPatterns.forEach((pattern) => {
        const input = createTestInput({ placeholder: pattern })
        expect(isSalaryExpectationsInput(input), `Failed for placeholder: ${pattern}`).toBe(true)
      })
    })

    it('should identify salary expectations by autocomplete', () => {
      const autocompletePatterns = ['salary', 'compensation', 'wage', 'pay']

      autocompletePatterns.forEach((pattern) => {
        const input = createTestInput({ autocomplete: pattern })
        expect(isSalaryExpectationsInput(input), `Failed for autocomplete: ${pattern}`).toBe(true)
      })
    })

    it('should work with different field types', () => {
      const textInput = createTestInput({
        label: 'Salary Expectations',
        fieldType: INPUT_ELEMENT_TYPES.TEXT,
      })
      const numberInput = createTestInput({
        label: 'Expected Salary',
        fieldType: INPUT_ELEMENT_TYPES.NUMBER,
      })
      const selectInput = createTestInput({
        label: 'Salary Range',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })

      expect(isSalaryExpectationsInput(textInput)).toBe(true)
      expect(isSalaryExpectationsInput(numberInput)).toBe(true)
      expect(isSalaryExpectationsInput(selectInput)).toBe(true)
    })

    it('should handle case insensitive matching', () => {
      const input1 = createTestInput({ label: 'SALARY EXPECTATIONS' })
      const input2 = createTestInput({ label: 'salary expectations' })
      const input3 = createTestInput({ label: 'Salary Expectations' })

      expect(isSalaryExpectationsInput(input1)).toBe(true)
      expect(isSalaryExpectationsInput(input2)).toBe(true)
      expect(isSalaryExpectationsInput(input3)).toBe(true)
    })

    it('should not identify non-salary fields', () => {
      const nonSalaryInputs = [
        createTestInput({ label: 'Email Address' }),
        createTestInput({ label: 'Phone Number' }),
        createTestInput({ label: 'Years of Experience' }),
        createTestInput({ label: 'Previous Company' }),
        createTestInput({ label: 'Education Level' }),
      ]

      nonSalaryInputs.forEach((input) => {
        expect(isSalaryExpectationsInput(input)).toBe(false)
      })
    })

    it('should not work with unsupported field types', () => {
      const unsupportedInput = createTestInput({
        label: 'Salary Expectations',
        fieldType: INPUT_ELEMENT_TYPES.EMAIL,
      })
      expect(isSalaryExpectationsInput(unsupportedInput)).toBe(false)
    })
  })

  describe('isPositionDiscoverySourceInput', () => {
    it('should identify position discovery source by exact label match', () => {
      const input1 = createTestInput({ label: 'How did you find out about this position?' })
      const input2 = createTestInput({
        label:
          'List the specific source where you learned about this position (ex. Job posting on Indeed, Google search)',
      })

      expect(isPositionDiscoverySourceInput(input1)).toBe(true)
      expect(isPositionDiscoverySourceInput(input2)).toBe(true)
    })

    it('should identify position discovery source with core question patterns', () => {
      const questionPatterns = [
        'How did you find out about this position?',
        'How did you hear about this job?',
        'How did you learn about this role?',
        'How did you discover this opportunity?',
        'Where did you find this position?',
        'Where did you hear about this job?',
        'Where did you learn about this role?',
      ]

      questionPatterns.forEach((pattern) => {
        const input = createTestInput({ label: pattern })
        expect(isPositionDiscoverySourceInput(input), `Failed for pattern: ${pattern}`).toBe(true)
      })
    })

    it('should identify position discovery source with source-focused patterns', () => {
      const sourcePatterns = [
        'Source of Position',
        'Referral Source',
        'Job Source',
        'Application Source',
        'Position Source',
        'Job Posting Source',
        'Discovery Source',
        'Learned about this position',
        'Found this position',
        'Heard about this position',
      ]

      sourcePatterns.forEach((pattern) => {
        const input = createTestInput({ label: pattern })
        expect(isPositionDiscoverySourceInput(input), `Failed for pattern: ${pattern}`).toBe(true)
      })
    })

    it('should identify position discovery source by name attribute', () => {
      const namePatterns = [
        'referral_source',
        'job_source',
        'application_source',
        'discovery_source',
        'position-source',
        'job-source',
        'referral-source',
      ]

      namePatterns.forEach((pattern) => {
        const input = createTestInput({ name: pattern })
        expect(isPositionDiscoverySourceInput(input), `Failed for name: ${pattern}`).toBe(true)
      })
    })

    it('should identify position discovery source by placeholder', () => {
      const placeholderPatterns = [
        'How did you hear about us?',
        'Where did you find this job?',
        'How you discovered this position',
        'Enter how you discovered this position',
      ]

      placeholderPatterns.forEach((pattern) => {
        const input = createTestInput({ placeholder: pattern })
        expect(isPositionDiscoverySourceInput(input), `Failed for placeholder: ${pattern}`).toBe(
          true,
        )
      })
    })

    it('should identify position discovery source by autocomplete', () => {
      const autocompletePatterns = [
        'referral-source',
        'job-source',
        'application-source',
        'discovery-source',
      ]

      autocompletePatterns.forEach((pattern) => {
        const input = createTestInput({ autocomplete: pattern })
        expect(isPositionDiscoverySourceInput(input), `Failed for autocomplete: ${pattern}`).toBe(
          true,
        )
      })
    })

    it('should work with different field types', () => {
      const textInput = createTestInput({
        label: 'How did you find out about this position?',
        fieldType: INPUT_ELEMENT_TYPES.TEXT,
      })
      const selectInput = createTestInput({
        label: 'Source of Position',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })
      const textboxInput = createTestInput({
        label: 'Referral Source',
        fieldType: INPUT_ELEMENT_TYPES.TEXTBOX,
      })

      expect(isPositionDiscoverySourceInput(textInput)).toBe(true)
      expect(isPositionDiscoverySourceInput(selectInput)).toBe(true)
      expect(isPositionDiscoverySourceInput(textboxInput)).toBe(true)
    })

    it('should handle regex patterns for flexible matching', () => {
      const regexTestCases = [
        'How do you find this position?',
        'How did you hear about the position?',
        'How did you learn about our position?',
        'How did you discover the available position?',
        'Where did you learn about this position?',
        'What source led you to this position?',
        'Which position source brought you here?',
      ]

      regexTestCases.forEach((testCase) => {
        const input = createTestInput({ label: testCase })
        expect(isPositionDiscoverySourceInput(input), `Failed for regex case: ${testCase}`).toBe(
          true,
        )
      })
    })

    it('should handle case insensitive matching', () => {
      const input1 = createTestInput({ label: 'HOW DID YOU FIND OUT ABOUT THIS POSITION?' })
      const input2 = createTestInput({ label: 'how did you find out about this position?' })
      const input3 = createTestInput({ label: 'How Did You Find Out About This Position?' })

      expect(isPositionDiscoverySourceInput(input1)).toBe(true)
      expect(isPositionDiscoverySourceInput(input2)).toBe(true)
      expect(isPositionDiscoverySourceInput(input3)).toBe(true)
    })

    it('should not identify non-discovery source fields', () => {
      const nonDiscoveryInputs = [
        createTestInput({ label: 'Email Address' }),
        createTestInput({ label: 'Phone Number' }),
        createTestInput({ label: 'Years of Experience' }),
        createTestInput({ label: 'Previous Position' }),
        createTestInput({ label: 'Education Source' }),
        createTestInput({ label: 'Reference Source' }), // This could be ambiguous but should not match
      ]

      nonDiscoveryInputs.forEach((input) => {
        expect(isPositionDiscoverySourceInput(input)).toBe(false)
      })
    })

    it('should not work with unsupported field types', () => {
      const unsupportedInput = createTestInput({
        label: 'How did you find out about this position?',
        fieldType: INPUT_ELEMENT_TYPES.EMAIL,
      })
      expect(isPositionDiscoverySourceInput(unsupportedInput)).toBe(false)
    })
  })

  describe('isPronounsInput', () => {
    it('should identify pronouns inputs by exact label matches', () => {
      const input1 = createTestInput({ label: 'What are your pronouns?' })
      const input2 = createTestInput({ label: 'Pronouns' })

      expect(isPronounsInput(input1)).toBe(true)
      expect(isPronounsInput(input2)).toBe(true)
    })

    it('should identify pronouns with core patterns', () => {
      const corePatterns = [
        'Pronouns',
        'Preferred Pronouns',
        'Your Pronouns',
        'Personal Pronouns',
        'Pronoun',
        'Preferred Pronoun',
        'Gender Pronouns',
        'Pronouns (Optional)',
        'Pronouns Optional',
        'Preferred Gender Pronouns',
        'Pronoun Preference',
        'Pronoun Preferences',
      ]

      corePatterns.forEach((pattern) => {
        const input = createTestInput({ label: pattern })
        expect(isPronounsInput(input), `Failed for pattern: ${pattern}`).toBe(true)
      })
    })

    it('should identify pronouns by name attribute', () => {
      const namePatterns = [
        'pronouns',
        'preferred_pronouns',
        'personal_pronouns',
        'gender_pronouns',
        'pronoun_preference',
        'pronoun-preferences',
        'preferred-pronouns',
      ]

      namePatterns.forEach((pattern) => {
        const input = createTestInput({ name: pattern })
        expect(isPronounsInput(input), `Failed for name: ${pattern}`).toBe(true)
      })
    })

    it('should identify pronouns by placeholder', () => {
      const placeholderPatterns = [
        'Enter your pronouns',
        'Your preferred pronouns',
        'Select pronouns',
        'Pronoun preference',
      ]

      placeholderPatterns.forEach((pattern) => {
        const input = createTestInput({ placeholder: pattern })
        expect(isPronounsInput(input), `Failed for placeholder: ${pattern}`).toBe(true)
      })
    })

    it('should identify pronouns by autocomplete', () => {
      const autocompletePatterns = [
        'pronouns',
        'preferred-pronouns',
        'gender-pronouns',
        'personal-pronouns',
      ]

      autocompletePatterns.forEach((pattern) => {
        const input = createTestInput({ autocomplete: pattern })
        expect(isPronounsInput(input), `Failed for autocomplete: ${pattern}`).toBe(true)
      })
    })

    it('should work with different field types', () => {
      const textInput = createTestInput({
        label: 'Pronouns',
        fieldType: INPUT_ELEMENT_TYPES.TEXT,
      })
      const selectInput = createTestInput({
        label: 'Preferred Pronouns',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })
      const radioInput = createTestInput({
        label: 'Your Pronouns',
        fieldType: INPUT_ELEMENT_TYPES.RADIO,
      })

      expect(isPronounsInput(textInput)).toBe(true)
      expect(isPronounsInput(selectInput)).toBe(true)
      expect(isPronounsInput(radioInput)).toBe(true)
    })

    it('should handle case insensitive matching', () => {
      const input1 = createTestInput({ label: 'PRONOUNS' })
      const input2 = createTestInput({ label: 'pronouns' })
      const input3 = createTestInput({ label: 'Pronouns' })

      expect(isPronounsInput(input1)).toBe(true)
      expect(isPronounsInput(input2)).toBe(true)
      expect(isPronounsInput(input3)).toBe(true)
    })

    it('should not identify non-pronouns fields', () => {
      const nonPronounsInputs = [
        createTestInput({ label: 'Email Address' }),
        createTestInput({ label: 'Phone Number' }),
        createTestInput({ label: 'Gender' }),
        createTestInput({ label: 'Name' }),
        createTestInput({ label: 'Title' }),
      ]

      nonPronounsInputs.forEach((input) => {
        expect(isPronounsInput(input)).toBe(false)
      })
    })

    it('should not work with unsupported field types', () => {
      const unsupportedInput = createTestInput({
        label: 'Pronouns',
        fieldType: INPUT_ELEMENT_TYPES.EMAIL,
      })
      expect(isPronounsInput(unsupportedInput)).toBe(false)
    })
  })

  describe('isCurrentJobTitleInput', () => {
    it('should identify current job title by exact label matches', () => {
      const input1 = createTestInput({ label: 'Current Title' })
      const input2 = createTestInput({ label: 'Title' })

      expect(isCurrentJobTitleInput(input1)).toBe(true)
      expect(isCurrentJobTitleInput(input2)).toBe(true)
    })

    it('should identify job title with core patterns', () => {
      const corePatterns = [
        'Current Title',
        'Job Title',
        'Position Title',
        'Current Position',
        'Current Role',
        'Role',
        'Position',
        'Title',
        'Your Title',
        'Your Current Title',
        'Your Position',
        'Your Role',
        'Current Job Title',
        'Present Title',
        'Present Position',
        'Present Role',
        'Work Title',
        'Employment Title',
        'Professional Title',
      ]

      corePatterns.forEach((pattern) => {
        const input = createTestInput({ label: pattern })
        expect(isCurrentJobTitleInput(input), `Failed for pattern: ${pattern}`).toBe(true)
      })
    })

    it('should identify job title by name attribute', () => {
      const namePatterns = [
        'current_title',
        'job_title',
        'position_title',
        'current_position',
        'current_role',
        'current-job-title',
        'present-title',
        'work-title',
        'employment-title',
        'professional-title',
      ]

      namePatterns.forEach((pattern) => {
        const input = createTestInput({ name: pattern })
        expect(isCurrentJobTitleInput(input), `Failed for name: ${pattern}`).toBe(true)
      })
    })

    it('should identify job title by placeholder', () => {
      const placeholderPatterns = [
        'Enter your current title',
        'Your job title',
        'Current position',
        'What is your role?',
      ]

      placeholderPatterns.forEach((pattern) => {
        const input = createTestInput({ placeholder: pattern })
        expect(isCurrentJobTitleInput(input), `Failed for placeholder: ${pattern}`).toBe(true)
      })
    })

    it('should identify job title by autocomplete', () => {
      const autocompletePatterns = [
        'job-title',
        'position',
        'role',
        'title',
        'current-title',
        'current-position',
      ]

      autocompletePatterns.forEach((pattern) => {
        const input = createTestInput({ autocomplete: pattern })
        expect(isCurrentJobTitleInput(input), `Failed for autocomplete: ${pattern}`).toBe(true)
      })
    })

    it('should work with different field types', () => {
      const textInput = createTestInput({
        label: 'Current Title',
        fieldType: INPUT_ELEMENT_TYPES.TEXT,
      })
      const selectInput = createTestInput({
        label: 'Job Title',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })

      expect(isCurrentJobTitleInput(textInput)).toBe(true)
      expect(isCurrentJobTitleInput(selectInput)).toBe(true)
    })

    it('should exclude non-job related titles', () => {
      const excludedInputs = [
        createTestInput({ label: 'Page Title' }),
        createTestInput({ label: 'Document Title' }),
        createTestInput({ label: 'Website Title' }),
        createTestInput({ label: 'Article Title' }),
        createTestInput({ label: 'Book Title' }),
        createTestInput({ label: 'Mr.' }),
        createTestInput({ label: 'Dr.' }),
        createTestInput({ label: 'Honorific' }),
      ]

      excludedInputs.forEach((input) => {
        expect(isCurrentJobTitleInput(input)).toBe(false)
      })
    })

    it('should handle case insensitive matching', () => {
      const input1 = createTestInput({ label: 'CURRENT TITLE' })
      const input2 = createTestInput({ label: 'current title' })
      const input3 = createTestInput({ label: 'Current Title' })

      expect(isCurrentJobTitleInput(input1)).toBe(true)
      expect(isCurrentJobTitleInput(input2)).toBe(true)
      expect(isCurrentJobTitleInput(input3)).toBe(true)
    })

    it('should not work with unsupported field types', () => {
      const unsupportedInput = createTestInput({
        label: 'Current Title',
        fieldType: INPUT_ELEMENT_TYPES.EMAIL,
      })
      expect(isCurrentJobTitleInput(unsupportedInput)).toBe(false)
    })
  })

  describe('isReferralSourceInput', () => {
    it('should identify referral source by exact label matches', () => {
      const input1 = createTestInput({
        label:
          "If you were referred by a current employee of Ziff Davis (or one of our brands), please list the employee's full name here:",
      })
      const input2 = createTestInput({ label: 'Who referred you to this job' })

      expect(isReferralSourceInput(input1)).toBe(true)
      expect(isReferralSourceInput(input2)).toBe(true)
    })

    it('should identify referral source with core patterns', () => {
      const corePatterns = [
        'Referred By',
        'Who Referred You',
        'Who Referred',
        'Referral',
        'Referrer',
        'Referring Employee',
        'Employee Referral',
        'Referred by Employee',
        'Referred by Current Employee',
        'Employee Who Referred',
        'Name of Referrer',
        'Referral Name',
        'Referred by a Current Employee',
        'If You Were Referred',
        'List the Employee',
        "Employee's Full Name",
        'Current Employee of',
        'Referred to This Job',
        'Referred You to This Position',
        'Employee Reference',
        'Internal Referral',
        'Staff Referral',
        'Team Member Referral',
      ]

      corePatterns.forEach((pattern) => {
        const input = createTestInput({ label: pattern })
        expect(isReferralSourceInput(input), `Failed for pattern: ${pattern}`).toBe(true)
      })
    })

    it('should identify referral source by name attribute', () => {
      const namePatterns = [
        'referred_by',
        'who_referred',
        'employee_referral',
        'referral_name',
        'referring_employee',
        'internal_referral',
        'staff_referral',
        'team-member-referral',
        'employee-reference',
      ]

      namePatterns.forEach((pattern) => {
        const input = createTestInput({ name: pattern })
        expect(isReferralSourceInput(input), `Failed for name: ${pattern}`).toBe(true)
      })
    })

    it('should identify referral source by placeholder', () => {
      const placeholderPatterns = [
        'Enter name of referring employee',
        'Who referred you?',
        'Employee referral name',
        'Name of person who referred you',
      ]

      placeholderPatterns.forEach((pattern) => {
        const input = createTestInput({ placeholder: pattern })
        expect(isReferralSourceInput(input), `Failed for placeholder: ${pattern}`).toBe(true)
      })
    })

    it('should identify referral source by autocomplete', () => {
      const autocompletePatterns = ['referral', 'referrer', 'employee-referral', 'referred-by']

      autocompletePatterns.forEach((pattern) => {
        const input = createTestInput({ autocomplete: pattern })
        expect(isReferralSourceInput(input), `Failed for autocomplete: ${pattern}`).toBe(true)
      })
    })

    it('should work with different field types', () => {
      const textInput = createTestInput({
        label: 'Referred By',
        fieldType: INPUT_ELEMENT_TYPES.TEXT,
      })
      const selectInput = createTestInput({
        label: 'Employee Referral',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })
      const textboxInput = createTestInput({
        label: 'Who Referred You',
        fieldType: INPUT_ELEMENT_TYPES.TEXTBOX,
      })

      expect(isReferralSourceInput(textInput)).toBe(true)
      expect(isReferralSourceInput(selectInput)).toBe(true)
      expect(isReferralSourceInput(textboxInput)).toBe(true)
    })

    it('should handle complex referral text', () => {
      const complexPatterns = [
        'If you were referred by someone at our company, please provide their name',
        'List the full name of the current employee who referred you',
        'Please provide the name of the employee who referred you to this position',
        'Enter the name of the team member who referred you',
      ]

      complexPatterns.forEach((pattern) => {
        const input = createTestInput({ label: pattern })
        expect(isReferralSourceInput(input), `Failed for complex pattern: ${pattern}`).toBe(true)
      })
    })

    it('should handle case insensitive matching', () => {
      const input1 = createTestInput({ label: 'REFERRED BY' })
      const input2 = createTestInput({ label: 'referred by' })
      const input3 = createTestInput({ label: 'Referred By' })

      expect(isReferralSourceInput(input1)).toBe(true)
      expect(isReferralSourceInput(input2)).toBe(true)
      expect(isReferralSourceInput(input3)).toBe(true)
    })

    it('should not identify non-referral fields', () => {
      const nonReferralInputs = [
        createTestInput({ label: 'Email Address' }),
        createTestInput({ label: 'Phone Number' }),
        createTestInput({ label: 'How did you find this position?' }), // This is position discovery, not referral
        createTestInput({ label: 'Reference Name' }), // Too generic
        createTestInput({ label: 'Emergency Contact' }),
      ]

      nonReferralInputs.forEach((input) => {
        expect(isReferralSourceInput(input)).toBe(false)
      })
    })

    it('should not work with unsupported field types', () => {
      const unsupportedInput = createTestInput({
        label: 'Referred By',
        fieldType: INPUT_ELEMENT_TYPES.EMAIL,
      })
      expect(isReferralSourceInput(unsupportedInput)).toBe(false)
    })
  })
})
