import { Card } from './BasicCard'
import { FileText } from 'lucide-react'

interface ResumeCardProps {
  type: 'original' | 'tailored'
}

const ResumeCard = ({ type }: ResumeCardProps) => {
  if (type === 'original') {
    return (
      <div className="relative">
        <div className="absolute -top-6 left-4">
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-gray-600 text-sm font-medium">
            <FileText className="h-4 w-4 mr-2" />
            Original Resume
          </div>
        </div>
        <Card className="border border-gray-200 shadow-md overflow-hidden p-0">
          <div className="bg-white p-6">
            {/* Resume header */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">John Doe</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">Software Engineer</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">johndoe@email.com</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">(555) 123-4567</span>
              </div>
            </div>
            {/* Professional Summary */}
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Professional Summary</h3>
              <p className="text-sm text-gray-600">
                Software Engineer with 5+ years experience in web development. Proficient in
                JavaScript, React and Node.js. Led teams and managed projects in agile environments.
              </p>
            </div>
            {/* Experience */}
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Experience</h3>
              <div className="mb-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium">Senior Developer, TechCorp</h4>
                  <span className="text-xs text-gray-500">2020 - Present</span>
                </div>
                <ul className="mt-1 pl-5 text-sm text-gray-600 list-disc">
                  <li>Developed front-end interfaces using React</li>
                  <li>Managed team of 5 junior developers</li>
                  <li>Implemented CI/CD pipelines for faster deployments</li>
                </ul>
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium">Web Developer, StartupXYZ</h4>
                  <span className="text-xs text-gray-500">2018 - 2020</span>
                </div>
                <ul className="mt-1 pl-5 text-sm text-gray-600 list-disc">
                  <li>Built responsive web applications</li>
                  <li>Worked with agile methodologies</li>
                  <li>Collaborated with designers on UI/UX improvements</li>
                </ul>
              </div>
            </div>
            {/* Skills */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                  JavaScript
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">React</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">Node.js</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">CSS</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">Git</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">Agile</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                  REST APIs
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Tailored resume
  return (
    <Card className="border border-perfectify-teal/20 shadow-lg overflow-hidden p-0 relative">
      {/* Gradient border at the top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-perfectify-purple via-perfectify-teal to-perfectify-purple" />
      <div className="bg-white p-6">
        {/* Resume header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">John Doe</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">
              <span className="font-medium text-perfectify-purple">Senior Frontend Developer</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">johndoe@email.com</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">(555) 123-4567</span>
          </div>
        </div>
        {/* Professional Summary */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Professional Summary</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-perfectify-purple">Senior Frontend Developer</span>{' '}
            with 5+ years experience specializing in{' '}
            <span className="font-medium text-perfectify-purple">React ecosystem</span>. Expert in
            building{' '}
            <span className="font-medium text-perfectify-purple">scalable UI components</span> and
            implementing{' '}
            <span className="font-medium text-perfectify-purple">performance optimizations</span>.
            Led teams in{' '}
            <span className="font-medium text-perfectify-purple">agile environments</span>.
          </p>
        </div>
        {/* Experience */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Experience</h3>
          <div className="mb-3">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium">Senior Developer, TechCorp</h4>
              <span className="text-xs text-gray-500">2020 - Present</span>
            </div>
            <ul className="mt-1 pl-5 text-sm text-gray-600 list-disc">
              <li>
                Developed{' '}
                <span className="font-medium text-perfectify-purple">
                  reusable UI component library
                </span>{' '}
                using React that increased team velocity by 40%
              </li>
              <li>
                Led{' '}
                <span className="font-medium text-perfectify-purple">
                  UI performance optimization
                </span>{' '}
                initiatives reducing load time by 60%
              </li>
              <li>
                Implemented{' '}
                <span className="font-medium text-perfectify-purple">CI/CD pipelines</span> for
                automated testing and deployment
              </li>
            </ul>
          </div>
          <div>
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium">Web Developer, StartupXYZ</h4>
              <span className="text-xs text-gray-500">2018 - 2020</span>
            </div>
            <ul className="mt-1 pl-5 text-sm text-gray-600 list-disc">
              <li>
                Built{' '}
                <span className="font-medium text-perfectify-purple">
                  responsive single-page applications
                </span>{' '}
                using React and Redux
              </li>
              <li>
                Worked in{' '}
                <span className="font-medium text-perfectify-purple">
                  cross-functional agile teams
                </span>{' '}
                to deliver features on schedule
              </li>
              <li>
                Collaborated with designers to implement{' '}
                <span className="font-medium text-perfectify-purple">pixel-perfect UI/UX</span>{' '}
                designs
              </li>
            </ul>
          </div>
        </div>
        {/* Skills */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-perfectify-purple/10 rounded text-xs text-perfectify-purple font-medium">
              React
            </span>
            <span className="px-2 py-1 bg-perfectify-purple/10 rounded text-xs text-perfectify-purple font-medium">
              React Native
            </span>
            <span className="px-2 py-1 bg-perfectify-purple/10 rounded text-xs text-perfectify-purple font-medium">
              JavaScript (ES6+)
            </span>
            <span className="px-2 py-1 bg-perfectify-purple/10 rounded text-xs text-perfectify-purple font-medium">
              TypeScript
            </span>
            <span className="px-2 py-1 bg-perfectify-purple/10 rounded text-xs text-perfectify-purple font-medium">
              Redux
            </span>
            <span className="px-2 py-1 bg-perfectify-purple/10 rounded text-xs text-perfectify-purple font-medium">
              Performance Optimization
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">CSS</span>
            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">Git</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ResumeCard
