import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const Button = styled.button`
  background: linear-gradient(90deg, #2196f3, #1976d2, #2196f3);
  background-size: 200% 100%;
  border-radius: 999px;
  box-shadow: #1976d2 0 10px 20px -10px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  opacity: 1;
  outline: 0 solid transparent;
  padding: 8px 18px;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;
  transition: all 0.3s ease;

  &:hover {
    animation: ${shimmer} 2s infinite linear;
    transform: translateY(-2px);
    box-shadow: #1976d2 0 15px 25px -10px;
  }

  &:active {
    transform: translateY(1px);
    box-shadow: #1976d2 0 5px 15px -10px;
  }
`

const AutofillButton = () => <Button>Begin Autofill</Button>

export default AutofillButton
