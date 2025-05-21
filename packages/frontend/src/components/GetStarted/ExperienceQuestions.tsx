import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import YesNoToggle, { ToggleStates } from '../YesNoToggle'
import { floorDivision } from '@/lib/utils'
import { QuestionAnswerMap } from '@/lib/api'

const ExperienceQuestionSingle: React.FC<{
  question: string
  setValue: (value: boolean) => void
}> = ({ question, setValue }) => {
  const [checkedState, setCheckedState] = useState<ToggleStates>('default')

  return (
    <div className="flex justify-between items-center gap-2 my-3 text-gray-700">
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
  selectionFinishedCallback?: () => void
}

const QUESTION_GROUP_SIZE = 3
const ExperienceQuestions: React.FC<ExperienceQuestionsProps> = ({
  experienceQuestionAnswers,
  setExperienceQuestionAnswers,
  selectionFinishedCallback,
}) => {
  // TODO: Bad practice, we end up storing the same data here and also with the default state in each
  // TODO: ExperienceQuestionSingle component, fix this
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([])
  const [activeGroupIdx, setActiveGroupIdx] = useState(0)

  const questionsArray = Object.entries(experienceQuestionAnswers)
  const numQuestions = questionsArray.length
  const numQuestionGroups = floorDivision(numQuestions, QUESTION_GROUP_SIZE)

  const questionGroup = questionsArray.slice(
    activeGroupIdx * 3,
    Math.min(activeGroupIdx * 3 + QUESTION_GROUP_SIZE, numQuestions - 1),
  )

  const nextQuestionGroup = () => {
    if (activeGroupIdx + 1 < numQuestionGroups) {
      setActiveGroupIdx((prev) => prev + 1)
    } else {
      selectionFinishedCallback?.()
    }
  }

  const updateQuestionValue = (question: string, value: boolean) => {
    setExperienceQuestionAnswers((prev) => ({
      ...prev,
      [question]: value,
    }))
    if (!answeredQuestions.includes(question)) {
      // If we use the state variable directly, it will not be updated immediately
      const newAnsweredQuestions = [...answeredQuestions, question]
      setAnsweredQuestions(newAnsweredQuestions)

      if (questionGroup.every(([question, _]) => newAnsweredQuestions.includes(question))) {
        nextQuestionGroup()
      }
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
          transition={{ duration: 0.3, delay: 0.1 }}
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
