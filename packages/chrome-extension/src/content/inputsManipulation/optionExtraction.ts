export type SelectOption = {
  value: string | null // Allow null for value as per normalizeOptionNode
  text: string
  domNode: HTMLElement
}

type Framework =
  | 'native'
  | 'aria'
  | 'react-select'
  | 'mui'
  | 'ant'
  | 'choices'
  | 'select2'
  | 'fallback'

interface DropdownControlInfo {
  control: HTMLElement
  framework: Framework
}

const FRAMEWORK_CLASS_PATTERNS: Record<
  Exclude<Framework, 'native' | 'aria' | 'fallback'>,
  string
> = {
  'react-select': '.react-select__control',
  mui: '[class*=MuiSelect-root]',
  ant: '.ant-select-selection__rendered', // or .ant-select for broader matching
  choices: '.choices__inner',
  select2: '.select2-selection',
}

const OPTION_SELECTORS: Record<Framework, string | null> = {
  native: 'select > option',
  aria: '[role="option"]',
  'react-select': '.react-select__option',
  mui: 'ul[class*=MuiMenu-list] li, .MuiMenuItem-root[role="option"]', // Added MuiMenuItem-root
  ant: '.ant-select-dropdown-menu-item, .ant-select-item-option', // Added .ant-select-item-option
  choices: '.choices__list.is-open .choices__item--choice',
  select2: '.select2-results__option',
  fallback: null, // Handled specially
}

function normalizeOptionNode(node: HTMLElement): SelectOption {
  const text = node.innerText?.trim() || node.textContent?.trim() || ''
  // Prefer data-value or a "value" attribute; otherwise, use text content as a fallback for value if no value attribute.
  const value =
    node.getAttribute('data-value') ||
    node.getAttribute('value') ||
    (node instanceof HTMLOptionElement ? node.value : text) // Fallback to text if no value attr, esp. for non-option elements

  return { text, value, domNode: node }
}

function isFallbackMenu(el: HTMLElement): boolean {
  if (!['UL', 'DIV', 'TABLE', 'TBODY'].includes(el.tagName)) return false // Added TABLE, TBODY
  if (el.children.length < 2) return false // Relaxed from 3 to 2 for some cases

  // Check for homogeneity or role="option" on children
  const firstChildTag = el.children[0]?.tagName
  const firstChildRole = el.children[0]?.getAttribute('role')

  const allChildrenHomogeneous = [...el.children].every(
    (ch) =>
      ch.tagName === firstChildTag ||
      ch.getAttribute('role') === 'option' ||
      ch.getAttribute('role') === 'menuitem',
  )
  if (!allChildrenHomogeneous && !firstChildRole?.match(/option|menuitem/)) return false

  const style = getComputedStyle(el)
  if (style.display === 'none' || style.visibility === 'hidden' || el.offsetParent === null) {
    // Exception: check if children are visible (e.g. parent display: contents)
    if (
      ![...el.children].some((child) => {
        const childStyle = getComputedStyle(child as HTMLElement)
        return (
          childStyle.display !== 'none' &&
          childStyle.visibility !== 'hidden' &&
          (child as HTMLElement).offsetParent !== null
        )
      })
    ) {
      return false
    }
  }
  return true
}

function detectFallbackMenus(): HTMLElement[] {
  return Array.from(document.querySelectorAll('ul, div, table, tbody')).filter(
    (el) => el instanceof HTMLElement && isFallbackMenu(el),
  ) as HTMLElement[]
}

