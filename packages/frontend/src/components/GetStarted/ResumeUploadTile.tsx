'use client'

import { useState } from 'react'
import UploadResumeInput from '../UploadResumeButton'
import PublishResumeProgressButton from './UploadProgressButton'

const ResumeUploadTile: React.FC<{ onUploadComplete: () => void }> = ({ onUploadComplete }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Upload Your Resume</h1>
      <p className="text-gray-600">
        Drag &amp; drop your resume here, or click below to choose a file.
      </p>

      <UploadResumeInput resumeFile={resumeFile} setResumeFile={setResumeFile} />
      <PublishResumeProgressButton
        resumeFile={resumeFile}
        onUploadComplete={() => {
          // Wait a second so so that no transitions happen before animations are complete
          setTimeout(() => {
            onUploadComplete()
          }, 500)
        }}
      />
    </div>
  )
}

export default ResumeUploadTile
