import React from 'react'

const AutofillOverlay: React.FC = () => (
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xs p-3 rounded-lg border border-perfectify-primary shadow-lg">
    <div className="text-center text-perfectify-primary font-medium">
      Autofilling your application...
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div
        className="bg-perfectify-primary h-2 rounded-full animate-pulse"
        style={{ width: '60%' }}
      ></div>
    </div>
  </div>
)

export default AutofillOverlay
