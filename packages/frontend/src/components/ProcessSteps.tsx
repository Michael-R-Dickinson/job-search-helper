import { FileText, Linkedin, CheckCircle, ArrowRight } from 'lucide-react'
import ProcessStep from './ProcessStep'

const ProcessSteps = () => (
  <div
    className="mt-12 max-w-4xl mx-auto feature-item-animate"
    style={{ transitionDelay: '400ms' }}
  >
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
      <h3 className="text-center font-semibold text-xl mb-6">How It Works</h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ProcessStep
          icon={<FileText className="h-6 w-6 text-perfectify-purple" />}
          title="1. Upload Your Resume"
          description={
            <>
              Use your <span className="font-semibold">existing</span> Google Doc or Word Document
            </>
          }
        />
        <div className="hidden md:block text-perfectify-purple">
          <ArrowRight className="h-5 w-5" />
        </div>
        <div className="md:hidden text-perfectify-purple">
          <ArrowRight className="h-5 w-5 transform rotate-90" />
        </div>
        <ProcessStep
          icon={<Linkedin className="h-6 w-6 text-blue-600" />}
          title="2. Add LinkedIn Job URL"
          description={<>Paste the link to the job you&apos;re applying for</>}
        />
        <div className="hidden md:block text-perfectify-purple">
          <ArrowRight className="h-5 w-5" />
        </div>
        <div className="md:hidden text-perfectify-purple">
          <ArrowRight className="h-5 w-5 transform rotate-90" />
        </div>
        <ProcessStep
          icon={<CheckCircle className="h-6 w-6 text-perfectify-purple" />}
          title="3. Get Your Tailored Resume"
          description={<>Instantly optimized for the specific job requirements</>}
        />
      </div>
    </div>
  </div>
)

export default ProcessSteps
