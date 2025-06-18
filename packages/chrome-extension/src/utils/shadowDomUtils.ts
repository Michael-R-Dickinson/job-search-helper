/**
 * Utility functions for working with Shadow DOM elements
 */

import { HOST_ELEMENT_ID } from '../content'

export type ShadowDomElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLButtonElement

/**
 * Helper function to check if an element is under the perfectify host and should be excluded
 * @param element - Element to check
 * @returns true if element should be excluded from queries
 */
const shouldExcludeElement = (element: Element): boolean => {
  // Check if this element is the perfectify host itself
  if (element.id === HOST_ELEMENT_ID) {
    return true
  }

  // Check if this element is a descendant of the perfectify host
  const hostElement = document.getElementById(HOST_ELEMENT_ID)
  if (hostElement && hostElement.contains(element)) {
    return true
  }

  return false
}

/**
 * Helper function to check if a root should be excluded from traversal
 * @param root - Root element to check
 * @returns true if root should be excluded
 */
const shouldExcludeRoot = (root: Document | DocumentFragment | Element): boolean => {
  if (root instanceof Element) {
    return shouldExcludeElement(root)
  }
  return false
}

/**
 * Helper function to check if a shadow host should be excluded
 * @param shadowHost - The element that hosts the shadow DOM
 * @returns true if the shadow DOM should be excluded
 */
const shouldExcludeShadowHost = (shadowHost: Element): boolean => {
  return shadowHost.id === HOST_ELEMENT_ID
}

/**
 * Recursively queries elements across both regular DOM and Shadow DOM boundaries
 * @param selector - CSS selector to search for
 * @param root - Root element to start searching from (defaults to document)
 * @returns Array of matching elements from both regular and shadow DOM
 */
export const querySelectorAllDeep = <T extends Element = Element>(
  selector: string,
  root: Document | DocumentFragment = document,
): T[] => {
  // Skip if this root should be excluded
  if (shouldExcludeRoot(root)) {
    return []
  }

  const elements: T[] = []

  // Query the current root
  const directMatches = root.querySelectorAll<T>(selector)
  for (const match of directMatches) {
    if (!shouldExcludeElement(match)) {
      elements.push(match)
    }
  }

  // Find all elements that might have shadow DOM
  const allElements = root.querySelectorAll('*')

  for (const element of allElements) {
    // Skip if this element should be excluded
    if (shouldExcludeElement(element)) {
      continue
    }

    // Check if this element has a shadow root
    if (element.shadowRoot) {
      // Skip if this is the perfectify shadow host
      if (shouldExcludeShadowHost(element)) {
        continue
      }

      // Recursively search inside the shadow DOM
      const shadowMatches = querySelectorAllDeep<T>(selector, element.shadowRoot)
      elements.push(...shadowMatches)
    }
  }

  return elements
}

/**
 * Lightweight version that only checks one level of shadow DOM
 * More performant for common use cases
 * @param selector - CSS selector to search for
 * @returns Array of matching elements from regular DOM and immediate shadow DOMs
 */
export const querySelectorAllShallow = <T extends Element = Element>(selector: string): T[] => {
  const elements: T[] = []

  // Regular DOM elements
  const regularElements = document.querySelectorAll<T>(selector)
  for (const element of regularElements) {
    if (!shouldExcludeElement(element)) {
      elements.push(element)
    }
  }

  // Check immediate shadow DOM hosts
  const potentialShadowHosts = document.querySelectorAll('*')
  for (const host of potentialShadowHosts) {
    // Skip if this host should be excluded
    if (shouldExcludeElement(host)) {
      continue
    }

    if (host.shadowRoot) {
      // Skip if this is the perfectify shadow host
      if (shouldExcludeShadowHost(host)) {
        continue
      }

      const shadowElements = host.shadowRoot.querySelectorAll<T>(selector)
      for (const element of shadowElements) {
        elements.push(element)
      }
    }
  }

  return elements
}

/**
 * Sets up MutationObserver that watches for changes in both regular DOM and shadow DOMs
 * @param callback - Function to call when mutations are detected
 * @param options - MutationObserver options
 * @returns Function to disconnect all observers
 */
