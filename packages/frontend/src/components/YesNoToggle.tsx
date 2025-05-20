import { cva } from 'class-variance-authority'
import { useState } from 'react'

export type ToggleStates = 'yes' | 'no' | 'default'

const YesNoToggle: React.FC<{
  checkedState: ToggleStates
  setCheckedState: (value: ToggleStates) => void
}> = ({ checkedState, setCheckedState }) => {
  const styles = cva('badge badge-outline cursor-pointer rounded-full', {
    variants: {
      checked: {
        yes: 'bg-green-100 text-green-600 border-green-600',
        no: 'bg-red-100 text-red-700 border-red-600',
        default: 'text-gray-500',
      },
    },
    defaultVariants: {
      checked: 'default',
    },
  })

  return (
    <div className="flex gap-2">
      <button
        className={styles({
          checked: checkedState === 'no' || checkedState === 'default' ? 'default' : 'yes',
        })}
        onClick={() => setCheckedState('yes')}
      >
        Yes
      </button>

      <button
        className={styles({
          checked: checkedState === 'yes' || checkedState === 'default' ? 'default' : 'no',
        })}
        onClick={() => setCheckedState('no')}
      >
        No
      </button>
    </div>
  )
}

export default YesNoToggle
