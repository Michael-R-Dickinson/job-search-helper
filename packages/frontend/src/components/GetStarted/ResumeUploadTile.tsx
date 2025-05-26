'use client'

import { useState } from 'react'
import UploadResumeInput from '../UploadResumeButton'
import PublishResumeProgressButton from './UploadProgressButton'

const ResumeUploadTile: React.FC<{ onUploadComplete: (fileName: string) => void }> = ({
  onUploadComplete,
}) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Upload Your Resume</h1>
      <p className="text-gray-600">
        Drag &amp; drop your resume here, or click below to choose a file that is in a <strong className="text-perfectify-purple">word or doc file.</strong>
      </p>

      <UploadResumeInput resumeFile={resumeFile} setResumeFile={setResumeFile} />
      <PublishResumeProgressButton
        resumeFile={resumeFile}
        onUploadComplete={() => {
          // Wait a second so so that no transitions happen before animations are complete
          setTimeout(() => {
            onUploadComplete(resumeFile?.name || 'no-name-provided')
          }, 400)
        }}
      />
    </div>
  )
}

export default ResumeUploadTile
