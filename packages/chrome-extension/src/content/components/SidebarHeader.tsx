import styled from '@emotion/styled'
import { useAtomValue } from 'jotai/react'
import { userAtom } from '../atoms'

const CaptionText = styled.p`
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.7);
  margin: 0.2rem;
  margin-bottom: 0.5rem;
`

const TitleText = styled.h2`
  margin: 0;
`

const HorizontalDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
`

const SidebarHeader = () => {
  const user = useAtomValue(userAtom)

  return (
    <div>
      <TitleText>Bruteforce</TitleText>
      <CaptionText>User: {user?.displayName}</CaptionText>
      <HorizontalDivider />
    </div>
  )
}

export default SidebarHeader
