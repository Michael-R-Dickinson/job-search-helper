import { UploadCloud } from 'lucide-react'
import React from 'react'

interface UploadResumeButtonProps {
  resumeFile: File | null
  setResumeFile: (file: File | null) => void
}

const UploadResumeInput: React.FC<UploadResumeButtonProps> = ({ resumeFile, setResumeFile }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setResumeFile(e.target.files[0])
    }
  }
  return (
    <label className="cursor-pointer block mt-3 mb-5">
      <div className="flex flex-col items-center justify-center h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
        {resumeFile ? (
          <span className="text-gray-700 font-medium truncate px-4">{resumeFile.name}</span>
        ) : (
          <span className="text-gray-500">Select a file to upload</span>
        )}
      </div>
      <input type="file" onChange={handleChange} className="hidden" />
    </label>
  )
}

export default UploadResumeInput
