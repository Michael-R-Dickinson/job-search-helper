import { ReactNode } from 'react'

interface ProcessStepProps {
  icon: ReactNode
  title: string
  description: ReactNode
}

const ProcessStep = ({ icon, title, description }: ProcessStepProps) => (
  <div className="flex-1 flex flex-col items-center text-center p-3">
    <div className="bg-perfectify-purple/10 rounded-full p-3 mb-3">{icon}</div>
    <h4 className="font-medium mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
)

export default ProcessStep
