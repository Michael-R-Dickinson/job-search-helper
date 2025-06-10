import { useEffect, useMemo, useRef, useState } from 'react'
import { useInputElements, type InputInfo } from './useInputElements'
import triggerGetAutofillValues, {
  triggerGetSimpleAutofillValues,
} from '../triggerGetAutofillValues'
import type { AutofillInstruction } from '../../autofillEngine/schema'

const useAutofillInputs = () => {
  const elements = useInputElements()
  const [unfilledInputs, setUnfilledInputs] = useState<InputInfo[]>([])
  // const instructionsQueryRef = useRef<Promise<SeparatedAutofillInstructions> | null>(null)
  const [simpleInputsInstructions, setSimpleInputsInstructions] = useState<
    AutofillInstruction[] | null
  >(null)
  const remainingInstructionsRef = useRef<Promise<AutofillInstruction[]> | null>(null)
  const loading = useRef<boolean>(false)

  const alreadyFilledRef = useRef<boolean>(false)
  useEffect(() => {
    const getInstructions = async () => {
      if (alreadyFilledRef.current) return

      loading.current = true

      const simpleInputsInstructionsCurrent = await triggerGetSimpleAutofillValues(elements)
      setSimpleInputsInstructions(simpleInputsInstructionsCurrent)

      const unfilledInputIds = simpleInputsInstructionsCurrent
        .filter((i) => i.value === null || i.value === '')
        .map((i) => i.input_id)
      const unfilledInputs = elements.filter((el) =>
        unfilledInputIds.includes(el.elementReferenceId),
      )
      remainingInstructionsRef.current = triggerGetAutofillValues(unfilledInputs)
      // // ! WHILE TESTING WE DON'T WANT TO COST LLM TOKENS
      // remainingInstructionsRef.current = Promise.resolve(null as unknown as AutofillInstruction[])

      const llmInstructions = await remainingInstructionsRef.current
      const allInstructions = [...simpleInputsInstructionsCurrent, ...llmInstructions]
      const filledInputIds = allInstructions
        .filter((i) => i.value !== null && i.value !== '')
        .map((i) => i.input_id)

      setUnfilledInputs(
        elements.filter((el) => !filledInputIds.includes(el.elementReferenceId) && !!el.label),
      )

      console.log('Finished Fetching LLM Instructions')

      loading.current = false
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
    loading: loading.current,
    unfilledInputs,
  }
}

export default useAutofillInputs