function findDropdownControl(startEl: HTMLElement): DropdownControlInfo | null {
  let node: HTMLElement | null = startEl
  while (node && node !== document.body) {
    const tag = node.tagName.toLowerCase()
    if (tag === 'select') {
      return { control: node, framework: 'native' }
    }
    const role = node.getAttribute('role')
    if (role === 'combobox' || role === 'listbox') {
      return { control: node, framework: 'aria' }
    }
    const cls = node.classList
    for (const fwKey in FRAMEWORK_CLASS_PATTERNS) {
      const framework = fwKey as Exclude<Framework, 'native' | 'aria' | 'fallback'>
      const selector = FRAMEWORK_CLASS_PATTERNS[framework]
      if (selector.startsWith('.') && cls.contains(selector.substring(1))) {
        return { control: node, framework }
      } else if (
        selector.startsWith('[class*=') &&
        [...cls].some((c) => c.includes(selector.substring(7, selector.length - 1)))
      ) {
        return { control: node, framework }
      } else if (node.matches(selector)) {
        // For more complex selectors if added
        return { control: node, framework }
      }
    }
    node = node.parentElement
  }
  // If no specific framework control is found up the tree,
  // consider the startEl itself if it has typical dropdown indicators.
  const startRole = startEl.getAttribute('role')
  if (
    startRole === 'combobox' ||
    startRole === 'listbox' ||
    startEl.tagName.toLowerCase() === 'select'
  ) {
    // This case should ideally be caught by the loop, but as a fallback:
    return {
      control: startEl,
      framework: startEl.tagName.toLowerCase() === 'select' ? 'native' : 'aria',
    }
  }
  // Default to fallback if the startEl itself might be the clickable control
  // This is important for inputs that are not wrapped by a framework-specific parent.
  if (
    startEl.matches('input, button, [role="button"]') ||
    getComputedStyle(startEl).cursor === 'pointer'
  ) {
    return { control: startEl, framework: 'fallback' }
  }

  return null
}

async function openDropdown(control: HTMLElement, framework: Framework): Promise<void> {
  return new Promise((resolve) => {
    if (framework === 'native') {
      resolve()
      return
    }

    let opened = false
    const tryResolve = () => {
      if (!opened) {
        opened = true
        // Ensure control still exists in DOM
        if (document.body.contains(control)) {
          // control.removeEventListener('click', tryResolve) // No, keep {once:true}
        }
        resolve()
      }
    }

    // For some frameworks, options might be present without interaction if control is already "expanded"
    if (control.getAttribute('aria-expanded') === 'true') {
      tryResolve()
      return
    }

    // 1) Try common keyboard interactions (ArrowDown, Space, Enter)
    // control.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true, composed: true }));
    // control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', bubbles: true, cancelable: true, composed: true }));
    // control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, composed: true }));

    // 2) Dispatch a genuine MouseEvent series
    // Use a slight delay before events for robustness with some frameworks
    setTimeout(() => {
      if (!document.body.contains(control) || opened) return // Check if control removed or already resolved

      control.addEventListener('click', tryResolve, { once: true, capture: true }) // Capture to catch event early

      // Simulate a sequence of mouse events
      control.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true, composed: true }),
      )
      // Small delay between mousedown and mouseup sometimes helps
      // setTimeout(() => {
      if (!document.body.contains(control) || opened) return
      control.dispatchEvent(
        new MouseEvent('mouseup', { bubbles: true, cancelable: true, composed: true }),
      )
      control.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }),
      )
      // }, 20); // 20ms delay

      // Focus the element before click sometimes helps with frameworks expecting focus
      if (typeof control.focus === 'function') {
        control.focus()
      }
      // Some frameworks might not fire 'click' if they preventDefault on mousedown/mouseup
      // So, if 'click' isn't caught, rely on the timeout.
    }, 50) // Initial 50ms delay before dispatching events

    // 3) Safety timeout: if nothing happens or 'click' isn't fired, resolve anyway
    // Increased to 300ms to allow for slower rendering / animations
    setTimeout(tryResolve, 300)
  })
}

