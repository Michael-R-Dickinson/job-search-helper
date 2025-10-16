import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { UpdateResumeDetails } from './TryForFreeCarouselForm'
import { getTailoringQuestions } from '@/lib/api'
import SelectSkillsDisplay from './SelectSkillsDisplay'
import GenericLoader from '../GenericLoader'

interface SelectSkillsHandlerProps {
  userId: string
  fileName?: string
  linkedInJobUrl?: string
  setResumeDetail: UpdateResumeDetails
  onQuestionsAnsweredCallback?: () => void
}

const SelectSkillsHandler: React.FC<SelectSkillsHandlerProps> = ({
  userId,
  fileName,
  linkedInJobUrl,
  setResumeDetail,
  onQuestionsAnsweredCallback,
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['selectSkills'],
    queryFn: async () => {
      const data = await getTailoringQuestions(userId, fileName!, linkedInJobUrl!)
      if (data?.json) setResumeDetail('chatId', data.json.chat_id)
      return data
    },
    enabled: Boolean(fileName && linkedInJobUrl),
  })

  if (error) {
    console.error('Error fetching skills:', error)
    return <div>Error: {error.message}</div>
  }

  const isNotLoaded = !data || isLoading
  return (
    <div className="min-h-[400px] h-[400px]">
      {isNotLoaded ? (
        <GenericLoader size={45} />
      ) : (
        <SelectSkillsDisplay
          skillsToAdd={data.json.questions.skills_to_add.map((q) => q.question)}
          experienceQuestions={data.json.questions.experience_questions.map((q) => q.question)}
          setResumeDetail={setResumeDetail}
          onQuestionsAnsweredCallback={onQuestionsAnsweredCallback}
        />
      )}
    </div>
  )
}

export default SelectSkillsHandler
