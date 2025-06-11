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

const UnfilledInputsListItemContent: React.FC<{
  unfilledInputs: InputInfo[]
  loading: boolean
}> = ({ unfilledInputs, loading }) => {
  const unfilledInputsToDisplay = useMemo(() => {
    return unfilledInputs.filter((input) => input.label !== '' && input.element.type !== 'button')
  }, [unfilledInputs])

  return (
    <PromptTextContainer>
      <PromptText>Help us fill in these inputs – </PromptText>
      <PromptText>And we'll remember them for next time!</PromptText>
      {loading ? <LoadingSpinner /> : <InputsCheckboxList inputs={unfilledInputsToDisplay} />}
    </PromptTextContainer>
  )
}

export default UnfilledInputsListItemContent
