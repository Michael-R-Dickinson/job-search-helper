import type { SelectOption } from './optionExtraction'
import { getCustomSelectOptions } from './optionExtraction'
import type { SelectLikeElement } from './selectMatching'
import { getSelectOptions, parsePreferenceValues, pickBestOption } from './selectMatching'

/**
 * fills a select-like element (HTMLSelectElement or HTMLInputElement)
 * with a specified value, attempting to match the best option.
 *
 */
export const robustlyFillSelectOrInput = async (
  element: SelectLikeElement,
  value: string | boolean, // Retaining boolean for compatibility, though string is primary focus
): Promise<void> => {
  if (!(typeof value === 'string') || !value.trim()) {
    // console.warn('robustlyFillSelectOrInput: Provided value is not a non-empty string or is only whitespace. Skipping.', { value });
    return
  }

  const searchValues = value.includes('|') ? parsePreferenceValues(value) : [value.trim()]
  if (searchValues.length === 0 || searchValues.every((s) => !s)) {
    // console.warn('robustlyFillSelectOrInput: No valid search values after parsing. Skipping.', { searchValues });
    return
  }

  const selectOptions: SelectOption[] =
    element instanceof HTMLSelectElement
      ? getSelectOptions(element)
      : // Cast to HTMLInputElement is safe here due to the SelectLikeElement type guard and prior check
        await getCustomSelectOptions(element as HTMLInputElement)

  if (selectOptions.length === 0) {
    /* console.warn(
      `robustlyFillSelectOrInput: No options found for element (ID: ${element.id || 'N/A'}, Class: ${element.className || 'N/A'}) when trying to fill with "${value}". Input Text: "${inputText}"`,
    ); */
    return
  }

  const bestMatch = pickBestOption(selectOptions, searchValues)

  if (!bestMatch) {
    /* const optionsSummary = selectOptions.map(o => `"${o.text}" (val: ${o.value === null ? 'null' : `"${o.value}"`})`).join(', ');
    console.warn(
      `robustlyFillSelectOrInput: No best match found for element (ID: ${element.id || 'N/A'}, Class: ${element.className || 'N/A'}) with search values: "${searchValues.join('|')}" among options: [${optionsSummary}]. Input Text: "${inputText}"`,
    ); */
    return
  }

  if (element instanceof HTMLSelectElement) {
    if (bestMatch.value !== null && element.value !== bestMatch.value) {
      const optionExists = Array.from(element.options).some((opt) => opt.value === bestMatch.value)
      if (optionExists) {
        element.value = bestMatch.value
        element.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
        // console.log(`HTMLSelectElement: Set to "${bestMatch.text}" (value: ${bestMatch.value}). Input Text: "${inputText}"`);
      } else {
        // console.warn(`HTMLSelectElement: Option with value "${bestMatch.value}" not found for "${bestMatch.text}". Not setting. Input Text: "${inputText}"`);
      }
    } else if (bestMatch.value === null && element.value !== '') {
      // Handles case where best match is an option with no value (e.g. placeholder "Select...")
      // and we don't want to clear a potentially valid existing selection with a "null" match.
      // console.warn(`HTMLSelectElement: Best match ("${bestMatch.text}") has null value. Current element value is "${element.value}". Not setting. Input Text: "${inputText}"`);
    } else if (element.value === bestMatch.value) {
      // This also covers bestMatch.value === null and element.value === '' (if it was a placeholder)
      // console.log(`HTMLSelectElement already set to "${bestMatch.text}" (value: ${bestMatch.value}). Input Text: "${inputText}"`);
    }
  } else if (element instanceof HTMLInputElement) {
    // For custom <input>-based selects
    const currentInputValue = element.value
    const targetText = bestMatch.text // Text to display and potentially set
    const targetValue = bestMatch.value // Internal value, might be an ID

    // Check if already correctly set.
    // For inputs, displayed text is often the key. Sometimes the .value attribute might also hold the actual selected value/ID.
    if (
      currentInputValue === targetText ||
      (targetValue !== null && currentInputValue === targetValue)
    ) {
      // console.log(`HTMLInputElement already correctly set to "${currentInputValue}". Input Text: "${inputText}"`);
      return
    }

    if (bestMatch.domNode && bestMatch.domNode instanceof HTMLElement) {
      // console.log(`HTMLInputElement: Attempting to click DOM node for "${targetText}". Input Text: "${inputText}"`);
      // Prioritize clicking the option's DOM node
      bestMatch.domNode.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true, composed: true }),
      )
      bestMatch.domNode.dispatchEvent(
        new MouseEvent('mouseup', { bubbles: true, cancelable: true, composed: true }),
      )
      bestMatch.domNode.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }),
      )

      // Custom selects often update their input display to the option's text content after a click.
      // We set it here to ensure consistency, as the click might not always do this or might do it asynchronously.
      if (element.value !== targetText) {
        element.value = targetText
      }
    } else if (targetText) {
      // If domNode is not available, prioritize setting the display text.
      // Fallback: if no domNode, try setting the value to the text of the option.
      // This is common for inputs that act as dropdowns; their .value shows the selected text.
      // console.log(`HTMLInputElement: No DOM node, attempting to set value to display text "${targetText}". Input Text: "${inputText}"`);
      element.value = targetText
    } else if (targetValue !== null) {
      // If text is also not available (should be rare for a valid option), fall back to targetValue.
      // This might be relevant if the input is supposed to hold an ID directly.
      // console.log(`HTMLInputElement: No DOM node and no text, attempting to set value to internal value "${targetValue}". Input Text: \"${inputText}\"`);
      element.value = targetValue
    } else {
      // console.warn(`HTMLInputElement: Best match ("${targetText}" / value: "${targetValue}") has no domNode and null/empty text/value. Cannot reliably fill. Input Text: "${inputText}"`);
      return // Cannot proceed if no way to set a meaningful value
    }

    // Dispatch events to ensure the component recognizes the change
    element.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    element.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    element.dispatchEvent(new Event('blur', { bubbles: true, composed: true })) // Blur after change
  }
}
