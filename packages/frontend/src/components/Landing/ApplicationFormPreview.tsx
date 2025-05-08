import React from 'react'
import AutofillOverlay from './AutofillOverlay'

interface ApplicationFormPreviewProps {
  showOverlay?: boolean
}

const ApplicationFormPreview: React.FC<ApplicationFormPreviewProps> = ({ showOverlay }) => (
  <div className="mb-8 bg-white rounded-xl p-6 shadow-lg feature-item-animate">
    <div className="border border-gray-200 rounded-lg p-4 relative overflow-hidden">
      <div className="text-sm font-medium mb-2">APPLICATION FORM</div>
      <div className="space-y-4 relative">
        <div>
          <label className="text-sm text-gray-500 block">Full Name</label>
          <div className="h-10 bg-perfectify-light/30 border border-perfectify-primary rounded flex items-center px-3 text-sm">
            John Smith
            <div className="absolute right-6 text-perfectify-primary">
              {/* Arrow icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="#9b87f5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500 block">Email</label>
          <div className="h-10 bg-perfectify-light/30 border border-perfectify-primary rounded flex items-center px-3 text-sm">
            johnsmith@example.com
            <div className="absolute right-6 text-perfectify-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="#9b87f5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500 block">Work Experience</label>
          <div className="h-10 bg-perfectify-light/30 border border-perfectify-primary rounded flex items-center px-3 text-sm">
            Marketing Manager at TechCorp (2020-Present)
            <div className="absolute right-6 text-perfectify-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="#9b87f5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500 block">Skills</label>
          <div className="h-10 bg-perfectify-light/30 border border-perfectify-primary rounded flex items-center px-3 text-sm">
            SEO, Content Marketing, Google Analytics
            <div className="absolute right-6 text-perfectify-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="#9b87f5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-white/80 pointer-events-none"></div>
      {showOverlay && <AutofillOverlay />}
    </div>
  </div>
)

export default ApplicationFormPreview
