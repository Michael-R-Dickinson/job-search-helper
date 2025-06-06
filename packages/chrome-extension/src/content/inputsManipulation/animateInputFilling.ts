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

export default triggerPulseAnimation
