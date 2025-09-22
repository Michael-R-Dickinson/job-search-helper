import { useCallback, useState } from 'react'
import type { AutofillFetchStates } from './useAutofillStates'
import { sendMessageToIframes } from '../iframe/iframeMessageHandler'
import { eventTypes } from '../../events'
import {
  AutofillAnimationSpeeds,
  autofillInputElements,
} from '../inputsManipulation/autofillInputElements'
import useMonitorIframeAutofills, { returnCompletionMessage } from './useMonitorIframeAutofills'

export type AutofillFillingStatus = 'idle' | 'filling_inputs' | 'success' | 'error'

const useExecuteAutofill = (outputState: AutofillFetchStates) => {
  const [fillingStatus, setFillingStatus] = useState<AutofillFillingStatus>('idle')

  const executeAutofillSequence = async () => {
    const simpleInputsInstructionsPromise = outputState.fastInputInstructionsPromiseRef.current
    const complexInputsInstructionsPromise = outputState.slowInputInstructionsPromiseRef.current
    const loading = outputState.fetchStatus === 'loading'

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

    setFillingStatus('success')
    returnCompletionMessage()
  }

  const executeResumeAutofill = async (resumeName: string) => {
    await sendMessageToIframes(eventTypes.BEGIN_RESUME_AUTOFILL, { resumeName })
    await outputState.fastInputInstructionsPromiseRef.current
    const resumeInstructions = outputState.resumeInstructionsRef.current
    if (!resumeInstructions) return

    resumeInstructions.setAutofillResumeUrl(resumeName)
    await autofillInputElements(resumeInstructions, AutofillAnimationSpeeds.NONE)
  }

  const setAutofillCompleted = useCallback(() => {
    setFillingStatus('success')
  }, [setFillingStatus])

  useMonitorIframeAutofills(setAutofillCompleted)

  return {
    executeAutofillSequence,
    executeResumeAutofill,
    fillingStatus,
  }
}

export default useExecuteAutofill
