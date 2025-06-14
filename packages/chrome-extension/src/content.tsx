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
import font400 from '@fontsource/inter/400.css?raw'
import font500 from '@fontsource/inter/500.css?raw'
import font600 from '@fontsource/inter/600.css?raw'
import font700 from '@fontsource/inter/700.css?raw'
import indexCss from './index.css?raw'

const allStyles = [mantineStyles, font400, font500, font600, font700, indexCss].join('\\n')

const host = document.createElement('div')
host.id = 'perfectify-host'
document.body.appendChild(host)

const shadowRoot = host.attachShadow({ mode: 'open' })

const appContainer = document.createElement('div')
appContainer.id = 'perfectify-root'
shadowRoot.appendChild(appContainer)

// Create an Emotion cache that will inject styles into the shadow root
const cache = createCache({
  key: 'mantine-shadow-dom',
  container: shadowRoot,
})

// Create a style element and inject the combined styles directly into the shadow root
const styleElement = document.createElement('style')
styleElement.innerHTML = allStyles
shadowRoot.appendChild(styleElement)

const GlobalStyles = styled.div({
  fontFamily: 'Inter, sans-serif',
  ['p']: {
    letterSpacing: '-0.02rem',
  },
})

const root = ReactDOM.createRoot(appContainer)

root.render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <MantineProvider cssVariablesSelector="#perfectify-root" getRootElement={() => appContainer}>
        <GlobalStyles>
          <Sidebar />
        </GlobalStyles>
      </MantineProvider>
    </CacheProvider>
  </React.StrictMode>,
)
