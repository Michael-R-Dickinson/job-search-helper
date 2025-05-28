import { describe, it, expect } from 'vitest'
import categorizeInputs from '../categorizeInputs'
import type { SerializedInput } from '../../content/triggerGetAutofillValues'

describe('categorizeInputs', () => {
  it('should categorize name inputs correctly', () => {
    const inputs: SerializedInput[] = [
      { label: 'Full Name', html: '<input name="full_name" />' },
      { label: 'First Name', html: '<input name="first_name" />' },
      { label: null, html: '<input placeholder="Enter your last name" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('name')
    })
  })

  it('should categorize email inputs correctly', () => {
    const inputs: SerializedInput[] = [
      { label: 'Email Address', html: '<input type="email" />' },
      { label: null, html: '<input name="user_email" placeholder="your@email.com" />' },
      { label: 'E-mail', html: '<input class="email-field" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('email')
    })
  })

  it('should categorize gender inputs correctly', () => {
    const inputs: SerializedInput[] = [
      { label: 'Gender', html: '<input type="radio" name="gender" />' },
      { label: 'Sex', html: '<input class="sex-selection" />' },
      { label: 'Select your gender identity', html: '<input />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('gender')
    })
  })

  it('should categorize veteran status inputs correctly', () => {
    const inputs: SerializedInput[] = [
      { label: 'Veteran Status', html: '<input type="radio" name="veteran_status_group" />' },
      { label: 'Are you a veteran?', html: '<input class="veteran-status" type="checkbox" />' },
      { label: 'Military service', html: '<select name="military_service"></select>' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('veteran')
    })
  })

  it('should categorize race/ethnicity inputs correctly', () => {
    const inputs: SerializedInput[] = [
      { label: 'Race', html: '<select name="race_dropdown"></select>' },
      { label: 'Ethnicity', html: '<select class="ethnicity-select" multiple></select>' },
      { label: 'Race/Ethnicity', html: '<input name="race_ethnicity" type="radio" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('race_ethnicity')
    })
  })

  it('should categorize disability inputs correctly', () => {
    const inputs: SerializedInput[] = [
      { label: 'Disability Status', html: '<input type="checkbox" name="disability" />' },
      {
        label: 'Do you have a disability?',
        html: '<input class="disability-check" type="checkbox" />',
      },
      {
        label: 'Voluntary Self-Identification of Disability',
        html: '<select name="disability_self_id"></select>',
      },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('disability')
    })
  })

  it('should categorize phone inputs correctly', () => {
    const inputs: SerializedInput[] = [
      { label: 'Phone Number', html: '<input type="tel" name="phone" />' },
      { label: null, html: '<input name="telephone" placeholder="(123) 456-7890" />' },
      { label: 'Mobile', html: '<input autocomplete="tel-national" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('phone')
    })
  })

  it('should categorize country inputs correctly', () => {
    const inputs: SerializedInput[] = [
      { label: 'Country', html: '<select name="country"></select>' },
      {
        label: null,
        html: '<select name="country_code" placeholder="Select your country"></select>',
      },
      { label: 'Location (Country)', html: '<input autocomplete="country-name" type="text" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('country')
    })
  })

  it('should categorize inputs with no matching category as unknown', () => {
    const inputs: SerializedInput[] = [
      { label: 'Favorite Color', html: '<input name="fav_color" />' },
      { label: null, html: '<input placeholder="Your hobbies" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(2)
    result.forEach((input) => {
      expect(input.category).toBe('unknown')
    })
  })

  it('should categorize inputs with empty or null labels (and no other strong identifiers) as unknown', () => {
    const inputs: SerializedInput[] = [
      { label: '', html: '<input />' },
      { label: null, html: '<input />' },
      { label: '     ', html: '<input />' },
      { label: '', html: '<input name="email_address" type="email" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(4)
    expect(result.find((r) => r.name === 'email_address')?.category).toBe('email')
    expect(result.filter((r) => r.category === 'unknown').length).toBe(3)
  })

  it('should correctly categorize inputs using autocomplete attributes', () => {
    const inputs: SerializedInput[] = [
      { label: null, html: '<input autocomplete="given-name" />' },
      { label: null, html: '<input autocomplete="family-name" />' },
      { label: null, html: '<input autocomplete="email" />' },
      { label: null, html: '<input autocomplete="tel" />' },
      { label: null, html: '<input autocomplete="country" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(5)
    expect(result.find((r) => r.autocomplete === 'given-name')?.category).toBe('name')
    expect(result.find((r) => r.autocomplete === 'family-name')?.category).toBe('name')
    expect(result.find((r) => r.autocomplete === 'email')?.category).toBe('email')
    expect(result.find((r) => r.autocomplete === 'tel')?.category).toBe('phone')
    expect(result.find((r) => r.autocomplete === 'country')?.category).toBe('country')
  })

  it('should handle various combinations of attributes for categorization', () => {
    const inputs: SerializedInput[] = [
      { label: 'Your Full Name', html: '<input type="text" placeholder="Enter name" />' },
      { label: null, html: '<input name="contact_email" type="email" />' },
      { label: 'Phone No.', html: '<input name="user_phone" placeholder="###-###-####" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    expect(result[0].category).toBe('name')
    expect(result[1].category).toBe('email')
    expect(result[2].category).toBe('phone')
  })

  it('should correctly prioritize categories if multiple keywords match (hypothetical)', () => {
    const inputs: SerializedInput[] = [
      { label: 'Your Email and Name', html: '<input name="contact_field" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result[0].category).toBe('name')
  })

  it('should correctly categorize select elements', () => {
    const inputs: SerializedInput[] = [
      { label: 'Gender', html: '<select name="gender_select"></select>' },
      { label: 'Race/Ethnicity', html: '<select name="race_select" multiple></select>' },
      { label: 'Country of Residence', html: '<select name="residence_country"></select>' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    expect(result.find((r) => r.name === 'gender_select')?.category).toBe('gender')
    expect(result.find((r) => r.name === 'race_select')?.category).toBe('race_ethnicity')
    expect(result.find((r) => r.name === 'residence_country')?.category).toBe('country')
  })

  it('should correctly categorize radio button inputs', () => {
    const inputs: SerializedInput[] = [
      { label: 'Male', html: '<input type="radio" name="gender" value="male" />' },
      { label: 'Female', html: '<input type="radio" name="gender" value="female" />' },
      {
        label: 'Yes, I am a veteran',
        html: '<input type="radio" name="vet_status" value="yes" />',
      },
      { label: 'No, not a veteran', html: '<input type="radio" name="vet_status" value="no" />' },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(4)
    expect(result.filter((r) => r.category === 'gender').length).toBe(2)
    expect(result.filter((r) => r.category === 'veteran').length).toBe(2)
  })

  it('should correctly categorize checkbox inputs', () => {
    const inputs: SerializedInput[] = [
      { label: 'I have a disability', html: '<input type="checkbox" name="has_disability" />' },
      {
        label: 'Subscribe to newsletter',
        html: '<input type="checkbox" name="newsletter_opt_in" />',
      },
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(2)
    expect(result.find((r) => r.name === 'has_disability')?.category).toBe('disability')
    expect(result.find((r) => r.name === 'newsletter_opt_in')?.category).toBe('unknown')
  })
})
