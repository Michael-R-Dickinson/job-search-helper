import styled from '@emotion/styled'
import { Check } from 'lucide-react'

const PromptText = styled.p({
  fontSize: '0.85rem',
  color: 'rgba(0, 0, 0, 0.7)',
  margin: '0.0rem',
})

const PromptTextContainer = styled.div({
  margin: '0.2rem',
})

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

const QuestionCheckIndicator = () => (
  <div
    style={{
      borderRadius: '5rem',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      minWidth: '24px',
      minHeight: '24px',
      maxWidth: '24px',
      maxHeight: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Check size={16} color="rgba(0, 0, 0, 0.6)" />
  </div>
)

const QuestionListContainer = styled.div({
  marginTop: '0.3rem',
  marginBottom: '0.8rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.1rem',
})

const MoreQuestionsRemainingText = styled.p({
  fontSize: '0.8rem',
  color: 'rgba(0, 0, 0, 0.6)',
  margin: '0',
})

const UnfilledInputsListItemContent = () => {
  return (
    <PromptTextContainer>
      <PromptText>Help us fill in these inputs – </PromptText>
      <PromptText>And we'll remember them for next time!</PromptText>
      <QuestionListContainer>
        <QuestionContainer>
          <QuestionCheckIndicator />
          <QuestionText>How would you describe your racial/ethnic background?</QuestionText>
        </QuestionContainer>
        <QuestionContainer>
          <QuestionCheckIndicator />
          <QuestionText>How would you describe your racial/ethnic background?</QuestionText>
        </QuestionContainer>
      </QuestionListContainer>
      <MoreQuestionsRemainingText>3 More Questions Remaining</MoreQuestionsRemainingText>
    </PromptTextContainer>
  )
}

export default UnfilledInputsListItemContent
