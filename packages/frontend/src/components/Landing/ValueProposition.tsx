'use client'

import ResumeTailoringSection from '../ResumeTailoringSection'
import ApplicationAutofill from './ApplicationAutofill'
import ApplicationTracking from './ApplicationTracking'
import ResumeTailoring from './ResumeTailoring'

const ValueProposition = () => {
  return (
    <section id="features" className="section bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <ResumeTailoring />
          <ResumeTailoringSection />
          <ApplicationAutofill />
          <ApplicationTracking />
        </div>
      </div>
    </section>
  )
}

export default ValueProposition
