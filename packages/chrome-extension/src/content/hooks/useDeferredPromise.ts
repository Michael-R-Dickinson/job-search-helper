import { useRef, useCallback } from 'react'

export function useDeferredPromise<T>() {
  const valueRef = useRef<T | null>(null)
  const resolveRef = useRef<((v: T) => void) | null>(null)
  const promiseRef = useRef<Promise<T> | null>(null)

  const createPromise = useCallback(() => {
    return new Promise<T>((resolve) => {
      resolveRef.current = (v: T) => {
        valueRef.current = v
        resolve(v)
        resolveRef.current = null
      }
    })
  }, [])

  // Lazily create on first render/use
  if (!promiseRef.current) {
    promiseRef.current = createPromise()
  }

  const resolve = useCallback((v: T) => {
    resolveRef.current?.(v)
  }, [])

  return {
    /** Current pending promise (always defined after the first render). */
    promiseRef,
    /** Call to resolve the current promise with a value. */
    resolve,
    /** Live ref that always holds the latest resolved value (or null if none yet). */
    valueRef,
  }
}

export default useDeferredPromise
