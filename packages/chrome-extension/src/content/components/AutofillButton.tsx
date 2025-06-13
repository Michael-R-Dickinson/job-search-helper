import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Tooltip } from '@mantine/core'
import type { AutofillStatus } from './SidebarContent'

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const dotAnimation = keyframes`
  0%, 20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const Button = styled.button<{ active: boolean; loading?: boolean }>`
  background: ${(props) =>
    props.loading
      ? 'linear-gradient(90deg, #9ca3af, #6b7280, #9ca3af)'
      : props.active
        ? 'linear-gradient(90deg, #4dabf5, #339af0, #4dabf5)'
        : 'linear-gradient(90deg, #a5d8ff, #74c0fc, #a5d8ff)'};
  background-size: 200% 100%;
  border-radius: 999px;
  box-shadow: ${(props) =>
    props.loading
      ? '#6b7280 0 10px 20px -10px'
      : props.active
        ? '#339af0 0 10px 20px -10px'
        : '#a5d8ff 0 10px 20px -10px'};
  color: #ffffff;
  cursor: ${(props) => (props.active && !props.loading ? 'pointer' : 'not-allowed')};
  line-height: 24px;
  padding: 0.5rem 2rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  opacity: ${(props) => (props.loading ? 0.5 : props.active ? 1 : 0.7)};

  &:hover {
    animation: ${(props) => (props.active && !props.loading ? shimmer : 'none')} 2s infinite linear;
    transform: ${(props) => (props.active && !props.loading ? 'translateY(-2px)' : 'none')};
    box-shadow: ${(props) =>
      props.loading
        ? '#6b7280 0 10px 20px -10px'
        : props.active
          ? 'rgb(62, 148, 219) 0 15px 25px -10px'
          : '#a5d8ff 0 10px 20px -10px'};
  }

  &:active {
    transform: ${(props) => (props.active && !props.loading ? 'translateY(1px)' : 'none')};
    box-shadow: ${(props) =>
      props.loading
        ? '#6b7280 0 5px 15px -10px'
        : props.active
          ? '#339af0 0 5px 15px -10px'
          : '#a5d8ff 0 10px 20px -10px'};
  }
`

const AnimatedDots = styled.span`
  & .dot {
    animation: ${dotAnimation} 1.4s infinite ease-in-out;
    animation-fill-mode: both;
  }

  & .dot:nth-of-type(1) {
    animation-delay: -0.32s;
  }

  & .dot:nth-of-type(2) {
    animation-delay: -0.16s;
  }
`

const AutofillButton: React.FC<{
  unfilledSections: string[]
  status: AutofillStatus
  onClick: () => void
}> = ({ unfilledSections, status, onClick }) => {
  const enabled = unfilledSections.length === 0
  if (status === 'loading') {
    return (
      <Button active={enabled} loading={true}>
        Loading
        <AnimatedDots>
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </AnimatedDots>
      </Button>
    )
  }

  if (enabled) {
    return (
      <Button active={enabled} onClick={onClick}>
        Begin Autofill
      </Button>
    )
  }
  return (
    <Tooltip label={`Fill in sections: ${unfilledSections.join(', ')}`}>
      <Button active={enabled}>Begin Autofill</Button>
    </Tooltip>
  )
}

export default AutofillButton
