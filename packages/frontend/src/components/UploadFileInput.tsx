'use client'
import { useState } from 'react'
import { auth, storage } from '../../firebase'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { UploadCloud } from 'lucide-react'

const UploadFileInput = () => {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setProgress(0)
    }
  }

  const handleUpload = () => {
    if (!file || !auth.currentUser) return

    const path = `resumes/${auth.currentUser.uid}/${file.name}`
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)

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
    <div className="max-w-md mx-auto space-y-4 p-6 bg-white rounded-lg shadow-lg">
      {/* File selector */}
      <label className="flex items-center justify-center cursor-pointer bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-6 hover:bg-green-100 transition">
        <UploadCloud className="w-6 h-6 text-green-500 mr-2" />
        <span className="text-green-600 font-medium">
          {file ? file.name : 'Click to select a file'}
        </span>
        <input type="file" onChange={handleChange} className="hidden" />
      </label>

      {/* Upload button */}
      <button
        className={`w-full flex items-center justify-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition ${
          !file ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleUpload}
        disabled={!file}
      >
        Push
      </button>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-green-800">
            {progress}%
          </span>
        </div>
      )}
    </div>
  )
}

export default UploadFileInput
