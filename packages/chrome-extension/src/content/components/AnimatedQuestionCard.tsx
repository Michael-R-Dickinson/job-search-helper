import styled from '@emotion/styled'
import { useSlideAnimation } from '../hooks/useSlideAnimation'

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

type AnimatedQuestionCardProps = {
  question: string
  onAnswer: (answer: boolean) => void
  onNextQuestion: () => void
  onComplete: () => void
  isSkillsQuestion: boolean
  isLastQuestion: boolean
}

const AnimatedQuestionCard: React.FC<AnimatedQuestionCardProps> = ({
  question,
  onAnswer,
  onNextQuestion,
  onComplete,
  isSkillsQuestion,
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
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.5rem' }}
    >
      <QuestionCardContainer className={animationClass}>
        {isSkillsQuestion && <QuestionCaption>Do you have this skill?</QuestionCaption>}
        <QuestionText>{question}</QuestionText>
      </QuestionCardContainer>
      <ButtonContainer>
        <YesNoButton variant="red" onClick={() => handleAnswer(false)} disabled={isTransitioning}>
          No
        </YesNoButton>
        <YesNoButton variant="green" onClick={() => handleAnswer(true)} disabled={isTransitioning}>
          Yes
        </YesNoButton>
      </ButtonContainer>
    </div>
  )
}

export default AnimatedQuestionCard
