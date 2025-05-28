import { describe, it, expect } from 'vitest'
import categorizeInputs from '../categorizeInputs'
import type { InputInfo } from '../../content/hooks/useInputElements'
import { serializeInputsHtml } from '../../content/serializeInputsHtml'

describe('categorizeInputs', () => {
  function makeInput(
    tag: string,
    opts: Record<string, any> = {},
    label: string | null = null,
  ): InputInfo {
    const el = document.createElement(tag)
    Object.entries(opts).forEach(([k, v]) => {
      if (k in el) {
        // @ts-expect-error: Setting property on DOM element that may not be typed
        el[k] = v
      } else {
        el.setAttribute(k, v)
      }
    })
    return { element: el as any, label }
  }

  it('should categorize name inputs correctly', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { name: 'full_name' }, 'Full Name'),
      makeInput('input', { name: 'first_name' }, 'First Name'),
      makeInput('input', { placeholder: 'Enter your last name' }, null),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('name')
    })
  })

  it('should categorize email inputs correctly', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { type: 'email' }, 'Email Address'),
      makeInput('input', { name: 'user_email', placeholder: 'your@email.com' }, null),
      makeInput('input', { className: 'email-field' }, 'E-mail'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('email')
    })
  })

  it('should categorize gender inputs correctly', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { type: 'radio', name: 'gender' }, 'Gender'),
      makeInput('input', { className: 'sex-selection' }, 'Sex'),
      makeInput('input', {}, 'Select your gender identity'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('gender')
    })
  })

  it('should categorize veteran status inputs correctly', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { type: 'radio', name: 'veteran_status_group' }, 'Veteran Status'),
      makeInput('input', { className: 'veteran-status', type: 'checkbox' }, 'Are you a veteran?'),
      makeInput('select', { name: 'military_service' }, 'Military service'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('veteran')
    })
  })

  it('should categorize race/ethnicity inputs correctly', () => {
    const inputs: InputInfo[] = [
      makeInput('select', { name: 'race_dropdown' }, 'Race'),
      makeInput('select', { className: 'ethnicity-select', multiple: true }, 'Ethnicity'),
      makeInput('input', { name: 'race_ethnicity', type: 'radio' }, 'Race/Ethnicity'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('race_ethnicity')
    })
  })

  it('should categorize disability inputs correctly', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { type: 'checkbox', name: 'disability' }, 'Disability Status'),
      makeInput(
        'input',
        { className: 'disability-check', type: 'checkbox' },
        'Do you have a disability?',
      ),
      makeInput(
        'select',
        { name: 'disability_self_id' },
        'Voluntary Self-Identification of Disability',
      ),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('disability')
    })
  })

  it('should categorize phone inputs correctly', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { type: 'tel', name: 'phone' }, 'Phone Number'),
      makeInput('input', { name: 'telephone', placeholder: '(123) 456-7890' }, null),
      makeInput('input', { autocomplete: 'tel-national' }, 'Mobile'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('phone')
    })
  })

  it('should categorize country inputs correctly', () => {
    const inputs: InputInfo[] = [
      makeInput('select', { name: 'country' }, 'Country'),
      makeInput('select', { name: 'country_code', placeholder: 'Select your country' }, null),
      makeInput('input', { autocomplete: 'country-name', type: 'text' }, 'Location (Country)'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('country')
    })
  })

  it('should categorize inputs with no matching category as unknown', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { name: 'fav_color' }, 'Favorite Color'),
      makeInput('input', { placeholder: 'Your hobbies' }, null),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(2)
    result.forEach((input) => {
      expect(input.category).toBe('unknown')
    })
  })

  it('should categorize inputs with empty or null labels (and no other strong identifiers) as unknown', () => {
    const inputs: InputInfo[] = [
      makeInput('input', {}, ''),
      makeInput('input', {}, null),
      makeInput('input', {}, '     '),
      makeInput('input', { name: 'email_address', type: 'email' }, ''),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(4)
    expect(result.find((r) => r.name === 'email_address')?.category).toBe('email')
    expect(result.filter((r) => r.category === 'unknown').length).toBe(3)
  })

  it('should correctly categorize inputs using autocomplete attributes', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { autocomplete: 'given-name' }, null),
      makeInput('input', { autocomplete: 'family-name' }, null),
      makeInput('input', { autocomplete: 'email' }, null),
      makeInput('input', { autocomplete: 'tel' }, null),
      makeInput('input', { autocomplete: 'country' }, null),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(5)
    expect(result.find((r) => r.autocomplete === 'given-name')?.category).toBe('name')
    expect(result.find((r) => r.autocomplete === 'family-name')?.category).toBe('name')
    expect(result.find((r) => r.autocomplete === 'email')?.category).toBe('email')
    expect(result.find((r) => r.autocomplete === 'tel')?.category).toBe('phone')
    expect(result.find((r) => r.autocomplete === 'country')?.category).toBe('country')
  })

  it('should handle various combinations of attributes for categorization', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { type: 'text', placeholder: 'Enter name' }, 'Your Full Name'),
      makeInput('input', { name: 'contact_email', type: 'email' }, null),
      makeInput('input', { name: 'user_phone', placeholder: '###-###-####' }, 'Phone No.'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    expect(result[0].category).toBe('name')
    expect(result[1].category).toBe('email')
    expect(result[2].category).toBe('phone')
  })

  it('should correctly prioritize categories if multiple keywords match (hypothetical)', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { name: 'contact_field' }, 'Your Email and Name'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result[0].category).toBe('name')
  })

  it('should correctly categorize select elements', () => {
    const inputs: InputInfo[] = [
      makeInput('select', { name: 'gender_select' }, 'Gender'),
      makeInput('select', { name: 'race_select', multiple: true }, 'Race/Ethnicity'),
      makeInput('select', { name: 'residence_country' }, 'Country of Residence'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(3)
    expect(result.find((r) => r.name === 'gender_select')?.category).toBe('gender')
    expect(result.find((r) => r.name === 'race_select')?.category).toBe('race_ethnicity')
    expect(result.find((r) => r.name === 'residence_country')?.category).toBe('country')
  })

  it('should correctly categorize radio button inputs', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { type: 'radio', name: 'gender', value: 'male' }, 'Male'),
      makeInput('input', { type: 'radio', name: 'gender', value: 'female' }, 'Female'),
      makeInput(
        'input',
        { type: 'radio', name: 'vet_status', value: 'yes' },
        'Yes, I am a veteran',
      ),
      makeInput('input', { type: 'radio', name: 'vet_status', value: 'no' }, 'No, not a veteran'),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(4)
    expect(result.filter((r) => r.category === 'gender').length).toBe(2)
    expect(result.filter((r) => r.category === 'veteran').length).toBe(2)
  })

  it('should correctly categorize checkbox inputs', () => {
    const inputs: InputInfo[] = [
      makeInput('input', { type: 'checkbox', name: 'has_disability' }, 'I have a disability'),
      makeInput(
        'input',
        { type: 'checkbox', name: 'newsletter_opt_in' },
        'Subscribe to newsletter',
      ),
    ]
    const parsed = serializeInputsHtml(inputs)
    const result = categorizeInputs(parsed)
    expect(result).toHaveLength(2)
    expect(result.find((r) => r.name === 'has_disability')?.category).toBe('disability')
    expect(result.find((r) => r.name === 'newsletter_opt_in')?.category).toBe('unknown')
  })
})
