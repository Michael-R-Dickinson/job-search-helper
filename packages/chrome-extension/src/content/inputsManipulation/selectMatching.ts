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
