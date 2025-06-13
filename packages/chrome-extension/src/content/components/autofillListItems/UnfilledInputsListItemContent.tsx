import styled from '@emotion/styled'
import type { InputInfo } from '../../hooks/useInputElements'
import LoadingSpinner from '../LoadingSpinner'
import { useMemo, useState } from 'react'
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

  const unfilledInputsToDisplay = useMemo(() => {
    return unfilledInputs
      .filter((input) => input.label !== '' && input.element.type !== 'button')
      .filter((i) => !(i instanceof HTMLButtonElement))
      .filter((input, index, self) => index === self.findIndex((i) => i.label === input.label))
  }, [unfilledInputs])

  useWatchInputs({
    inputElements: unfilledInputsToDisplay.map((i) => i.element) as WatchableInputElement[],
    onInputFilled: (el) => {
      setFilledInputs((prev) => [...prev, unfilledInputsToDisplay.find((i) => i.element === el)!])
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
          inputs={unfilledInputsToDisplay}
          filledInputs={filledInputs}
          setFilledInputs={setFilledInputs}
        />
      )}
    </PromptTextContainer>
  )
}

export default UnfilledInputsListItemContent
