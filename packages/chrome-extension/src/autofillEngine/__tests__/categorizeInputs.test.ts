import { describe, it, expect } from 'vitest'
import categorizeInputs, { INPUT_TYPES } from '../categorizeInputs'
import type { InputInfo } from '../../content/hooks/useInputElements'

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

interface TestInputOptions {
  label?: string | null
  element?: Partial<MockInputElement> & { type?: string; tagName?: 'INPUT' | 'SELECT' | 'TEXTAREA'; value?: string; checked?: boolean; selected?: boolean; }
}

// Simple mock for HTML elements
class MockInputElement {
  tagName: 'INPUT' | 'SELECT' | 'TEXTAREA';
  type: string;
  name: string;
  className: string;
  placeholder: string;
  autocomplete: string;
  value: string;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  checked: boolean;
  selected: boolean; // For select options
  parentElement: HTMLElement | null = null;

  constructor(options: Partial<MockInputElement> & { type?: string; tagName?: 'INPUT' | 'SELECT' | 'TEXTAREA'; value?: string; checked?: boolean; selected?: boolean; } = {}) {
    this.type = options.type || 'text';

    if (options.tagName) {
      this.tagName = options.tagName;
    } else {
      if (this.type === 'select-one' || this.type === 'select-multiple' || this.type === 'select') {
        this.tagName = 'SELECT';
      } else if (this.type === 'textarea') {
        this.tagName = 'TEXTAREA';
      } else {
        this.tagName = 'INPUT';
      }
    }

    this.name = options.name || '';
    this.className = options.className || '';
    this.placeholder = options.placeholder || '';
    this.autocomplete = options.autocomplete || '';
    this.value = options.value || '';
    this.required = options.required || false;
    this.disabled = options.disabled || false;
    this.readOnly = options.readOnly || false;
    this.checked = options.checked || false;
    this.selected = options.selected || false;
    this.parentElement = options.parentElement || null;
  }

  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
}

