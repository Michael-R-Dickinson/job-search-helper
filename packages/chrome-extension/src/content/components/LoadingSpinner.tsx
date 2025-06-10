import { Loader2 } from 'lucide-react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const SpinningIcon = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`

const LoadingSpinner = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SpinningIcon size={24} color="#6B7280" />
    </div>
  )
}

export default LoadingSpinner
