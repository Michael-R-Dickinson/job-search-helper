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

const SidebarListItem: React.FC<{ Icon: LucideIcon; title: string; active: boolean }> = ({
  Icon,
  title,
  active,
}) => {
  return (
    <ListItemContainer active={active}>
      <Icon size={20} />
      <ItemTitle>{title}</ItemTitle>
    </ListItemContainer>
  )
}

export default SidebarListItem
