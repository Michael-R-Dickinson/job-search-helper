import React from 'react'
import AutofillFeatureItem from './AutofillFeatureItem'

const features = [
  {
    title: 'One-Click Convenience',
    description:
      'Breeze through lengthy application forms on major job boards and company career pages.',
  },
  {
    title: 'Accuracy Assured',
    description: 'Reduce errors and ensure consistency across all your applications.',
  },
  {
    title: 'More Applications, Less Burnout',
    description:
      'Free up your time to find more opportunities, network, and prepare for interviews instead of battling forms.',
  },
]

const AutofillFeatureList: React.FC = () => (
  <ul className="space-y-4 mb-6 feature-item-animate">
    {features.map((feature) => (
      <AutofillFeatureItem
        key={feature.title}
        title={feature.title}
        description={feature.description}
      />
    ))}
  </ul>
)

export default AutofillFeatureList
