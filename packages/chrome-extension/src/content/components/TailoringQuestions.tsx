import type { QuestionAnswers } from '../../backendApi'
import type { QuestionAnswersAllowUnfilled } from './autofillListItems/ResumeListItemContent'
import LoadingSpinner from './LoadingSpinner'
import AnimatedQuestionCard from './AnimatedQuestionCard'
import { useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { PromptText } from './autofillListItems/UnfilledInputsListItemContent'

const ProgressIndicator = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
})

const ProgressText = styled.p({
  fontSize: '0.75rem',
  color: 'rgba(0, 0, 0, 0.5)',
  margin: '0',
})

const HeadingText = styled(PromptText)({
  margin: '0.8rem 0',
})

type FlatQuestion = {
  type: 'skillsToAdd' | 'experienceQuestions'
  question: string
}

type Props = {
  tailoringQuestions: QuestionAnswersAllowUnfilled | null
  setQuestionAnswers: (questionAnswers: QuestionAnswersAllowUnfilled) => void
  onAllQuestionsAnswered: (questionAnswers: QuestionAnswers) => void
}

const flattenQuestions = (tailoringQuestions: QuestionAnswersAllowUnfilled): FlatQuestion[] => {
  const skills = Object.keys(tailoringQuestions.skillsToAdd).map((skill) => ({
    type: 'skillsToAdd' as const,
    question: skill,
  }))

  const experience = Object.keys(tailoringQuestions.experienceQuestions).map((question) => ({
    type: 'experienceQuestions' as const,
    question,
  }))

  return [...skills, ...experience]
}

const updateQuestionAnswer = (
  tailoringQuestions: QuestionAnswersAllowUnfilled,
  question: FlatQuestion,
  answer: boolean,
): QuestionAnswersAllowUnfilled => {
  return {
    ...tailoringQuestions,
    [question.type]: {
      ...tailoringQuestions[question.type],
      [question.question]: answer,
    },
  }
}

const allQuestionsAnswered = (questionAnswers: QuestionAnswersAllowUnfilled): boolean => {
  return (
    Object.values(questionAnswers.experienceQuestions).every((answer) => answer !== null) &&
    Object.values(questionAnswers.skillsToAdd).every((answer) => answer !== null)
  )
}

const TailoringQuestions = ({
  tailoringQuestions,
  setQuestionAnswers,
  onAllQuestionsAnswered,
}: Props) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const allQuestions = useMemo(() => {
    if (!tailoringQuestions) return []
    return flattenQuestions(tailoringQuestions)
  }, [tailoringQuestions])

  const currentQuestion = allQuestions[currentQuestionIndex]
  const totalQuestions = allQuestions.length
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1)
  }

  const handleAnswer = (answer: boolean) => {
    if (!currentQuestion || !tailoringQuestions) return

    const newAnswers = updateQuestionAnswer(tailoringQuestions, currentQuestion, answer)
    setQuestionAnswers(newAnswers)

    if (isLastQuestion) {
      if (!allQuestionsAnswered(newAnswers)) {
        console.error('not all questions answered', newAnswers)
        return
      }

      onAllQuestionsAnswered(newAnswers as QuestionAnswers)
    }
  }

  // Show loading spinner if tailoringQuestions is null
  if (!tailoringQuestions) {
    return <LoadingSpinner />
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div>
      <HeadingText>Answer a few questions to help us tailor your resume</HeadingText>
      <AnimatedQuestionCard
        question={currentQuestion.question}
        onAnswer={handleAnswer}
        onNextQuestion={handleNextQuestion}
        isSkillsQuestion={currentQuestion.type === 'skillsToAdd'}
        isLastQuestion={isLastQuestion}
      />
      <ProgressIndicator>
        <ProgressText>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </ProgressText>
      </ProgressIndicator>
    </div>
  )
}

export default TailoringQuestions
