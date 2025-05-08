import ResumeCard from './ResumeCard'
import MatchIndicator from './MatchIndicator'
import LinkedInJobIndicator from './LinkedInJobIndicator'
import { ArrowRight } from 'lucide-react'

const ResumeComparison = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-24">
      {/* Left side - Current Resume */}
      <div className="feature-item-animate">
        <ResumeCard type="original" />
      </div>

      {/* Right side - Tailored Resume */}
      <div className="feature-item-animate" style={{ transitionDelay: '300ms' }}>
        <div className="relative">
          <LinkedInJobIndicator />
          <MatchIndicator />
          <ResumeCard type="tailored" />
          {/* Transformation arrow for small screens */}
          <div className="lg:hidden flex justify-center my-4">
            <div className="bg-perfectify-purple/10 p-2 rounded-full">
              <ArrowRight className="h-5 w-5 text-perfectify-purple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeComparison
