import React from 'react'
import FeatureSection from '../FeatureSection'
import { LINKED_SECTION_IDS } from '@/lib/enums'
const ApplicationTracking = () => (
  <FeatureSection id={LINKED_SECTION_IDS.SMART_TRACKING} className="max-w-5xl mx-auto">
    <h2 className="mb-6 text-center feature-item-animate">
      Step 3: <span className="gradient-text">Track</span> Your Applications and Stay Organized.
    </h2>
    <div className="mb-8 bg-white rounded-xl p-6 shadow-lg feature-item-animate">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-sm font-medium mb-4">APPLICATION DASHBOARD</div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-perfectify-light/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-perfectify-primary">24</div>
            <div className="text-xs text-gray-500">Applied</div>
          </div>
          <div className="bg-perfectify-light/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-perfectify-primary">8</div>
            <div className="text-xs text-gray-500">Interviews</div>
          </div>
          <div className="bg-perfectify-light/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-perfectify-primary">3</div>
            <div className="text-xs text-gray-500">Offers</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 hover:border-perfectify-primary hover:shadow-xs transition-all">
            <div>
              <div className="font-medium">Senior Marketing Manager</div>
              <div className="text-xs text-gray-500">TechCorp Inc.</div>
            </div>
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Interview</div>
          </div>
          <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 hover:border-perfectify-primary hover:shadow-xs transition-all">
            <div>
              <div className="font-medium">Digital Marketing Specialist</div>
              <div className="text-xs text-gray-500">Global Solutions Ltd.</div>
            </div>
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Applied</div>
          </div>
          <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 hover:border-perfectify-primary hover:shadow-xs transition-all">
            <div>
              <div className="font-medium">Content Marketing Lead</div>
              <div className="text-xs text-gray-500">Innovate Agency</div>
            </div>
            <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Follow-up</div>
          </div>
        </div>
      </div>
    </div>
    <ul className="space-y-4 mb-6 feature-item-animate">
      <li className="flex gap-3">
        <div className="mt-1 bg-perfectify-light rounded-full p-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="#9b87f5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-lg">Centralized Hub</h3>
          <p className="text-muted-foreground">
            See the status of all your applications, interview schedules, and contact details in one
            organized place.
          </p>
        </div>
      </li>
      <li className="flex gap-3">
        <div className="mt-1 bg-perfectify-light rounded-full p-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="#9b87f5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-lg">Actionable Insights</h3>
          <p className="text-muted-foreground">
            {"Understand your application activity and identify what's working best."}
          </p>
        </div>
      </li>
      <li className="flex gap-3">
        <div className="mt-1 bg-perfectify-light rounded-full p-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="#9b87f5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-lg">Stay Prepared & Proactive</h3>
          <p className="text-muted-foreground">
            Get reminders for follow-ups and easily manage communications, ensuring you never miss a
            beat.
          </p>
        </div>
      </li>
    </ul>
  </FeatureSection>
)

export default ApplicationTracking
