import { Check } from 'lucide-react'
import styled from '@emotion/styled'
import type { InputInfo } from '../hooks/useInputElements'
import triggerPulseAnimation from '../inputsManipulation/animateInputFilling'
import { getElementByReferenceId } from '../inputsManipulation/autofillInputElements'

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

const highlightAndScrollToInput = (input: InputInfo) => () => {
  const inputElement = getElementByReferenceId(input.elementReferenceId)
  if (inputElement) {
    triggerPulseAnimation(inputElement)
    inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

type Props = {
  inputs: InputInfo[]
  maxItems?: number
}

const CheckboxList = ({ inputs, maxItems = 5 }: Props) => {
  return (
    <QuestionListContainer>
      {inputs.map((input) => (
        <QuestionContainer
          key={input.elementReferenceId}
          onClick={highlightAndScrollToInput(input)}
        >
          <QuestionCheckIndicator />
          <QuestionText>{input.label}</QuestionText>
        </QuestionContainer>
      ))}
    </QuestionListContainer>
  )
}

export default CheckboxList
