/**
 * Utility functions for intelligent select option matching using fuzzy search
 */

import Fuse from 'fuse.js'
import { getCustomSelectOptions } from './optionExtraction'
import type { SelectOption } from './optionExtraction'
import { CANONICAL } from './canonicalSelectValues'
import { fillSelectOrInputExact } from './fillSelectInput'

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
      domNode: option,
    }))
    .filter((option) => option.value !== '' && option.text !== 'Select an option...')
}

const isNegated = (value: string): boolean => {
  const negations = ['not']
  if (negations.some((negation) => value.toLowerCase().includes(negation))) {
    return true
  }
  return false
}

/**
 * Finds the best matching SelectOption for a given logical key using canonical synonyms and Fuse.js
 */
function findBestOptionMatch(
  options: SelectOption[],
  value: string,
  maxScore = 0.5,
): SelectOption | null {
  const synonymsStrings = value
    .toLowerCase()
    .split('|')
    .map((s) => s.trim())
  if (!options.length) return null

  // Prepare Fuse index over lowercased option text
  const optionList = options.map((opt, i) => ({
    label: opt.text.trim().toLowerCase(),
    index: i,
    value: opt.value,
    text: opt.text,
    domNode: opt.domNode,
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

  for (const syn of synonymsStrings) {
    const synIsNegated = isNegated(syn)
    const results = fuse.search(syn)
    if (!results.length) continue

    results
      .map((r) => {
        if (isNegated(r.item.text) != synIsNegated) {
          return { ...r, score: r?.score ? r?.score * 0.5 : 0 }
        }
        return r
      })
      .sort((a, b) => (a?.score ?? 0) - (b?.score ?? 0))

    const { score, item } = results[0]
    if (score !== undefined && score < bestScore && score <= maxScore) {
      bestScore = score
      bestOption = { value: item.value, text: item.text, domNode: item.domNode }
    }
  }

  // const optionsString = optionList.map((o) => `${o.text}`).join(', ')
  // console.log(
  //   `Instruction: ${inputText}, \n\nSynonyms: ${synonyms},\n Options: ${optionsString}\n\nBest Option: ${bestOption?.text}`,
  // )

  return bestOption
}

/**
 * Main function to handle filling a select-like element with intelligent matching.
 * Works with both HTMLSelectElement and custom select-like input elements (HTMLInputElement).
 */
export const fillSelectLikeElement = async (
  element: SelectLikeElement,
  value: string | boolean,
  // Passed in for debugging purposes
  inputText: string | null,
): Promise<void> => {
  if (!(typeof value === 'string')) return
  // searchValues are the parsed values we want to fill, for example, for an ethnicity field, if the passed value was
  // "Asian|East Asian" then searchValues would be ["Asian", "East Asian"]
  const selectOptions =
    element instanceof HTMLSelectElement
      ? getSelectOptions(element)
      : await getCustomSelectOptions(element)

  if (selectOptions.length === 0) return

  const bestMatch = findBestOptionMatch(selectOptions, value)
  if (!bestMatch?.value || element.value === bestMatch.value) return

  // const optionsString = selectOptions.map((o) => `${o.text}`).join(', ')
  // console.log(
  //   `Instruction: ${inputText}, \n\nIdeal: ${value}, Filled: ${bestMatch.text} \noptions: ${optionsString}`,
  // )

  await fillSelectOrInputExact(element, bestMatch)
}
