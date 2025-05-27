import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import beginAuthenticationFlow from "./content/beginAuthenticationFlow"
import { signOut } from "firebase/auth"
import { auth } from "./extensionFirebase"

function ActionPopup() {
  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {
          beginAuthenticationFlow()
        }}>
        Sign In
        </button>
        <button onClick={()=> signOut(auth)}>Sign Out</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default ActionPopup
