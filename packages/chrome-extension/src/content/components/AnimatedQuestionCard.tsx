import styled from '@emotion/styled'
import { useSlideAnimation } from '../hooks/useSlideAnimation'
import { useState } from 'react'
import { Check } from 'lucide-react'

const QuestionCardContainer = styled.div({
  padding: '0.7rem',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  borderRadius: '0.75rem',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.025)',
  position: 'relative',
})

const QuestionText = styled.p({
  fontSize: '0.8rem',
  color: 'rgba(0, 0, 0, 0.6)',
  margin: 0,
  marginTop: '0.4rem',
  marginBottom: '0.2rem',
  textAlign: 'center',
})

const QuestionCaption = styled.p({
  fontSize: '0.69rem',
  color: 'rgba(0, 0, 0, 0.5)',
  margin: '0',
  textAlign: 'center',
})

const ButtonContainer = styled.div({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  marginTop: 'auto',
})

const YesNoButton = styled('button')(({ variant }: { variant: 'green' | 'red' }) => ({
  width: '3rem',
  height: '1.5rem',
  fontSize: '0.7rem',
  fontWeight: '400',
  // i'm bad with colors so i'm just using opacity to make it a bit more subtle
  opacity: 0.75,
  cursor: 'pointer',

  color: variant === 'green' ? '#3cb544' : '#f03e3e',
  border: `1px solid ${variant === 'green' ? '#67c26d' : '#e66767'}`,
  borderRadius: '5rem',
  backgroundColor: 'white',

  '&:hover': {
    backgroundColor: variant === 'green' ? '#e6f7e2' : '#fde8e8',
  },
}))

const InputContainer = styled.div({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
})

const ContextInput = styled.input({
  flex: 1,
  padding: '0.5rem',
  fontSize: '0.75rem',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '0.5rem',
  outline: 'none',
  '&:focus': {
    border: '1px solid #67c26d',
  },
})

const SubmitButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  padding: '0',
  backgroundColor: '#3cb544',
  border: '1px solid #67c26d',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  color: 'white',
  '&:hover': {
    backgroundColor: '#35a03a',
  },
})

type AnimatedQuestionCardProps = {
  question: string
  onAnswer: (answer: string) => void
  onNextQuestion: () => void
  isSkillsQuestion: boolean
  isLastQuestion: boolean
}

const AnimatedQuestionCard: React.FC<AnimatedQuestionCardProps> = ({
  question,
  onAnswer,
  onNextQuestion,
  isSkillsQuestion,
  isLastQuestion,
}) => {
  const { isTransitioning, animationClass, slideToNext, slideOut } = useSlideAnimation()
  const [showContextInput, setShowContextInput] = useState(false)
  const [contextText, setContextText] = useState('')

  const handleAnswer = (answer: string) => {
    if (isTransitioning) return

    onAnswer(answer)

    if (isLastQuestion) {
      slideOut()
    } else {
      slideToNext(onNextQuestion)
    }
  }

  const handleNoClick = () => {
    handleAnswer('No')
  }

  const handleYesClick = () => {
    if (isSkillsQuestion) {
      handleAnswer('Yes')
    } else {
      setShowContextInput(true)
    }
  }

  const handleContextSubmit = () => {
    const answer = contextText.trim() ? `Yes: ${contextText.trim()}` : 'Yes'
    setShowContextInput(false)
    setContextText('')
    handleAnswer(answer)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleContextSubmit()
    }
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.5rem' }}
    >
      <QuestionCardContainer className={animationClass}>
        {isSkillsQuestion && <QuestionCaption>Do you have this skill?</QuestionCaption>}
        <QuestionText>{question}</QuestionText>
      </QuestionCardContainer>
      {showContextInput ? (
        <InputContainer>
          <ContextInput
            type="text"
            placeholder="Add context (optional) and press Enter..."
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <SubmitButton onClick={handleContextSubmit} type="button">
            <Check size={16} />
          </SubmitButton>
        </InputContainer>
      ) : (
        <ButtonContainer>
          <YesNoButton variant="red" onClick={handleNoClick} disabled={isTransitioning}>
            No
          </YesNoButton>
          <YesNoButton variant="green" onClick={handleYesClick} disabled={isTransitioning}>
            Yes
          </YesNoButton>
        </ButtonContainer>
      )}
    </div>
  )
}

export default AnimatedQuestionCard
