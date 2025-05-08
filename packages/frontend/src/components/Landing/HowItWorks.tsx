import { FileText, SquareArrowRight, ListChecks } from 'lucide-react'
import FeatureTile from '../FeatureTile'
import { LINKED_SECTION_IDS } from '@/lib/enums'

const HowItWorks = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ animationDelay: '0.4s' }}>
    <FeatureTile
      icon={<FileText className="w-8 h-8" />}
      title="1. AI Resume Tailoring"
      description="Upload your resume & paste a job URL for instant customization"
      link={`#${LINKED_SECTION_IDS.RESUME_TAILORING}`}
    />
    <FeatureTile
      icon={<SquareArrowRight className="w-8 h-8" />}
      title="2. Rapid Autofill"
      description="Fill applications automatically across major job platforms"
      link={`#${LINKED_SECTION_IDS.AUTOFILL}`}
    />
    <FeatureTile
      icon={<ListChecks className="w-8 h-8" />}
      title="3. Smart Tracking"
      description="Monitor all applications and interviews in one dashboard"
      link={`#${LINKED_SECTION_IDS.SMART_TRACKING}`}
    />
  </div>
)

export default HowItWorks
