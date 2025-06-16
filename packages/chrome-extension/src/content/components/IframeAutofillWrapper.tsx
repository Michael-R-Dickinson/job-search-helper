import { useEffect } from 'react'
import useAutofillInputs from '../hooks/useAutofillInputs'

const IframeAutofillWrapper = () => {
  const { executeAutofillSequence } = useAutofillInputs()

  useEffect(() => {
    const onFrameMsg = (event: MessageEvent) => {
      if (event.data?.type === 'BEGIN_AUTOFILL') {
        // With few elements this is unlikely to be the form container
        executeAutofillSequence()
      }
    }

    window.addEventListener('message', onFrameMsg)

    return () => {
      window.removeEventListener('message', onFrameMsg)
    }
  }, [executeAutofillSequence])

  return null
}

export default IframeAutofillWrapper
