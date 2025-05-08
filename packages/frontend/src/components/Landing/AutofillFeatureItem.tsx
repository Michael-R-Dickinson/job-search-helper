import React from 'react'
import CheckCircleIcon from '../CheckCircleIcon'

interface AutofillFeatureItemProps {
  title: string
  description: string
}

const AutofillFeatureItem: React.FC<AutofillFeatureItemProps> = ({ title, description }) => (
  <li className="flex gap-3 items-center">
    <CheckCircleIcon />
    <div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </li>
)

export default AutofillFeatureItem