export const observeDeepMutations = (
  callback: MutationCallback,
  options: MutationObserverInit = { childList: true, subtree: true },
): (() => void) => {
  const observers: MutationObserver[] = []

  const observeRecursively = (root: Document | DocumentFragment) => {
    const observer = new MutationObserver((mutations, obs) => {
      callback(mutations, obs)

      // Check if new shadow DOMs were created in this mutation batch
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode instanceof Element && addedNode.shadowRoot) {
              observeRecursively(addedNode.shadowRoot)
            }
          }
        }
      }
    })

    observer.observe(root as Node, options)
    observers.push(observer)

    // Also observe any shadow roots that currently exist
    const elementsWithShadow = root.querySelectorAll('*')
    for (const element of elementsWithShadow) {
      if (element.shadowRoot) {
        observeRecursively(element.shadowRoot)
      }
    }
  }

  observeRecursively(document)

  // Return cleanup function
  return () => {
    observers.forEach((observer) => observer.disconnect())
  }
}

/**
 * Finds the root document or shadow root that contains the given element
 * @param element - Element to find the root for
 * @returns The document or shadow root containing the element
 */
export const findElementRoot = (element: Element): Document | ShadowRoot => {
  let current: Node = element

  while (current.parentNode) {
    current = current.parentNode
    if (current instanceof ShadowRoot) {
      return current
    }
  }

  return document
}

/**
 * Finds an element by attribute value across both regular DOM and shadow DOM
 * @param attributeName - The attribute name to search for
 * @param attributeValue - The attribute value to match
 * @param root - Root element to start searching from (defaults to document)
 * @returns The first matching element or null if not found
 */
export const getElementByAttributeDeep = <T extends Element = Element>(
  attributeName: string,
  attributeValue: string,
  root: Document | DocumentFragment = document,
): T | null => {
  // Skip if this root should be excluded
  if (shouldExcludeRoot(root)) {
    return null
  }

  // First check the current root for a direct match
  const selector = `[${attributeName}="${attributeValue}"]`
  const directMatch = root.querySelector<T>(selector)
  if (directMatch && !shouldExcludeElement(directMatch)) {
    return directMatch
  }

  // Recursively search shadow DOMs
  const allElements = root.querySelectorAll('*')
  for (const element of allElements) {
    // Skip if this element should be excluded
    if (shouldExcludeElement(element)) {
      continue
    }

    if (element.shadowRoot) {
      // Skip if this is the perfectify shadow host
      if (shouldExcludeShadowHost(element)) {
        continue
      }

      const shadowMatch = getElementByAttributeDeep<T>(
        attributeName,
        attributeValue,
        element.shadowRoot,
      )
      if (shadowMatch) {
        return shadowMatch
      }
    }
  }

  return null
}

/**
 * Finds an element by ID across both regular DOM and shadow DOM
 * @param id - The ID to search for
 * @param root - Root element to start searching from (defaults to document)
 * @returns The element with the matching ID or null if not found
 */
export const getElementByIdDeep = <T extends Element = Element>(
  id: string,
  root: Document | DocumentFragment = document,
): T | null => {
  return getElementByAttributeDeep<T>('id', id, root)
}

/**
 * Searches for elements matching a selector within an element's ancestry, including shadow DOM boundaries
 * @param startElement - The element to start searching from
 * @param selector - The CSS selector to search for
 * @param maxDepth - Maximum number of ancestor levels to traverse (default: 10)
 * @returns The first matching element or null if not found
 */
export const queryUpTreeDeep = <T extends Element = Element>(
  startElement: Element,
  selector: string,
  maxDepth: number = 10,
): T | null => {
  // Skip if the start element should be excluded
  if (shouldExcludeElement(startElement)) {
    return null
  }

  let current: Element | null = startElement
  let depth = 0

  while (current && depth < maxDepth) {
    // Skip if current element should be excluded
    if (shouldExcludeElement(current)) {
      // Move to parent without checking this element
    } else {
      // Check if current element matches
      if (current.matches && current.matches(selector)) {
        return current as T
      }

      // Check if current element contains a matching descendant
      const descendant = current.querySelector<T>(selector)
      if (descendant && !shouldExcludeElement(descendant)) {
        return descendant
      }
    }

    // Move to parent, handling shadow DOM boundaries
    if (current.parentElement) {
      current = current.parentElement
    } else if (current.parentNode && current.parentNode instanceof ShadowRoot) {
      // Cross shadow DOM boundary to the host element
      current = (current.parentNode as ShadowRoot).host
    } else {
      break
    }

    depth++
  }

  return null
}
