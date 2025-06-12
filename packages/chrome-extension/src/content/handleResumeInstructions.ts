import { RESUME_UPLOAD_VALUE } from '../autofillEngine/inputCategoryHandlers'
import type { AutofillInstruction } from '../autofillEngine/schema'

const handleResumeInstructions = (
  instructions: AutofillInstruction[],
  selectedResume: string | null,
) => {
  if (!selectedResume) return instructions

  const resumeInstructions = instructions.filter(
    (instruction) => instruction.value === RESUME_UPLOAD_VALUE,
  )
  const updatedResumeInstructions = resumeInstructions.map((instruction) => {
    return {
      ...instruction,
      value: RESUME_UPLOAD_VALUE + selectedResume,
    }
  })

  const updatedInstructions = instructions
    .filter((instruction) => instruction.value !== RESUME_UPLOAD_VALUE)
    .concat(updatedResumeInstructions)

  console.log('updated instructions', updatedInstructions)
  return updatedInstructions
}

export default handleResumeInstructions
