import { Loader2 } from 'lucide-react'
import React from 'react'

const GenericLoader: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-500 dark:text-gray-400" size={size} />
    </div>
  )
}

export default GenericLoader
