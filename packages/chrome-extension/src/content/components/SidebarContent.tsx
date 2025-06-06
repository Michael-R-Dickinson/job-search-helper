import styled from '@emotion/styled'
import SidebarListItem from './SidebarListItem'
import { AppWindow, FileText, PencilLine } from 'lucide-react'
import { useState } from 'react'
import ResumeListItemContent from './ResumeListItemContent'

const AutofillHeader = styled.h3`
  margin: 0.8rem 0;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
`

const SidebarContent = () => {
  const [activeItem, setActiveItem] = useState<'resume' | 'unfilled' | 'free-response'>('resume')
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
        />
        <SidebarListItem
          Icon={PencilLine}
          title="Free Responses"
          active={activeItem === 'free-response'}
          onClick={() => setActiveItem('free-response')}
        />
      </div>
    </div>
  )
}

export default SidebarContent
