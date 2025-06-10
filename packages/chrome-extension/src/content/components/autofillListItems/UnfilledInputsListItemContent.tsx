import styled from '@emotion/styled'
import { Check } from 'lucide-react'
import type { InputInfo } from '../../hooks/useInputElements'
import LoadingSpinner from '../LoadingSpinner'
import { useMemo } from 'react'
import { getElementByReferenceId } from '../../inputsManipulation/autofillInputElements'
import triggerPulseAnimation from '../../inputsManipulation/animateInputFilling'

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

const highlightAndScrollToInput = (input: InputInfo) => () => {
  const inputElement = getElementByReferenceId(input.elementReferenceId)
  if (inputElement) {
    triggerPulseAnimation(inputElement)
    inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const UnfilledInputsListItemContent: React.FC<{
  unfilledInputs: InputInfo[]
  loading: boolean
}> = ({ unfilledInputs, loading }) => {
  const unfilledInputsToDisplay = useMemo(() => {
    return unfilledInputs.filter((input) => input.label !== '' && input.element.type !== 'button')
  }, [unfilledInputs])
  const moreQuestionsRemaining = unfilledInputsToDisplay.length

  return (
    <PromptTextContainer>
      <PromptText>Help us fill in these inputs – </PromptText>
      <PromptText>And we'll remember them for next time!</PromptText>
      {loading && <LoadingSpinner />}
      <QuestionListContainer>
        {unfilledInputsToDisplay.map((input) => (
          <QuestionContainer
            key={input.elementReferenceId}
            onClick={highlightAndScrollToInput(input)}
          >
            <QuestionCheckIndicator />
            <QuestionText>{input.label}</QuestionText>
          </QuestionContainer>
        ))}
      </QuestionListContainer>
      <MoreQuestionsRemainingText>
        {!loading &&
          (moreQuestionsRemaining > 0
            ? `${moreQuestionsRemaining} More Questions Remaining`
            : 'All Inputs Filled!')}
      </MoreQuestionsRemainingText>
    </PromptTextContainer>
  )
}

export default UnfilledInputsListItemContent
