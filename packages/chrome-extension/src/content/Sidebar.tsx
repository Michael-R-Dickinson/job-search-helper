import { useInputElements } from './hooks/useInputElements'
import triggerGetAutofillValues from './triggerGetAutofillValues'

const Sidebar = () => {
  const elements = useInputElements()
  console.log('ements', elements)

  return (
    <div
      style={{
        position: 'fixed',
        height: '500px',
        width: '200px',
        right: '0',
        top: '50%',
        transform: 'translate(0, -50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <button
        onClick={() => {
          triggerGetAutofillValues(elements)
        }}
      >
        Begin Autofill Sequence
      </button>
    </div>
  )
}

export default Sidebar
