import React from 'react'
import { ArrowRight } from 'lucide-react'
import FeatureSection from '../FeatureSection'
import { LINKED_SECTION_IDS } from '@/lib/enums'

const ApplicationAutofill = () => (
  <FeatureSection
    id={LINKED_SECTION_IDS.AUTOFILL}
    className="bg-gradient-to-b to-gray-50 from-white"
  >
    <div className="max-w-5xl mx-auto">
      <h2 className="mb-6 text-center feature-item-animate">
        Step 2: <span className="gradient-text">Autofill</span> Job Applications in a Flash.
      </h2>
      <div className="mb-8 bg-white rounded-xl p-6 shadow-lg feature-item-animate">
        <div className="border border-gray-200 rounded-lg p-4 relative overflow-hidden">
          <div className="text-sm font-medium mb-2">APPLICATION FORM</div>
          <div className="space-y-4 relative">
            <div>
              <label className="text-sm text-gray-500 block">Full Name</label>
              <div className="h-10 bg-perfectify-light/30 border border-perfectify-primary rounded flex items-center px-3 text-sm">
                John Smith
                <div className="absolute right-6 text-perfectify-primary">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block">Email</label>
              <div className="h-10 bg-perfectify-light/30 border border-perfectify-primary rounded flex items-center px-3 text-sm">
                johnsmith@example.com
                <div className="absolute right-6 text-perfectify-primary">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block">Work Experience</label>
              <div className="h-10 bg-perfectify-light/30 border border-perfectify-primary rounded flex items-center px-3 text-sm">
                Marketing Manager at TechCorp (2020-Present)
                <div className="absolute right-6 text-perfectify-primary">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block">Skills</label>
              <div className="h-10 bg-perfectify-light/30 border border-perfectify-primary rounded flex items-center px-3 text-sm">
                SEO, Content Marketing, Google Analytics
                <div className="absolute right-6 text-perfectify-primary">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-white/80 pointer-events-none"></div>
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
            <h3 className="font-medium text-lg">One-Click Convenience</h3>
            <p className="text-muted-foreground">
              Breeze through lengthy application forms on major job boards and company career pages.
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
            <h3 className="font-medium text-lg">Accuracy Assured</h3>
            <p className="text-muted-foreground">
              Reduce errors and ensure consistency across all your applications.
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
            <h3 className="font-medium text-lg">More Applications, Less Burnout</h3>
            <p className="text-muted-foreground">
              Free up your time to find more opportunities, network, and prepare for interviews
              instead of battling forms.
            </p>
          </div>
        </li>
      </ul>
    </div>
  </FeatureSection>
)

export default ApplicationAutofill
