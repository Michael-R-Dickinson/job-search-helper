/**
 * Utility functions for intelligent select option matching
 */

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
 * Simplified keyword-based matching for common job application scenarios
 */
export const findBestMatch = (
  preferenceValue: string,
  options: SelectOption[],
): SelectOption | null => {
  if (options.length === 0) return null

  const preference = preferenceValue.toLowerCase().trim()

  // Direct exact matches (case insensitive)
  for (const option of options) {
    const optionText = option.text.toLowerCase()
    const optionValue = option.value.toLowerCase().replace(/^string:/, '')

    if (optionText === preference || optionValue === preference) {
      return option
    }
  }

  // Keyword-based matching with specific patterns
  const patterns: { [key: string]: string[] } = {
    linkedin: ['linkedin', 'social media', 'social network'],
    'job board': ['job board', 'job posting', 'posting', 'indeed', 'glassdoor', 'monster'],
    website: ['website', 'company website', 'company site', 'corporate website'],
    online: ['online', 'internet', 'web', 'digital'],
    referral: ['referral', 'employee referral', 'friend', 'referred'],
    recruiter: ['recruiter', 'sourced', 'headhunter', 'directly sourced'],
    'career fair': ['career fair', 'job fair', 'fair'],
    agency: ['agency', 'recruiting agency', 'staffing'],
    other: ['other', 'miscellaneous'],
  }

  // Find matches using keyword patterns
  const matchingPatterns = patterns[preference] || [preference]

  for (const pattern of matchingPatterns) {
    for (const option of options) {
      const optionText = option.text.toLowerCase()
      const optionValue = option.value.toLowerCase().replace(/^string:/, '')

      // Check if the pattern is contained in option text or value
      if (optionText.includes(pattern) || optionValue.includes(pattern)) {
        return option
      }
    }
  }

  // Fallback: simple word matching
  const preferenceWords = preference.split(/\s+/)
  for (const word of preferenceWords) {
    if (word.length < 3) continue // Skip very short words

    for (const option of options) {
      const optionText = option.text.toLowerCase()
      const optionValue = option.value.toLowerCase().replace(/^string:/, '')

      if (optionText.includes(word) || optionValue.includes(word)) {
        return option
      }
    }
  }

  return null
}

/**
 * Attempts to select the best option based on preference values
 */
export const selectBestOption = (
  selectElement: HTMLSelectElement,
  preferenceValues: string[],
): boolean => {
  const options = getSelectOptions(selectElement)

  if (options.length === 0) return false

  // Try each preference value in order
  for (const preferenceValue of preferenceValues) {
    const match = findBestMatch(preferenceValue, options)

    if (match) {
      console.log(`Matched preference "${preferenceValue}" to option:`, match)
      if (selectElement.value !== match.value) {
        selectElement.value = match.value
        selectElement.dispatchEvent(new Event('change', { bubbles: true }))
      }
      return true
    }
  }

  console.log('No suitable match found for preferences:', preferenceValues)
  console.log('Available options:', options)
  return false
}

/**
 * Main function to handle filling a select element with preference-based selection
 */
export const fillSelectElement = (selectElement: HTMLSelectElement, value: string): void => {
  // Check if this looks like a pipe-separated preference list
  if (value.includes('|')) {
    console.log('Filling select element with preference values:', value)
    const preferenceValues = parsePreferenceValues(value)
    console.log('Parsed preference values:', preferenceValues)

    // Only try preference matching if we actually have valid preferences
    if (preferenceValues.length > 0) {
      const success = selectBestOption(selectElement, preferenceValues)
      console.log('Selection success:', success)

      // If preference-based selection succeeded, we're done
      if (success) {
        return
      }
    }

    // If preference-based selection failed or no valid preferences, fall back to direct value assignment
    console.log('Falling back to direct value assignment')
    if (selectElement.value !== value) {
      selectElement.value = value
      selectElement.dispatchEvent(new Event('change', { bubbles: true }))
    }
  } else {
    // Direct value assignment
    if (selectElement.value !== value) {
      selectElement.value = value
      selectElement.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
}
