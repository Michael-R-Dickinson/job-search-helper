import { useState } from 'react'
import { useInputElements } from './hooks/useInputElements'
import { autofillInputElements } from './inputsManipulation/autofillInputElements'
import triggerGetAutofillValues, {
  triggerGetSimpleAutofillValues,
} from './triggerGetAutofillValues'
import triggerSaveFilledValues from './triggerSaveFilledValues'

const Sidebar = () => {
  const elements = useInputElements()
  const [filledSimpleInputsIds, setFilledSimpleInputsIds] = useState<string[]>([])

  const fullAutofillSequence = async () => {
    const simpleInputsInstructions = await triggerGetSimpleAutofillValues(elements)
    const simpleAutofillFinished = autofillInputElements(simpleInputsInstructions, true)

    const unfilledInputIds = simpleInputsInstructions
      .filter((i) => i.value === null || i.value === '')
      .map((i) => i.input_id)

    const unfilledInputs = elements.filter((el) => unfilledInputIds.includes(el.elementReferenceId))

    triggerGetAutofillValues(unfilledInputs).then(async (instructions) => {
      await simpleAutofillFinished
      autofillInputElements(instructions)
    })
  }

  const fillSimpleInputs = async () => {
    const response = await triggerGetSimpleAutofillValues(elements)
    const filledInputs = response
      .filter((instruction) => instruction.value)
      .map((instruction) => instruction.input_id)
    setFilledSimpleInputsIds(filledInputs)
    autofillInputElements(response, true)
  }

  const fillInputsWithLLM = async () => {
    const unfilledInputs = elements.filter(
      (element) => !filledSimpleInputsIds.includes(element.elementReferenceId),
    )
    const response = await triggerGetAutofillValues(unfilledInputs)
    autofillInputElements(response)
  }

  const saveAutofillValues = async () => {
    const response = await triggerSaveFilledValues(elements)
    console.log('saveAutofillValues response', response)
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
      <button onClick={fillSimpleInputs}>Simple Autofill</button>
      <button onClick={fillInputsWithLLM}>Begin Autofill Sequence</button>
      <button onClick={saveAutofillValues}>Save Autofill Values</button>
    </div>
  )
}

export default Sidebar
