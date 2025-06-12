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
import handleResumeInstructions from '../handleResumeInstructions'
import { tailoringResumeAtom } from '../atoms'
import { useAtomValue } from 'jotai/react'

const AutofillHeader = styled.h3`
  margin: 0.8rem 0;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
`

const SidebarContent = () => {
  const {
    simpleInputsInstructionsPromise,
    complexInputsInstructionsPromise,
    loading,
    unfilledInputs,
  } = useAutofillInputs()

  const [activeItem, setActiveItem] = useState<'resume' | 'unfilled' | 'free-response'>('resume')
  const { promise: resumePromise, name: resumeName } = useAtomValue(tailoringResumeAtom)

  const undoneAutofillSections: string[] = []
  if (!resumePromise) undoneAutofillSections.push('resume')

  const fullAutofillSequence = async () => {
    if (!simpleInputsInstructionsPromise || !complexInputsInstructionsPromise) return

    const simpleInputsInstructions = await simpleInputsInstructionsPromise

    const animationSpeed = loading ? AutofillAnimationSpeeds.SLOW : AutofillAnimationSpeeds.FAST
    await autofillInputElements(simpleInputsInstructions, animationSpeed)

    const remainingAutofillInstructions = await complexInputsInstructionsPromise
    await autofillInputElements(remainingAutofillInstructions, AutofillAnimationSpeeds.NONE)

    const resume = await resumePromise
    console.log('Got Resume', resumeName)
    const resumeInstructions = handleResumeInstructions(simpleInputsInstructions, resume)
    console.log('resumeInstructions', resumeInstructions)
    await autofillInputElements(resumeInstructions, AutofillAnimationSpeeds.NONE)
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
          content={<ResumeListItemContent />}
        />
        <SidebarListItem
          Icon={AppWindow}
          title="Unfilled Inputs"
          active={activeItem === 'unfilled'}
          onClick={() => setActiveItem('unfilled')}
          content={
            <UnfilledInputsListItemContent unfilledInputs={unfilledInputs} loading={loading} />
          }
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
