// packages/chrome-extension/src/content/inputsManipulation/fillSelectOrInputExact.ts

import type { SelectOption } from './optionExtraction'
import type { SelectLikeElement } from './selectMatching'

/**
 * Fills a select-like element (native <select> or custom <input>-based select)
 * with exactly the provided value. Throws an error if the value is not found
 * among the available options.
 *
 * @param element   The select-like element to fill.
 * @param value     A string representing exactly one of the option texts or values.
 * @throws          Error if `value` is not a non-empty string, or if no matching option is found.
 */
export const fillSelectOrInputExact = async (
  element: SelectLikeElement,
  option: SelectOption,
): Promise<void> => {
  // 4. Handle a native <select> element
  if (element instanceof HTMLSelectElement) {
    // If bestMatch.value is null, that usually means a placeholder; we clear selection
    if (option.value !== null) {
      const exists = Array.from(element.options).some((opt) => opt.value === option.value)
      if (!exists) {
        throw new Error(
          `fillSelectOrInputExact: Found matching text "${option.text}", but no <option> with value "${option.value}" exists in the <select>.`,
        )
      }
      element.value = option.value
    }
    element.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    return
  }

  // 5. Handle a custom <input>-based select (e.g., React-Select, MUI Autocomplete, etc.)
  if (element instanceof HTMLInputElement) {
    const targetText = option.text
    const targetValue = option.value

    // If the option has an associated DOM node, simulate a user click on it:
    if (option.domNode && option.domNode instanceof HTMLElement) {
      option.domNode.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true, composed: true }),
      )
      option.domNode.dispatchEvent(
        new MouseEvent('mouseup', { bubbles: true, cancelable: true, composed: true }),
      )
      option.domNode.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }),
      )

      // Some components update the visible value asynchronously; enforce it immediately if needed
      if (element.value !== targetText) {
        element.value = targetText
      }
    }

    // Dispatch native events so that the component picks up the change
    element.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    element.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    element.dispatchEvent(new Event('blur', { bubbles: true, composed: true }))
    return
  }
}
