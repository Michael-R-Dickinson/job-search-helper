/**
 * Utility functions for intelligent select option matching using fuzzy search
 */

import Fuse from 'fuse.js'
import { getCustomSelectOptions } from './optionExtraction'
import type { SelectOption } from './optionExtraction'

// Type for elements that can behave like selects
export type SelectLikeElement = HTMLSelectElement | HTMLInputElement

/**
 * Determines if an element behaves like a select element
 */
export const isSelectLikeElement = (element: HTMLElement): element is SelectLikeElement => {
  // Standard HTML select elements
  if (element instanceof HTMLSelectElement) {
    return true
  }

  // Custom select elements are often input elements with specific attributes
  if (element instanceof HTMLInputElement) {
    // Check for common patterns that indicate a select-like behavior
    const hasComboboxRole = element.getAttribute('role') === 'combobox'
    const hasPopup = element.getAttribute('aria-haspopup') === 'true'
    const hasListAutocomplete = element.getAttribute('aria-autocomplete') === 'list'
    const hasSelectClass = element.className.toLowerCase().includes('select')
    const hasSelectId = element.id.toLowerCase().includes('select')

    // If any of these patterns match, it's likely a custom select
    return hasComboboxRole || hasPopup || hasListAutocomplete || hasSelectClass || hasSelectId
  }

  return false
}

/**
 * Parses pipe-separated preference values
 */
export const parsePreferenceValues = (value: string): string[] => {
  return value
    .split('|')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
}

/**
 * Gets all available options from a standard select element
 */
export const getSelectOptions = (selectElement: HTMLSelectElement): SelectOption[] => {
  return Array.from(selectElement.options)
    .map((option) => ({
      value: option.value,
      text: option.textContent?.trim() || '',
    }))
    .filter((option) => option.value !== '' && option.text !== 'Select an option...')
}

/**
 * Enhanced fuzzy matching using fuse.js for better option selection
 */
export const findBestMatch = (
  searchValue: string,
  options: SelectOption[],
): SelectOption | null => {
  if (options.length === 0 || !searchValue.trim()) return null

  const fuseOptions = {
    keys: [
      { name: 'text', weight: 0.7 },
      { name: 'value', weight: 0.3 },
    ],
    threshold: 0.5, // Adjusted for stricter matching
    distance: 100,
    minMatchCharLength: 2, // Consider increasing if very short matches are an issue
    includeScore: true,
    ignoreLocation: true, // If false, might make short string matching harder
    findAllMatches: true, // Get all matches to choose the best one
    shouldSort: true, // User added
  }
  // console.log('\n\n\nsearchValue', searchValue, 'options', options); // User added log - REMOVING

  const fuse = new Fuse(options, fuseOptions)
  const results = fuse.search(searchValue)

  // Temporary logging for debugging a specific test case - REMOVING
  // if (searchValue === 'first' && options.some(o => o.value === 'optionA')) {
  //   console.log('[DEBUG] findBestMatch with searchValue "first":', JSON.stringify(results, null, 2));
  // }

  if (results.length > 0) {
    const bestMatch = results[0]
    return bestMatch.item
  }

  return null
}

/**
 * Attempts to select the best option based on a single value or preference values
 * for HTMLSelectElement.
 */
export const selectBestOption = (
  selectElement: HTMLSelectElement,
  searchValues: string[],
): boolean => {
  const options = getSelectOptions(selectElement)
  if (options.length === 0) return false

  for (const searchValue of searchValues) {
    const exactMatch = options.find((option) => {
      const cleanValue = option.value?.toLowerCase().replace(/^string:/, '')
      const searchLower = searchValue.toLowerCase()
      return (
        option.text.toLowerCase() === searchLower ||
        cleanValue === searchLower ||
        option.value?.toLowerCase() === searchLower
      )
    })

    if (exactMatch && exactMatch.value) {
      if (selectElement.value !== exactMatch.value) {
        selectElement.value = exactMatch.value
        selectElement.dispatchEvent(new Event('change', { bubbles: true }))
      }
      return true
    }

    const fuzzyMatch = findBestMatch(searchValue, options)
    if (fuzzyMatch && fuzzyMatch.value) {
      if (selectElement.value !== fuzzyMatch.value) {
        selectElement.value = fuzzyMatch.value
        selectElement.dispatchEvent(new Event('change', { bubbles: true }))
      }
      return true
    }
  }
  return false
}

