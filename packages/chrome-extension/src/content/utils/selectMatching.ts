/**
 * Utility functions for intelligent select option matching using fuzzy search
 */

import Fuse from 'fuse.js'

export interface SelectOption {
  value: string
  text: string
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
 * Gets all available options from a select element
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

  // Configure Fuse.js for fuzzy searching
  const fuseOptions = {
    keys: [
      { name: 'text', weight: 0.7 },
      { name: 'value', weight: 0.3 },
    ],
    threshold: 0.6, // More permissive threshold for better matching
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
    ignoreLocation: true,
    findAllMatches: true, // Get all matches to choose the best one
  }

  const fuse = new Fuse(options, fuseOptions)
  const results = fuse.search(searchValue)

  if (results.length > 0) {
    const bestMatch = results[0]
    return bestMatch.item
  }

  return null
}

/**
 * Attempts to select the best option based on a single value or preference values
 */
export const selectBestOption = (
  selectElement: HTMLSelectElement,
  searchValues: string[],
): boolean => {
  const options = getSelectOptions(selectElement)

  if (options.length === 0) return false

  // Try each search value in order of preference
  for (const searchValue of searchValues) {
    // First try exact match (case insensitive)
    const exactMatch = options.find((option) => {
      const cleanValue = option.value.toLowerCase().replace(/^string:/, '')
      const searchLower = searchValue.toLowerCase()

      return (
        option.text.toLowerCase() === searchLower ||
        cleanValue === searchLower ||
        option.value.toLowerCase() === searchLower
      )
    })

    if (exactMatch) {
      console.log(`Exact match for "${searchValue}":`, exactMatch)
      if (selectElement.value !== exactMatch.value) {
        selectElement.value = exactMatch.value
        selectElement.dispatchEvent(new Event('change', { bubbles: true }))
      }
      return true
    }

    // If no exact match, try fuzzy matching
    const fuzzyMatch = findBestMatch(searchValue, options)
    if (fuzzyMatch) {
      if (selectElement.value !== fuzzyMatch.value) {
        selectElement.value = fuzzyMatch.value
        selectElement.dispatchEvent(new Event('change', { bubbles: true }))
      }
      return true
    }
  }

  console.log('No suitable match found for search values:', searchValues)
  console.log('Available options:', options)
  return false
}

/**
 * Main function to handle filling a select element with intelligent matching
 * Always attempts to find the best match, regardless of input format
 */
export const fillSelectElement = (selectElement: HTMLSelectElement, value: string): void => {
  console.log('Filling select element with value:', value)

  let searchValues: string[] = []

  // Check if this looks like a pipe-separated preference list
  if (value.includes('|')) {
    searchValues = parsePreferenceValues(value)
  } else {
    // Single value - still use intelligent matching
    searchValues = [value]
  }

  // Always attempt intelligent matching
  if (searchValues.length > 0) {
    const success = selectBestOption(selectElement, searchValues)

    // If intelligent selection succeeded, we're done
    if (success) {
      return
    }
  }

  // Final fallback: direct value assignment (only if intelligent matching completely failed)
  console.log('Falling back to direct value assignment')
  // Only attempt to set the value if it's a valid option or if we want to force it
  const availableValues = Array.from(selectElement.options).map((o) => o.value)
  if (availableValues.includes(value) || value === '') {
    if (selectElement.value !== value) {
      selectElement.value = value
      selectElement.dispatchEvent(new Event('change', { bubbles: true }))
    }
  } else {
    // If the value is not a valid option, try to set it anyway (some selects allow arbitrary values)
    const originalValue = selectElement.value
    selectElement.value = value

    // If the assignment worked (value actually changed), dispatch the event
    if (selectElement.value === value) {
      selectElement.dispatchEvent(new Event('change', { bubbles: true }))
    } else {
      // If assignment failed, revert to original value
      selectElement.value = originalValue
    }
  }
}
