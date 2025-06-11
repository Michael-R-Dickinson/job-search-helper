import { Check } from 'lucide-react'
import styled from '@emotion/styled'
import type { InputInfo } from '../hooks/useInputElements'
import triggerPulseAnimation from '../inputsManipulation/animateInputFilling'
import { getElementByReferenceId } from '../inputsManipulation/autofillInputElements'
import { useInputAnimations } from '../hooks/useInputAnimations'

const QuestionContainer = styled.div<{
  isExiting?: boolean
  isCollapsing?: boolean
  isEntering?: boolean
}>(({ isExiting, isCollapsing, isEntering }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.5rem',
  cursor: 'pointer',
  transition: isCollapsing ? 'all 0.2s ease-in-out' : 'opacity 0.3s ease-in-out',
  opacity: isExiting ? 0 : isEntering ? 1 : 1,
  maxHeight: isCollapsing ? '0' : '60px',
  overflow: 'hidden',
  marginBottom: isCollapsing ? '0' : '0.1rem',
  paddingTop: isCollapsing ? '0' : '0.5rem',
  paddingBottom: isCollapsing ? '0' : '0.5rem',
  '&:hover': {
    backgroundColor: isExiting ? 'transparent' : 'rgba(0, 0, 0, 0.035)',
  },
}))

const QuestionText = styled.p({
  fontSize: '0.8rem',
  color: 'rgba(0, 0, 0, 0.6)',
  margin: '0',
})

const QuestionCheckIndicator = ({ filled }: { filled: boolean }) => (
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
      backgroundColor: filled ? '#10b981' : 'transparent',
      borderColor: filled ? '#10b981' : 'rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease-in-out',
    }}
  >
    <Check size={16} color={filled ? 'white' : 'rgba(0, 0, 0, 0.6)'} />
  </div>
)

const QuestionListContainer = styled.div<{ height: number }>(({ height }) => ({
  marginTop: '0.3rem',
  marginBottom: '0.8rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.1rem',
  transition: 'height 0.3s ease-in-out',
  height: `${height}px`,
  minHeight: `${height}px`,
}))

const highlightAndScrollToInput = (input: InputInfo) => () => {
  const inputElement = getElementByReferenceId(input.elementReferenceId)
  if (inputElement) {
    triggerPulseAnimation(inputElement)
    inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

type Props = {
  inputs: InputInfo[]
  maxItems?: number
}

const CheckboxList = ({ inputs, maxItems = 5 }: Props) => {
  const {
    visibleInputs,
    dynamicHeight,
    markInputAsFilled,
    isInputFilled,
    isInputExiting,
    isInputCollapsing,
    isInputEntering,
  } = useInputAnimations(inputs, maxItems)

  return (
    <QuestionListContainer height={dynamicHeight}>
      {visibleInputs.map((input) => (
        <QuestionContainer
          key={input.elementReferenceId}
          onClick={() => {
            markInputAsFilled(input)
            highlightAndScrollToInput(input)()
          }}
          isExiting={isInputExiting(input)}
          isCollapsing={isInputCollapsing(input)}
          isEntering={isInputEntering(input)}
        >
          <QuestionCheckIndicator filled={isInputFilled(input)} />
          <QuestionText>{truncateText(input.label ?? '', 90)}</QuestionText>
        </QuestionContainer>
      ))}
    </QuestionListContainer>
  )
}

export default CheckboxList
