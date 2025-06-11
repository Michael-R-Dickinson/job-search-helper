import type { QuestionAnswers } from '../../backendApi'
import type { QuestionAnswersAllowUnfilled } from './autofillListItems/ResumeListItemContent'
import styled from '@emotion/styled'
import { Check } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

const QuestionContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.5rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.035)',
  },
})

const QuestionText = styled.p({
  fontSize: '0.8rem',
  color: 'rgba(0, 0, 0, 0.6)',
  margin: '0',
})

const QuestionCheckIndicator = styled.div<{ checked: boolean }>(({ checked }) => ({
  borderRadius: '5rem',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  minWidth: '24px',
  minHeight: '24px',
  maxWidth: '24px',
  maxHeight: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: checked ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
}))

const QuestionListContainer = styled.div({
  marginTop: '0.3rem',
  marginBottom: '0.8rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.1rem',
})

type Props = {
  tailoringQuestions: QuestionAnswersAllowUnfilled | null
  setQuestionAnswers: (questionAnswers: QuestionAnswersAllowUnfilled) => void
  onAllQuestionsAnswered: (questionAnswers: QuestionAnswers) => void
}

const TailoringQuestions = ({
  tailoringQuestions,
  setQuestionAnswers,
  onAllQuestionsAnswered,
}: Props) => {
  // Show loading spinner if tailoringQuestions is null
  if (!tailoringQuestions) {
    return <LoadingSpinner />
  }

  const handleQuestionToggle = (
    category: 'skillsToAdd' | 'experienceQuestions',
    question: string,
  ) => {
    const newAnswers = {
      ...tailoringQuestions,
      [category]: {
        ...tailoringQuestions[category],
        [question]: !tailoringQuestions[category][question],
      },
    }
    setQuestionAnswers(newAnswers)

    // Check if all questions are answered
    const allAnswered =
      Object.values(newAnswers.skillsToAdd).every((answer) => answer !== null) &&
      Object.values(newAnswers.experienceQuestions).every((answer) => answer !== null)

    if (allAnswered) {
      onAllQuestionsAnswered(newAnswers as QuestionAnswers)
    }
  }

  return (
    <QuestionListContainer>
      {Object.entries(tailoringQuestions.skillsToAdd).map(([skill, answer]) => (
        <QuestionContainer key={skill} onClick={() => handleQuestionToggle('skillsToAdd', skill)}>
          <QuestionCheckIndicator checked={answer === true}>
            {answer === true && <Check size={16} color="rgba(0, 0, 0, 0.6)" />}
          </QuestionCheckIndicator>
          <QuestionText>{skill}</QuestionText>
        </QuestionContainer>
      ))}
      {Object.entries(tailoringQuestions.experienceQuestions).map(([question, answer]) => (
        <QuestionContainer
          key={question}
          onClick={() => handleQuestionToggle('experienceQuestions', question)}
        >
          <QuestionCheckIndicator checked={answer === true}>
            {answer === true && <Check size={16} color="rgba(0, 0, 0, 0.6)" />}
          </QuestionCheckIndicator>
          <QuestionText>{question}</QuestionText>
        </QuestionContainer>
      ))}
    </QuestionListContainer>
  )
}

export default TailoringQuestions
