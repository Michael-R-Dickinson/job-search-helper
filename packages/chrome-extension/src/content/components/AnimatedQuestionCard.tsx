import styled from '@emotion/styled'
import { Button } from '@mantine/core'
import { useSlideAnimation } from '../hooks/useSlideAnimation'

const QuestionCardContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1.5rem',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '0.75rem',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  minHeight: '200px',
  position: 'relative',
})

const QuestionText = styled.h3({
  fontSize: '1rem',
  color: 'rgba(0, 0, 0, 0.8)',
  margin: '0',
  textAlign: 'center',
  lineHeight: '1.4',
  fontWeight: '500',
})

const ButtonContainer = styled.div({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  marginTop: 'auto',
})

const ProgressIndicator = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1rem',
})

const ProgressText = styled.p({
  fontSize: '0.75rem',
  color: 'rgba(0, 0, 0, 0.5)',
  margin: '0',
})

type AnimatedQuestionCardProps = {
  question: string
  currentIndex: number
  totalQuestions: number
  onAnswer: (answer: boolean) => void
  onNextQuestion: () => void
  onComplete: () => void
  isLastQuestion: boolean
}

const AnimatedQuestionCard: React.FC<AnimatedQuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onNextQuestion,
  onComplete,
  isLastQuestion,
}) => {
  const { isTransitioning, animationClass, slideToNext, slideOut } = useSlideAnimation()

  const handleAnswer = (answer: boolean) => {
    if (isTransitioning) return

    onAnswer(answer)

    if (isLastQuestion) {
      slideOut(onComplete)
    } else {
      slideToNext(onNextQuestion)
    }
  }

  return (
    <div>
      <ProgressIndicator>
        <ProgressText>
          Question {currentIndex} of {totalQuestions}
        </ProgressText>
      </ProgressIndicator>

      <QuestionCardContainer className={animationClass}>
        <QuestionText>{question}</QuestionText>
        <ButtonContainer>
          <Button
            variant="outline"
            color="red"
            size="md"
            onClick={() => handleAnswer(false)}
            disabled={isTransitioning}
          >
            No
          </Button>
          <Button
            variant="filled"
            color="green"
            size="md"
            onClick={() => handleAnswer(true)}
            disabled={isTransitioning}
          >
            Yes
          </Button>
        </ButtonContainer>
      </QuestionCardContainer>
    </div>
  )
}

export default AnimatedQuestionCard
