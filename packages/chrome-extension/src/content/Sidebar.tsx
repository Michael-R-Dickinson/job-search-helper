import { serializeInputInfosForTest } from '../e2e-testing/saveInputInfosForTests'
import { useInputElements } from './hooks/useInputElements'
import { autofillInputElements } from './inputsManipulation/autofillInputElements'
import triggerGetAutofillValues from './triggerGetAutofillValues'
import triggerSaveFilledValues from './triggerSaveFilledValues'
import type { SerializedHtmlInput } from '../autofillEngine/schema';

const Sidebar = () => {
  const elements = useInputElements()
  console.log('elements', elements)

  // For testing
  // Collects all test data and copies to clipboard as JSON
  const getTestingJson = async () => {
    const inputsData = serializeInputInfosForTest(elements)
    const saveFilledInputsResponse = await triggerSaveFilledValues(elements)
    const autofillInstructionsResponse = await triggerGetAutofillValues(elements)
    const testCase = {
      sourceURL: window.location.href,
      inputsData,
      saveFilledInputsResponse,
      autofillInstructionsResponse,
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(testCase, null, 2))
      alert('Test case copied to clipboard!')
    } catch (e) {
      alert('Failed to copy test case to clipboard.')
    }
  }

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
          const response = await triggerGetAutofillValues(elements);
          if (!response.userId) {
             console.error('User ID not received from background script.');
             return;
          }
          await autofillInputElements(response.instructions, response.serializedInputs, response.userId);
        }}
      >
        Begin Autofill Sequence
      </button>
      <button
        onClick={async () => {
          const response = await triggerSaveFilledValues(elements)
          console.log('saveAutofillValues response', response)
        }}
      >
        Save Autofill Values
      </button>
      <button onClick={getTestingJson}>Save Inputs For Testing</button>
    </div>
  )
}

export default Sidebar
