import { UploadCloud } from 'lucide-react'
import React, { useState } from 'react'
import { storage } from '../../../firebase'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { getUserBucketPath } from '@/lib/utils'
import useAuth from '@/hooks/useAuth'

interface UploadButtonProgressProps {
  resumeFile: File | null
  onUploadComplete: () => void
  disabled?: boolean
}

const PublishResumeProgressButton: React.FC<UploadButtonProgressProps> = ({
  resumeFile,
  onUploadComplete,
  disabled,
}) => {
  const { user: currentUser, loading } = useAuth()
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = () => {
    if (!resumeFile || loading) return

    const path = `${getUserBucketPath(currentUser.uid, false)}/${resumeFile.name}`
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, resumeFile)

    // For testing, simulate an instant upload
    // const uploadTask = {
    //   on: (
    //     event: string,
    //     progressCallback: (snapshot: { bytesTransferred: number; totalBytes: number }) => void,
    //     errorCallback: (error: { message: string }) => void,
    //     completeCallback: () => void,
    //   ) => {
    //     progressCallback({ bytesTransferred: 100, totalBytes: 100 })
    //     completeCallback()
    //   },
    // }

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(Math.round(pct))
      },
      (error) => {
        setError(error.message)
      },
      async () => {
        setProgress(100)
        onUploadComplete()
      },
    )
  }

  return (
    <div>
      <button
        onClick={handleUpload}
        disabled={disabled || !resumeFile || (progress > 0 && progress < 100)}
        className={`text-indigo-500 relative w-full h-12 overflow-hidden rounded-full border-2 cursor-pointer hover:bg-purple-100 ${resumeFile ? 'border-perfectify-primary' : 'border-gray-300 opacity-60 cursor-not-allowed'}`}
        style={{
          pointerEvents: disabled || !resumeFile || (progress > 0 && progress < 100) ? 'none' : 'auto',
        }}
      >
        <div
          className="absolute top-0 left-0 h-full bg-perfectify-primary transition-[width] ease-in-out duration-200"
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
      {error && <div className="text-red-500 text-sm px-4 py-2">Error: {error}</div>}
    </div>
  )
}

export default PublishResumeProgressButton
