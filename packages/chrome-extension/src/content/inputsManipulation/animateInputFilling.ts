function hasVisualBorder(element: HTMLElement): boolean {
  const computedStyle = window.getComputedStyle(element)

  // Check for visible box shadow
  const hasBoxShadow = computedStyle.boxShadow !== 'none' && computedStyle.boxShadow !== ''

  // Check for visible outline
  const hasOutline =
    computedStyle.outline !== 'none' &&
    computedStyle.outlineWidth !== '0px' &&
    computedStyle.outlineStyle !== 'none'

  // Check for visible border (any side with width > 0 and style not 'none')
  const borderWidths = [
    computedStyle.borderTopWidth,
    computedStyle.borderRightWidth,
    computedStyle.borderBottomWidth,
    computedStyle.borderLeftWidth,
  ]
  const borderStyles = [
    computedStyle.borderTopStyle,
    computedStyle.borderRightStyle,
    computedStyle.borderBottomStyle,
    computedStyle.borderLeftStyle,
  ]

  const hasBorder = borderWidths.some(
    (width, index) => parseFloat(width) > 0 && borderStyles[index] !== 'none',
  )

  return hasBoxShadow || hasOutline || hasBorder
}

function findElementWithVisualBorder(
  inputEl: HTMLElement,
  maxLevels: number = 3,
): HTMLElement | null {
  let currentElement: HTMLElement | null = inputEl
  let level = 0

  while (currentElement && level <= maxLevels) {
    if (hasVisualBorder(currentElement)) {
      return currentElement
    }
    currentElement = currentElement.parentElement
    level++
  }

  // If no element with visual border found, return the original element
  return null
}

function triggerPulseAnimation(inputEl: HTMLElement) {
  // Find the best element to apply the pulse animation to
  const targetElement = findElementWithVisualBorder(inputEl, 3)
  if (!targetElement) return

  // Add the pulse class
  targetElement.classList.add('pulse-outline')

  // Clean up after the animation finishes
  const onAnimationEnd = () => {
    // targetElement.classList.remove('pulse-outline')
    targetElement.removeEventListener('animationend', onAnimationEnd)
  }

  targetElement.addEventListener('animationend', onAnimationEnd)
}

export const asyncScrollToElement = async (element: HTMLElement) => {
  return new Promise<void>((resolve) => {
    // Set a timeout to ensure the function resolves after 1 second - prevents animation hanging
    const timeout = setTimeout(() => resolve(), 1000)

    // Feature detect scrollend event (modern browsers)
    if (window.onscrollend !== undefined) {
      // Use modern scrollend event
      addEventListener(
        'scrollend',
        () => {
          clearTimeout(timeout)
          resolve()
        },
        { once: true },
      )
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      // Fallback polyfill using requestAnimationFrame for older browsers
      let same = 0 // counter for consecutive same positions
      let lastPos: number | null = null // last known Y position

      // Start the smooth scroll
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      requestAnimationFrame(check)

      // Check if scrolling has stopped by monitoring element position
      function check() {
        const newPos = element.getBoundingClientRect().top

        if (newPos === lastPos) {
          // Position hasn't changed
          if (same++ > 2) {
            // If position is stable for more than 2 frames, scrolling is done
            clearTimeout(timeout)
            return resolve()
          }
        } else {
          // Position changed, reset counter and update last position
          same = 0
          lastPos = newPos
        }
        // Check again next frame
        requestAnimationFrame(check)
      }
    }
  })
}

export default triggerPulseAnimation