describe('categorizeInputs', () => {
  const createTestInput = (options: TestInputOptions = {}): InputInfo => {
    const elementOptions = options.element || {};
    const element = new MockInputElement(elementOptions) as unknown as InputElement;

    return {
      element,
      label: options.label !== undefined ? options.label : null,
    };
  }

  it('should categorize name inputs correctly', () => {
    const inputs = [
      createTestInput({ 
        label: 'Full Name',
        element: { name: 'full_name' }
      }),
      createTestInput({ 
        label: 'First Name',
        element: { name: 'first_name' }
      }),
      createTestInput({ 
        element: { placeholder: 'Enter your last name' }
      }),
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('name')
    })
  })

  it('should categorize email inputs correctly', () => {
    const inputs = [
      createTestInput({ 
        label: 'Email Address',
        element: { type: 'email' }
      }),
      createTestInput({ 
        element: { 
          name: 'user_email', 
          placeholder: 'your@email.com' 
        }
      }),
      createTestInput({ 
        label: 'E-mail',
        element: { className: 'email-field' }
      }),
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('email')
    })
  })

  it('should categorize gender inputs correctly', () => {
    const inputs = [
      createTestInput({ 
        label: 'Gender',
        element: { type: 'radio', name: 'gender' }
      }),
      createTestInput({ 
        label: 'Sex',
        element: { className: 'sex-selection' }
      }),
      createTestInput({ 
        label: 'Select your gender identity' 
      }),
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('gender')
    })
  })

  it('should categorize veteran status inputs correctly', () => {
    const inputs = [
      createTestInput({ 
        label: 'Veteran Status',
        element: { type: 'radio', name: 'veteran_status_group' } 
      }),
      createTestInput({ 
        label: 'Are you a veteran?',
        element: { className: 'veteran-status', type: 'checkbox' } 
      }),
      createTestInput({ 
        label: 'Military service',
        element: { name: 'military_service', type: 'select' } 
      }),
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('veteran')
    })
  })

  it('should categorize race/ethnicity inputs correctly', () => {
    const inputs = [
      createTestInput({ 
        label: 'Race',
        element: { type: 'select', name: 'race_dropdown' } 
      }),
      createTestInput({ 
        label: 'Ethnicity',
        element: { className: 'ethnicity-select', type: 'select-multiple' } 
      }),
      createTestInput({ 
        label: 'Race/Ethnicity',
        element: { name: 'race_ethnicity', type: 'radio' } 
      }),
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('race_ethnicity')
    })
  })

  it('should categorize disability inputs correctly', () => {
    const inputs = [
      createTestInput({ 
        label: 'Disability Status',
        element: { type: 'checkbox', name: 'disability' }
      }),
      createTestInput({ 
        label: 'Do you have a disability?',
        element: { className: 'disability-check', type: 'checkbox' } 
      }),
      createTestInput({ 
        label: 'Voluntary Self-Identification of Disability',
        element: { type: 'select', name: 'disability_self_id' } 
      }),
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('disability')
    })
  })

  it('should categorize phone inputs correctly', () => {
    const inputs = [
      createTestInput({ 
        label: 'Phone Number',
        element: { type: 'tel', name: 'phone' }
      }),
      createTestInput({ 
        element: { 
          name: 'telephone',
          placeholder: '(123) 456-7890'
        }
      }),
      createTestInput({ 
        label: 'Mobile',
        element: { autocomplete: 'tel-national' }
      }),
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('phone')
    })
  })

  it('should categorize country inputs correctly', () => {
    const inputs = [
      createTestInput({ 
        label: 'Country',
        element: { type: 'select-one', name: 'country' } 
      }),
      createTestInput({ 
        element: { 
          name: 'country_code',
          placeholder: 'Select your country',
          type: 'select' 
        }
      }),
      createTestInput({ 
        label: 'Location (Country)',
        element: { autocomplete: 'country-name', type: 'text' } 
      }),
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    result.forEach((input) => {
      expect(input.category).toBe('country')
    })
  })

  it('should categorize inputs with no matching category as unknown', () => {
    const inputs = [
      createTestInput({ 
        label: 'Favorite Color',
        element: { name: 'fav_color' }
      }),
      createTestInput({ 
        element: { placeholder: 'Your hobbies' }
      }),
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(2) 
    result.forEach((input) => {
      expect(input.category).toBe('unknown')
    })
  })

  it('should categorize inputs with empty or null labels (and no other strong identifiers) as unknown', () => {
    const inputs = [
      createTestInput({ label: '' }), 
      createTestInput({ label: null }), 
      createTestInput({ label: '     ' }), 
      createTestInput({ label: '', element: { name: 'email_address', type: 'email' } })
    ]

    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(4) 
    expect(result.find(r => r.element.name === 'email_address')?.category).toBe('email')
    expect(result.filter(r => r.category === 'unknown').length).toBe(3) 
  })

  it('should correctly categorize inputs using autocomplete attributes', () => {
    const inputs = [
      createTestInput({ element: { autocomplete: 'given-name' } }),
      createTestInput({ element: { autocomplete: 'family-name' } }),
      createTestInput({ element: { autocomplete: 'email' } }),
      createTestInput({ element: { autocomplete: 'tel' } }),
      createTestInput({ element: { autocomplete: 'country' } }),
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(5)
    expect(result.find(r => r.element.autocomplete === 'given-name')?.category).toBe('name')
    expect(result.find(r => r.element.autocomplete === 'family-name')?.category).toBe('name')
    expect(result.find(r => r.element.autocomplete === 'email')?.category).toBe('email')
    expect(result.find(r => r.element.autocomplete === 'tel')?.category).toBe('phone')
    expect(result.find(r => r.element.autocomplete === 'country')?.category).toBe('country')
  })

  it('should handle various combinations of attributes for categorization', () => {
    const inputs = [
      createTestInput({ label: 'Your Full Name', element: { type: 'text', placeholder: 'Enter name' } }), 
      createTestInput({ element: { name: 'contact_email', type: 'email' } }), 
      createTestInput({ label: 'Phone No.', element: { name: 'user_phone', placeholder: '###-###-####' } }), 
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    expect(result[0].category).toBe('name')
    expect(result[1].category).toBe('email')
    expect(result[2].category).toBe('phone')
  })

  it('should correctly prioritize categories if multiple keywords match (hypothetical)', () => {
    const inputs = [
      createTestInput({ label: 'Your Email and Name', element: { name: 'contact_field' } })
    ]
    const result = categorizeInputs(inputs)
    expect(result[0].category).toBe('name') 
  })

  it('should correctly categorize select elements', () => {
    const inputs = [
      createTestInput({ label: 'Gender', element: { type: 'select-one', name: 'gender_select' } }),
      createTestInput({ label: 'Race/Ethnicity', element: { type: 'select-multiple', name: 'race_select' } }),
      createTestInput({ label: 'Country of Residence', element: { type: 'select-one', name: 'residence_country' } }),
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(3)
    expect(result.find(r => r.element.name === 'gender_select')?.category).toBe('gender')
    expect(result.find(r => r.element.name === 'race_select')?.category).toBe('race_ethnicity')
    expect(result.find(r => r.element.name === 'residence_country')?.category).toBe('country')
  })

  it('should correctly categorize radio button inputs', () => {
    const inputs = [
      createTestInput({ label: 'Male', element: { type: 'radio', name: 'gender', value: 'male' } }),
      createTestInput({ label: 'Female', element: { type: 'radio', name: 'gender', value: 'female' } }),
      createTestInput({ label: 'Yes, I am a veteran', element: { type: 'radio', name: 'vet_status', value: 'yes' } }),
      createTestInput({ label: 'No, not a veteran', element: { type: 'radio', name: 'vet_status', value: 'no' } }),
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(4) 
    expect(result.filter(r => r.category === 'gender').length).toBe(2)
    expect(result.filter(r => r.category === 'veteran').length).toBe(2)
  })

  it('should correctly categorize checkbox inputs', () => {
    const inputs = [
      createTestInput({ label: 'I have a disability', element: { type: 'checkbox', name: 'has_disability' } }),
      createTestInput({ label: 'Opt-in for newsletter', element: { type: 'checkbox', name: 'newsletter_opt_in' } }) 
    ]
    const result = categorizeInputs(inputs)
    expect(result).toHaveLength(2) 
    expect(result.find(r => r.element.name === 'has_disability')?.category).toBe('disability')
    expect(result.find(r => r.element.name === 'newsletter_opt_in')?.category).toBe('unknown')
  })

  it('should correctly categorize textarea inputs if applicable', () => {
    const inputs = [
      createTestInput({ label: 'Home Address', element: { type: 'textarea', name: 'home_address_text' } }),
      createTestInput({ label: 'Comments', element: { type: 'textarea', name: 'user_comments' } })
    ]
    const result = categorizeInputs(inputs)
    expect(result.length).toBe(2)
    result.forEach((input) => {
      expect(input.category).toBe('unknown')
    });
  })
})
