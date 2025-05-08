import React from 'react'

interface AutofillFeatureItemProps {
  title: string
  description: string
}

const AutofillFeatureItem: React.FC<AutofillFeatureItemProps> = ({ title, description }) => (
  <li className="flex gap-3">
    <div className="mt-1 bg-perfectify-light rounded-full p-1">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="#9b87f5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </li>
)

export default AutofillFeatureItem
