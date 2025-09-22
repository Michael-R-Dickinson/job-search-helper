import { useEffect, useRef, useState } from 'react'
import { useInputElements } from './useInputElements'
import triggerGetAutofillValues, {
  triggerGetSimpleAutofillValues,
} from '../triggers/triggerGetAutofillValues'
import { useOnPageLoad } from '../../utils'
import useAutofillInstructionStates from './useAutofillStates'
import triggerSaveFilledValues from '../triggers/triggerSaveFilledValues'
import useExecuteAutofill from './useExecuteAutofill'

export type AutofillFetchStatus = 'loading' | 'fetched' | 'error'

const useAutofillInputs = () => {
  const elementsRef = useInputElements()

  const {
    resolveFastInputInstructions,
    resolveSlowInputInstructions,
    getUnfilledInputs,
    outputState,
  } = useAutofillInstructionStates(elementsRef)

  const { executeAutofillSequence, executeResumeAutofill, fillingStatus } =
    useExecuteAutofill(outputState)

  // whether the inputs are housed in iframes or not - we need to disable some features if they are
  const [usesIframes, setUsesIframes] = useState(false)
  const pageLoadedDeferredRef = useRef<{
    promise: Promise<void>
    resolve: () => void
  }>(null)

  if (!pageLoadedDeferredRef.current) {
    let resolveFn!: () => void
    const promise = new Promise<void>((res) => {
      resolveFn = res
    })
    pageLoadedDeferredRef.current = { promise, resolve: resolveFn }
  }

  useOnPageLoad(() => {
    pageLoadedDeferredRef.current?.resolve()
    if (elementsRef.current.length <= 3) {
      setUsesIframes(true)
      return
    }
    console.log('Found inputs for autofill: ', elementsRef.current)
  }, 1000)

  useEffect(() => {
    const beginFetchAutofillInstructionsSequence = async () => {
      const elements = elementsRef.current
      const shouldFetchAutofills = elements.length > 3
      if (!shouldFetchAutofills) {
        return
      }
      console.log('Beginning fetch autofill instructions')

      // Ensure the page is fully loaded before fetching autofill instructions
      await pageLoadedDeferredRef.current?.promise

      // Handle Fast Input Instructions
      const simpleInputsInstructions = await triggerGetSimpleAutofillValues(elements)
      console.log('Fetched simple input instructions for inputs: ', simpleInputsInstructions)
      resolveFastInputInstructions(simpleInputsInstructions)

      // Handle Slow Input Instructions
      const remainingUnfilled = getUnfilledInputs().filter((input) => input.isLLMAutofillable)
      const complexInputsInstructions = await triggerGetAutofillValues(remainingUnfilled)
      // ! WHILE TESTING WE DON'T WANT TO COST LLM TOKENS
      // const complexInputsInstructions = new AutofillReadyInputArray([])
      console.log('Fetched complex input instructions for inputs: ', complexInputsInstructions)

      resolveSlowInputInstructions(complexInputsInstructions)
    }
    beginFetchAutofillInstructionsSequence()
  }, [elementsRef, resolveFastInputInstructions, resolveSlowInputInstructions, getUnfilledInputs])

  const executeSaveFilledValues = async () => {
    const elements = elementsRef.current
    const filledInputs = elements.filter((el) => el.isLLMAutofillable)
    await triggerSaveFilledValues(filledInputs)
  }

  return {
    executeAutofillSequence,
    executeResumeAutofill,
    executeSaveFilledValues,
    unfilledInputs: outputState.unknownInputs,
    freeResponseInputs: outputState.freeResponseInputs,
    fetchStatus: outputState.fetchStatus,
    fillingStatus,
    usesIframes,
  }
}

export default useAutofillInputs
