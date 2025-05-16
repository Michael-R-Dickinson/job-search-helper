import React, { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface TailoredResumeDisplayProps {
  fileName?: string
  linkedInJobUrl?: string
}

const COMPLETING_TASKS: string[] = [
  'Scraping job description...',
  'Extracting keywords...',
  'Parsing your resume...',
  'Analyzing your work experience...',
  'Extracting your certifications...',
  'Analyzing your skills...',
  'Finding areas for improvement...',
  'Adding top keywords...',
  'Recalculating ATS score...',
  'Tailoring your resume...',
  'Finalizing revisions...',
  'Preparing your tailored resume...',
  'Generating PDF...',
  'Creating download link...',
]

const CompletingTasks: React.FC<{ label: string; inProgress: boolean }> = ({
  label,
  inProgress,
}) => {
  return (
    <div
      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg delay-200 transition-all duration-300"
      style={{ opacity: inProgress ? 1 : 0.7 }}
    >
      {inProgress ? (
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      )}

      <span className="text-gray-700">{label}</span>
    </div>
  )
}

const TailoredResumeDisplay: React.FC<TailoredResumeDisplayProps> = ({}) => {
  const interval = 1500
  const maxTasksOnScreen = 3

  const [currentIndex, setCurrentIndex] = useState(1)
  const [completedTasks, setCompletedTasks] = useState<string[]>([COMPLETING_TASKS[0]])

  useEffect(() => {
    const id = setInterval(() => {
      // Reset if all are complete
      if (currentIndex === -1) {
        setCompletedTasks([COMPLETING_TASKS[0]])
        setCurrentIndex(1)
        return
      }

      const task = COMPLETING_TASKS[currentIndex]
      setCompletedTasks((prev) => {
        const updated = [...prev, task]
        return updated.length > maxTasksOnScreen
          ? updated.slice(updated.length - maxTasksOnScreen)
          : updated
      })
      // Move to next
      setCurrentIndex((prev) => (prev + 1 < COMPLETING_TASKS.length ? prev + 1 : -1))
    }, interval)

    return () => clearInterval(id)
  }, [currentIndex])

  return (
    <div className="flex flex-col justify-between h-full p-4 pb-2">
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Your tailored resume is being generated...
        </h2>
      </div>

      <div className="flex flex-col justify-end space-y-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {completedTasks.map((task, idx) => (
            <motion.div
              layout
              key={task}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0, transition: { opacity: { delay: 0.2 } } }}
              exit={{
                opacity: 0,
                transition: { delay: 0.3 },
              }}
              transition={{ duration: 0.4 }}
            >
              <CompletingTasks label={task} inProgress={idx === completedTasks.length - 1} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TailoredResumeDisplay
