import { describe, expect, it } from 'vitest'
import { categorizeSimpleInputs } from '../categorizeInputs'
import { INPUT_ELEMENT_TYPES } from '../schema'
import type { SerializedHtmlInput } from '../schema'

// Helper to create a basic input
const createInput = (overrides: Partial<SerializedHtmlInput> = {}): SerializedHtmlInput => ({
  name: '',
  label: '',
  placeholder: '',
  fieldType: INPUT_ELEMENT_TYPES.TEXT,
  autocomplete: '',
  html: '<input>',
  value: '',
  htmlId: '',
  className: '',
  required: false,
  elementReferenceId: '',
  ...overrides,
})

describe('categorizeInputs', () => {
  describe('name inputs', () => {
    it('categorizes basic name inputs', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'firstname' }),
        createInput({ name: 'last_name' }),
        createInput({ name: 'full-name' }),
        createInput({ label: 'First Name' }),
        createInput({ placeholder: 'Enter your name' }),
        createInput({ autocomplete: 'given-name' }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result.every((r) => r.category === 'name')).toBe(true)
    })

    it('excludes company/employer fields from name category', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'firstname', label: 'Company Name' }),
        createInput({ name: 'last_name', label: 'Employer' }),
        createInput({ name: 'full-name', label: 'Organization' }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result.every((r) => r.category === 'unknown')).toBe(true)
    })

    it('handles name inputs with different field types', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'firstname', fieldType: INPUT_ELEMENT_TYPES.TEXT }),
        createInput({ name: 'lastname', fieldType: INPUT_ELEMENT_TYPES.TEXTBOX }),
        createInput({ name: 'fullname', fieldType: INPUT_ELEMENT_TYPES.TEL }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result[0].category).toBe('name')
      expect(result[1].category).toBe('unknown')
      expect(result[2].category).toBe('unknown')
    })
  })

  describe('email inputs', () => {
    it('categorizes basic email inputs', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'email' }),
        createInput({ name: 'e-mail' }),
        createInput({ fieldType: INPUT_ELEMENT_TYPES.EMAIL }),
        createInput({ autocomplete: 'email' }),
        createInput({ placeholder: 'Enter your email' }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result.every((r) => r.category === 'email')).toBe(true)
    })

    it('handles email inputs with different field types', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'email', fieldType: INPUT_ELEMENT_TYPES.EMAIL }),
        createInput({ name: 'email', fieldType: INPUT_ELEMENT_TYPES.TEXT }),
        createInput({ name: 'email', fieldType: INPUT_ELEMENT_TYPES.TEXTBOX }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result[0].category).toBe('email')
      expect(result[1].category).toBe('email')
      expect(result[2].category).toBe('unknown')
    })
  })

  describe('pronouns inputs', () => {
    it('categorizes basic pronouns inputs', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'pronouns' }),
        createInput({ name: 'preferred-pronouns' }),
        createInput({ label: 'Personal Pronouns' }),
        createInput({ placeholder: 'Enter your pronouns' }),
        createInput({ autocomplete: 'pronouns' }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result.every((r) => r.category === 'pronouns')).toBe(true)
    })

    it('handles pronouns inputs with different field types', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'pronouns', fieldType: INPUT_ELEMENT_TYPES.TEXT }),
        createInput({ name: 'pronouns', fieldType: INPUT_ELEMENT_TYPES.SELECT }),
        createInput({ name: 'pronouns', fieldType: INPUT_ELEMENT_TYPES.RADIO }),
        createInput({ name: 'pronouns', fieldType: INPUT_ELEMENT_TYPES.CHECKBOX }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result[0].category).toBe('pronouns')
      expect(result[1].category).toBe('pronouns')
      expect(result[2].category).toBe('pronouns')
      expect(result[3].category).toBe('unknown')
    })
  })

  describe('LinkedIn profile inputs', () => {
    it('categorizes LinkedIn profile inputs', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'linkedin' }),
        createInput({ name: 'linkedin-profile' }),
        createInput({ name: 'linkedin_url' }),
        createInput({ label: 'LinkedIn Profile' }),
        createInput({ placeholder: 'Enter your LinkedIn URL' }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result.every((r) => r.category === 'linkedin_profile')).toBe(true)
    })

    it('handles LinkedIn inputs with different field types', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'linkedin', fieldType: INPUT_ELEMENT_TYPES.TEXT }),
        createInput({ name: 'linkedin', fieldType: INPUT_ELEMENT_TYPES.URL }),
        createInput({ name: 'linkedin', fieldType: INPUT_ELEMENT_TYPES.TEXTBOX }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result.every((r) => r.category === 'linkedin_profile')).toBe(true)
    })
  })

  describe('Twitter URL inputs', () => {
    it('categorizes Twitter URL inputs', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'twitter' }),
        createInput({ name: 'twitter-url' }),
        createInput({ name: 'twitter_handle' }),
        createInput({ label: 'Twitter Profile' }),
        createInput({ placeholder: 'Enter your Twitter URL' }),
        createInput({ autocomplete: 'twitter' }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result.every((r) => r.category === 'twitter_url')).toBe(true)
    })

    it('handles Twitter inputs with different field types', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'twitter', fieldType: INPUT_ELEMENT_TYPES.URL }),
        createInput({ name: 'twitter', fieldType: INPUT_ELEMENT_TYPES.TEXT }),
        createInput({ name: 'twitter', fieldType: INPUT_ELEMENT_TYPES.TEXTBOX }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result[0].category).toBe('twitter_url')
      expect(result[1].category).toBe('twitter_url')
      expect(result[2].category).toBe('unknown')
    })
  })

  describe('GitHub URL inputs', () => {
    it('categorizes GitHub URL inputs', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'github' }),
        createInput({ name: 'github-url' }),
        createInput({ name: 'github_handle' }),
        createInput({ label: 'GitHub Profile' }),
        createInput({ placeholder: 'Enter your GitHub URL' }),
        createInput({ autocomplete: 'github' }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result.every((r) => r.category === 'github_url')).toBe(true)
    })

    it('handles GitHub inputs with different field types', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'github', fieldType: INPUT_ELEMENT_TYPES.URL }),
        createInput({ name: 'github', fieldType: INPUT_ELEMENT_TYPES.TEXT }),
        createInput({ name: 'github', fieldType: INPUT_ELEMENT_TYPES.TEXTBOX }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result[0].category).toBe('github_url')
      expect(result[1].category).toBe('github_url')
      expect(result[2].category).toBe('unknown')
    })
  })

  describe('edge cases', () => {
    it('handles empty inputs', () => {
      const inputs: SerializedHtmlInput[] = []
      const result = categorizeSimpleInputs(inputs)
      expect(result).toEqual([])
    })

    it('handles inputs with no identifying properties', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({}),
        createInput({ name: 'random' }),
        createInput({ label: 'Some Label' }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result.every((r) => r.category === 'unknown')).toBe(true)
    })

    it('handles inputs with multiple matching properties', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({
          name: 'email',
          label: 'First Name',
          placeholder: 'Enter your LinkedIn URL',
        }),
        createInput({
          name: 'firstname',
          label: 'Twitter Handle',
          placeholder: 'Enter your pronouns',
        }),
      ]

      const result = categorizeSimpleInputs(inputs)
      // Should match the first matching category in the if-else chain
      expect(result[0].category).toBe('name')
      expect(result[1].category).toBe('name')
    })

    it('handles case-insensitive matching', () => {
      const inputs: SerializedHtmlInput[] = [
        createInput({ name: 'FIRSTNAME' }),
        createInput({ name: 'EMAIL' }),
        createInput({ name: 'LINKEDIN' }),
        createInput({ name: 'TWITTER' }),
        createInput({ name: 'GITHUB' }),
        createInput({ name: 'PRONOUNS' }),
      ]

      const result = categorizeSimpleInputs(inputs)
      expect(result[0].category).toBe('name')
      expect(result[1].category).toBe('email')
      expect(result[2].category).toBe('linkedin_profile')
      expect(result[3].category).toBe('twitter_url')
      expect(result[4].category).toBe('github_url')
      expect(result[5].category).toBe('pronouns')
    })
  })
})
