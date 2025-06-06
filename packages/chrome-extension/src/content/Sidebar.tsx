import { autofillInputElements } from './inputsManipulation/autofillInputElements'
import useAutofillInputs from './hooks/useAutofillInputs'

const Sidebar = () => {
  const { simpleInputsInstructions, llmGeneratedInputsPromise, stopRefetchingAutofillValues } =
    useAutofillInputs()

  const fullAutofillSequence = async () => {
    if (!simpleInputsInstructions || !llmGeneratedInputsPromise) return

    await autofillInputElements(simpleInputsInstructions, true)

    const remainingAutofillInstructions = await llmGeneratedInputsPromise
    await autofillInputElements(remainingAutofillInstructions, false)

    stopRefetchingAutofillValues()
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
      <button onClick={fullAutofillSequence}>Full Autofill Sequence</button>
    </div>
  )
}

export default Sidebar
