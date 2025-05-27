import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Sidebar from './content/Sidebar'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.appendChild(root)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Sidebar />
  </React.StrictMode>,
)
