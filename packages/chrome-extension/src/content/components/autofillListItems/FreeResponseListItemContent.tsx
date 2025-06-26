import React, { useEffect, useState } from 'react'
import type { InputInfo } from '../../hooks/useInputElements'
import LoadingSpinner from '../LoadingSpinner'
import styled from '@emotion/styled'
import { PromptText } from './UnfilledInputsListItemContent'
import { QuestionText } from '../InputsCheckboxList'
import { Center, Input } from '@mantine/core'
import { Wand2 } from 'lucide-react'
import triggerWriteFreeResponse from '../../triggers/triggerWriteFreeResponse'
import { useAtomValue } from 'jotai'
import { jobUrlAtom, tailoringResumeAtom } from '../../atoms'
import { highlightAndScrollToInput } from '../../inputsManipulation/animateInputFilling'
import { autofillInputElements } from '../../inputsManipulation/autofillInputElements'
import { AutofillReadyInputArray } from '../../autofillReadyInput'

const Container = styled.div({
  width: '100%',
})

const QuestionContainer = styled.div<{ isLoading?: boolean }>(({ isLoading }) => ({
  position: 'relative',
  opacity: isLoading ? 0.5 : 1,
  transition: 'opacity 0.2s ease-in-out',
}))

const LoadingOverlay = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '0.4rem',
  zIndex: 1,
})

const ThreeDotsLoader = styled.div({
  display: 'flex',
  gap: '0.2rem',
  '& div': {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#2abfe8',
    animation: 'threeDotsBounce 1.4s ease-in-out infinite both',
  },
  '& div:nth-of-type(1)': {
    animationDelay: '-0.32s',
  },
  '& div:nth-of-type(2)': {
    animationDelay: '-0.16s',
  },
  '@keyframes threeDotsBounce': {
    '0%, 80%, 100%': {
      transform: 'scale(0)',
    },
    '40%': {
      transform: 'scale(1)',
    },
  },
})

const FreeResponseQuestionList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
})

const PromptInputWrapper = styled.div({
  width: '100%',
  borderRadius: '0.4rem',
  flexGrow: 1,
  '& input': {
    opacity: 0.67,
    fontSize: '0.8rem',
  },
})

const initializePrompts = (freeResponseInputs: InputInfo[]) => {
  return freeResponseInputs.reduce(
    (acc, input) => {
      if (!input.label) return acc
      acc[input.label] = ''
      return acc
    },
    {} as Record<string, string>,
  )
}

interface FreeResponseListItemContentProps {
  freeResponseInputs: InputInfo[]
  loading: boolean
}

const FreeResponseListItemContent: React.FC<FreeResponseListItemContentProps> = ({
  freeResponseInputs,
  loading,
}) => {
  const jobUrl = useAtomValue(jobUrlAtom)
  const { name: resumeName } = useAtomValue(tailoringResumeAtom)
  const [prompts, setPrompts] = useState<Record<string, string>>(
    initializePrompts(freeResponseInputs),
  )
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const setLoadingState = (label: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [label]: isLoading }))
  }
  const isLoading = (label: string | null) => label !== null && loadingStates[label]

  useEffect(() => {
    setPrompts(initializePrompts(freeResponseInputs))
  }, [freeResponseInputs])

  const handleClick = async (input: InputInfo) => {
    if (!input.label || !jobUrl) return
    setLoadingState(input.label, true)
    const res = await triggerWriteFreeResponse(
      input.label,
      prompts[input.label],
      jobUrl,
      resumeName,
    )
    if (res) {
      const content = res.content
      console.log(content)
      highlightAndScrollToInput(input)
      autofillInputElements(
        AutofillReadyInputArray.fromAutofillInstructions([
          {
            input_id: input.elementReferenceId,
            value: content,
          },
        ]),
      )
    }
    setLoadingState(input.label, false)
  }

  return (
    <Container>
      {freeResponseInputs.length > 0 ? (
        <>
          <PromptText>Want help writing these responses?</PromptText>
          <PromptText style={{ marginBottom: '0.6rem' }}>
            {"Write a short prompt (or don't) and we'll help you out!"}
          </PromptText>
        </>
      ) : (
        <PromptText>No free response inputs found!</PromptText>
      )}
      {loading ? (
        <div
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <LoadingSpinner />
        </div>
      ) : (
        <FreeResponseQuestionList>
          {freeResponseInputs.map((input) => (
            <QuestionContainer key={input.label} isLoading={isLoading(input.label)}>
              {isLoading(input.label) && (
                <LoadingOverlay>
                  <ThreeDotsLoader>
                    <div />
                    <div />
                    <div />
                  </ThreeDotsLoader>
                </LoadingOverlay>
              )}
              <QuestionText key={input.label}>{input.label}</QuestionText>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <PromptInputWrapper>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (!input.label) return
                      setPrompts({
                        ...prompts,
                        [input.label]: e.target.value,
                      })
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleClick(input)
                      }
                    }}
                    disabled={loadingStates[input.label!]}
                  />
                </PromptInputWrapper>
                <Center
                  onClick={() => handleClick(input)}
                  style={{
                    borderRadius: '0.4rem',
                    padding: '0.39rem',
                    backgroundColor: isLoading(input.label!) ? '#ccc' : '#2abfe8',
                    cursor: isLoading(input.label!) ? 'not-allowed' : 'pointer',
                    pointerEvents: isLoading(input.label!) ? 'none' : 'auto',
                  }}
                >
                  <Wand2 size={18} color="white" />
                </Center>
              </div>
            </QuestionContainer>
          ))}
        </FreeResponseQuestionList>
      )}
    </Container>
  )
}

export default FreeResponseListItemContent
