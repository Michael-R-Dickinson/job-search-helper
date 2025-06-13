import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { tailoringResumeAtom } from '../atoms'
import { triggerGetTailoringQuestions } from '../triggers/triggerGetTailoringQuestions'
import type { ResumeListItemContent_ResumeFlowAction } from '../components/autofillListItems/ResumeListItemContent'

// Use the actual ResumeFlowState type structure for resumeState
interface ResumeFlowStateForHook {
  status: string
  tailoring: {
    questionAnswers?: unknown | null
    chatId?: string | null
  }
}

type UseResumeTailoringProps = {
  shouldTailor: boolean
  selectedResume: string | null
  jobUrl: string | null
  resumeState: ResumeFlowStateForHook | null
  dispatch: React.Dispatch<ResumeListItemContent_ResumeFlowAction>
}

export const useResumeTailoring = ({
  shouldTailor,
  selectedResume,
  jobUrl,
  resumeState,
  dispatch,
}: UseResumeTailoringProps) => {
  const setAutofillResume = useSetAtom(tailoringResumeAtom)

  useEffect(() => {
    if (
      !shouldTailor ||
      !selectedResume ||
      !jobUrl ||
      !resumeState ||
      resumeState.status === 'uploading'
    ) {
      return
    }
    if (resumeState.tailoring?.questionAnswers) {
      return
    }
    dispatch({ type: 'START_FETCH_QS', name: selectedResume })
    triggerGetTailoringQuestions(selectedResume, jobUrl).then(({ json }) => {
      if (!json) return
      dispatch({
        type: 'FINISH_FETCH_QS',
        name: selectedResume,
        questions: json.questions,
        chatId: json.chat_id,
      })
    })
    setAutofillResume({ promise: null, name: null })
  }, [shouldTailor, selectedResume, jobUrl, resumeState, dispatch, setAutofillResume])
}
