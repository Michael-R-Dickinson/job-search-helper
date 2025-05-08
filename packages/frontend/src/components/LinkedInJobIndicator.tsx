import { Linkedin } from 'lucide-react'

const LinkedInJobIndicator = () => (
  <div className="absolute -top-16 right-0 left-0 mx-auto md:mx-0 md:right-4 md:left-auto z-20">
    <div className="flex flex-col items-center">
      <div className="bg-white border-2 border-blue-600 rounded-lg shadow-lg p-3 max-w-xs">
        <div className="flex items-center gap-2 mb-1">
          <Linkedin size={20} className="text-blue-600" />
          <span className="font-semibold text-gray-800">Tailored To:</span>
        </div>
        <div className="text-sm text-gray-700 font-medium">Senior Frontend Developer @ Meta</div>
      </div>
    </div>
  </div>
)

export default LinkedInJobIndicator
