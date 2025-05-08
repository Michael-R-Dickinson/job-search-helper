'use client'

import { auth } from '../../../firebase'
import React, { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../../firebase'
import UploadResumeButton from '../UploadResumeButton'

const ResumeUploadFullscreen = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)

  const handleUpload = () => {
    if (!resumeFile || !auth.currentUser) return

    const path = `resumes/${auth.currentUser.uid}/${resumeFile.name}`
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, resumeFile)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(Math.round(pct))
      },
      (error) => {
        console.error('Upload failed:', error)
      },
      async () => {
        setProgress(100)
      },
    )
  }
  return (
    <div className="mt-[33vh] w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center space-y-6 h-fit">
      <h1 className="text-2xl font-bold text-gray-800">Upload Your Resume</h1>
      <p className="text-gray-600">
        Drag &amp; drop your resume here, or click below to choose a file.
      </p>

      <UploadResumeButton resumeFile={resumeFile} setResumeFile={setResumeFile} />

      <button
        onClick={handleUpload}
        disabled={!resumeFile || (progress > 0 && progress < 100)}
        className={`text-indigo-500 relative w-full h-12 overflow-hidden rounded-full border-2 cursor-pointer hover:bg-purple-100 ${resumeFile ? 'border-perfectify-primary' : 'border-gray-300 opacity-60 cursor-not-allowed'}
  `}
        style={{
          pointerEvents: !resumeFile || (progress > 0 && progress < 100) ? 'none' : 'auto',
        }}
      >
        <div
          className="absolute top-0 left-0 h-full bg-perfectify-primary transition-[width] ease-linear duration-100"
          style={{ width: `${progress}%` }}
        />

        <span
          className="relative z-10 flex items-center justify-center h-full w-full font-semibold"
          style={{ color: progress > 0 ? 'white' : undefined }}
        >
          <UploadCloud className="w-5 h-5 mr-2" />
          {progress > 0 && progress < 100
            ? `${progress}%`
            : progress === 100
              ? 'Done'
              : 'Upload Resume'}
        </span>
      </button>
    </div>
  )
}

export default ResumeUploadFullscreen
