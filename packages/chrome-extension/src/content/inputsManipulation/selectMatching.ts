/**
 * Utility functions for intelligent select option matching using fuzzy search
 */

import Fuse from 'fuse.js'
import { getCustomSelectOptions } from './optionExtraction'
import type { SelectOption } from './optionExtraction'
import { robustlyFillSelectOrInput } from './fillSelectInput'
import { CANONICAL } from './canonicalSelectValues'

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
  console.log(
    `searchValue: ${searchValue}, results: ${results.map((r) => `${r.item.text} - ${r.score}`).join(', ')}`,
  )

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
  console.log(
    `\n\nsearchValues: ${searchValues} \noptions: ${options.map((o) => o.text).join(', ')}`,
  )
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
  const selectOptions =
    element instanceof HTMLSelectElement
      ? getSelectOptions(element)
      : await getCustomSelectOptions(element)

  if (selectOptions.length === 0) return

  const bestMatch = findBestCanonicalMatch(selectOptions, value, 0.5, inputText)
  if (!bestMatch?.value || element.value === bestMatch.value) return

  // const optionsString = selectOptions.map((o) => `${o.text}`).join(', ')
  // console.log(
  //   `Instruction: ${inputText}, \n\nIdeal: ${value}, Filled: ${bestMatch.text} \noptions: ${optionsString}`,
  // )

  element.value = bestMatch.value
  robustlyFillSelectOrInput(element, bestMatch.value)
}

/**
 * Finds the best matching SelectOption for a given logical key using canonical synonyms and Fuse.js
 */
function findBestCanonicalMatch(
  options: SelectOption[],
  logicalKey: string,
  maxScore = 0.5,
  inputText?: string,
): SelectOption | null {
  const record = CANONICAL.find((r) => r.key === logicalKey)
  const synonyms = record?.synonyms || [logicalKey]
  if (!options.length) return null

  // Prepare Fuse index over lowercased option text
  const optionList = options.map((opt, i) => ({
    label: opt.text.trim().toLowerCase(),
    index: i,
    value: opt.value,
    text: opt.text,
  }))
  const fuse = new Fuse(optionList, {
    keys: ['label'],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 1,
    includeScore: true,
  })

  let bestScore = Infinity
  let bestOption: SelectOption | null = null

  console.log('InputText', inputText)
  console.log('Synonyms', synonyms)
  for (const syn of synonyms) {
    const results = fuse.search(syn.toLowerCase())
    console.log('Results', results)
    if (!results.length) continue
    const { score, item } = results[0]
    if (score !== undefined && score < bestScore && score <= maxScore) {
      bestScore = score
      bestOption = { value: item.value, text: item.text }
    }
  }
  console.log('Best Option', bestOption, '\n\n')

  // const optionsString = optionList.map((o) => `${o.text}`).join(', ')
  // console.log(
  //   `Instruction: ${inputText}, \n\nSynonyms: ${synonyms},\n Options: ${optionsString}\n\nBest Option: ${bestOption?.text}`,
  // )

  return bestOption
}
