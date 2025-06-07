import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Tooltip } from '@mantine/core'

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const Button = styled.button<{ active: boolean }>`
  background: ${(props) =>
    props.active
      ? 'linear-gradient(90deg, #4dabf5, #339af0, #4dabf5)'
      : 'linear-gradient(90deg, #a5d8ff, #74c0fc, #a5d8ff)'};
  background-size: 200% 100%;
  border-radius: 999px;
  box-shadow: ${(props) => (props.active ? '#339af0' : '#a5d8ff')} 0 10px 20px -10px;
  color: #ffffff;
  cursor: ${(props) => (props.active ? 'pointer' : 'not-allowed')};
  line-height: 24px;
  padding: 0.5rem 2rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  opacity: ${(props) => (props.active ? 1 : 0.7)};

  &:hover {
    animation: ${(props) => (props.active ? shimmer : 'none')} 2s infinite linear;
    transform: ${(props) => (props.active ? 'translateY(-2px)' : 'none')};
    box-shadow: ${(props) =>
      props.active ? 'rgb(62, 148, 219) 0 15px 25px -10px' : '#a5d8ff 0 10px 20px -10px'};
  }

  &:active {
    transform: ${(props) => (props.active ? 'translateY(1px)' : 'none')};
    box-shadow: ${(props) =>
      props.active ? '#339af0 0 5px 15px -10px' : '#a5d8ff 0 10px 20px -10px'};
  }
`

const AutofillButton: React.FC<{ unfilledSections: string[] }> = ({ unfilledSections }) => {
  const enabled = unfilledSections.length === 0
  if (enabled) {
    return <Button active={enabled}>Begin Autofill</Button>
  }
  return (
    <Tooltip label={`Fill in sections: ${unfilledSections.join(', ')}`}>
      <Button active={enabled}>Begin Autofill</Button>
    </Tooltip>
  )
}

export default AutofillButton
