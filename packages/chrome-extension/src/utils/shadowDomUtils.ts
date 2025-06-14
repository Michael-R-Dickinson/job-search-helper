/**
 * Utility functions for working with Shadow DOM elements
 */

export type ShadowDomElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLButtonElement

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
  const elements: T[] = []

  // Query the current root
  const directMatches = root.querySelectorAll<T>(selector)
  elements.push(...Array.from(directMatches))

  // Find all elements that might have shadow DOM
  const allElements = root.querySelectorAll('*')

  for (const element of allElements) {
    // Check if this element has a shadow root
    if (element.shadowRoot) {
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
  elements.push(...Array.from(document.querySelectorAll<T>(selector)))

  // Check immediate shadow DOM hosts
  const potentialShadowHosts = document.querySelectorAll('*')
  for (const host of potentialShadowHosts) {
    if (host.shadowRoot) {
      const shadowElements = host.shadowRoot.querySelectorAll<T>(selector)
      elements.push(...Array.from(shadowElements))
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
