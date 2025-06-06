import { autofillInputElements } from './inputsManipulation/autofillInputElements'
import useAutofillInputs from './hooks/useAutofillInputs'

const Sidebar = () => {
  const { autofillInstructionsPromise, stopRefetchingAutofillValues } = useAutofillInputs()
  const fullAutofillSequence = async () => {
    const instructions = await autofillInstructionsPromise

    if (!instructions) return
    const { simpleInputsInstructions, remainingAutofillInstructions } = instructions

    stopRefetchingAutofillValues()
    await autofillInputElements(simpleInputsInstructions, true)
    await autofillInputElements(remainingAutofillInstructions, false)
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
