'use client'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import ResumeUploadTile from './ResumeUploadTile'
import LinkedinLinkPaste from './LinkedinLinkPaste'

const TryForFreeCarouselForm = () => {
  const [step, setStep] = useState(0)
  const next = () => void setStep((prev) => prev + 1)

  const slides = [
    <ResumeUploadTile onUploadComplete={next} key="upload" />,
    <LinkedinLinkPaste onLinkInputted={next} key="linkedin" />,
  ]

  if (step > slides.length - 1) {
    return <div>Done</div>
  }
  return (
    <div className="mt-[33vh] w-full max-w-md bg-white px-8 py-12 rounded-2xl shadow-lg text-center space-y-6 h-[400px]">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={step}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          // className="absolute inset-0"
        >
          {slides[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default TryForFreeCarouselForm
