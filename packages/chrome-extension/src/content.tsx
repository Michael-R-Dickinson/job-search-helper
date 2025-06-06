import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Sidebar from './content/Sidebar'

import styled from '@emotion/styled'

import { MantineProvider } from '@mantine/core'

import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import '@mantine/core/styles.css'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.appendChild(root)

const GlobalStyles = styled.div({
  fontFamily: 'Inter, sans-serif',
  ['p']: {
    letterSpacing: '-0.02rem',
  },
})

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <MantineProvider>
      <GlobalStyles>
        <Sidebar />
      </GlobalStyles>
    </MantineProvider>
  </React.StrictMode>,
)
