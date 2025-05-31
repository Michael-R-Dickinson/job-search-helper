import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CategorizedInput } from '../schema'
import {
  GenderEnum,
  VeteranStatusEnum,
  RaceEthnicityEnum,
  HispanicLatinoEnum,
  DisabilityStatusEnum,
  AuthorizationStatusEnum,
} from '../schema'
import getHandlerForInputCategory from '../inputTypeHandlers'
import { saveUserAutofillValue } from '../../firebase/realtimeDB'

// Mock saveUserAutofillValue
vi.mock('../../firebase/realtimeDB', () => ({
  saveUserAutofillValue: vi.fn(),
}))

const baseElement = (
  overrides: Partial<CategorizedInput['element']> = {},
): CategorizedInput['element'] => ({
  label: 'Test',
  html: '<input>',
  fieldType: 'text',
  name: 'test',
  type: 'text',
  placeholder: '',
  autocomplete: '',
  id: 'test',
  className: '',
  value: '',
  required: false,
  elementReferenceId: 'af-123',
  ...overrides,
})

const baseInput = (overrides: Partial<CategorizedInput>): CategorizedInput => {
  const { element, ...rest } = overrides
  return {
    category: 'unknown',
    label: 'Test',
    element: baseElement(element),
    ...rest,
  }
}

