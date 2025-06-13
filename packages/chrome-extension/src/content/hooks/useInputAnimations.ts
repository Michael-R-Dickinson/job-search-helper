import { useState, useEffect, useRef } from 'react'
import type { InputInfo } from './useInputElements'

export const useInputAnimations = (
  inputs: InputInfo[],
  maxItems: number = 5,
  filledInputs: InputInfo[],
  setFilledInputs: React.Dispatch<React.SetStateAction<InputInfo[]>>,
) => {
  const [exitingInputs, setExitingInputs] = useState<Set<string>>(new Set())
  const [collapsingInputs, setCollapsingInputs] = useState<Set<string>>(new Set())
  const [removedInputs, setRemovedInputs] = useState<Set<string>>(new Set())
  const [enteringInputs, setEnteringInputs] = useState<Set<string>>(new Set())
  const previousVisibleIds = useRef<string[]>([])

  // Filter inputs: remove completely filled ones, then limit to maxItems
  const visibleInputs = inputs
    .filter((input) => !removedInputs.has(input.elementReferenceId))
    .slice(0, maxItems)

  // Simple dynamic height calculation
  const dynamicHeight = visibleInputs.length * 50

  // Detect new items entering the visible list
  useEffect(() => {
    const currentVisibleIds = visibleInputs.map((input) => input.elementReferenceId)
    const newIds = currentVisibleIds.filter((id) => !previousVisibleIds.current.includes(id))

    if (newIds.length > 0) {
      // Mark new items as entering with initial opacity 0
      setEnteringInputs((prev) => new Set([...prev, ...newIds]))

      // Fade them in after a brief delay
      setTimeout(() => {
        setEnteringInputs((prev) => {
          const updated = new Set(prev)
          newIds.forEach((id) => updated.delete(id))
          return updated
        })
      }, 50)
    }

    previousVisibleIds.current = currentVisibleIds
  }, [visibleInputs])

  // Handle animation sequence when inputs are filled
  useEffect(() => {
    filledInputs.forEach((input) => {
      if (
        !exitingInputs.has(input.elementReferenceId) &&
        !removedInputs.has(input.elementReferenceId)
      ) {
        // Show green checkbox for 500ms, then start fade animation
        setTimeout(() => {
          setExitingInputs((prev) => new Set([...prev, input.elementReferenceId]))

          // After fade completes, start collapse animation
          setTimeout(() => {
            setCollapsingInputs((prev) => new Set([...prev, input.elementReferenceId]))

            // After collapse completes, remove from visible list
            setTimeout(() => {
              setRemovedInputs((prev) => new Set([...prev, input.elementReferenceId]))
            }, 200) // Match the collapse transition duration
          }, 300) // Match the fade transition duration
        }, 500)
      }
    })
  }, [filledInputs, exitingInputs, removedInputs])

  const isInputFilled = (input: InputInfo) =>
    filledInputs.some((filled) => filled.elementReferenceId === input.elementReferenceId)

  const isInputExiting = (input: InputInfo) => exitingInputs.has(input.elementReferenceId)

  const isInputCollapsing = (input: InputInfo) => collapsingInputs.has(input.elementReferenceId)

  const isInputEntering = (input: InputInfo) => enteringInputs.has(input.elementReferenceId)

  return {
    visibleInputs,
    dynamicHeight,
    isInputFilled,
    isInputExiting,
    isInputCollapsing,
    isInputEntering,
  }
}
