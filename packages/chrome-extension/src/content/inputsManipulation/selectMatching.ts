/**
 * Utility functions for intelligent select option matching using fuzzy search
 */

import Fuse from 'fuse.js'
import { getCustomSelectOptions } from './optionExtraction'
import type { SelectOption } from './optionExtraction'
import { robustlyFillSelectOrInput } from './fillSelectInput'

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

const preprocessSearchValuesForFuzzyMatching = (searchValues: string[]): string[] => {
  const isTrue = searchValues.find((s) => s === 'true')
  if (isTrue) {
    searchValues.push('yes')
  }
  const isFalse = searchValues.find((s) => s === 'false')
  if (isFalse) {
    searchValues.push('no')
  }
  return searchValues
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
    ignoreLocation: true, // If false, might make short string matching harder
    findAllMatches: true, // Get all matches to choose the best one

    shouldSort: true, // User added
    includeScore: true,
    includeMatches: true,
  }

  const fuse = new Fuse(options, fuseOptions)
  const results = fuse.search(searchValue)
  // console.log(`searchValue: ${searchValue}, results: `, results)

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

export const pickBestOption = (
  options: SelectOption[],
  searchValues: string[],
): SelectOption | null => {
  searchValues = preprocessSearchValuesForFuzzyMatching(searchValues)
  for (const searchValue of searchValues) {
    const bestMatch = findBestMatch(searchValue, options)
    if (bestMatch) {
      return bestMatch
    }
  }

  return null
}
/**
 * Attempts to select the best option based on a single value or preference values
 * for HTMLSelectElement.
 */
// export const selectBestOption = (selectElement: HTMLSelectElement, searchValues: string[]) => {}

const fillSelectElement = (element: HTMLSelectElement, searchValues: string[]) => {
  const options = getSelectOptions(element)
  if (options.length === 0) return

  const bestMatch = pickBestOption(options, searchValues)
  if (bestMatch?.value && element.value !== bestMatch.value) {
    element.value = bestMatch.value
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }

  // // Fallback for HTMLSelectElement if direct value setting is still desired (e.g. for empty value)
  // // or if the value is an actual option value not caught by intelligent matching (less likely)
  // const availableValues = Array.from(element.options).map((o) => o.value)
  // if (availableValues.includes(value) || value === '') {
  //   // Allow setting to empty value
  //   if (element.value !== value) {
  //     element.value = value
  //     element.dispatchEvent(new Event('change', { bubbles: true }))
  //   }
  // } else {
  //   // If the value is not a valid option, try to set it anyway (some selects allow arbitrary values)
  //   // This part might be controversial based on "Never default to just filling in the value"
  //   // For standard HTMLSelectElement, this is usually safe, but for consistency, we might remove it.
  //   // For now, keeping it as HTMLSelectElement behavior is often expected to allow setting value directly.
  //   const originalValue = element.value
  //   element.value = value
  //   if (element.value === value) {
  //     element.dispatchEvent(new Event('change', { bubbles: true }))
  //   } else {
  //     element.value = originalValue // Revert if not settable
  //   }
  // }
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
    const bestMatch = pickBestOption(options, searchValues)
    if (bestMatch?.value && inputElement.value !== bestMatch.value) {
      inputElement.value = bestMatch.value
      inputElement.dispatchEvent(new Event('input', { bubbles: true }))
      inputElement.dispatchEvent(new Event('change', { bubbles: true }))
      inputElement.dispatchEvent(new Event('blur', { bubbles: true }))
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
export const fillSelectLikeElement = async (
  element: SelectLikeElement,
  value: string | boolean,
  inputText?: string,
): Promise<void> => {
  if (!(typeof value === 'string')) return
  // searchValues are the parsed values we want to fill, for example, for an ethnicity field, if the passed value was
  // "Asian|East Asian" then searchValues would be ["Asian", "East Asian"]
  const searchValues = value.includes('|') ? parsePreferenceValues(value) : [value]
  const selectOptions =
    element instanceof HTMLSelectElement
      ? getSelectOptions(element)
      : await getCustomSelectOptions(element)

  if (searchValues.length === 0) return
  if (selectOptions.length === 0) return

  const bestMatch = pickBestOption(selectOptions, searchValues)
  if (!bestMatch?.value || element.value === bestMatch.value) return

  // const optionsString = selectOptions.map((o) => `${o.text}`).join(', ')
  // console.log(
  //   `Instruction: ${inputText}, \n\nIdeal: ${value}, Filled: ${bestMatch.text} \noptions: ${optionsString}`,
  // )

  element.value = bestMatch.value
  robustlyFillSelectOrInput(element, bestMatch.value)
}
