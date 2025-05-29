import { copyInputInfosToClipboard } from '../e2e-testing/saveInputInfosForTests'
import { autofillInputElements, useInputElements } from './hooks/useInputElements'
import triggerGetAutofillValues from './triggerGetAutofillValues'
import triggerSaveFilledValues from './triggerSaveFilledValues'

const Sidebar = () => {
  const elements = useInputElements()
  console.log('elements', elements)

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
        onClick={async () => {
          const response = await triggerGetAutofillValues(elements)
          autofillInputElements(response)
        }}
      >
        Begin Autofill Sequence
      </button>
      <button
        onClick={() => {
          triggerSaveFilledValues(elements)
        }}
      >
        Save Autofill Values
      </button>
      <button
        onClick={() => {
          const serialized = copyInputInfosToClipboard(elements, window.location.href)
          console.log('serialized', serialized)
        }}
      >
        Save Inputs For Testing
      </button>
    </div>
  )
}

export default Sidebar
