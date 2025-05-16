import React from 'react'
import TailoredResumeLoading from './TailoredResumeLoading'
import { useQuery } from '@tanstack/react-query'
import { getTailoredResume } from '@/lib/api'
import Link from 'next/link'

interface TailoredResumeDisplayProps {
  fileName?: string
  linkedInJobUrl?: string
  userId: string
}

const TailoredResumeDisplay: React.FC<TailoredResumeDisplayProps> = ({
  fileName,
  linkedInJobUrl,
  userId,
}) => {
  const loadingScreen = <TailoredResumeLoading />
  const { data, isLoading, error } = useQuery({
    queryKey: ['tailorResume', userId, fileName, linkedInJobUrl],
    queryFn: async () => await getTailoredResume(fileName!, linkedInJobUrl!, userId!),
    enabled: Boolean(fileName && linkedInJobUrl),
  })
  const { json, status } = data || {}

  if (isLoading) return loadingScreen
  if (error || status !== 200) {
    return (
      <div>
        Error: {error?.message} {json?.message}
      </div>
    )
  }

  return (
    <div>
      SUCCESS {json?.message}, url: {json?.download_url}
      {json?.download_url && <Link href={json?.download_url}></Link>}
    </div>
  )
}

export default TailoredResumeDisplay
