import { useEffect } from 'react'
import { eventTypes } from '../../events'
import { frameId } from '../../content'

const useMonitorIframeAutofills = (setAutofillCompleted: () => void) => {
  useEffect(() => {
    const onFrameMsg = (event: MessageEvent) => {
      if (event.data?.type === eventTypes.AUTOFILL_WITH_IFRAMES_COMPLETED) {
        setAutofillCompleted()
      }
    }

    window.addEventListener('message', onFrameMsg)

    return () => {
      window.removeEventListener('message', onFrameMsg)
    }
  }, [setAutofillCompleted])
}

export const returnCompletionMessage = () => {
  window.top?.postMessage(
    {
      type: eventTypes.AUTOFILL_WITH_IFRAMES_COMPLETED,
      fromFrame: frameId,
    },
    '*',
  )
}

export default useMonitorIframeAutofills
