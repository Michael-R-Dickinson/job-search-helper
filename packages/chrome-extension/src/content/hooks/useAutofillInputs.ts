import { useEffect, useRef, useState } from 'react'
import { useInputElements, type InputInfo } from './useInputElements'
import triggerGetAutofillValues, {
  triggerGetSimpleAutofillValues,
} from '../triggers/triggerGetAutofillValues'
import type { AutofillInstruction } from '../../autofillEngine/schema'
import { useOnPageLoad } from '../../utils'

const useAutofillInputs = () => {
  // State
  const [unfilledInputs, setUnfilledInputs] = useState<InputInfo[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Refs
  const simpleInputsPromiseRef = useRef<Promise<AutofillInstruction[]> | null>(null)
  const complexInputsPromiseRef = useRef<Promise<AutofillInstruction[]> | null>(null)
  const pageLoadedDeferredRef = useRef<{
    promise: Promise<void>
    resolve: () => void
  }>(null)
  const elementsRef = useInputElements()

  if (!pageLoadedDeferredRef.current) {
    let resolveFn!: () => void
    const promise = new Promise<void>((res) => {
      resolveFn = res
    })
    pageLoadedDeferredRef.current = { promise, resolve: resolveFn }
  }

  useOnPageLoad(() => {
    pageLoadedDeferredRef.current?.resolve()
  })

  useEffect(() => {
    // Takes instructions for inputs to fill and sets unfilledInputs based on which have no values to fill
    const handleUnfilledInputs = (instructions: AutofillInstruction[]) => {
      const elements = elementsRef.current
      const filledInputIds = instructions
        .filter((i) => i.value !== null && i.value !== '')
        .map((i) => i.input_id)

      setUnfilledInputs(
        elements.filter((el) => !filledInputIds.includes(el.elementReferenceId) && !!el.label),
      )
    }

    simpleInputsPromiseRef.current = (async () => {
      await pageLoadedDeferredRef.current?.promise

      const elements = elementsRef.current
      const simpleInputsInstructions = await triggerGetSimpleAutofillValues(elements)
      return simpleInputsInstructions
    })()

    complexInputsPromiseRef.current = (async () => {
      await pageLoadedDeferredRef.current?.promise
      const simpleInputsInstructions = (await simpleInputsPromiseRef.current) || []

      const elements = elementsRef.current
      // const complexInputsInstructions = await triggerGetAutofillValues(elements)
      // ! WHILE TESTING WE DON'T WANT TO COST LLM TOKENS
      const complexInputsInstructions = [] as AutofillInstruction[]
      const allInstructions = [...simpleInputsInstructions, ...complexInputsInstructions]

      handleUnfilledInputs(allInstructions)
      setLoading(false)

      console.log('complex inputs instructions found')
      return complexInputsInstructions
    })()
  }, [elementsRef])

  return {
    simpleInputsInstructionsPromise: simpleInputsPromiseRef.current,
    complexInputsInstructionsPromise: complexInputsPromiseRef.current,
    unfilledInputs,
    loading,
  }
}

export default useAutofillInputs
