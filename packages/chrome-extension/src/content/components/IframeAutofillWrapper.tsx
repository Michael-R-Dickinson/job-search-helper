import { useEffect } from 'react'
import useAutofillInputs from '../hooks/useAutofillInputs'
import { eventTypes } from '../../events'

const IframeAutofillWrapper = () => {
  const { executeAutofillSequence } = useAutofillInputs()

  useEffect(() => {
    const onFrameMsg = (event: MessageEvent) => {
      if (event.data?.type === eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES) {
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
