import styled from '@emotion/styled'
import SidebarListItem from './SidebarListItem'
import { AppWindow, FileText, PencilLine } from 'lucide-react'

const AutofillHeader = styled.h3`
  margin: 0.8rem 0;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
`

const SidebarContent = () => {
  return (
    <div>
      <AutofillHeader>Autofill</AutofillHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <SidebarListItem Icon={FileText} title="Resume" active={true} />
        <SidebarListItem Icon={AppWindow} title="Unfilled Inputs" active={false} />
        <SidebarListItem Icon={PencilLine} title="Free Responses" active={false} />
      </div>
    </div>
  )
}

export default SidebarContent
