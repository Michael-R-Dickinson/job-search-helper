import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CategorizedInput } from '../schema'
import {
  GenderEnum,
  VeteranStatusEnum,
  RaceEthnicityEnum,
  HispanicLatinoEnum,
  DisabilityStatusEnum,
  AuthorizationStatusEnum,
  SponsorshipStatusEnum,
} from '../schema'
import getHandlerForInputCategory from '../inputTypeHandlers'

// Mock saveUserAutofillValue
vi.mock('../../firebase/realtimeDB', () => ({
  saveUserAutofillValue: vi.fn(),
}))
import { saveUserAutofillValue } from '../../firebase/realtimeDB'

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

  it('handles country, mailing_address, school, degree, discipline, end_date_year, linkedin_profile', () => {
    const fields = [
      { cat: 'country', val: 'USA' },
      { cat: 'mailing_address', val: '123 Main St' },
      { cat: 'school', val: 'Test University' },
      { cat: 'degree', val: 'BSc' },
      { cat: 'discipline', val: 'CS' },
      { cat: 'end_date_year', val: '2024' },
      { cat: 'linkedin_profile', val: 'https://linkedin.com/in/test' },
    ]
    for (const { cat, val } of fields) {
      const handler = getHandlerForInputCategory(cat as any, { [cat]: val })
      const input = baseInput({
        category: cat as any,
        element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-14' }) },
      })
      expect(handler.getAutofillInstruction(input)).toEqual({
        action: 'fill',
        value: val,
        id: 'af-14',
      })
      handler.saveAutofillValue(input, 'user2')
      expect(saveUserAutofillValue).toHaveBeenCalledWith('user2', cat, '')
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

  it('skips if no value is present', () => {
    const handler = getHandlerForInputCategory('gender', {})
    const input = baseInput({
      category: 'gender',
      element: { ...baseElement({ fieldType: 'text', elementReferenceId: 'af-15' }) },
    })
    expect(handler.getAutofillInstruction(input)).toEqual({ action: 'skip', id: 'af-15' })
  })
})
