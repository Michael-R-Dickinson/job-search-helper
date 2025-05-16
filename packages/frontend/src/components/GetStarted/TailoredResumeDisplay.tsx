import React from 'react'
import TailoredResumeLoading from './TailoredResumeLoading'
import { useQuery } from '@tanstack/react-query'
import { getTailoredResume } from '@/lib/api'

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
  if (error) {
    console.error('Error fetching tailored resume:', error)
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      SUCCESS {json?.message}, url: {json?.download_url}
    </div>
  )
}

export default TailoredResumeDisplay