function waitForOptions(framework: Framework, controlToOpen: HTMLElement): Promise<SelectOption[]> {
  return new Promise((resolve) => {
    const selector = OPTION_SELECTORS[framework]

    if (framework === 'native') {
      // For native selects, options are always part of the control itself.
      const opts = Array.from(controlToOpen.querySelectorAll(selector || 'option')).map((node) =>
        normalizeOptionNode(node as HTMLElement),
      )
      return resolve(opts)
    }

    let activeObserver: MutationObserver | null = null
    let activeTimeoutId: NodeJS.Timeout | null = null

    const cleanup = () => {
      if (activeObserver) activeObserver.disconnect()
      if (activeTimeoutId) clearTimeout(activeTimeoutId)
      activeObserver = null
      activeTimeoutId = null
    }

    // Function to find and resolve options based on selector or fallback
    const findAndResolveOptions = () => {
      cleanup()
      let nodes: HTMLElement[] = []
      if (framework === 'fallback') {
        // Fallback: check near the control first, then globally
        let potentialMenus: HTMLElement[] = []
        let parent: HTMLElement | null = controlToOpen.parentElement
        for (let i = 0; i < 3 && parent && parent !== document.body; i++) {
          // Check 3 levels up
          potentialMenus.push(
            ...(Array.from(parent.querySelectorAll('ul, div')).filter(
              (el) => el instanceof HTMLElement && isFallbackMenu(el),
            ) as HTMLElement[]),
          )
          if (potentialMenus.length > 0) break
          parent = parent.parentElement
        }
        if (potentialMenus.length === 0) {
          potentialMenus = detectFallbackMenus() // Global fallback detection
        }
        nodes = potentialMenus.flatMap((menu) => Array.from(menu.children) as HTMLElement[])
      } else if (selector) {
        // For specific frameworks, try to find options container relative to control first.
        // This helps with multiple identical dropdowns on a page.
        // Example: React-Select often portals, but some custom ARIA might be nearby.
        let optionsContainer: HTMLElement | null = null

        // aria-controls might point to the listbox
        const ariaControlsId = controlToOpen.getAttribute('aria-controls')
        if (ariaControlsId) {
          optionsContainer = document.getElementById(ariaControlsId)
        }

        // Look for a common parent if options are not directly portaled
        if (!optionsContainer) {
          const commonAncestor =
            controlToOpen.closest('[data-radix-popper-content-wrapper]') || // Radix UI
            controlToOpen.closest('.MuiPopover-root') || // Material UI Popover
            controlToOpen.closest('.ant-select-dropdown') // Ant Design Dropdown
          if (commonAncestor) {
            nodes = Array.from(commonAncestor.querySelectorAll(selector)).map(
              (n) => n as HTMLElement,
            )
          }
        } else {
          nodes = Array.from(optionsContainer.querySelectorAll(selector)).map(
            (n) => n as HTMLElement,
          )
        }

        // If still no nodes, query the whole document (for portaled elements)
        if (nodes.length === 0) {
          nodes = Array.from(document.querySelectorAll(selector)).map((n) => n as HTMLElement)
        }
      }

      // Filter out non-visible options that might be in the DOM but hidden
      const visibleNodes = nodes.filter((node) => {
        const style = getComputedStyle(node)
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          node.offsetHeight > 0 &&
          node.offsetWidth > 0
        )
      })

      const opts = visibleNodes.map(normalizeOptionNode)
      resolve(opts)
    }

    // Initial check: Options might already be visible (e.g., aria-expanded="true")
    // especially for ARIA widgets or if openDropdown resolved very quickly
    // For frameworks with known selectors, check if options are already present
    if (selector) {
      let initialNodes: HTMLElement[] = []
      const ariaControlsId = controlToOpen.getAttribute('aria-controls')
      if (ariaControlsId) {
        const optionsContainer = document.getElementById(ariaControlsId)
        if (optionsContainer) {
          initialNodes = Array.from(optionsContainer.querySelectorAll(selector)).map(
            (n) => n as HTMLElement,
          )
        }
      }
      if (initialNodes.length === 0) {
        // Fallback to global search if not found via aria-controls
        initialNodes = Array.from(document.querySelectorAll(selector)).map((n) => n as HTMLElement)
      }

      const visibleInitialNodes = initialNodes.filter((node) => {
        const style = getComputedStyle(node)
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          node.offsetHeight > 0 &&
          node.offsetWidth > 0
        )
      })

      if (visibleInitialNodes.length > 0) {
        // console.log("Options found without mutation observer for framework:", framework, visibleInitialNodes);
        const opts = visibleInitialNodes.map(normalizeOptionNode)
        resolve(opts)
        return
      }
    } else if (framework === 'fallback') {
      // Initial check for fallback
      const fallbackMenus = detectFallbackMenus()
      if (fallbackMenus.length > 0) {
        const initialFallbackNodes = fallbackMenus.flatMap(
          (menu) => Array.from(menu.children) as HTMLElement[],
        )
        const visibleFallbackNodes = initialFallbackNodes.filter((node) => {
          const style = getComputedStyle(node)
          return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            node.offsetHeight > 0 &&
            node.offsetWidth > 0
          )
        })
        if (visibleFallbackNodes.length > 0) {
          // console.log("Fallback options found without mutation observer", visibleFallbackNodes);
          const opts = visibleFallbackNodes.map(normalizeOptionNode)
          resolve(opts)
          return
        }
      }
    }

    activeObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue

            // Check if the added node itself is an options container or contains options
            if (framework === 'fallback') {
              if (
                isFallbackMenu(node) ||
                Array.from(node.querySelectorAll('ul, div')).some(
                  (n) => n instanceof HTMLElement && isFallbackMenu(n),
                )
              ) {
                findAndResolveOptions()
                return
              }
            } else if (selector) {
              if (
                node.matches(selector) ||
                node.querySelector(selector) ||
                (node.shadowRoot &&
                  (node.shadowRoot.querySelector(selector) || // Check shadow DOM
                    Array.from(node.shadowRoot.querySelectorAll('*')).some((sn) =>
                      sn.matches(selector),
                    )))
              ) {
                findAndResolveOptions()
                return
              }
            }
          }
        } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // Sometimes options are revealed by class changes on existing elements
          // e.g. a class like 'is-open' is added to the options container
          if (selector && document.querySelector(selector)) {
            // Re-check if options now match
            findAndResolveOptions()
            return
          }
        }
      }
    })

    activeObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    }) // Added attributes

    // Safety timeout: if nothing appears in specified ms, grab whatever is there now
    // Increased to 700ms for very slow components or network-loaded options
    activeTimeoutId = setTimeout(findAndResolveOptions, 700)
  })
}

