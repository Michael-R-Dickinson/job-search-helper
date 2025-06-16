import { useEffect, useRef } from 'react'
import type {
  QuestionAnswerMapAllowUnfilled,
  QuestionAnswersAllowUnfilled,
} from './content/components/autofillListItems/ResumeListItemContent'
import type { QuestionsResponse } from './backendApi'

export type ValueOf<T> = T[keyof T]

// For content scripts
export function useOnPageLoad(
  callback: () => void,
  timeoutMs: number = 1000,
  maxTotalTimeMs: number = 5000,
): void {
  const callbackRef = useRef<() => void>(callback)
  const hasFiredRef = useRef<boolean>(false)
  const timerRef = useRef<number | null>(null)
  const maxTimerRef = useRef<number | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)

  // Keep the latest callback in a ref
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const finish = (): void => {
      if (hasFiredRef.current) return
      hasFiredRef.current = true
      observerRef.current?.disconnect()
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      if (maxTimerRef.current !== null) {
        clearTimeout(maxTimerRef.current)
      }
      callbackRef.current()
    }

    const resetTimer = (): void => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(finish, timeoutMs)
    }

    const startObserving = (): void => {
      // Start the maximum total time timer
      maxTimerRef.current = window.setTimeout(finish, maxTotalTimeMs)

      // Kick off the timer in case there are no mutations
      resetTimer()
      observerRef.current = new MutationObserver(resetTimer)
      observerRef.current.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      })
    }

    if (document.readyState === 'complete') {
      startObserving()
    } else {
      window.addEventListener('load', startObserving, { once: true })
    }

    return (): void => {
      window.removeEventListener('load', startObserving)
      observerRef.current?.disconnect()
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      if (maxTimerRef.current !== null) {
        clearTimeout(maxTimerRef.current)
      }
    }
  }, [timeoutMs, maxTotalTimeMs])
}

export const getEmptyQuestionAnswers = (
  questions: QuestionsResponse['questions'],
): QuestionAnswersAllowUnfilled => {
  const skillsToAdd = questions.skills_to_add.reduce((acc, question) => {
    acc[question] = null
    return acc
  }, {} as QuestionAnswerMapAllowUnfilled)
  const experienceQuestions = questions.experience_questions.reduce((acc, question) => {
    acc[question] = null
    return acc
  }, {} as QuestionAnswerMapAllowUnfilled)
  return { skillsToAdd, experienceQuestions }
}

export function shortHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    // multiply by 31 (a small prime), add the char code, force int32
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  // >>> 0 turns it into an unsigned 32-bit, toString(36) makes it shorter
  return (hash >>> 0).toString(36)
}
