import { describe, it, expect, vi } from 'vitest'
import getHandlerForInputCategory, { NoValueHandler } from '../inputCategoryHandlers'
import type { CategorizedInput, UserAutofillPreferences, SerializedHtmlInput } from '../schema'

// Mock the firebase function
vi.mock('../../firebase/realtimeDB', () => ({
  saveUserAutofillValue: vi
    .fn()
    .mockResolvedValue({ status: 'success', valuePath: 'test', value: 'test' }),
}))

// Helper function to create test input
const createTestInput = (overrides: Partial<SerializedHtmlInput> = {}): CategorizedInput => ({
  category: 'unknown',
  element: {
    label: 'Test Label',
    wholeQuestionLabel: null,
    html: '<input>',
    fieldType: 'text',
    name: 'test',
    placeholder: 'test placeholder',
    autocomplete: '',
    htmlId: 'test-id',
    className: 'test-class',
    value: 'test-value',
    required: false,
    elementReferenceId: 'test-ref-id',
    ...overrides,
  },
})

// Helper function to create test user preferences
const createTestUserPreferences = (
  overrides: Partial<UserAutofillPreferences> = {},
): UserAutofillPreferences => ({
  name: {
    first_name: 'John',
    last_name: 'Doe',
  },
  email: 'john.doe@example.com',
  linkedin_profile: 'https://linkedin.com/in/johndoe',
  twitter_url: 'https://twitter.com/johndoe',
  github_url: 'https://github.com/johndoe',
  salary_expectations: '$100,000',
  identity: {
    pronouns: 'he/him',
  },
  ...overrides,
})

