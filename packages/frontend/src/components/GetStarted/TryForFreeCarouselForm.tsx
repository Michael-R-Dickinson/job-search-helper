'use client'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import ResumeUploadTile from './ResumeUploadTile'
import LinkedinLinkPaste from './LinkedinLinkPaste'

const TryForFreeCarouselForm = () => {
  const [step, setStep] = useState(0)
  const maxSlides = 2
  const next = () => void setStep((prev) => (prev + 1 < maxSlides ? prev + 1 : 0))

  const slides = [
    <ResumeUploadTile onUploadComplete={next} key="upload" />,
    <LinkedinLinkPaste onLinkInputted={next} key="linkedin" />,
  ]

  if (step > slides.length - 1) {
    return <div>Done</div>
  }
  return (
    <motion.div
      layout
      transition={{
        duration: 0.35,
        delay: 0.1,
      }}
      style={{
        height: step === 0 ? '400px' : '300px',
      }}
      className="mt-[33vh] w-full max-w-md bg-white px-8 py-12 rounded-2xl shadow-lg text-center space-y-6 h-fit"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          layout
          key={step}
          initial={{ x: 300, opacity: 0, transition: { duration: 0.35 } }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.35, delay: 0.2 } }}
          exit={{ opacity: 0 }}
          // className="absolute inset-0"
        >
          {slides[step]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default TryForFreeCarouselForm
