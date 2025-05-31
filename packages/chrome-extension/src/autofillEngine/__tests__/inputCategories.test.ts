import { describe, it, expect } from 'vitest'
import {
  isNameInput,
  isEmailInput,
  isGenderInput,
  isVeteranStatusInput,
  isRaceEthnicityInput,
  isDisabilityInput,
  isPhoneInput,
  isCountryInput,
  isAuthorizationInput,
  isSponsorshipInput,
  isMailingAddressInput,
  isSchoolInput,
  isDegreeInput,
  isDisciplineInput,
  isEndDateYearInput,
  isLinkedInProfileInput,
  isWebsiteInput,
  isTwitterUrlInput,
  isGithubUrlInput,
  isCurrentCompanyInput,
  isCurrentLocationInput,
  isOtherWebsiteInput,
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

  describe('isCountryInput', () => {
    it('should identify country inputs by label', () => {
      const input = createTestInput({
        label: 'Country of Residence',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })
      expect(isCountryInput(input)).toBe(true)
    })

    it('should identify nationality inputs', () => {
      const input = createTestInput({
        name: 'nationality',
        fieldType: INPUT_ELEMENT_TYPES.SELECT,
      })
      expect(isCountryInput(input)).toBe(true)
    })

    it('should identify country inputs by autocomplete', () => {
      const input = createTestInput({
        autocomplete: 'country',
        fieldType: INPUT_ELEMENT_TYPES.TEXT,
      })
      expect(isCountryInput(input)).toBe(true)
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
    it('should identify work authorization by name', () => {
      const input = createTestInput({ name: 'work_authorization' })
      expect(isAuthorizationInput(input)).toBe(true)
    })
  })

  describe('isSponsorshipInput', () => {
    it('should identify sponsorship requirement', () => {
      const input = createTestInput({ label: 'Do you now or in the future require sponsorship?' })
      expect(isSponsorshipInput(input)).toBe(true)
    })
  })

  describe('isMailingAddressInput', () => {
    it('should identify current mailing address', () => {
      const input = createTestInput({ label: 'Current mailing address*' })
      expect(isMailingAddressInput(input)).toBe(true)
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

  describe('isCurrentLocationInput', () => {
    it('should identify current location by label', () => {
      const input = createTestInput({ label: 'Current Location' })
      expect(isCurrentLocationInput(input)).toBe(true)
    })
    it('should identify current location by name', () => {
      const input = createTestInput({ name: 'current_city' })
      expect(isCurrentLocationInput(input)).toBe(true)
    })
    it('should identify current location by placeholder', () => {
      const input = createTestInput({ placeholder: 'Where do you live?' })
      expect(isCurrentLocationInput(input)).toBe(true)
    })
    it('should identify current location by autocomplete', () => {
      const input = createTestInput({ autocomplete: 'city' })
      expect(isCurrentLocationInput(input)).toBe(true)
    })
    it('should not identify non-location fields', () => {
      const input = createTestInput({ label: 'Mailing Address' })
      expect(isCurrentLocationInput(input)).toBe(false)
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
})
