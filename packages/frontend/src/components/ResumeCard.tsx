import { Card } from './BasicCard' // Assuming BasicCard.tsx exists
import { FileText } from 'lucide-react'

interface ResumeCardProps {
  type: 'original' | 'tailored'
}

// Helper component for new/changed text in tailored resume
const ChangedText = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium text-perfectify-purple">{children}</span>
)

// Helper component for new skill tags
const NewSkillTag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-1 bg-perfectify-purple/10 rounded text-xs text-perfectify-purple font-medium">
    {children}
  </span>
)

// Helper component for existing skill tags (original or retained in tailored)
const ExistingSkillTag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{children}</span>
)

const ResumeCard = ({ type }: ResumeCardProps) => {
  if (type === 'original') {
    return (
      <div className="relative">
        <div className="absolute -top-8 left-4">
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-sm font-medium">
            <FileText className="h-4 w-4 mr-2" />
            Original Resume
          </div>
        </div>
        <Card className="border border-gray-200 shadow-md overflow-hidden p-0">
          <div className="bg-white p-6">
            {/* Resume header */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Alex Chen</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">Software Engineer</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">alex.chen@email.com</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">(555) 123-4567</span>
              </div>
            </div>
            {/* Professional Summary */}
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Professional Summary</h3>
              <p className="text-sm text-gray-600">
                Results-oriented Software Engineer with 5+ years of experience in full-stack web
                development. Proven ability in designing, developing, and deploying web applications
                using JavaScript, React, and Node.js. A collaborative team player with experience in
                agile methodologies and project coordination.
              </p>
            </div>
            {/* Experience */}
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Experience</h3>
              <div className="mb-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-700">
                    Software Engineer, Innovate Solutions
                  </h4>
                  <span className="text-xs text-gray-500">2020 - Present</span>
                </div>
                <ul className="mt-1 pl-5 text-sm text-gray-600 list-disc">
                  <li>
                    Developed and maintained key features for client-facing web applications using
                    React and Redux.
                  </li>
                  <li>Contributed to backend API development with Node.js and Express.</li>
                  <li>
                    Participated in daily stand-ups and sprint planning in an Agile environment.
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-700">
                    Web Developer, WebWorks Inc.
                  </h4>
                  <span className="text-xs text-gray-500">2018 - 2020</span>
                </div>
                <ul className="mt-1 pl-5 text-sm text-gray-600 list-disc">
                  <li>Built responsive user interfaces for e-commerce platforms.</li>
                  <li>Worked closely with senior developers to debug and optimize code.</li>
                  <li>Assisted in migrating legacy code to modern JavaScript frameworks.</li>
                </ul>
              </div>
            </div>
            {/* Skills */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                <ExistingSkillTag>JavaScript</ExistingSkillTag>
                <ExistingSkillTag>React</ExistingSkillTag>
                <ExistingSkillTag>Node.js</ExistingSkillTag>
                <ExistingSkillTag>HTML</ExistingSkillTag>
                <ExistingSkillTag>CSS</ExistingSkillTag>
                <ExistingSkillTag>Git</ExistingSkillTag>
                <ExistingSkillTag>Agile</ExistingSkillTag>
                <ExistingSkillTag>REST APIs</ExistingSkillTag>
                <ExistingSkillTag>SQL</ExistingSkillTag>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Tailored resume for Senior Frontend Developer @ Meta
  return (
    <Card className="border border-perfectify-teal/20 shadow-lg overflow-hidden p-0 relative">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-perfectify-purple via-perfectify-teal to-perfectify-purple" />
      <div className="bg-white p-6">
        {/* Resume header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Alex Chen</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">
              <ChangedText>Senior Frontend Developer</ChangedText>
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">alex.chen@email.com</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">(555) 123-4567</span>
          </div>
        </div>
        {/* Professional Summary */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Professional Summary</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Results-oriented Software Engineer with{' '}
            <ChangedText>5+ years of dedicated frontend and full-stack experience</ChangedText>,
            specializing in crafting{' '}
            <ChangedText>high-quality, scalable user interfaces with React</ChangedText>. Expert in{' '}
            <ChangedText>
              modern JavaScript (including TypeScript), state management (Redux)
            </ChangedText>
            , and building responsive web applications. Proven ability to{' '}
            <ChangedText>
              lead frontend initiatives and optimize application performance
            </ChangedText>{' '}
            within agile teams.
          </p>
        </div>
        {/* Experience */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Experience</h3>
          <div className="mb-3">
            <div className="flex justify-between items-start">
              {/* Title remains "Software Engineer" as per original, but bullets highlight frontend leadership */}
              <h4 className="text-sm font-medium text-gray-700">
                Software Engineer, Innovate Solutions
              </h4>
              <span className="text-xs text-gray-500">2020 - Present</span>
            </div>
            <ul className="mt-1 pl-5 text-sm text-gray-600 list-disc space-y-1">
              <li>
                Led the{' '}
                <ChangedText>
                  frontend development of key client-facing features using React and Redux
                </ChangedText>
                , enhancing user experience and{' '}
                <ChangedText>improving application stability by 20%</ChangedText> through robust
                code.
              </li>
              <li>
                Engineered{' '}
                <ChangedText>
                  reusable React components and optimized component rendering
                </ChangedText>
                , contributing to a{' '}
                <ChangedText>15% improvement in overall application load times</ChangedText>.
              </li>
              <li>
                Collaborated within an Agile team to{' '}
                <ChangedText>define frontend architecture for new modules</ChangedText> and ensure
                timely delivery.
              </li>
            </ul>
          </div>
          <div>
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium text-gray-700">
                {/* Title changed slightly to emphasize frontend focus, plausible tailoring */}
                <ChangedText>Frontend-Focused Web Developer</ChangedText>, WebWorks Inc.
              </h4>
              <span className="text-xs text-gray-500">2018 - 2020</span>
            </div>
            <ul className="mt-1 pl-5 text-sm text-gray-600 list-disc space-y-1">
              <li>
                Developed{' '}
                <ChangedText>
                  responsive and accessible user interfaces for e-commerce platforms
                </ChangedText>
                , focusing on{' '}
                <ChangedText>React-based solutions and cross-browser compatibility</ChangedText>.
              </li>
              <li>
                Proactively{' '}
                <ChangedText>identified and resolved frontend performance bottlenecks</ChangedText>,
                improving user interaction smoothness.
              </li>
              <li>
                Played a key role in{' '}
                <ChangedText>
                  migrating legacy UI elements to a modern React architecture
                </ChangedText>
                , enhancing code maintainability.
              </li>
            </ul>
          </div>
        </div>
        {/* Skills */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            <NewSkillTag>React (Expert)</NewSkillTag>
            <NewSkillTag>TypeScript</NewSkillTag>
            <NewSkillTag>Redux</NewSkillTag>
            <NewSkillTag>JavaScript (ES6+)</NewSkillTag>{' '}
            {/* Kept as new for emphasis, but was in original */}
            <NewSkillTag>Next.js</NewSkillTag>
            <NewSkillTag>Performance Optimization</NewSkillTag>
            <NewSkillTag>Accessibility (A11y)</NewSkillTag>
            <NewSkillTag>Jest & RTL</NewSkillTag>
            <NewSkillTag>Webpack/Vite</NewSkillTag>
            <NewSkillTag>CI/CD</NewSkillTag>
            <ExistingSkillTag>HTML5</ExistingSkillTag>
            <ExistingSkillTag>CSS3 & SASS</ExistingSkillTag>
            <ExistingSkillTag>Node.js</ExistingSkillTag>
            <ExistingSkillTag>Git</ExistingSkillTag>
            <ExistingSkillTag>Agile Methodologies</ExistingSkillTag>
            <ExistingSkillTag>REST APIs</ExistingSkillTag>
            <ExistingSkillTag>SQL</ExistingSkillTag>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ResumeCard
