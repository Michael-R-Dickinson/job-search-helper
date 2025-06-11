import styled from '@emotion/styled'
import type { InputInfo } from '../../hooks/useInputElements'
import LoadingSpinner from '../LoadingSpinner'
import { useMemo } from 'react'
import InputsCheckboxList from '../InputsCheckboxList'

export const PromptText = styled.p({
  fontSize: '0.85rem',
  color: 'rgba(0, 0, 0, 0.7)',
  margin: '0.0rem',
})
PromptText.withComponent('h3')

const PromptTextContainer = styled.div({
  margin: '0.2rem',
})

const MoreQuestionsRemainingText = styled.p({
  fontSize: '0.8rem',
  color: 'rgba(0, 0, 0, 0.6)',
  margin: '0',
})

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
      <InputsCheckboxList inputs={unfilledInputsToDisplay} />
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
