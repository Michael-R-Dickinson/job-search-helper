'use client'

import ResumeTailoringSection from '../ResumeTailoringSection'
import ApplicationAutofill from './ApplicationAutofill'
import ApplicationTracking from './ApplicationTracking'

const ValueProposition = () => {
  return (
    <div className="mx-auto w-full">
      <ResumeTailoringSection />
      <ApplicationAutofill />
      <ApplicationTracking />
    </div>
  )
}

export default ValueProposition
