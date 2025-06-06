import { useEffect, useRef } from 'react'
import { useInputElements } from './useInputElements'
import triggerGetAutofillValues, {
  triggerGetSimpleAutofillValues,
} from '../triggerGetAutofillValues'
import type { AutofillInstruction } from '../../autofillEngine/schema'

// We separate these because often we want to animate them differently
type SeparatedAutofillInstructions = {
  simpleInputsInstructions: AutofillInstruction[]
  remainingAutofillInstructions: AutofillInstruction[]
}

const useAutofillInputs = () => {
  const elements = useInputElements()
  const instructionsQueryRef = useRef<Promise<SeparatedAutofillInstructions> | null>(null)
  const alreadyFilledRef = useRef<boolean>(false)
  useEffect(() => {
    const getAutofillInstructions = async () => {
      console.log('\n\nFetching autofill instructions\n\n')
      const simpleInputsInstructions = await triggerGetSimpleAutofillValues(elements)

      const unfilledInputIds = simpleInputsInstructions
        .filter((i) => i.value === null || i.value === '')
        .map((i) => i.input_id)
      const unfilledInputs = elements.filter((el) =>
        unfilledInputIds.includes(el.elementReferenceId),
      )
      const remainingAutofillInstructions = await triggerGetAutofillValues(unfilledInputs)

      console.log('\n\nAutofill instructions fetched\n\n')

      return {
        simpleInputsInstructions,
        remainingAutofillInstructions,
      }
    }

    if (!alreadyFilledRef.current) {
      instructionsQueryRef.current = getAutofillInstructions()
    }
  }, [elements])

  const stopRefetchingAutofillValues = () => {
    alreadyFilledRef.current = true
  }

  return {
    autofillInstructionsPromise: instructionsQueryRef.current,
    // Intended to be called after autofill is executed
    stopRefetchingAutofillValues,
  }
}

export default useAutofillInputs
