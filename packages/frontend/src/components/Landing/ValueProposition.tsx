'use client'

import ResumeTailoringSection from '../ResumeTailoringSection'
import ApplicationAutofill from './ApplicationAutofill'
import ApplicationTracking from './ApplicationTracking'

const ValueProposition = () => {
  return (
    <div className="mx-auto w-full">
      <ResumeTailoringSection />
      <div className="max-w-5xl mx-auto">
        <ApplicationAutofill />
        <ApplicationTracking />
      </div>
    </div>
  )
}

export default ValueProposition
