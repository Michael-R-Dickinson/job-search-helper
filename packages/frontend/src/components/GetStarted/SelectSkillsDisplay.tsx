import React from 'react'
import { ResumeTailoringDetails } from './TryForFreeCarouselForm'

interface SelectSkillsDisplayProps {
  skillsToAdd: string[]
  experienceQuestions: string[]
  setResumeDetail: (key: keyof ResumeTailoringDetails, value: string) => void
}

const SelectSkillsDisplay: React.FC<SelectSkillsDisplayProps> = ({}) => {
  return <></>
}

export default SelectSkillsDisplay