function closeDropdown(control: HTMLElement, framework: Framework): void {
  if (framework === 'native' || !document.body.contains(control)) {
    return
  }

  // Attempt to close by dispatching "Escape" key
  // Try focusing the control first, then dispatch Escape to document.activeElement or control itself
  if (typeof control.focus === 'function') {
    // control.focus(); // Focusing might reopen some dropdowns, be careful
  }

  const activeEl = document.activeElement || document.body
  activeEl.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
      keyCode: 27,
      bubbles: true,
      cancelable: true,
      composed: true,
    }),
  )

  // Blur the control to signify it's no longer active
  if (typeof control.blur === 'function') {
    // control.blur();
  }
}

/**
 * Attempts to extract options from custom select elements by searching the DOM
 */
export const getCustomSelectOptions = async (
  inputElement: HTMLInputElement,
): Promise<SelectOption[]> => {
  // console.log('[getCustomSelectOptions] Called for element:', inputElement.id || inputElement.className);

  // 1. Find the real control and its framework type
  const dropdownInfo = findDropdownControl(inputElement)
  if (!dropdownInfo) {
    // console.log('[getCustomSelectOptions] No dropdown control found for:', inputElement);
    return []
  }
  const { control, framework } = dropdownInfo
  // console.log(`[getCustomSelectOptions] Found control: ${control.tagName}, Framework: ${framework}`);

  // If native select, get options directly (should ideally be handled by getSelectOptions in selectMatching.ts)
  // However, this function is specifically for "custom" selects, so native handling here is a safety net
  // or if `inputElement` itself was misidentified but is part of a native select structure.
  if (framework === 'native' && control instanceof HTMLSelectElement) {
    // console.log('[getCustomSelectOptions] Native select found, extracting options directly.');
    return Array.from(control.options)
      .map((option) => ({
        value: option.value,
        text: option.textContent?.trim() || '',
        domNode: option,
      }))
      .filter((option) => option.value !== '' && option.text !== '') // Basic filtering
  }

  // Make sure the control is visible and interactive before trying to open it.
  const controlStyle = getComputedStyle(control)
  if (
    controlStyle.display === 'none' ||
    controlStyle.visibility === 'hidden' ||
    (control as HTMLInputElement | HTMLButtonElement).disabled
  ) {
    // console.log('[getCustomSelectOptions] Control is not visible or is disabled:', control);
    return []
  }

  // 2. Programmatically "open" the dropdown
  // console.log('[getCustomSelectOptions] Attempting to open dropdown for:', control);
  await openDropdown(control, framework)
  // console.log('[getCustomSelectOptions] Dropdown open action complete for:', control);

  // 3. Wait for options to appear and extract them
  // console.log('[getCustomSelectOptions] Waiting for options for framework:', framework);
  const options = await waitForOptions(framework, control)
  // console.log(`[getCustomSelectOptions] Extracted ${options.length} options:`, options.map(o => ({text: o.text, value: o.value})));

  // 4. "Close" the dropdown to restore page state (best effort)
  // console.log('[getCustomSelectOptions] Attempting to close dropdown for:', control);
  closeDropdown(control, framework)
  // console.log('[getCustomSelectOptions] Dropdown close action complete for:', control);

  return options
}
