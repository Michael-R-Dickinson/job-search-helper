import { Group } from '@mantine/core'
import { UploadIcon } from 'lucide-react'
import styled from '@emotion/styled'
import { useRef } from 'react'

export const UploadResumeSelectItemContainer = styled(Group)`
  width: 100%;
  padding: 0.375rem 0.625rem;
`

const UploadResumeSelectItem: React.FC<{
  onResumeUpload: (file: File) => void
}> = ({ onResumeUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onResumeUpload(file)
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

export default UploadResumeSelectItem
