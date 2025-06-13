import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { tailoringResumeAtom } from '../atoms'
import triggerDocxToPdfConversion from '../triggers/triggerDocxToPdfConversion'
import type { ResumeListItemContent_ResumeFlowAction } from '../components/autofillListItems/ResumeListItemContent'

// Use the actual ResumeFlowState type structure for resumeState
interface ResumeFlowStateForHook {
  status: string
  pdfUrl?: string | null
}

type UsePdfConversionProps = {
  shouldTailor: boolean
  selectedResume: string | null
  resumeState: ResumeFlowStateForHook | null
  dispatch: React.Dispatch<ResumeListItemContent_ResumeFlowAction>
}

export const usePdfConversion = ({
  shouldTailor,
  selectedResume,
  resumeState,
  dispatch,
}: UsePdfConversionProps) => {
  const setAutofillResume = useSetAtom(tailoringResumeAtom)

  useEffect(() => {
    if (shouldTailor || !selectedResume || !resumeState || resumeState.status === 'uploading') {
      return
    }
    if (!resumeState.pdfUrl) {
      const pdfPromise = triggerDocxToPdfConversion(selectedResume).then((response) => {
        if (!response) throw new Error('No response from docx to pdf conversion')
        dispatch({
          type: 'PDF_CONVERSION_FINISHED',
          name: selectedResume,
          url: response.public_url,
        })
        return response.public_url
      })
      console.log('Setting resume to promise: Pdf conversion - ', selectedResume)
      setAutofillResume({
        promise: pdfPromise,
        name: selectedResume,
      })
    } else {
      setAutofillResume({
        promise: Promise.resolve(resumeState.pdfUrl),
        name: selectedResume,
      })
    }
  }, [shouldTailor, selectedResume, resumeState, dispatch, setAutofillResume])
}
