'use client'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import ResumeUploadTile from './ResumeUploadTile'
import LinkedinLinkPaste from './LinkedinLinkPaste'
import TailoredResumeHandler from './TailoredResumeHandler'
import { auth } from '../../../firebase'
import SelectSkillsHandler from './SelectSkillsHandler'
import { QuestionAnswers } from '@/lib/api'

export type ResumeTailoringDetails = {
  fileName?: string
  linkedInJobUrl?: string
  chatId?: string
  questionAnswers?: QuestionAnswers
}

type SlideFormat = {
  component: React.ReactNode
  height: string
  width?: string
}

export type UpdateResumeDetails = (
  key: keyof ResumeTailoringDetails,
  value: ResumeTailoringDetails[keyof ResumeTailoringDetails],
) => void

const TryForFreeCarouselForm = () => {
  const [resumeDetails, setResumeDetails] = useState<ResumeTailoringDetails>({})
  const updateResumeDetail: UpdateResumeDetails = (key, value) =>
    void setResumeDetails((prev) => ({ ...prev, [key]: value }))

  const [step, setStep] = useState(0)
  const maxSlides = 4
  const next = () => void setStep((prev) => (prev + 1 < maxSlides ? prev + 1 : 0))

  const slides: SlideFormat[] = [
    {
      component: (
        <ResumeUploadTile
          onUploadComplete={(fileName) => {
            updateResumeDetail('fileName', fileName)
            next()
          }}
          key="upload"
        />
      ),
      height: '400px',
    },
    {
      component: (
        <LinkedinLinkPaste
          onLinkInputted={(link) => {
            updateResumeDetail('linkedInJobUrl', link)
            next()
          }}
          key="linkedin"
        />
      ),
      height: '275px',
    },
    {
      component: (
        <SelectSkillsHandler
          userId={auth.currentUser.uid}
          fileName={resumeDetails.fileName}
          linkedInJobUrl={resumeDetails.linkedInJobUrl}
          setResumeDetail={updateResumeDetail}
          onQuestionsAnsweredCallback={() => {
            next()
          }}
        />
      ),
      height: '500px',
      width: '600px',
    },
    {
      component: (
        <TailoredResumeHandler
          userId={auth.currentUser.uid}
          fileName={resumeDetails.fileName}
          key="tailored"
        />
      ),
      height: '400px',
      width: '600px',
    },
  ]

  return (
    // This outer motion.div only deals with the height and width of the carousel tile
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
      {/* This inner AnimatePresence and motion.div deals with switching the slide */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          layout="position"
          key={step}
          initial={{ x: 300, opacity: 0, transition: { duration: 0.35 } }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.35, delay: 0.2 } }}
          exit={{ opacity: 0 }}
          className="h-full w-full"
        >
          <>{slides[step].component}</>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default TryForFreeCarouselForm
