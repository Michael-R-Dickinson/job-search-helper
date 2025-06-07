import styled from '@emotion/styled'
import SidebarListItem from './SidebarListItem'
import { AppWindow, FileText, PencilLine } from 'lucide-react'
import { useState } from 'react'
import ResumeListItemContent from './autofillListItems/ResumeListItemContent'
import UnfilledInputsListItemContent from './autofillListItems/UnfilledInputsListItemContent'
import AutofillButton from './AutofillButton'
import useAutofillInputs from '../hooks/useAutofillInputs'
import {
  AutofillAnimationSpeeds,
  autofillInputElements,
} from '../inputsManipulation/autofillInputElements'

const AutofillHeader = styled.h3`
  margin: 0.8rem 0;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
`

const SidebarContent = () => {
  const {
    simpleInputsInstructions,
    llmGeneratedInputsPromise,
    stopRefetchingAutofillValues,
    loading,
    unfilledInputs,
  } = useAutofillInputs()

  const [activeItem, setActiveItem] = useState<'resume' | 'unfilled' | 'free-response'>('resume')
  const [selectedResume, setSelectedResume] = useState<string | null>(null)

  const undoneAutofillSections = []
  if (!selectedResume) undoneAutofillSections.push('resume')

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
    <div>
      <AutofillHeader>Autofill</AutofillHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <SidebarListItem
          Icon={FileText}
          title="Resume"
          active={activeItem === 'resume'}
          onClick={() => setActiveItem('resume')}
          content={
            <ResumeListItemContent
              selectedResume={selectedResume}
              setSelectedResume={setSelectedResume}
            />
          }
        />
        <SidebarListItem
          Icon={AppWindow}
          title="Unfilled Inputs"
          active={activeItem === 'unfilled'}
          onClick={() => setActiveItem('unfilled')}
          content={<UnfilledInputsListItemContent unfilledInputs={unfilledInputs} />}
        />
        <SidebarListItem
          Icon={PencilLine}
          title="Free Responses"
          active={activeItem === 'free-response'}
          onClick={() => setActiveItem('free-response')}
        />
      </div>
      <div style={{ marginTop: '0.8rem' }}>
        <AutofillButton unfilledSections={undoneAutofillSections} onClick={fullAutofillSequence} />
      </div>
    </div>
  )
}

export default SidebarContent
