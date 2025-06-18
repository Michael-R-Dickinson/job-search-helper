import { useEffect } from 'react'
import useAutofillInputs from '../hooks/useAutofillInputs'
import { eventTypes } from '../../events'

const IframeAutofillWrapper = () => {
  const { executeAutofillSequence, executeResumeAutofill } = useAutofillInputs()

  useEffect(() => {
    const onFrameMsg = (event: MessageEvent) => {
      if (event.data?.type === eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES) {
        // With few elements this is unlikely to be the form container
        executeAutofillSequence()
      }
      if (event.data?.type === eventTypes.BEGIN_RESUME_AUTOFILL) {
        const { resumeName } = event.data
        executeResumeAutofill(resumeName)
      }
    }

    window.addEventListener('message', onFrameMsg)

    return () => {
      window.removeEventListener('message', onFrameMsg)
    }
  }, [executeAutofillSequence, executeResumeAutofill])

  return null
}

export default IframeAutofillWrapper
