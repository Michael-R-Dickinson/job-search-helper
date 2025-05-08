'use client'

import { useState } from 'react'
import UploadResumeButton from '../UploadResumeButton'
import UploadButtonProgress from './UploadProgressButton'

const ResumeUploadFullscreen = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  return (
    <div className="mt-[33vh] w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center space-y-6 h-fit">
      <h1 className="text-2xl font-bold text-gray-800">Upload Your Resume</h1>
      <p className="text-gray-600">
        Drag &amp; drop your resume here, or click below to choose a file.
      </p>

      <UploadResumeButton resumeFile={resumeFile} setResumeFile={setResumeFile} />
      <UploadButtonProgress resumeFile={resumeFile} />
    </div>
  )
}

export default ResumeUploadFullscreen
