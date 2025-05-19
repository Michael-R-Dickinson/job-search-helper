'use client'
import React from 'react'
import TailoredResumeLoading from './TailoredResumeLoading'
import { useQuery } from '@tanstack/react-query'
import { getTailoredResume } from '@/lib/api'
import { useRouter } from 'next/router'

interface TailoredResumeDisplayProps {
  fileName?: string
  linkedInJobUrl?: string
  userId: string
}

const TailoredResumeHandler: React.FC<TailoredResumeDisplayProps> = ({
  fileName,
  linkedInJobUrl,
  userId,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tailorResume', userId, fileName, linkedInJobUrl],
    queryFn: async () => await getTailoredResume(fileName!, linkedInJobUrl!, userId!),
    enabled: Boolean(fileName && linkedInJobUrl),
  })
  const { json, status } = data || {}

  if (isLoading) return <TailoredResumeLoading />

  if (error || status !== 200) {
    console.error('Error fetching tailored resume:', error)
    return (
      <div>
        Error: {error?.message} {json?.message}
      </div>
    )
  }

  if (!json) {
    return <div>No tailored resume data available</div>
  }

  if (json?.pdf_url) {
    window.open(json.pdf_url, '_blank', 'noopener,noreferrer')
  }
}

export default TailoredResumeHandler
