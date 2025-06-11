import { Select, type SelectProps, Group, Checkbox } from '@mantine/core'
import { UploadIcon } from 'lucide-react'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import triggerResumeUpload from '../../triggerResumeUpload'
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { jobUrlAtom, tailoringResumeAtom, userAtom, userResumeNamesAtom } from '../../atoms'
import { getTailoredResume, getTailoringQuestions, type QuestionAnswers } from '../../../backendApi'
import TailoringQuestions from '../TailoringQuestions'
import { getEmptyQuestionAnswers } from '../../../utils'

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

const UploadResumeSelectItemContainer = styled(Group)`
  width: 100%;
  padding: 0.375rem 0.625rem;
`

const UploadResumeSelectItem: React.FC<{ onResumeUpload: (name: string) => void }> = ({
  onResumeUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const success = await triggerResumeUpload(file)
      if (success) {
        console.log('resume uploaded successfully')
        onResumeUpload(file.name)
      } else {
        console.error('resume upload failed')
      }
    }
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '90%', height: '1px', backgroundColor: '#e0e0e0' }} />
      <UploadResumeSelectItemContainer onClick={handleClick} style={{ cursor: 'pointer' }}>
        <span>Upload Resume</span>
        <UploadIcon size={16} opacity={0.7} style={{ marginLeft: 'auto' }} />
      </UploadResumeSelectItemContainer>
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export type QuestionAnswerMapAllowUnfilled = Record<string, boolean | null>
export type QuestionAnswersAllowUnfilled = {
  skillsToAdd: QuestionAnswerMapAllowUnfilled
  experienceQuestions: QuestionAnswerMapAllowUnfilled
}

const ResumeListItemContent: React.FC = () => {
  const [resumeNames, setResumeNames] = useAtom(userResumeNamesAtom)
  const setTailoringResume = useSetAtom(tailoringResumeAtom)
  const jobUrl = useAtomValue(jobUrlAtom)
  const user = useAtomValue(userAtom)

  const [shouldTailorResume, setShouldTailorResume] = useState(false)
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswersAllowUnfilled | null>(null)
  const chatIdRef = useRef<string | null>(null)

  const resumeSelectOptions = resumeNames.map((name) => ({ value: name, label: name }))
  const fullSelectOptions = [...resumeSelectOptions, { value: 'upload', label: 'Upload Resume' }]

  useEffect(() => {
    if (!selectedResume) return

    if (shouldTailorResume) {
      if (!user?.userId || !jobUrl) return
      // getTailoringQuestions(user?.userId, selectedResume, jobUrl).then((response) => {
      //   const { json: questionsData } = response
      //   console.log('questionsData', questionsData)
      //   setQuestionAnswers(getEmptyQuestionAnswers(questionsData.questions))
      //   chatIdRef.current = questionsData.chat_id
      // })
    } else {
      setTailoringResume(Promise.resolve(selectedResume))
    }
  }, [selectedResume, shouldTailorResume, user?.userId, jobUrl, setTailoringResume])

  const onAllQuestionsAnswered = async (filledQuestionAnswers: QuestionAnswers) => {
    if (!user?.userId || !selectedResume || !filledQuestionAnswers || !chatIdRef.current) return
    const { json: tailoredResume } = await getTailoredResume(
      selectedResume,
      user.userId,
      chatIdRef.current,
      filledQuestionAnswers,
    )
    setTailoringResume(Promise.resolve(tailoredResume.docx_download_url))
  }

  const onResumeUpload = (name: string) => {
    setResumeNames((prev) => [...prev, name])
    setSelectedResume(name)
  }

  // Renders each option and allows us to put in a special component for the resume upload select
  const renderSelectOption: SelectProps['renderOption'] = ({ option }) =>
    option.value === 'upload' ? (
      <UploadResumeSelectItem onResumeUpload={onResumeUpload} />
    ) : (
      <UploadResumeSelectItemContainer>
        <span>{option.label}</span>
      </UploadResumeSelectItemContainer>
    )

  return (
    <Container>
      <Select
        data={fullSelectOptions}
        placeholder="Select Resume"
        size="sm"
        // plug in your custom renderer
        renderOption={renderSelectOption}
        value={selectedResume}
        onChange={setSelectedResume}
        styles={{
          option: {
            padding: '0px',
          },
        }}
      />
      {questionAnswers && shouldTailorResume && (
        <TailoringQuestions
          tailoringQuestions={questionAnswers}
          setQuestionAnswers={setQuestionAnswers}
          onAllQuestionsAnswered={onAllQuestionsAnswered}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <PointerCheckbox
          label="Tailor Resume"
          size="xs"
          checked={shouldTailorResume}
          onChange={(event) => setShouldTailorResume(event.currentTarget.checked)}
        />
        <PointerCheckbox label="Always Use This Resume" size="xs" />
      </div>
    </Container>
  )
}

export default ResumeListItemContent
