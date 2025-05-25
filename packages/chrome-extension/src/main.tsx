import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import ActionPopup from "./ActionPopup.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ActionPopup />
  </StrictMode>
)
