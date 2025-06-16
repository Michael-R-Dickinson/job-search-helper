import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Sidebar from './content/Sidebar'

import styled from '@emotion/styled'
import { MantineProvider } from '@mantine/core'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

// Import styles as raw strings
import mantineStyles from '@mantine/core/styles.css?raw'
import indexCss from './index.css?raw'

import { initializeFontLoading, getShadowDOMFontCSS } from './utils/fontLoader'
import IframeAutofillWrapper from './content/components/IframeAutofillWrapper'
import { shortHash } from './utils'

export const isTopFrame = window.self === window.top
export const frameId = shortHash(document.documentElement.innerHTML.slice(0, 1000))

const initializeFullApp = () => {
  // Initialize all font loading methods
  initializeFontLoading()

  const APP_ELEMENT_ID = 'perfectify-root'
  const host = document.createElement('div')
  host.id = 'perfectify-host'
  document.body.appendChild(host)

  const shadowRoot = host.attachShadow({ mode: 'open' })

  const appContainer = document.createElement('div')
  appContainer.id = APP_ELEMENT_ID
  shadowRoot.appendChild(appContainer)

  // Create an Emotion cache that will inject styles into the shadow root
  const cache = createCache({
    key: 'mantine-shadow-dom',
    container: shadowRoot,
  })

  // Get font CSS and setup shadow DOM fonts
  const fontCSS = getShadowDOMFontCSS(shadowRoot)
  const allStyles = [mantineStyles, indexCss, fontCSS].join('\n')

  // Create a style element and inject the combined styles directly into the shadow root
  const styleElement = document.createElement('style')
  styleElement.innerHTML = allStyles
  shadowRoot.appendChild(styleElement)

  const GlobalStyles = styled.div({
    fontFamily: 'Inter, sans-serif',
    ['p']: {
      letterSpacing: '-0.02rem',
    },
    ['button']: {
      border: '0',
    },
  })

  const root = ReactDOM.createRoot(appContainer)

  root.render(
    <React.StrictMode>
      <CacheProvider value={cache}>
        <MantineProvider
          cssVariablesSelector="#perfectify-root"
          getRootElement={() => appContainer}
        >
          <GlobalStyles>
            <Sidebar />
          </GlobalStyles>
        </MantineProvider>
      </CacheProvider>
    </React.StrictMode>,
  )
}

const initializeIframeWrapper = () => {
  const container = document.createElement('div')
  container.id = 'iframe-wrapper-' + frameId
  document.body.appendChild(container)

  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <IframeAutofillWrapper />
    </React.StrictMode>,
  )
}

if (isTopFrame) {
  initializeFullApp()
} else {
  initializeIframeWrapper()
}
