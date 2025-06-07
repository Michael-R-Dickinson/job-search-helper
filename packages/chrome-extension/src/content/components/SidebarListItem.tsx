import styled from '@emotion/styled'
import type { LucideIcon } from 'lucide-react'
import React from 'react'

const ListItemContainer = styled.div<{ active?: boolean }>`
  display: flex;
  gap: 0.7rem;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 0.7rem;
  cursor: pointer;
  background-color: ${(props) => (props.active ? 'rgba(242, 243, 246, 1)' : 'transparent')};

  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(props) => (props.active ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.05)')};
  }
`

const ItemTitle = styled.h4`
  margin: 0;
  font-weight: 500;
  letter-spacing: -0.03rem;
`

const ExpandedContentContainer = styled.div`
  padding: 0.8rem 0.8rem 0.8rem 1.4rem;
  // padding: 0.8rem 1.4rem;
  display: flex;
  gap: 0.8rem;
`

const VerticalLine = styled.div`
  width: 1px;
  height: auto;
  background-color: rgba(0, 0, 0, 0.1);
`

const SidebarListItem: React.FC<{
  Icon: LucideIcon
  title: string
  active: boolean
  content?: React.ReactNode
  onClick?: () => void
}> = ({ Icon, title, active, content, onClick }) => {
  return (
    <div>
      <ListItemContainer active={active} onClick={onClick}>
        <Icon size={20} />
        <ItemTitle>{title}</ItemTitle>
      </ListItemContainer>
      {active && (
        <ExpandedContentContainer>
          <VerticalLine />
          {content}
        </ExpandedContentContainer>
      )}
    </div>
  )
}

export default SidebarListItem
