import { Select, type SelectProps, Group, Checkbox } from '@mantine/core'
import { UploadIcon } from 'lucide-react'
import styled from '@emotion/styled'
import { useRef } from 'react'
import triggerResumeUpload from '../triggerResumeUpload'

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

const data = [
  { value: 'resume1', label: 'Resume 1' },
  { value: 'resume2', label: 'Resume 2' },
  { value: 'resume3', label: 'Resume 3' },
  { value: 'upload', label: 'Upload Resume' },
]

const UploadResumeSelectItemContainer = styled(Group)`
  width: 100%;
  padding: 0.375rem 0.625rem;
`

const UploadResumeSelectItem = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      triggerResumeUpload(file)
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

// renderOption gives you full control over each item
const renderOption: SelectProps['renderOption'] = ({ option }) =>
  option.value === 'upload' ? (
    <UploadResumeSelectItem />
  ) : (
    <UploadResumeSelectItemContainer>
      <span>{option.label}</span>
    </UploadResumeSelectItemContainer>
  )

function ResumeListItemContent() {
  return (
    <Container>
      <Select
        data={data}
        placeholder="Select Resume"
        size="sm"
        // plug in your custom renderer
        renderOption={renderOption}
        styles={{
          option: {
            padding: '0px',
          },
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <PointerCheckbox label="Tailor Resume" size="xs" />
        <PointerCheckbox label="Always Use This Resume" size="xs" />
      </div>
    </Container>
  )
}

export default ResumeListItemContent
