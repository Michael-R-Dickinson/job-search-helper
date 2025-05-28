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
} from '../inputCategoryPredicates'
import { INPUT_TYPES } from '../categorizeInputs'

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
      fieldType: INPUT_TYPES.TEXT,
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
      const input = createTestInput({ label: 'Gender', fieldType: INPUT_TYPES.SELECT })
      expect(isGenderInput(input)).toBe(true)
    })

    it('should identify sex inputs by name', () => {
      const input = createTestInput({ name: 'sex', fieldType: INPUT_TYPES.RADIO })
      expect(isGenderInput(input)).toBe(true)
    })

    it('should not identify non-gender inputs', () => {
      const input = createTestInput({ label: 'Date of Birth', fieldType: INPUT_TYPES.DATE })
      expect(isGenderInput(input)).toBe(false)
    })
  })

  describe('isVeteranStatusInput', () => {
    it('should identify veteran status inputs by label', () => {
      const input = createTestInput({
        label: 'Are you a veteran?',
        fieldType: INPUT_TYPES.RADIO,
      })
      expect(isVeteranStatusInput(input)).toBe(true)
    })

    it('should identify military service inputs by name', () => {
      const input = createTestInput({
        name: 'military_service',
        fieldType: INPUT_TYPES.SELECT,
      })
      expect(isVeteranStatusInput(input)).toBe(true)
    })

    it('should identify veteran preference inputs', () => {
      const input = createTestInput({
        placeholder: 'Veteran Preference',
        fieldType: INPUT_TYPES.CHECKBOX,
      })
      expect(isVeteranStatusInput(input)).toBe(true)
    })
  })

  describe('isRaceEthnicityInput', () => {
    it('should identify race/ethnicity inputs by label', () => {
      const input = createTestInput({
        label: 'Race/Ethnicity',
        fieldType: INPUT_TYPES.SELECT,
      })
      expect(isRaceEthnicityInput(input)).toBe(true)
    })

    it('should identify ethnicity inputs by name', () => {
      const input = createTestInput({
        name: 'ethnic_background',
        fieldType: INPUT_TYPES.CHECKBOX,
      })
      expect(isRaceEthnicityInput(input)).toBe(true)
    })

    it('should identify multi-race selection inputs', () => {
      const input = createTestInput({
        label: 'Select all that apply (race/ethnicity)',
        fieldType: INPUT_TYPES.CHECKBOX,
      })
      expect(isRaceEthnicityInput(input)).toBe(true)
    })
  })

  describe('isDisabilityInput', () => {
    it('should identify disability status inputs', () => {
      const input = createTestInput({
        label: 'Do you have a disability?',
        fieldType: INPUT_TYPES.RADIO,
      })
      expect(isDisabilityInput(input)).toBe(true)
    })

    it('should identify accommodation request inputs', () => {
      const input = createTestInput({
        label: 'Request accommodation',
        fieldType: INPUT_TYPES.CHECKBOX,
      })
      expect(isDisabilityInput(input)).toBe(true)
    })

    it('should identify disability type inputs', () => {
      const input = createTestInput({
        name: 'disability_type',
        fieldType: INPUT_TYPES.SELECT,
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
        fieldType: INPUT_TYPES.SELECT,
      })
      expect(isCountryInput(input)).toBe(true)
    })

    it('should identify nationality inputs', () => {
      const input = createTestInput({
        name: 'nationality',
        fieldType: INPUT_TYPES.SELECT,
      })
      expect(isCountryInput(input)).toBe(true)
    })

    it('should identify country inputs by autocomplete', () => {
      const input = createTestInput({
        autocomplete: 'country',
        fieldType: INPUT_TYPES.TEXT,
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
})
