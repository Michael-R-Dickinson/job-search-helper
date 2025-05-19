import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { ResumeTailoringDetails } from './TryForFreeCarouselForm'
import { getTailoringQuestions } from '@/lib/api'
import SelectSkillsDisplay from './SelectSkillsDisplay'
import GenericLoader from '../GenericLoader'

interface SelectSkillsHandlerProps {
  userId: string
  fileName?: string
  linkedInJobUrl?: string
  setResumeDetail: (key: keyof ResumeTailoringDetails, value: string) => void
}

const SelectSkillsHandler: React.FC<SelectSkillsHandlerProps> = ({
  userId,
  fileName,
  linkedInJobUrl,
  setResumeDetail,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['selectSkills'],
    queryFn: async () => await getTailoringQuestions(userId, fileName!, linkedInJobUrl!),
    enabled: Boolean(fileName && linkedInJobUrl),
  })

  if (!data || isLoading) return <GenericLoader size={45} />
  if (error) {
    console.error('Error fetching skills:', error)
    return <div>Error: {error.message}</div>
  }
  const { json } = data

  return (
    <SelectSkillsDisplay
      skillsToAdd={json.questions.skills_to_add}
      experienceQuestions={json.questions.experience_questions}
      setResumeDetail={setResumeDetail}
    />
  )
}

export default SelectSkillsHandler