describe('InputTypeHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('skips unknown category', () => {
    const handler = getHandlerForInputCategory('unknown', {})
    const input = baseInput({ category: 'unknown' })
    expect(handler.getAutofillInstruction(input)).toEqual({ action: 'skip', id: 'af-123' })
  })

  it('handles name fields', () => {
    const handler = getHandlerForInputCategory('name', {
      name: { first_name: 'Alice', last_name: 'Smith' },
    })
    const firstInput = baseInput({
      category: 'name',
      label: 'First Name',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-1' }) },
    })
    const lastInput = baseInput({
      category: 'name',
      label: 'Last Name',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-2' }) },
    })
    expect(handler.getAutofillInstruction(firstInput)).toEqual({
      action: 'fill',
      value: 'Alice',
      id: 'af-1',
    })
    expect(handler.getAutofillInstruction(lastInput)).toEqual({
      action: 'fill',
      value: 'Smith',
      id: 'af-2',
    })
  })

  it('handles email', () => {
    const handler = getHandlerForInputCategory('email', { email: 'a@b.com' })
    const input = baseInput({
      category: 'email',
      element: { ...baseElement({ fieldType: 'email', elementReferenceId: 'af-3' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: 'a@b.com',
      id: 'af-3',
    })
    handler.saveAutofillValue(input, 'user1')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user1', 'email', '')
  })

  it('handles gender for all field types', () => {
    const handler = getHandlerForInputCategory('gender', { gender: GenderEnum.enum.female })
    const textInput = baseInput({
      category: 'gender',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-4' }) },
    })
    const selectInput = baseInput({
      category: 'gender',
      element: { ...baseElement({ fieldType: 'select', elementReferenceId: 'af-5' }) },
    })
    const radioInput = baseInput({
      category: 'gender',
      element: { ...baseElement({ fieldType: 'radio', elementReferenceId: 'af-6' }) },
    })
    const checkboxInput = baseInput({
      category: 'gender',
      element: { ...baseElement({ fieldType: 'checkbox', elementReferenceId: 'af-7' }) },
    })
    expect(handler.getAutofillInstruction(textInput)).toEqual({
      action: 'fill',
      value: 'female',
      id: 'af-4',
    })
    expect(handler.getAutofillInstruction(selectInput)).toEqual({
      action: 'fill',
      value: 'female',
      id: 'af-5',
    })
    expect(handler.getAutofillInstruction(radioInput)).toEqual({
      action: 'fill',
      value: 'female',
      id: 'af-6',
    })
    expect(handler.getAutofillInstruction(checkboxInput)).toEqual({ action: 'clear', id: 'af-7' }) // not 'yes'
  })

  it('handles veteran, race_ethnicity, hispanic_latino, disability for all field types', () => {
    const enums = [
      { cat: 'veteran', val: VeteranStatusEnum.enum.yes },
      { cat: 'race_ethnicity', val: RaceEthnicityEnum.enum.asian },
      { cat: 'hispanic_latino', val: HispanicLatinoEnum.enum.yes },
      { cat: 'disability', val: DisabilityStatusEnum.enum.no },
    ]
    for (const { cat, val } of enums) {
      const handler = getHandlerForInputCategory(cat as any, { [cat]: val })
      const textInput = baseInput({
        category: cat as any,
        element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-8' }) },
      })
      const selectInput = baseInput({
        category: cat as any,
        element: { ...baseElement({ fieldType: 'select', elementReferenceId: 'af-9' }) },
      })
      const radioInput = baseInput({
        category: cat as any,
        element: { ...baseElement({ fieldType: 'radio', elementReferenceId: 'af-10' }) },
      })
      const checkboxInput = baseInput({
        category: cat as any,
        element: { ...baseElement({ fieldType: 'checkbox', elementReferenceId: 'af-11' }) },
      })
      expect(handler.getAutofillInstruction(textInput)).toEqual({
        action: 'fill',
        value: val,
        id: 'af-8',
      })
      expect(handler.getAutofillInstruction(selectInput)).toEqual({
        action: 'fill',
        value: val,
        id: 'af-9',
      })
      expect(handler.getAutofillInstruction(radioInput)).toEqual({
        action: 'fill',
        value: val,
        id: 'af-10',
      })
      // Only 'yes' should fill checkbox
      expect(handler.getAutofillInstruction(checkboxInput)).toEqual({
        action: val === 'yes' ? 'fill' : 'clear',
        id: 'af-11',
      })
    }
  })

  it('handles authorization and sponsorship (no decline to answer)', () => {
    const handler = getHandlerForInputCategory('authorization', {
      authorization: AuthorizationStatusEnum.enum.yes,
    })
    const input = baseInput({
      category: 'authorization',
      element: { ...baseElement({ fieldType: 'checkbox', elementReferenceId: 'af-12' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({ action: 'fill', id: 'af-12' })
    const handler2 = getHandlerForInputCategory('sponsorship', {
      sponsorship: { yesNoAnswer: false },
    })
    const input2 = baseInput({
      category: 'sponsorship',
      element: { ...baseElement({ fieldType: 'checkbox', elementReferenceId: 'af-13' }) },
    })
    expect(handler2.getAutofillInstruction(input2)).toEqual({ action: 'clear', id: 'af-13' })
  })

  it('handles phone', () => {
    const handler = getHandlerForInputCategory('phone', { phone: { phoneNum: 5551234 } })
    const input = baseInput({
      category: 'phone',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-14' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: '5551234',
      id: 'af-14',
    })
    handler.saveAutofillValue(input, 'user2')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user2', 'phone/phoneNum', '')
  })

  it('handles location (country, city, state, postal_code, address)', () => {
    const fields = [
      {
        cat: 'location',
        val: {
          country: 'USA',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          address: '123 Main St',
        },
        subfields: [
          { label: 'Country', expected: 'USA', path: 'location/country', name: 'country' },
          { label: 'City', expected: 'New York', path: 'location/city', name: 'city' },
          { label: 'State', expected: 'NY', path: 'location/state', name: 'state' },
          {
            label: 'Postal Code',
            expected: '10001',
            path: 'location/postal_code',
            name: 'postal_code',
          },
          { label: 'Address', expected: '123 Main St', path: 'location/address', name: 'address' },
        ],
      },
    ]
    for (const { cat, val, subfields } of fields) {
      const handler = getHandlerForInputCategory(cat as any, { [cat]: val })
      for (const { label, expected, path, name } of subfields) {
        const input = baseInput({
          category: cat as any,
          element: {
            ...baseElement({ fieldType: 'text', elementReferenceId: `af-${label}`, name }),
            label,
          },
        })
        expect(handler.getAutofillInstruction(input)).toEqual({
          action: 'fill',
          value: expected,
          id: `af-${label}`,
        })
        handler.saveAutofillValue(input, 'user2')
        expect(saveUserAutofillValue).toHaveBeenCalledWith('user2', path, '')
      }
    }
  })

  it('handles website', () => {
    const handler = getHandlerForInputCategory('website', { website: 'https://my.site' })
    const input = baseInput({
      category: 'website',
      element: { ...baseElement({ fieldType: 'url', elementReferenceId: 'af-website' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: 'https://my.site',
      id: 'af-website',
    })
    handler.saveAutofillValue(input, 'user3')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user3', 'website', '')
  })

  it('handles twitter_url', () => {
    const handler = getHandlerForInputCategory('twitter_url', {
      twitter_url: 'https://twitter.com/user',
    })
    const input = baseInput({
      category: 'twitter_url',
      element: { ...baseElement({ fieldType: 'url', elementReferenceId: 'af-twitter' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: 'https://twitter.com/user',
      id: 'af-twitter',
    })
    handler.saveAutofillValue(input, 'user4')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user4', 'twitter_url', '')
  })

  it('handles github_url', () => {
    const handler = getHandlerForInputCategory('github_url', {
      github_url: 'https://github.com/user',
    })
    const input = baseInput({
      category: 'github_url',
      element: { ...baseElement({ fieldType: 'url', elementReferenceId: 'af-github' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: 'https://github.com/user',
      id: 'af-github',
    })
    handler.saveAutofillValue(input, 'user5')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user5', 'github_url', '')
  })

  it('handles current_company', () => {
    const handler = getHandlerForInputCategory('current_company', { current_company: 'Acme Corp' })
    const input = baseInput({
      category: 'current_company',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-company' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: 'Acme Corp',
      id: 'af-company',
    })
    handler.saveAutofillValue(input, 'user6')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user6', 'current_company', '')
  })

  it('handles current location as location', () => {
    const handler = getHandlerForInputCategory('location', {
      location: { city: 'San Francisco', country: 'USA' },
    })
    const input = baseInput({
      category: 'location',
      label: 'Current Location',
      element: {
        ...baseElement({
          fieldType: 'text',
          elementReferenceId: 'af-location',
          name: 'current_location',
        }),
      },
    })
    // The LocationHandler only fills for city, country, state, postal_code, address, not 'current location' directly
    // So the expected action is 'skip'
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'skip',
      id: 'af-location',
    })
    handler.saveAutofillValue(input, 'user7')
    expect(saveUserAutofillValue).toHaveBeenCalled()
  })

  it('handles other_website', () => {
    const handler = getHandlerForInputCategory('other_website', {
      other_website: 'https://other.site',
    })
    const input = baseInput({
      category: 'other_website',
      element: { ...baseElement({ fieldType: 'url', elementReferenceId: 'af-other-website' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: 'https://other.site',
      id: 'af-other-website',
    })
    handler.saveAutofillValue(input, 'user7')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user7', 'other_website', '')
  })

  it('handles salary_expectations', () => {
    const handler = getHandlerForInputCategory('salary_expectations', {
      salary_expectations: '$80,000 - $100,000',
    })
    const input = baseInput({
      category: 'salary_expectations',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-salary' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: '$80,000 - $100,000',
      id: 'af-salary',
    })
    handler.saveAutofillValue(input, 'user8')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user8', 'salary_expectations', '')
  })

  it('handles salary_expectations with different field types', () => {
    const testCases = [
      { fieldType: 'text', value: '75000' },
      { fieldType: 'number', value: '90000' },
      { fieldType: 'select', value: '$70k-$90k' },
    ]

    testCases.forEach(({ fieldType, value }, index) => {
      const handler = getHandlerForInputCategory('salary_expectations', {
        salary_expectations: value,
      })
      const input = baseInput({
        category: 'salary_expectations',
        element: {
          ...baseElement({ fieldType: fieldType as any, elementReferenceId: `af-salary-${index}` }),
        },
      })
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'fill',
        value: value,
        id: `af-salary-${index}`,
      })
    })
  })

  it('handles position_discovery_source', async () => {
    // Test with no saved preferences - should still fill with "linkedin"
    const handler = getHandlerForInputCategory('position_discovery_source', {})
    const input = baseInput({
      category: 'position_discovery_source',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-discovery' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: 'linkedin',
      id: 'af-discovery',
    })

    // Test that save always returns error
    const saveResult = handler.saveAutofillValue(input, 'user9')
    await expect(saveResult).resolves.toEqual({
      status: 'error',
      error: 'Position discovery source is not saved',
    })
  })

  it('handles position_discovery_source with different field types', () => {
    const testCases = [{ fieldType: 'text' }, { fieldType: 'select' }, { fieldType: 'textbox' }]

    testCases.forEach(({ fieldType }, index) => {
      const handler = getHandlerForInputCategory('position_discovery_source', {})
      const input = baseInput({
        category: 'position_discovery_source',
        element: {
          ...baseElement({
            fieldType: fieldType as any,
            elementReferenceId: `af-discovery-${index}`,
          }),
        },
      })
      // Should always fill with "linkedin" regardless of field type
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'fill',
        value: 'linkedin',
        id: `af-discovery-${index}`,
      })
    })
  })

  it('handles current_job_title', () => {
    const handler = getHandlerForInputCategory('current_job_title', {
      current_job_title: 'Senior Software Engineer',
    })
    const input = baseInput({
      category: 'current_job_title',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-title' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: 'Senior Software Engineer',
      id: 'af-title',
    })
    handler.saveAutofillValue(input, 'user10')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user10', 'current_job_title', '')
  })

  it('handles current_job_title with different field types', () => {
    const testCases = [
      { fieldType: 'text', value: 'Product Manager' },
      { fieldType: 'select', value: 'Data Scientist' },
    ]

    testCases.forEach(({ fieldType, value }, index) => {
      const handler = getHandlerForInputCategory('current_job_title', {
        current_job_title: value,
      })
      const input = baseInput({
        category: 'current_job_title',
        element: {
          ...baseElement({ fieldType: fieldType as any, elementReferenceId: `af-title-${index}` }),
        },
      })
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'fill',
        value: value,
        id: `af-title-${index}`,
      })
    })
  })

  it('handles referral_source', async () => {
    // Test with no saved preferences - should always skip
    const handler = getHandlerForInputCategory('referral_source', {})
    const input = baseInput({
      category: 'referral_source',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-referral' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'skip',
      id: 'af-referral',
    })

    // Test that save always returns error
    const saveResult = handler.saveAutofillValue(input, 'user11')
    await expect(saveResult).resolves.toEqual({
      status: 'error',
      error: 'Referral source is not saved',
    })
  })

  it('handles referral_source with different field types', () => {
    const testCases = [{ fieldType: 'text' }, { fieldType: 'select' }, { fieldType: 'textbox' }]

    testCases.forEach(({ fieldType }, index) => {
      const handler = getHandlerForInputCategory('referral_source', {})
      const input = baseInput({
        category: 'referral_source',
        element: {
          ...baseElement({
            fieldType: fieldType as any,
            elementReferenceId: `af-referral-${index}`,
          }),
        },
      })
      // Should always skip regardless of field type
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'skip',
        id: `af-referral-${index}`,
      })
    })
  })

  it('handles pronouns', () => {
    const handler = getHandlerForInputCategory('pronouns', {
      pronouns: 'they/them',
    })
    const input = baseInput({
      category: 'pronouns',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-pronouns' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({
      action: 'fill',
      value: 'they/them',
      id: 'af-pronouns',
    })
    handler.saveAutofillValue(input, 'user12')
    expect(saveUserAutofillValue).toHaveBeenCalledWith('user12', 'pronouns', '')
  })

  it('handles pronouns with different field types', () => {
    const testCases = [
      { fieldType: 'text', value: 'she/her' },
      { fieldType: 'select', value: 'he/him' },
      { fieldType: 'radio', value: 'they/them' },
    ]

    testCases.forEach(({ fieldType, value }, index) => {
      const handler = getHandlerForInputCategory('pronouns', {
        pronouns: value,
      })
      const input = baseInput({
        category: 'pronouns',
        element: {
          ...baseElement({
            fieldType: fieldType as any,
            elementReferenceId: `af-pronouns-${index}`,
          }),
        },
      })
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'fill',
        value: value,
        id: `af-pronouns-${index}`,
      })
    })
  })

  it('handles complex salary expectations values', () => {
    const complexValues = [
      '$60,000 - $80,000 annually',
      '90k',
      '35-40 per hour',
      'Competitive salary based on experience',
      '120000',
    ]

    complexValues.forEach((value, index) => {
      const handler = getHandlerForInputCategory('salary_expectations', {
        salary_expectations: value,
      })
      const input = baseInput({
        category: 'salary_expectations',
        element: {
          ...baseElement({ fieldType: 'text', elementReferenceId: `af-complex-salary-${index}` }),
        },
      })
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'fill',
        value: value,
        id: `af-complex-salary-${index}`,
      })
    })
  })

  it('handles complex job title values', () => {
    const complexValues = [
      'Senior Full Stack Developer',
      'VP of Engineering',
      'Lead UX/UI Designer',
      'Principal Data Scientist - AI/ML',
      'Software Engineering Manager',
    ]

    complexValues.forEach((value, index) => {
      const handler = getHandlerForInputCategory('current_job_title', {
        current_job_title: value,
      })
      const input = baseInput({
        category: 'current_job_title',
        element: {
          ...baseElement({ fieldType: 'text', elementReferenceId: `af-complex-title-${index}` }),
        },
      })
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'fill',
        value: value,
        id: `af-complex-title-${index}`,
      })
    })
  })

  it('handles various pronoun values', () => {
    const pronounValues = [
      'she/her',
      'he/him',
      'they/them',
      'she/they',
      'he/they',
      'xe/xir',
      'prefer not to specify',
    ]

    pronounValues.forEach((value, index) => {
      const handler = getHandlerForInputCategory('pronouns', {
        pronouns: value,
      })
      const input = baseInput({
        category: 'pronouns',
        element: {
          ...baseElement({ fieldType: 'select', elementReferenceId: `af-pronoun-${index}` }),
        },
      })
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'fill',
        value: value,
        id: `af-pronoun-${index}`,
      })
    })
  })

  it('skips new handlers if no value is present', () => {
    const newCategories = ['salary_expectations', 'current_job_title', 'pronouns']

    newCategories.forEach((category, index) => {
      const handler = getHandlerForInputCategory(category as any, {})
      const input = baseInput({
        category: category as any,
        element: {
          ...baseElement({ fieldType: 'text', elementReferenceId: `af-no-value-${index}` }),
        },
      })
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'skip',
        id: `af-no-value-${index}`,
      })
    })
  })

  it('saves autofill values for all new handlers', () => {
    const testCases = [
      {
        category: 'salary_expectations',
        value: 'test-salary',
        path: 'salary_expectations',
      },
      {
        category: 'current_job_title',
        value: 'test-title',
        path: 'current_job_title',
      },
      {
        category: 'pronouns',
        value: 'test-pronouns',
        path: 'pronouns',
      },
    ]

    testCases.forEach(({ category, value, path }, index) => {
      const handler = getHandlerForInputCategory(category as any, { [category]: value })
      const input = baseInput({
        category: category as any,
        element: {
          ...baseElement({
            fieldType: 'text',
            elementReferenceId: `af-save-${index}`,
            value: 'filled-value',
          }),
        },
      })
      handler.saveAutofillValue(input, `user-${index}`)
      expect(saveUserAutofillValue).toHaveBeenCalledWith(`user-${index}`, path, 'filled-value')
    })
  })

  it('skips if no value is present', () => {
    const handler = getHandlerForInputCategory('gender', {})
    const input = baseInput({
      category: 'gender',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-15' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({ action: 'skip', id: 'af-15' })
  })
})
