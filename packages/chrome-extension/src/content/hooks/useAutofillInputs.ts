import { useCallback, useEffect, useRef, useState } from 'react'
import { useInputElements, type InputInfo } from './useInputElements'
import triggerGetAutofillValues, {
  triggerGetSimpleAutofillValues,
} from '../triggers/triggerGetAutofillValues'
import type { AutofillInstruction } from '../../autofillEngine/schema'
import { cleanText, useOnPageLoad } from '../../utils'
import {
  AutofillAnimationSpeeds,
  autofillInputElements,
} from '../inputsManipulation/autofillInputElements'
import {
  FREE_RESPONSE_VALUE,
  RESUME_UPLOAD_VALUE,
} from '../../autofillEngine/inputCategoryHandlers'
import { sendMessageToIframes } from '../iframe/iframeMessageHandler'
import { eventTypes } from '../../events'
import { frameId } from '../../content'
import handleResumeInstructions from '../handleResumeInstructions'

const useMonitorIframeAutofills = (setAutofillCompleted: () => void) => {
  useEffect(() => {
    const onFrameMsg = (event: MessageEvent) => {
      if (event.data?.type === eventTypes.AUTOFILL_WITH_IFRAMES_COMPLETED) {
        setAutofillCompleted()
      }
    }

    window.addEventListener('message', onFrameMsg)

    return () => {
      window.removeEventListener('message', onFrameMsg)
    }
  }, [setAutofillCompleted])
}

const returnCompletionMessage = () => {
  window.top?.postMessage(
    {
      type: eventTypes.AUTOFILL_WITH_IFRAMES_COMPLETED,
      fromFrame: frameId,
    },
    '*',
  )
}

export type AutofillFetchStatus = 'loading' | 'fetched' | 'error'
export type AutofillFillingStatus = 'idle' | 'filling_inputs' | 'success' | 'error'

