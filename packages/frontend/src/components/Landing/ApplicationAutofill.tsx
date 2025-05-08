import React from 'react'
import FeatureSection from '../FeatureSection'
import { LINKED_SECTION_IDS } from '@/lib/enums'
import ApplicationFormPreview from './ApplicationFormPreview'
import AutofillFeatureList from './AutofillFeatureList'

const ApplicationAutofill = () => (
  <FeatureSection
    id={LINKED_SECTION_IDS.AUTOFILL}
    className="bg-gradient-to-b to-gray-50 from-white"
  >
    <div className="max-w-5xl mx-auto">
      <h2 className="mb-6 text-center feature-item-animate">
        Step 2: <span className="gradient-text">Autofill</span> Job Applications in a Flash.
      </h2>
      <ApplicationFormPreview showOverlay />
      <AutofillFeatureList />
    </div>
  </FeatureSection>
)

export default ApplicationAutofill
