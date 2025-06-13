import { Select, type SelectProps, Checkbox } from '@mantine/core'
import styled from '@emotion/styled'
import { useEffect, useReducer, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai/react'
import { jobUrlAtom, tailoringResumeAtom, userAtom, userResumesAtom } from '../../atoms'
import {
  getTailoredResume,
  type QuestionAnswers,
  type QuestionsResponse,
} from '../../../backendApi'
import TailoringQuestions from '../TailoringQuestions'
import { getEmptyQuestionAnswers } from '../../../utils'
import { triggerGetTailoringQuestions } from '../../triggers/triggerGetTailoringQuestions'
import triggerDocxToPdfConversion from '../../triggers/triggerDocxToPdfConversion'
import UploadResumeSelectItem, { UploadResumeSelectItemContainer } from '../UploadResumeSelectItem'
import triggerResumeUpload from '../../triggers/triggerResumeUpload'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
`

const PointerCheckbox = styled(Checkbox)({
  input: {
    cursor: 'pointer',
  },
  label: {
    cursor: 'pointer',
  },
})

export type QuestionAnswerMapAllowUnfilled = Record<string, boolean | null>
export type QuestionAnswersAllowUnfilled = {
  skillsToAdd: QuestionAnswerMapAllowUnfilled
  experienceQuestions: QuestionAnswerMapAllowUnfilled
}

type ResumeFlowAction =
  | { type: 'INIT'; payload: Record<string, string> }
  | { type: 'START_UPLOAD'; name: string }
  | { type: 'FINISH_UPLOAD'; name: string }
  | { type: 'START_FETCH_QS'; name: string }
  | { type: 'PDF_CONVERSION_FINISHED'; name: string; url: string }
  | {
      type: 'FINISH_FETCH_QS'
      name: string
      questions: QuestionsResponse['questions']
      chatId: string
    }
  | { type: 'SET_ANSWERS'; name: string; answers: QuestionAnswersAllowUnfilled }
  | { type: 'FINISH_TAILORING_QS'; name: string }
  | { type: 'FINISH_TAILOR'; name: string; url: string }

type ResumeFlowState = {
  status:
    | 'idle'
    | 'uploading'
    | 'uploaded'
    | 'fetchingQuestions'
    | 'questionsFetched'
    | 'tailoring'
    | 'done'
  pdfUrl?: string | null
  tailoring: {
    chatId?: string | null
    questionAnswers?: QuestionAnswersAllowUnfilled | null
  }
}

type AllResumesState = Record<string, ResumeFlowState>

const resumesReducer = (state: AllResumesState, action: ResumeFlowAction): AllResumesState => {
  const actionType = action.type
  switch (actionType) {
    case 'INIT': {
      const resumes = action.payload
      return Object.entries(resumes).reduce((acc, [resumeName, docxUrl]) => {
        acc[resumeName] = {
          status: 'uploaded',
          pdfUrl: null,
          tailoring: {
            questionAnswers: null,
            chatId: null,
          },
        }
        return acc
      }, {} as AllResumesState)
    }
    case 'START_UPLOAD':
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          status: 'uploading',

          // Add in defaults for newly uploaded resumes
          pdfUrl: null,
          tailoring: {
            questionAnswers: null,
            chatId: null,
          },
        },
      }
    case 'FINISH_UPLOAD':
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          status: 'uploaded',
        },
      }
    case 'PDF_CONVERSION_FINISHED':
      return {
        ...state,
        [action.name]: { ...state[action.name], pdfUrl: action.url },
      }
    case 'START_FETCH_QS':
      return {
        ...state,
        [action.name]: { ...state[action.name], status: 'fetchingQuestions' },
      }
    case 'FINISH_FETCH_QS':
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          status: 'questionsFetched',
          tailoring: {
            questionAnswers: getEmptyQuestionAnswers(action.questions),
            chatId: action.chatId,
          },
        },
      }
    case 'SET_ANSWERS':
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          tailoring: {
            ...state[action.name].tailoring,
            questionAnswers: action.answers,
          },
        },
      }
    case 'FINISH_TAILORING_QS':
      return {
        ...state,
        [action.name]: { ...state[action.name], status: 'tailoring' },
      }
    case 'FINISH_TAILOR':
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          status: 'done',
          pdfUrl: action.url,
        },
      }
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}

const ResumeListItemContent: React.FC = () => {
  const resumes = useAtomValue(userResumesAtom)
  const jobUrl = useAtomValue(jobUrlAtom)
  const user = useAtomValue(userAtom)

  const setAutofillResume = useSetAtom(tailoringResumeAtom)
  const [resumesState, dispatch] = useReducer(resumesReducer, {})

  // UI state
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [shouldTailorResume, setShouldTailorResume] = useState(false)
  const selectedResumeState = (selectedResume && resumesState[selectedResume]) || null
  const selectedResumeStatus = selectedResumeState?.status

  const selectOptions = Object.keys(resumesState).map((name) => ({
    value: name,
    label: name,
  }))
  const fullSelectOptions = [...selectOptions, { value: 'upload', label: 'Upload Resume' }]

  const onResumeSelect = (value: string | null) => {
    setSelectedResume(value)
  }
  const onResumeUpload = async (file: File) => {
    const name = file.name
    const uploadPromise = triggerResumeUpload(file)
    console.log('Setting resume to promise: Upload - ', name)
    setSelectedResume(name)
    dispatch({ type: 'START_UPLOAD', name })
    await uploadPromise
    dispatch({ type: 'FINISH_UPLOAD', name })
  }
  const onAllQuestionsAnswered = (answers: QuestionAnswers) => {
    if (!selectedResume || !user?.userId || !selectedResumeState?.tailoring.chatId) return
    dispatch({ type: 'FINISH_TAILORING_QS', name: selectedResume })

    const pdfPromise = getTailoredResume(
      selectedResume,
      user.userId!,
      selectedResumeState.tailoring.chatId,
      answers,
    ).then(({ json }) => {
      dispatch({ type: 'FINISH_TAILOR', name: selectedResume, url: json.pdf_url })
      return json.pdf_url
    })
    console.log('Setting resume to promise: Tailored - ', selectedResume)
    setAutofillResume({
      promise: pdfPromise,
      name: selectedResume,
    })
  }

  const resumeUploading = selectedResumeStatus === 'uploading'
  const selectedResumeExists = selectedResumeState !== null
  useEffect(() => {
    if (!selectedResume || !selectedResumeExists || !jobUrl || resumeUploading) return

    if (shouldTailorResume) {
      // We already have questions fetched so return
      if (selectedResumeState?.tailoring.questionAnswers) return

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
    } else if (!selectedResumeState?.pdfUrl) {
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
      // Reset to finished upload state
      dispatch({ type: 'FINISH_UPLOAD', name: selectedResume })
    }
  }, [
    selectedResume,
    shouldTailorResume,
    jobUrl,
    resumeUploading,
    selectedResumeState?.pdfUrl,
    selectedResumeState?.tailoring.questionAnswers,
    setAutofillResume,
    selectedResumeExists,
  ])

  useEffect(() => {
    if (!resumes) return
    dispatch({ type: 'INIT', payload: resumes })
  }, [resumes])

  const renderSelectOption: SelectProps['renderOption'] = ({ option }) =>
    option.value === 'upload' ? (
      <UploadResumeSelectItem onResumeUpload={onResumeUpload} />
    ) : (
      <UploadResumeSelectItemContainer>
        <span>{option.label}</span>
      </UploadResumeSelectItemContainer>
    )

  const tailoringQuestionsFinished =
    selectedResumeStatus === 'done' || selectedResumeStatus === 'tailoring'
  const setQuestionAnswers = (answers: QuestionAnswersAllowUnfilled) => {
    if (!selectedResume) return
    dispatch({ type: 'SET_ANSWERS', name: selectedResume, answers })
  }

  const tailoringQuestions = selectedResumeState?.tailoring.questionAnswers ?? null
  return (
    <Container>
      <Select
        data={fullSelectOptions}
        placeholder="Select Resume"
        size="sm"
        renderOption={renderSelectOption}
        value={selectedResume}
        onChange={onResumeSelect}
        styles={{
          option: {
            padding: '0px',
          },
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <PointerCheckbox
          label="Tailor Resume"
          size="xs"
          checked={shouldTailorResume}
          onChange={(event) => setShouldTailorResume(event.currentTarget.checked)}
        />
        <PointerCheckbox label="Always Use This Resume" size="xs" />
      </div>
      {shouldTailorResume &&
        selectedResumeExists &&
        (tailoringQuestionsFinished ? (
          <div>Thanks!</div>
        ) : (
          <TailoringQuestions
            tailoringQuestions={tailoringQuestions}
            setQuestionAnswers={setQuestionAnswers}
            onAllQuestionsAnswered={onAllQuestionsAnswered}
          />
        ))}
    </Container>
  )
}

export default ResumeListItemContent
