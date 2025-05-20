import React, { useState } from 'react'
import { ResumeTailoringDetails } from './TryForFreeCarouselForm'
import { getEmptyMap } from '@/lib/utils'
import SkillsToAddChips from './SkillsToAddChips'
import ExperienceQuestions from './ExperienceQuestions'

export type QuestionAnswerMap = Record<string, boolean>

interface SelectSkillsDisplayProps {
  skillsToAdd: string[]
  experienceQuestions: string[]
  setResumeDetail: (key: keyof ResumeTailoringDetails, value: string) => void
}

const SelectSkillsDisplay: React.FC<SelectSkillsDisplayProps> = ({
  skillsToAdd,
  experienceQuestions,
  setResumeDetail,
}) => {
  // A map of a skill to a boolean value indicating if the user has the skill and therefore
  // should be added to the resume
  const [skillsSelected, setSkillsSelected] = useState<Record<string, boolean>>(
    getEmptyMap(skillsToAdd, false),
  )
  const [experienceQuestionAnswers, setExperienceQuestionAnswers] = useState<QuestionAnswerMap>(
    getEmptyMap(experienceQuestions, false),
  )
  return (
    <div className="h-full w-full">
      <div className="mb-12">
        <div className="mb-4">
          <h2 className="text-2xl ">Do you have these skills?</h2>
          <p className="text-gray-600">Click skills to add</p>
        </div>
        <SkillsToAddChips skillsSelected={skillsSelected} setSkillsSelected={setSkillsSelected} />
      </div>
      <div>
        <div className="mb-4">
          <h2 className="text-2xl ">Tailoring Questions</h2>
          <p className="text-gray-600">Click Yes or No</p>
        </div>
        <ExperienceQuestions
          experienceQuestionAnswers={experienceQuestionAnswers}
          setExperienceQuestionAnswers={setExperienceQuestionAnswers}
        />
      </div>
    </div>
  )
}

export default SelectSkillsDisplay
