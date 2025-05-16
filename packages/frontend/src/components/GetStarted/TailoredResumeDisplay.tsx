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
  if (error) return <div>Error: {JSON.stringify(error)}</div>

  return (
    <div>
      SUCCESS: {json}, status: {status}
    </div>
  )
}

export default TailoredResumeDisplay
