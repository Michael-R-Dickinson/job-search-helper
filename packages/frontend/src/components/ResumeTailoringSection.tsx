import FeatureSection from '@/components/FeatureSection'
import ResumeComparison from '@/components/ResumeComparison'
import ProcessSteps from '@/components/ProcessSteps'
import ExplanationSection from '@/components/ExplanationSection'

const ResumeTailoringSection = () => {
  return (
    <FeatureSection className="bg-gray-50">
      <h2 className="mb-5 text-center feature-item-animate">
        Step 1: <span className="gradient-text">Craft a Winning Resume</span> for Every Role.
        Instantly.
      </h2>
      <p className="text-center text-gray-500 mb-8 text-xl feature-item-animate">
        Tailors your <span className="font-bold">existing resume </span> to to any job description
        in seconds.
      </p>
      {/* Upload sources banner */}
      {/* <div className="flex flex-col items-center mb-8 feature-item-animate">
        <div className="bg-white py-3 px-5 rounded-full shadow-md border border-gray-100 flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Google Docs</span>
          </div>
          <span className="text-gray-400">or</span>
          <div className="flex items-center gap-1">
            <File className="h-5 w-5 text-blue-700" />
            <span className="text-sm font-medium">Word Document</span>
          </div>
          <span className="text-gray-500 font-medium">→</span>
          <span className="bg-perfectify-purple/10 text-perfectify-purple px-3 py-1 rounded-full text-sm font-medium">
            Use Your Existing Resume
          </span>
        </div>
      </div> */}

      <ResumeComparison />

      <ProcessSteps />

      <ExplanationSection />

      {/* Explanation section */}
      <div
        className="mt-12 max-w-3xl mx-auto text-center feature-item-animate"
        style={{ transitionDelay: '450ms' }}
      >
        <p className="text-gray-700">
          Upload your existing resume, add a LinkedIn job URL, and watch our AI instantly transform
          your generic resume into a tailored masterpiece that matches the specific job you want.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
          <div
            className="feature-item-animate p-4 rounded-lg bg-white border border-gray-100 shadow-sm"
            style={{ transitionDelay: '600ms' }}
          >
            <h4 className="font-medium mb-2 text-perfectify-purple">Experience Optimization</h4>
            <p className="text-sm text-gray-600">
              We reframe your work history to emphasize the skills and achievements most relevant to
              your target position.
            </p>
          </div>

          <div
            className="feature-item-animate p-4 rounded-lg bg-white border border-gray-100 shadow-sm"
            style={{ transitionDelay: '500ms' }}
          >
            <h4 className="font-medium mb-2 text-perfectify-purple">
              Intelligent Keyword Matching
            </h4>
            <p className="text-sm text-gray-600">
              Our system identifies and incorporates job-specific keywords to help you pass ATS
              screening systems.
            </p>
          </div>

          <div
            className="feature-item-animate p-4 rounded-lg bg-white border border-gray-100 shadow-sm"
            style={{ transitionDelay: '700ms' }}
          >
            <h4 className="font-medium mb-2 text-perfectify-purple">Instant Results</h4>
            <p className="text-sm text-gray-600">
              No need to spend hours tailoring resumes by hand — get a perfectly optimized resume in
              seconds.
            </p>
          </div>
        </div>
      </div>
    </FeatureSection>
  )
}

export default ResumeTailoringSection
