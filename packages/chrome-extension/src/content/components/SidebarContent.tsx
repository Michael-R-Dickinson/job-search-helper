import styled from '@emotion/styled'
import SidebarListItem from './SidebarListItem'
import { AppWindow, FileText, PencilLine } from 'lucide-react'
import { useState } from 'react'
import ResumeListItemContent from './autofillListItems/ResumeListItemContent'
import UnfilledInputsListItemContent from './autofillListItems/UnfilledInputsListItemContent'
import AutofillButton from './AutofillButton'
import useAutofillInputs from '../hooks/useAutofillInputs'
import { tailoringResumeAtom } from '../atoms'
import { useAtomValue } from 'jotai/react'
import FreeResponseListItemContent from './autofillListItems/FreeResponseListItemContent'

const AutofillHeader = styled.h3`
  margin: 0.8rem 0;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
`

const SidebarContent = () => {
  const {
    fillingStatus,
    fetchStatus,
    executeAutofillSequence,
    executeResumeAutofill,
    executeSaveFilledValues,
    unfilledInputs,
    freeResponseInputs,
    usesIframes,
  } = useAutofillInputs()

  const [activeItem, setActiveItem] = useState<'resume' | 'unfilled' | 'free-response'>('resume')
  const { promise: resumePromise } = useAtomValue(tailoringResumeAtom)

  const undoneAutofillSections: string[] = []
  if (!resumePromise) undoneAutofillSections.push('resume')

  const isFetchingValues = fetchStatus === 'loading'

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
        {!usesIframes && (
          <>
            <SidebarListItem
              Icon={AppWindow}
              title="Unfilled Inputs"
              active={activeItem === 'unfilled'}
              onClick={() => setActiveItem('unfilled')}
              content={
                <UnfilledInputsListItemContent
                  unfilledInputs={unfilledInputs}
                  loading={isFetchingValues}
                />
              }
            />
            <SidebarListItem
              Icon={PencilLine}
              title="Free Responses"
              active={activeItem === 'free-response'}
              onClick={() => setActiveItem('free-response')}
              content={
                <FreeResponseListItemContent
                  freeResponseInputs={freeResponseInputs}
                  loading={isFetchingValues}
                />
              }
            />
          </>
        )}
      </div>
      <div style={{ marginTop: '0.8rem' }}>
        <AutofillButton
          unfilledSections={undoneAutofillSections}
          onClick={async () => {
            await executeAutofillSequence()
            const resumeUrl = await resumePromise
            if (resumeUrl) {
              await executeResumeAutofill(resumeUrl)
            }
          }}
          fillStatus={fillingStatus}
        />
        <button onClick={executeSaveFilledValues}>Save</button>
      </div>
    </div>
  )
}

export default SidebarContent
