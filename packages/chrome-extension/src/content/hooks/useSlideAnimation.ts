import { useState, useCallback } from 'react'

export const useSlideAnimation = () => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [animationClass, setAnimationClass] = useState('')

  const slideToNext = useCallback((onComplete?: () => void) => {
    setIsTransitioning(true)
    setAnimationClass('slide-out-left')

    setTimeout(() => {
      // Update content BEFORE sliding in
      onComplete?.()
      setAnimationClass('slide-in-right')

      setTimeout(() => {
        setAnimationClass('')
        setIsTransitioning(false)
      }, 300)
    }, 300)
  }, [])

  const slideOut = useCallback((onComplete?: () => void) => {
    setIsTransitioning(true)
    setAnimationClass('slide-out-left')

    setTimeout(() => {
      onComplete?.()
    }, 300)
  }, [])

  return { isTransitioning, animationClass, slideToNext, slideOut }
}
