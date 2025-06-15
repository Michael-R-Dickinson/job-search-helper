import { useEffect, useRef, useState } from 'react'
import { useInputElements, type InputInfo } from './useInputElements'
import triggerGetAutofillValues, {
  triggerGetSimpleAutofillValues,
} from '../triggers/triggerGetAutofillValues'
import type { AutofillInstruction } from '../../autofillEngine/schema'
import { useOnPageLoad } from '../../utils'
import {
  AutofillAnimationSpeeds,
  autofillInputElements,
} from '../inputsManipulation/autofillInputElements'
import { RESUME_UPLOAD_VALUE } from '../../autofillEngine/inputCategoryHandlers'

export type AutofillFetchStatus = 'loading' | 'fetched' | 'error'
export type AutofillFillingStatus = 'idle' | 'filling_inputs' | 'success' | 'error'

const useAutofillInputs = () => {
  // State
  const [unfilledInputs, setUnfilledInputs] = useState<InputInfo[]>([])
  // Purely for UI
  const [fetchStatus, setFetchStatus] = useState<AutofillFetchStatus>('loading')
  const [fillingStatus, setFillingStatus] = useState<AutofillFillingStatus>('idle')

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
    console.log('Found inputs for autofill: ', elementsRef.current)
  }, 1000)

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
      const complexInputsInstructions = await triggerGetAutofillValues(elements)
      // ! WHILE TESTING WE DON'T WANT TO COST LLM TOKENS
      // const complexInputsInstructions = [] as AutofillInstruction[]
      const allInstructions = [...simpleInputsInstructions, ...complexInputsInstructions]

      handleUnfilledInputs(allInstructions)
      setFetchStatus('fetched')

      // TODO: This probably runs too many times
      console.log('complex inputs instructions found')
      return complexInputsInstructions
    })()
  }, [elementsRef])

  const executeAutofillSequence = async () => {
    const simpleInputsInstructionsPromise = simpleInputsPromiseRef.current
    const complexInputsInstructionsPromise = complexInputsPromiseRef.current
    const loading = fetchStatus === 'loading'

    setFillingStatus('filling_inputs')
    if (!simpleInputsInstructionsPromise || !complexInputsInstructionsPromise) return

    const simpleInputsInstructions = await simpleInputsInstructionsPromise
    console.log('filling simple inputs', simpleInputsInstructions)

    const animationSpeed = loading ? AutofillAnimationSpeeds.SLOW : AutofillAnimationSpeeds.FAST
    await autofillInputElements(simpleInputsInstructions, animationSpeed)

    const remainingAutofillInstructions = await complexInputsInstructionsPromise
    console.log('filling complex inputs', remainingAutofillInstructions)
    await autofillInputElements(remainingAutofillInstructions, AutofillAnimationSpeeds.NONE)

    const resumeInstructions = simpleInputsInstructions.filter(
      (instruction) => instruction.value === RESUME_UPLOAD_VALUE,
    )

    setFillingStatus('success')

    // Returns the resume instructions to be filled in the next step
    return resumeInstructions
  }

  return {
    executeAutofillSequence,
    unfilledInputs,
    fillingStatus,
    fetchStatus,
  }
}

export default useAutofillInputs