const useAutofillInputs = () => {
  // State
  // Purely for UI
  const [freeResponseInputs, setFreeResponseInputs] = useState<InputInfo[]>([])
  const [unfilledInputs, setUnfilledInputs] = useState<InputInfo[]>([])
  const [fetchStatus, setFetchStatus] = useState<AutofillFetchStatus>('loading')
  const [fillingStatus, setFillingStatus] = useState<AutofillFillingStatus>('idle')

  // Refs
  const simpleInputsPromiseRef = useRef<Promise<AutofillInstruction[]> | null>(null)
  const complexInputsPromiseRef = useRef<Promise<AutofillInstruction[]> | null>(null)
  const resumeInstructionsRef = useRef<AutofillInstruction[]>([])
  // whether the inputs are housed in iframes or not - we need to disable some features if they are
  const [usesIframes, setUsesIframes] = useState(false)
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
    if (elementsRef.current.length <= 3) {
      setUsesIframes(true)
      return
    }
    console.log('Found inputs for autofill: ', elementsRef.current)
  }, 1000)

  useEffect(() => {
    // Conditional to prevent fetching autofills for frames or documents with few inputs
    const shouldFetchAutofills = elementsRef.current.length > 3
    if (!shouldFetchAutofills) return

    // Takes instructions for inputs to fill and sets unfilledInputs based on which have no values to fill
    const handleUnfilledInputs = (instructions: AutofillInstruction[]) => {
      const elements = elementsRef.current
      const filledInputIds = instructions
        .filter((i) => i.value !== null && i.value !== '')
        .map((i) => i.input_id)

      const unfilledInputs = elements.filter((el, idx, self) => {
        const isUnfilled = !filledInputIds.includes(el.elementReferenceId) && !!el.label
        const isTextInput =
          el.element instanceof HTMLInputElement || el.element instanceof HTMLTextAreaElement
        const isUnique =
          idx === self.findIndex((i) => cleanText(i.label || '') === cleanText(el.label || ''))

        return isUnfilled && isTextInput && isUnique
      })
      setUnfilledInputs(unfilledInputs)
      console.log('unfilledInputs', unfilledInputs)
    }

    const handleSpecialAutofillTokens = (instructions: AutofillInstruction[]) => {
      // Resume instructions
      const resumeInstructions = instructions.filter(
        (instruction) => instruction.value === RESUME_UPLOAD_VALUE,
      )
      const resumeInputIds = resumeInstructions.map((i) => i.input_id)

      // Free Responses
      const freeResponseInputs: InputInfo[] = instructions
        .filter((instruction) => instruction.value === FREE_RESPONSE_VALUE)
        .map((i) => {
          const element = elementsRef.current.find((el) => el.elementReferenceId === i.input_id)
          if (!element) return null
          return element
        })
        .filter((i) => i !== null)
      const freeResponseInputIds = freeResponseInputs.map((i) => i.elementReferenceId)

      if (resumeInstructions.length > 0) {
        resumeInstructionsRef.current = resumeInstructions
      }
      if (freeResponseInputs.length > 0) {
        setFreeResponseInputs(freeResponseInputs)
        console.log('freeResponseInputs', freeResponseInputs)
      }

      const specialInputsIds = [...freeResponseInputIds, ...resumeInputIds]
      // console.log(
      //   'specialInputs',
      //   instructions.filter((i) => specialInputsIds.includes(i.input_id)),
      // )
      return specialInputsIds
    }

    simpleInputsPromiseRef.current = (async () => {
      await pageLoadedDeferredRef.current?.promise

      const elements = elementsRef.current
      const simpleInputsInstructions = await triggerGetSimpleAutofillValues(elements)
      const specialInputsIds = handleSpecialAutofillTokens(simpleInputsInstructions)
      const instructions = simpleInputsInstructions.filter(
        (i) => !specialInputsIds.includes(i.input_id),
      )
      return instructions
    })()

    complexInputsPromiseRef.current = (async () => {
      await pageLoadedDeferredRef.current?.promise
      const simpleInputsInstructions = (await simpleInputsPromiseRef.current) || []

      const elements = elementsRef.current
      const complexInputs = elements.filter(
        (el) =>
          !simpleInputsInstructions.some(
            (i) => i.input_id === el.elementReferenceId && i.value !== null && i.value !== '',
          ),
      )
      console.log('triggering complex inputs', complexInputs)
      const complexInputsInstructions = await triggerGetAutofillValues(complexInputs)
      // ! WHILE TESTING WE DON'T WANT TO COST LLM TOKENS
      // const complexInputsInstructions = [] as AutofillInstruction[]
      const allInstructions = [...simpleInputsInstructions, ...complexInputsInstructions]

      handleUnfilledInputs(allInstructions)
      const specialInputsIds = handleSpecialAutofillTokens(allInstructions)
      const instructions = complexInputsInstructions.filter(
        (i) => !specialInputsIds.includes(i.input_id),
      )
      setFetchStatus('fetched')

      console.log('complex inputs instructions found')
      return instructions
    })()
  }, [elementsRef])

  const executeAutofillSequence = async () => {
    const simpleInputsInstructionsPromise = simpleInputsPromiseRef.current
    const complexInputsInstructionsPromise = complexInputsPromiseRef.current
    const loading = fetchStatus === 'loading'

    setFillingStatus('filling_inputs')

    // Send autofill messages to all nested iframes
    await sendMessageToIframes(eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES)

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
    returnCompletionMessage()

    // Returns the resume instructions to be filled in the next step
    return resumeInstructions
  }

  const executeResumeAutofill = async (resumeName: string) => {
    await sendMessageToIframes(eventTypes.BEGIN_RESUME_AUTOFILL, { resumeName })
    await simpleInputsPromiseRef.current
    const resumeInstructions = resumeInstructionsRef.current
    if (!resumeInstructions) return
    const updatedResumeInstructions = handleResumeInstructions(resumeInstructions, resumeName)
    await autofillInputElements(updatedResumeInstructions, AutofillAnimationSpeeds.NONE)
  }

  const setAutofillCompleted = useCallback(() => {
    setFillingStatus('success')
  }, [setFillingStatus])
  useMonitorIframeAutofills(setAutofillCompleted)

  return {
    executeAutofillSequence,
    executeResumeAutofill,
    unfilledInputs,
    freeResponseInputs,
    fillingStatus,
    fetchStatus,
    usesIframes,
  }
}

export default useAutofillInputs
