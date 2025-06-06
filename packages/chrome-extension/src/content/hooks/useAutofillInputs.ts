import { useEffect, useRef, useState } from 'react'
import { useInputElements, type InputInfo } from './useInputElements'
import triggerGetAutofillValues, {
  triggerGetSimpleAutofillValues,
} from '../triggerGetAutofillValues'
import type { AutofillInstruction } from '../../autofillEngine/schema'

const useAutofillInputs = () => {
  const elements = useInputElements()
  // const instructionsQueryRef = useRef<Promise<SeparatedAutofillInstructions> | null>(null)
  const [simpleInputsInstructions, setSimpleInputsInstructions] = useState<
    AutofillInstruction[] | null
  >(null)
  const remainingInstructionsRef = useRef<Promise<AutofillInstruction[]> | null>(null)

  const alreadyFilledRef = useRef<boolean>(false)
  useEffect(() => {
    const getInstructions = async () => {
      if (alreadyFilledRef.current) return
      console.log('\n\nGetting instructions\n\n')

      const simpleInputsInstructionsCurrent = await triggerGetSimpleAutofillValues(elements)
      setSimpleInputsInstructions(simpleInputsInstructionsCurrent)
      console.log('Simple inputs instructions fetched')

      const unfilledInputIds = simpleInputsInstructionsCurrent
        .filter((i) => i.value === null || i.value === '')
        .map((i) => i.input_id)
      const unfilledInputs = elements.filter((el) =>
        unfilledInputIds.includes(el.elementReferenceId),
      )
      remainingInstructionsRef.current = triggerGetAutofillValues(unfilledInputs)

      await remainingInstructionsRef.current
      console.log('\n\nRemaining instructions fetched\n\n')
    }

    getInstructions()
  }, [elements])

  const stopRefetchingAutofillValues = () => {
    alreadyFilledRef.current = true
  }

  return {
    simpleInputsInstructions,
    llmGeneratedInputsPromise: remainingInstructionsRef.current,
    // Intended to be called after autofill is executed
    stopRefetchingAutofillValues,
  }
}

export default useAutofillInputs
