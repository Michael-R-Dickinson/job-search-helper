import { cva } from 'class-variance-authority'

const SkillsToAddChips: React.FC<{
  skillsSelected: Record<string, boolean>
  setSkillsSelected: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}> = ({ skillsSelected, setSkillsSelected }) => {
  const toggleSkill = (skill: string) => {
    setSkillsSelected((prev) => ({ ...prev, [skill]: !prev[skill] }))
  }
  const styles = cva('badge badge-outline cursor-pointer', {
    variants: {
      selected: {
        true: 'bg-green-100 text-green-600 border-green-600',
        false: 'text-gray-500',
      },
    },
    defaultVariants: {
      selected: false,
    },
  })
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Object.keys(skillsSelected).map((skill, index) => (
        <div
          key={index}
          className={styles({ selected: skillsSelected[skill] })}
          onClick={() => toggleSkill(skill)}
        >
          {skill}
        </div>
      ))}
    </div>
  )
}

export default SkillsToAddChips
