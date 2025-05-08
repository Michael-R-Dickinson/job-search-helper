import { ReactNode } from 'react'

interface ExplanationCardProps {
  title: string
  description: ReactNode
  className?: string
}

const ExplanationCard = ({ title, description, className }: ExplanationCardProps) => (
  <div
    className={`feature-item-animate p-4 rounded-lg bg-white border border-gray-100 shadow-sm ${className || ''}`}
  >
    <h4 className="font-medium mb-2 text-perfectify-purple">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
)

export default ExplanationCard
