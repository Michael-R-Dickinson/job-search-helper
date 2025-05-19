'use client'
import React from 'react'
import TailoredResumeLoading from './TailoredResumeLoading'
import { useQuery } from '@tanstack/react-query'
import { getTailoredResume, QuestionAnswers } from '@/lib/api'

interface TailoredResumeDisplayProps {
  userId: string
  fileName?: string
  chatId?: string
  questionAnswers?: QuestionAnswers
}

const TailoredResumeHandler: React.FC<TailoredResumeDisplayProps> = ({
  userId,
  fileName,
  chatId,
  questionAnswers,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tailorResume', userId, fileName, chatId],
    queryFn: async () => await getTailoredResume(fileName!, userId!, chatId!, questionAnswers!), // We know these will be defined because the query is disabled otherwise
    enabled: Boolean(fileName && userId && chatId && questionAnswers),
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
