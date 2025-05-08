import ExplanationCard from './ExplanationCard'

const ExplanationSection = () => (
  <div
    className="mt-12 max-w-3xl mx-auto text-center feature-item-animate"
    style={{ transitionDelay: '450ms' }}
  >
    <p className="text-gray-700">
      Upload your existing resume, add a LinkedIn job URL, and watch our AI instantly transform your
      generic resume into a tailored masterpiece that matches the specific job you want.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left items-stretch">
      <div style={{ transitionDelay: '600ms' }} className="h-full">
        <ExplanationCard
          title="Experience Optimization"
          description="We reframe your work history to emphasize the skills and achievements most relevant to your target position."
          className="h-full"
        />
      </div>
      <div style={{ transitionDelay: '500ms' }} className="h-full">
        <ExplanationCard
          title="Intelligent Keyword Matching"
          description="Our system identifies and incorporates job-specific keywords to help you pass ATS screening systems."
          className="h-full"
        />
      </div>
      <div style={{ transitionDelay: '700ms' }} className="h-full">
        <ExplanationCard
          title="Instant Results"
          description="No need to spend hours tailoring resumes by hand — get a perfectly optimized resume in seconds."
          className="h-full"
        />
      </div>
    </div>
  </div>
)

export default ExplanationSection
