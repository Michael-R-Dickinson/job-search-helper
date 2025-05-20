import React, { useState } from 'react'
import { QuestionAnswerMap } from './SelectSkillsDisplay'
import { AnimatePresence, motion } from 'motion/react'
import YesNoToggle, { ToggleStates } from '../YesNoToggle'
import { floorDivision } from '@/lib/utils'

const ExperienceQuestionSingle: React.FC<{
  question: string
  setValue: (value: boolean) => void
}> = ({ question, setValue }) => {
  const [checkedState, setCheckedState] = useState<ToggleStates>('default')

  return (
    <div className="flex content-around items-center gap-2">
      <p className="text-left">{question}</p>
      <YesNoToggle
        checkedState={checkedState}
        setCheckedState={(value: ToggleStates) => {
          // setValue maps on to the underlying data structure which only contains boolean values
          // whereas the checkedState, holds intermediate states such as the default - neither yes or no checked state
          // This could be improved later
          setCheckedState(value)
          setValue(value === 'yes')
        }}
      />
    </div>
  )
}

interface ExperienceQuestionsProps {
  experienceQuestionAnswers: Record<string, boolean>
  setExperienceQuestionAnswers: React.Dispatch<React.SetStateAction<QuestionAnswerMap>>
}

const QUESTION_GROUP_SIZE = 3
const ExperienceQuestions: React.FC<ExperienceQuestionsProps> = ({
  experienceQuestionAnswers,
  setExperienceQuestionAnswers,
}) => {
  const questionsArray = Object.entries(experienceQuestionAnswers)
  const numQuestions = questionsArray.length
  const numQuestionGroups = floorDivision(numQuestions, QUESTION_GROUP_SIZE)

  const [activeGroupIdx, setActiveGroupIdx] = React.useState(0)

  const questionGroup = questionsArray.slice(
    activeGroupIdx * 3,
    Math.min(activeGroupIdx * 3 + QUESTION_GROUP_SIZE, numQuestions - 1),
  )

  const nextQuestionGroup = () => {
    if (activeGroupIdx + 1 < numQuestionGroups) {
      setActiveGroupIdx((prev) => prev + 1)
    } else {
      setActiveGroupIdx(numQuestionGroups - 1)
    }
  }

  const updateQuestionValue = (question: string, value: boolean) => {
    setExperienceQuestionAnswers((prev) => ({
      ...prev,
      [question]: value,
    }))
    if (question === questionGroup[questionGroup.length - 1][0]) {
      nextQuestionGroup()
    }
  }

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeGroupIdx}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {questionGroup.map(([question, value], index) => (
            <ExperienceQuestionSingle
              key={index}
              question={question}
              setValue={(value: boolean) => updateQuestionValue(question, value)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ExperienceQuestions
