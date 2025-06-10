import { useEffect, useRef } from 'react'

export type ValueOf<T> = T[keyof T]

// For content scripts
export function useOnPageLoad(callback: () => void, timeoutMs: number = 1000): void {
  const callbackRef = useRef<() => void>(callback)
  const hasFiredRef = useRef<boolean>(false)
  const timerRef = useRef<number | null>(null)
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
      callbackRef.current()
    }

    const resetTimer = (): void => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(finish, timeoutMs)
    }

    const startObserving = (): void => {
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
    }
  }, [timeoutMs])
}
