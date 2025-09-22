import { useCallback, useEffect, useRef, useState } from 'react'
import type InputElement from '../input'
import type { AutofillFetchStatus } from './useAutofillInputs'
import type { InputInfo } from './useInputElements'
import { AutofillReadyInputArray } from '../autofillReadyInput'
import useDeferredPromise from './useDeferredPromise'
import { cleanText } from '../../utils'

export type AutofillFetchStates = {
  freeResponseInputs: InputElement[]
  unknownInputs: InputInfo[]
  fetchStatus: AutofillFetchStatus
  fastInputInstructionsPromiseRef: React.RefObject<Promise<AutofillReadyInputArray> | null>
  slowInputInstructionsPromiseRef: React.RefObject<Promise<AutofillReadyInputArray> | null>
  resumeInstructionsRef: React.RefObject<AutofillReadyInputArray>
}

type UseAutofillStatesResult = {
  resolveFastInputInstructions: (inputs: AutofillReadyInputArray) => void
  resolveSlowInputInstructions: (inputs: AutofillReadyInputArray) => void
  getUnfilledInputs: () => InputElement[]
  outputState: AutofillFetchStates
}

const useAutofillInstructionStates = (
  elementsRef: React.RefObject<InputElement[]>,
): UseAutofillStatesResult => {
  const [freeResponseInputs, _setFreeResponseInputs] = useState<InputElement[]>([])
  const [unknownInputs, setUnknownInputs] = useState<InputInfo[]>([])
  const [fetchStatus, setFetchStatus] = useState<AutofillFetchStatus>('loading')

  const {
    promiseRef: fastInputInstructionsPromiseRef,
    resolve: _resolveFastInputInstructions,
    valueRef: fastInputInstructionsValueRef,
  } = useDeferredPromise<AutofillReadyInputArray>()
  const {
    promiseRef: slowInputInstructionsPromiseRef,
    resolve: _resolveSlowInputInstructions,
    valueRef: slowInputInstructionsValueRef,
  } = useDeferredPromise<AutofillReadyInputArray>()
  const resumeInstructionsRef = useRef<AutofillReadyInputArray>(new AutofillReadyInputArray([]))

  // Unfilled inputs are those that we don't have any instructions for
  // Whereas unknown inputs are those that we don't have the information to fill
  const getUnfilledInputs: () => InputElement[] = useCallback(() => {
    const elements = elementsRef.current

    const filledInputs = [
      ...(fastInputInstructionsValueRef.current || []),
      ...(slowInputInstructionsValueRef.current || []),
      ...resumeInstructionsRef.current,
    ]
    const filledInputIds = filledInputs.map((i) => i.elementReferenceId)
    return elements.filter((el) => !filledInputIds.includes(el.elementReferenceId))
  }, [elementsRef, fastInputInstructionsValueRef, slowInputInstructionsValueRef])

  const updateUnknownInputs = useCallback(() => {
    const unfilled = getUnfilledInputs()

    const unknownInputs = unfilled.filter((el, idx, self) => {
      const isLabeled = Boolean(el.label)
      const isTextInput =
        el.element instanceof HTMLInputElement || el.element instanceof HTMLTextAreaElement
      const isUnique =
        idx === self.findIndex((i) => cleanText(i.label || '') === cleanText(el.label || ''))

      return isLabeled && isTextInput && isUnique
    })

    setUnknownInputs(unknownInputs)
  }, [getUnfilledInputs])

  const setResumeAutofillInstructions = (inputs: AutofillReadyInputArray) => {
    if (inputs.length > 0) {
      resumeInstructionsRef.current = inputs
    }
  }
  // Although these are named AutofillReadyInputArray, they don't yet have autofill values
  // These are just set to a free response placeholder
  const setFreeResponseInputs = (inputs: AutofillReadyInputArray) => {
    if (inputs.length > 0) {
      _setFreeResponseInputs(inputs)
    }
  }

  const resolveFastInputInstructions = useCallback(
    (inputs: AutofillReadyInputArray) => {
      if (inputs.length === 0) {
        return
      }

      _resolveFastInputInstructions(inputs.getStandardAutofills())
      setResumeAutofillInstructions(inputs.getResumeAutofills())
    },
    [_resolveFastInputInstructions],
  )

  const resolveSlowInputInstructions = useCallback(
    (inputs: AutofillReadyInputArray) => {
      if (inputs.length === 0) {
        return
      }

      _resolveSlowInputInstructions(inputs.getStandardAutofills())
      setFreeResponseInputs(inputs.getFreeResponseAutofills())

      updateUnknownInputs()

      setFetchStatus('fetched')
    },
    [_resolveSlowInputInstructions, updateUnknownInputs],
  )

  useEffect(() => {
    setFetchStatus('loading')
  }, [])

  return {
    resolveFastInputInstructions,
    resolveSlowInputInstructions,
    getUnfilledInputs,
    outputState: {
      freeResponseInputs,
      unknownInputs,
      fetchStatus,
      fastInputInstructionsPromiseRef,
      slowInputInstructionsPromiseRef,
      resumeInstructionsRef,
    },
  }
}

export default useAutofillInstructionStates
