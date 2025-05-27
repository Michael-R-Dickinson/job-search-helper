import { useInputElements } from "./hooks/useInputElements"
import { injectAuthFrame } from "./injectAuthIframe"


const Sidebar = () => {
  const elements = useInputElements()
  return (
    <div
      style={{
        position: "fixed",
        height: "500px",
        width: "200px",
        right: "0",
        top: "50%",
        transform: "translate(0, -50%)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      TEST
      <button onClick={()=> {
        console.log("Injecting iframe")
        injectAuthFrame()
      }}>Inject Iframe</button>
    </div>
  )
}

export default Sidebar
