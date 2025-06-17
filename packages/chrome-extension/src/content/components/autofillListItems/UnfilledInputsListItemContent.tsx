import styled from '@emotion/styled'
import type { InputInfo } from '../../hooks/useInputElements'
import LoadingSpinner from '../LoadingSpinner'
import { useState } from 'react'
import InputsCheckboxList from '../InputsCheckboxList'
import { useWatchInputs, type WatchableInputElement } from '../../hooks/useWatchInputs'

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
  const [filledInputs, setFilledInputs] = useState<InputInfo[]>([])

  useWatchInputs({
    inputElements: unfilledInputs.map((i) => i.element) as WatchableInputElement[],
    onInputFilled: (el) => {
      setFilledInputs((prev) => [...prev, unfilledInputs.find((i) => i.element === el)!])
    },
  })

  return (
    <PromptTextContainer>
      <PromptText>Help us fill in these inputs – </PromptText>
      <PromptText>And we'll remember them for next time!</PromptText>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <InputsCheckboxList
          inputs={unfilledInputs}
          filledInputs={filledInputs}
          setFilledInputs={setFilledInputs}
        />
      )}
    </PromptTextContainer>
  )
}

export default UnfilledInputsListItemContent
