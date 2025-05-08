'use client'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import ResumeUploadTile from './ResumeUploadTile'

const TryForFreeCarouselForm = () => {
  const [step, setStep] = useState(0)
  const next = () => void setStep((prev) => prev + 1)

  const slides = [
    <ResumeUploadTile onUploadComplete={next} key="upload" />,
    <div key="upload">
      <h1>Upload Your Resume</h1>
      <p>Drag &amp; drop your resume here, or click below to choose a file.</p>
    </div>,
    // <QuestionStep key="q2" question="What’s your email?" onNext={next} />,
    // <UploadStep key="upload" onNext={next} />,
  ]

  if (step > slides.length - 1) {
    return <div>Done</div>
  }
  return (
    <div className="mt-[33vh] w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center space-y-6 h-fit">
      {/* exitBeforeEnter */}
      <AnimatePresence initial={false}>
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
