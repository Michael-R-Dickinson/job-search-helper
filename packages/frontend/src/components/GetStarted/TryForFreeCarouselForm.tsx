'use client'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import ResumeUploadTile from './ResumeUploadTile'
import LinkedinLinkPaste from './LinkedinLinkPaste'
import TailoredResumeDisplay from './TailoredResumeDisplay'

type SlideFormat = {
  component: React.ReactNode
  height: string
  width?: string
}

const TryForFreeCarouselForm = () => {
  const [step, setStep] = useState(2)
  const maxSlides = 3
  const next = () => void setStep((prev) => (prev + 1 < maxSlides ? prev + 1 : 0))

  const slides: SlideFormat[] = [
    { component: <ResumeUploadTile onUploadComplete={next} key="upload" />, height: '400px' },
    { component: <LinkedinLinkPaste onLinkInputted={next} key="linkedin" />, height: '275px' },
    { component: <TailoredResumeDisplay key="tailored" />, height: '400px', width: '600px' },
  ]

  return (
    <motion.div
      layout
      transition={{
        duration: 0.35,
        delay: 0.1,
      }}
      style={{
        height: slides[step].height,
        width: slides[step].width || 'var(--container-md)',
      }}
      className="mt-[33vh] bg-white px-8 py-12 rounded-2xl shadow-lg text-center space-y-6"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          layout
          key={step}
          initial={{ x: 300, opacity: 0, transition: { duration: 0.35 } }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.35, delay: 0.2 } }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          {slides[step].component}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default TryForFreeCarouselForm