/**
 * Attempts intelligent option selection for custom select inputs (HTMLInputElement).
 */
export const selectBestCustomOption = (
  inputElement: HTMLInputElement,
  searchValues: string[],
  options: SelectOption[], // Options are now passed in, typically from getCustomSelectOptions
): boolean => {
  if (options.length === 0) return false

  for (const searchValue of searchValues) {
    const fuzzyMatch = findBestMatch(searchValue, options)
    if (fuzzyMatch) {
      if (inputElement.value !== fuzzyMatch.value) {
        if (!fuzzyMatch.value) {
          console.error('no fuzzy match found for value: ', searchValue, ', options: ', options)
          return false
        }
        inputElement.value = fuzzyMatch.value
        inputElement.dispatchEvent(new Event('input', { bubbles: true }))
        inputElement.dispatchEvent(new Event('change', { bubbles: true }))
        inputElement.dispatchEvent(new Event('blur', { bubbles: true }))
      }
      return true
    }
  }
  return false
}

/**
 * Fills a custom select-like input element.
 * It now relies on getCustomSelectOptions (from optionExtraction.ts) to find options.
 */
const fillCustomSelectInput = async (
  inputElement: HTMLInputElement,
  value: string, // Original value from instruction (single or pipe-separated)
  searchValues: string[], // Parsed values for matching
  inputText?: string,
): Promise<void> => {
  const options = await getCustomSelectOptions(inputElement) // Get options using the imported function

  if (options.length > 0) {
    // const optionsString = options.map((o) => `${o.text}`).join(', ')
    // console.log(`Instruction: ${inputText}, \t with: ${value}, \noptions: ${optionsString}`)
    const success = selectBestCustomOption(inputElement, searchValues, options)
    if (success) {
      return
    }
  }

  // If no options were found, or if matching failed, log a warning.
  console.warn(
    `Could not find or match an option for custom select input (ID: ${inputElement.id || 'N/A'}, Class: ${inputElement.className || 'N/A'}) with search values: ${searchValues.join(', ')}. Input not changed.`,
  )
}

/**
 * Main function to handle filling a select-like element with intelligent matching.
 * Works with both HTMLSelectElement and custom select-like input elements (HTMLInputElement).
 */
export const fillSelectElement = (
  element: SelectLikeElement,
  value: string | boolean,
  inputText?: string,
): void => {
  if (!(typeof value === 'string')) return

  let searchValues: string[] = []
  if (value.includes('|')) {
    searchValues = parsePreferenceValues(value)
  } else {
    searchValues = [value]
  }

  // console.log('filling select-like element', element.tagName, value, 'searchValues', searchValues) // User removed log

  if (element instanceof HTMLSelectElement) {
    if (searchValues.length > 0) {
      const success = selectBestOption(element, searchValues)
      if (success) {
        return
      }
    }
    // Fallback for HTMLSelectElement if direct value setting is still desired (e.g. for empty value)
    // or if the value is an actual option value not caught by intelligent matching (less likely)
    const availableValues = Array.from(element.options).map((o) => o.value)
    if (availableValues.includes(value) || value === '') {
      // Allow setting to empty value
      if (element.value !== value) {
        element.value = value
        element.dispatchEvent(new Event('change', { bubbles: true }))
      }
    } else {
      // If the value is not a valid option, try to set it anyway (some selects allow arbitrary values)
      // This part might be controversial based on "Never default to just filling in the value"
      // For standard HTMLSelectElement, this is usually safe, but for consistency, we might remove it.
      // For now, keeping it as HTMLSelectElement behavior is often expected to allow setting value directly.
      const originalValue = element.value
      element.value = value
      if (element.value === value) {
        element.dispatchEvent(new Event('change', { bubbles: true }))
      } else {
        element.value = originalValue // Revert if not settable
      }
    }
  } else if (element instanceof HTMLInputElement) {
    fillCustomSelectInput(element, value, searchValues, inputText)
  }
}
