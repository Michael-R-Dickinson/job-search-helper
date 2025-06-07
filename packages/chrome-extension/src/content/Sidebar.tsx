import {
  AutofillAnimationSpeeds,
  autofillInputElements,
} from './inputsManipulation/autofillInputElements'
import useAutofillInputs from './hooks/useAutofillInputs'

import styled from '@emotion/styled'
import SidebarHeader from './components/SidebarHeader'
import SidebarContent from './components/SidebarContent'
import useFetchUserData from './hooks/useUserData'

const SidebarRoot = styled.div`
  position: fixed;
  height: 30rem;
  width: 20rem;
  right: 0;
  top: 50%;
  transform: translate(-5%, -50%);
`

const SidebarContainer = styled.div`
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1.5rem;
  border-radius: 10px 10px 10px 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`

const Sidebar = () => {
  useFetchUserData()
  const {
    simpleInputsInstructions,
    llmGeneratedInputsPromise,
    stopRefetchingAutofillValues,
    loading,
  } = useAutofillInputs()

  const fullAutofillSequence = async () => {
    if (!simpleInputsInstructions || !llmGeneratedInputsPromise) return
    console.log('Starting Autofill Sequence', simpleInputsInstructions, llmGeneratedInputsPromise)

    const animationSpeed = loading ? AutofillAnimationSpeeds.SLOW : AutofillAnimationSpeeds.FAST
    await autofillInputElements(simpleInputsInstructions, animationSpeed)

    const remainingAutofillInstructions = await llmGeneratedInputsPromise
    await autofillInputElements(remainingAutofillInstructions, AutofillAnimationSpeeds.NONE)

    stopRefetchingAutofillValues()
  }
  return (
    <SidebarRoot>
      <SidebarContainer>
        <SidebarHeader />
        {/* <RedButton onClick={fullAutofillSequence}>Full Autofill Sequence</RedButton> */}
        <SidebarContent />
      </SidebarContainer>
    </SidebarRoot>
  )
}

export default Sidebar
