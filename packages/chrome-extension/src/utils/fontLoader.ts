// Import font CSS files
import font400css from '@fontsource/inter/400.css?raw'
import font500css from '@fontsource/inter/500.css?raw'
import font600css from '@fontsource/inter/600.css?raw'
import font700css from '@fontsource/inter/700.css?raw'

// AGGRESSIVE FONT LOADING - Load fonts EVERYWHERE
const loadFontsEverywhere = () => {
  // Method 1: Load fonts in main document head
  const mainDocumentStyle = document.createElement('style')
  mainDocumentStyle.innerHTML = [font400css, font500css, font600css, font700css].join('\n')
  document.head.appendChild(mainDocumentStyle)

  // Method 2: Load Google Fonts as backup
  const googleFontsLink = document.createElement('link')
  googleFontsLink.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  googleFontsLink.rel = 'stylesheet'
  document.head.appendChild(googleFontsLink)

  // Method 3: Preload font files directly
  const fontFiles = [
    'inter-latin-400-normal.woff2',
    'inter-latin-500-normal.woff2',
    'inter-latin-600-normal.woff2',
    'inter-latin-700-normal.woff2',
  ]

  fontFiles.forEach((filename) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = chrome.runtime.getURL(`fonts/${filename}`)
    document.head.appendChild(link)
  })
}

// Helper to replace relative font paths with chrome-extension URLs
const fixFontPaths = (css: string) => {
  return css.replace(/url\(\.\/files\/([^)]+)\)/g, (_, filename) => {
    return `url(${chrome.runtime.getURL(`fonts/${filename}`)})`
  })
}

// ADDITIONAL METHOD: Use Font Loading API
const loadFontsWithAPI = async () => {
  try {
    const fontPromises = [
      new FontFace('Inter', `url(${chrome.runtime.getURL('fonts/inter-latin-400-normal.woff2')})`, {
        weight: '400',
      }),
      new FontFace('Inter', `url(${chrome.runtime.getURL('fonts/inter-latin-500-normal.woff2')})`, {
        weight: '500',
      }),
      new FontFace('Inter', `url(${chrome.runtime.getURL('fonts/inter-latin-600-normal.woff2')})`, {
        weight: '600',
      }),
      new FontFace('Inter', `url(${chrome.runtime.getURL('fonts/inter-latin-700-normal.woff2')})`, {
        weight: '700',
      }),
    ]

    const loadedFonts = await Promise.all(fontPromises.map((font) => font.load()))
    loadedFonts.forEach((font) => {
      document.fonts.add(font)
    })
    console.log('✅ Fonts loaded via Font Loading API')
  } catch (error) {
    console.warn('Font Loading API failed:', error)
  }
}

// Setup fonts in shadow DOM with all the nuclear options
const setupShadowDOMFonts = (shadowRoot: ShadowRoot) => {
  const font400Fixed = fixFontPaths(font400css)
  const font500Fixed = fixFontPaths(font500css)
  const font600Fixed = fixFontPaths(font600css)
  const font700Fixed = fixFontPaths(font700css)

  // NUCLEAR OPTION: Also inject fonts directly into shadow DOM head if it exists
  const shadowHead = shadowRoot.querySelector('head') || shadowRoot
  const shadowFontStyle = document.createElement('style')
  shadowFontStyle.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    ${font400Fixed}
    ${font500Fixed}
    ${font600Fixed}
    ${font700Fixed}
    
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
    }
  `
  shadowHead.appendChild(shadowFontStyle)

  // Force font loading by creating invisible text elements
  const fontTestDiv = document.createElement('div')
  fontTestDiv.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    font-family: 'Inter';
    font-size: 1px;
    opacity: 0;
    pointer-events: none;
  `
  fontTestDiv.innerHTML = 'Inter font test 400 500 600 700'
  shadowRoot.appendChild(fontTestDiv)

  // Try to force font loading
  setTimeout(() => {
    const weights = [400, 500, 600, 700]
    weights.forEach((weight) => {
      const testSpan = document.createElement('span')
      testSpan.style.fontFamily = 'Inter'
      testSpan.style.fontWeight = weight.toString()
      testSpan.style.position = 'absolute'
      testSpan.style.left = '-9999px'
      testSpan.textContent = 'test'
      shadowRoot.appendChild(testSpan)

      // Force reflow
      void testSpan.offsetHeight

      // Remove after forcing load
      setTimeout(() => testSpan.remove(), 100)
    })
  }, 100)

  return { font400Fixed, font500Fixed, font600Fixed, font700Fixed }
}

// Main font loading orchestrator
export const initializeFontLoading = () => {
  // Load fonts everywhere before creating shadow DOM
  loadFontsEverywhere()

  // Load fonts with API
  loadFontsWithAPI()
}

// Get processed font CSS for shadow DOM
export const getShadowDOMFontCSS = (shadowRoot: ShadowRoot) => {
  const { font400Fixed, font500Fixed, font600Fixed, font700Fixed } = setupShadowDOMFonts(shadowRoot)

  // Additional CSS with multiple font fallbacks
  const aggressiveFontCSS = `
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
    }
    
    #perfectify-root * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
    }
  `

  return [font400Fixed, font500Fixed, font600Fixed, font700Fixed, aggressiveFontCSS].join('\n')
}