describe('inputCategoryHandlers', () => {
  describe('NameHandler', () => {
    const userPrefs = createTestUserPreferences()

    it('should handle first name inputs', () => {
      const handler = getHandlerForInputCategory('name', userPrefs)
      const input = createTestInput({ label: 'First Name' })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'John',
        input_id: 'test-ref-id',
      })
    })

    it('should handle last name inputs', () => {
      const handler = getHandlerForInputCategory('name', userPrefs)
      const input = createTestInput({ label: 'Last Name' })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'Doe',
        input_id: 'test-ref-id',
      })
    })

    it('should handle full name inputs', () => {
      const handler = getHandlerForInputCategory('name', userPrefs)
      const input = createTestInput({ label: 'Full Name' })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'John Doe',
        input_id: 'test-ref-id',
      })
    })

    it('should handle case insensitive labels', () => {
      const handler = getHandlerForInputCategory('name', userPrefs)
      const input = createTestInput({ label: 'FIRST NAME' })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'John',
        input_id: 'test-ref-id',
      })
    })

    it('should return empty value for non-name inputs', () => {
      const handler = getHandlerForInputCategory('name', userPrefs)
      const input = createTestInput({ label: 'Other Field' })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })

    it('should handle missing name data gracefully', () => {
      const handler = getHandlerForInputCategory(
        'name',
        createTestUserPreferences({ name: undefined }),
      )
      const input = createTestInput({ label: 'First Name' })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })

    it('should handle partial name data', () => {
      const handler = getHandlerForInputCategory(
        'name',
        createTestUserPreferences({
          name: { first_name: 'Jane' },
        }),
      )
      const input = createTestInput({ label: 'Full Name' })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'Jane ',
        input_id: 'test-ref-id',
      })
    })

    it('should save first name correctly', async () => {
      const handler = getHandlerForInputCategory('name', userPrefs)
      const input = createTestInput({ label: 'First Name' })

      const result = await handler.saveAutofillValue(input, 'user123')

      expect(result).toEqual({
        status: 'success',
        valuePath: 'test',
        value: 'test',
      })
    })

    it('should return error for unrecognized name fields', async () => {
      const handler = getHandlerForInputCategory('name', userPrefs)
      const input = createTestInput({ label: 'Middle Initial' })

      const result = await handler.saveAutofillValue(input, 'user123')

      expect(result).toEqual({
        status: 'error',
        error: 'Failed to save name autofill value',
      })
    })
  })

  describe('EmailHandler', () => {
    const userPrefs = createTestUserPreferences()

    it('should provide email value when available', () => {
      const handler = getHandlerForInputCategory('email', userPrefs)
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'john.doe@example.com',
        input_id: 'test-ref-id',
      })
    })

    it('should return empty value when email is not available', () => {
      const handler = getHandlerForInputCategory(
        'email',
        createTestUserPreferences({ email: undefined }),
      )
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })

    it('should save email value correctly', async () => {
      const handler = getHandlerForInputCategory('email', userPrefs)
      const input = createTestInput()

      const result = await handler.saveAutofillValue(input, 'user123')

      expect(result).toEqual({
        status: 'success',
        valuePath: 'test',
        value: 'test',
      })
    })
  })

  describe('PronounsHandler', () => {
    const userPrefs = createTestUserPreferences()

    it('should provide pronouns value when available', () => {
      const handler = getHandlerForInputCategory('pronouns', userPrefs)
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'he/him',
        input_id: 'test-ref-id',
      })
    })

    it('should return empty value when pronouns are not available', () => {
      const handler = getHandlerForInputCategory(
        'pronouns',
        createTestUserPreferences({ identity: undefined }),
      )
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })

    it('should save pronouns value correctly', async () => {
      const handler = getHandlerForInputCategory('pronouns', userPrefs)
      const input = createTestInput()

      const result = await handler.saveAutofillValue(input, 'user123')

      expect(result).toEqual({
        status: 'success',
        valuePath: 'test',
        value: 'test',
      })
    })
  })

  describe('LinkedinProfileHandler', () => {
    const userPrefs = createTestUserPreferences()

    it('should provide LinkedIn profile when available', () => {
      const handler = getHandlerForInputCategory('linkedin_profile', userPrefs)
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'https://linkedin.com/in/johndoe',
        input_id: 'test-ref-id',
      })
    })

    it('should return empty value when LinkedIn profile is not available', () => {
      const handler = getHandlerForInputCategory(
        'linkedin_profile',
        createTestUserPreferences({ linkedin_profile: undefined }),
      )
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })
  })

  describe('TwitterUrlHandler', () => {
    const userPrefs = createTestUserPreferences()

    it('should provide Twitter URL when available', () => {
      const handler = getHandlerForInputCategory('twitter_url', userPrefs)
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'https://twitter.com/johndoe',
        input_id: 'test-ref-id',
      })
    })

    it('should handle various Twitter label patterns', () => {
      const handler = getHandlerForInputCategory('twitter_url', userPrefs)

      const twitterLabels = ['Twitter', 'Twitter URL', 'Twitter Profile', 'Twitter Handle']

      twitterLabels.forEach((label) => {
        const input = createTestInput({ label })
        const instruction = handler.getAutofillInstruction(input)
        expect(instruction.value).toBe('https://twitter.com/johndoe')
      })
    })
  })

  describe('GithubUrlHandler', () => {
    const userPrefs = createTestUserPreferences()

    it('should provide GitHub URL when available', () => {
      const handler = getHandlerForInputCategory('github_url', userPrefs)
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'https://github.com/johndoe',
        input_id: 'test-ref-id',
      })
    })

    it('should handle various GitHub label patterns', () => {
      const handler = getHandlerForInputCategory('github_url', userPrefs)

      const githubLabels = ['GitHub', 'GitHub URL', 'GitHub Profile', 'Github', 'Git Hub']

      githubLabels.forEach((label) => {
        const input = createTestInput({ label })
        const instruction = handler.getAutofillInstruction(input)
        expect(instruction.value).toBe('https://github.com/johndoe')
      })
    })
  })

  describe('SalaryExpectationsHandler', () => {
    const userPrefs = createTestUserPreferences()

    it('should provide salary expectations when available', () => {
      const handler = getHandlerForInputCategory('salary_expectations', userPrefs)
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '$100,000',
        input_id: 'test-ref-id',
      })
    })

    it('should return empty value when salary expectations are not available', () => {
      const handler = getHandlerForInputCategory(
        'salary_expectations',
        createTestUserPreferences({ salary_expectations: undefined }),
      )
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })

    it('should handle various salary label patterns', () => {
      const handler = getHandlerForInputCategory('salary_expectations', userPrefs)

      const salaryLabels = ['Salary', 'Expected Salary', 'Salary Expectations', 'Desired Salary']

      salaryLabels.forEach((label) => {
        const input = createTestInput({ label })
        const instruction = handler.getAutofillInstruction(input)
        expect(instruction.value).toBe('$100,000')
      })
    })
  })

  describe('DefaultHandler', () => {
    const userPrefs = createTestUserPreferences()

    it('should return empty value for unknown categories', () => {
      const handler = getHandlerForInputCategory('unknown', userPrefs)
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })

    it('should return error when saving unknown categories', async () => {
      const handler = getHandlerForInputCategory('unknown', userPrefs)
      const input = createTestInput()

      const result = await handler.saveAutofillValue(input, 'user123')

      expect(result).toEqual({
        status: 'error',
        error: 'Unknown input category',
      })
    })
  })

  describe('NoValueHandler', () => {
    const userPrefs = createTestUserPreferences()

    it('should return empty value', () => {
      const handler = new NoValueHandler(userPrefs)
      const input = createTestInput()

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })

    it('should return error when saving', async () => {
      const handler = new NoValueHandler(userPrefs)
      const input = createTestInput()

      const result = await handler.saveAutofillValue(input, 'user123')

      expect(result).toEqual({
        status: 'error',
        error: 'element value is empty',
      })
    })
  })

  describe('getHandlerForInputCategory', () => {
    const userPrefs = createTestUserPreferences()

    it('should return correct handler for each category', () => {
      const categories = [
        'name',
        'email',
        'pronouns',
        'linkedin_profile',
        'twitter_url',
        'github_url',
        'salary_expectations',
      ] as const

      categories.forEach((category) => {
        const handler = getHandlerForInputCategory(category, userPrefs)
        expect(handler).toBeDefined()
        expect(typeof handler.getAutofillInstruction).toBe('function')
        expect(typeof handler.saveAutofillValue).toBe('function')
      })
    })

    it('should return DefaultHandler for unknown category', () => {
      const handler = getHandlerForInputCategory('unknown', userPrefs)
      expect(handler).toBeDefined()

      const input = createTestInput()
      const instruction = handler.getAutofillInstruction(input)
      expect(instruction.value).toBe('')
    })

    it('should handle null label gracefully', () => {
      const handler = getHandlerForInputCategory('name', userPrefs)
      const input = createTestInput({ label: null })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })

    it('should handle different field types', () => {
      const handler = getHandlerForInputCategory('email', userPrefs)
      const fieldTypes = ['text', 'email', 'select', 'textbox'] as const

      fieldTypes.forEach((fieldType) => {
        const input = createTestInput({ fieldType })
        const instruction = handler.getAutofillInstruction(input)
        expect(instruction.value).toBe('john.doe@example.com')
      })
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle completely empty user preferences', () => {
      const emptyPrefs: UserAutofillPreferences = {}
      const handler = getHandlerForInputCategory('name', emptyPrefs)
      const input = createTestInput({ label: 'First Name' })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: '',
        input_id: 'test-ref-id',
      })
    })

    it('should handle missing element reference id', () => {
      const userPrefs = createTestUserPreferences()
      const handler = getHandlerForInputCategory('email', userPrefs)
      const input = createTestInput({ elementReferenceId: '' })

      const instruction = handler.getAutofillInstruction(input)

      expect(instruction).toEqual({
        value: 'john.doe@example.com',
        input_id: '',
      })
    })

    it('should handle various label variations for name inputs', () => {
      const userPrefs = createTestUserPreferences()
      const handler = getHandlerForInputCategory('name', userPrefs)

      const variations = [
        'first name',
        'firstname',
        'given name',
        'first_name',
        'lastName',
        'surname',
        'family name',
        'full name',
        'complete name',
        'your name',
      ]

      variations.forEach((label) => {
        const input = createTestInput({ label })
        const instruction = handler.getAutofillInstruction(input)
        expect(instruction.input_id).toBe('test-ref-id')
        // Should either have a value or be empty, but not throw error
        expect(typeof instruction.value).toBe('string')
      })
    })

    it('should handle mixed case and whitespace in field names', () => {
      const userPrefs = createTestUserPreferences()
      const handler = getHandlerForInputCategory('name', userPrefs)

      const mixedCaseLabels = [
        '  First Name  ',
        'FIRST NAME',
        'first name',
        'First_Name',
        'LAST NAME',
        'last name',
        'Last_Name',
      ]

      mixedCaseLabels.forEach((label) => {
        const input = createTestInput({ label })
        const instruction = handler.getAutofillInstruction(input)
        expect(instruction.input_id).toBe('test-ref-id')
        expect(typeof instruction.value).toBe('string')
      })
    })
  })
})
