'use client'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import ResumeUploadTile from './ResumeUploadTile'
import LinkedinLinkPaste from './LinkedinLinkPaste'
import TailoredResumeDisplay from './TailoredResumeDisplay'

type ResumeTailoringDetails = {
  fileName?: string
  linkedInJobUrl?: string
}

type SlideFormat = {
  component: React.ReactNode
  height: string
  width?: string
}

const TryForFreeCarouselForm = () => {
  const [resumeDetails, setResumeDetails] = useState<ResumeTailoringDetails>({})
  const updateResumeDetail = (key: keyof ResumeTailoringDetails, value: string) =>
    void setResumeDetails((prev) => ({ ...prev, [key]: value }))

  const [step, setStep] = useState(0)
  const maxSlides = 3
  const next = () => void setStep((prev) => (prev + 1 < maxSlides ? prev + 1 : 0))

  const slides: SlideFormat[] = [
    {
      component: (
        <ResumeUploadTile
          onUploadComplete={(fileName) => updateResumeDetail('fileName', fileName)}
          key="upload"
        />
      ),
      height: '400px',
    },
    {
      component: (
        <LinkedinLinkPaste
          onLinkInputted={(link) => updateResumeDetail('linkedInJobUrl', link)}
          key="linkedin"
        />
      ),
      height: '275px',
    },
    {
      component: (
        <TailoredResumeDisplay
          linkedInJobUrl={resumeDetails.linkedInJobUrl}
          fileName={resumeDetails.fileName}
          key="tailored"
        />
      ),
      height: '400px',
      width: '600px',
    },
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
