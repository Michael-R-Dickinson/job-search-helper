import FeatureSection from '@/components/FeatureSection'
import { FileText, Linkedin, ArrowRight, CheckCircle } from 'lucide-react'
import { Card } from './BasicCard'

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-24">
        {/* Left side - Current Resume */}
        <div className="feature-item-animate">
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
                    JavaScript, React and Node.js. Led teams and managed projects in agile
                    environments.
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
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      React
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      Node.js
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">CSS</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">Git</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      Agile
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      REST APIs
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right side - Tailored Resume */}
        <div className="feature-item-animate" style={{ transitionDelay: '300ms' }}>
          <div className="relative">
            <div className="absolute -top-6 left-4 z-10">
              <div className="inline-flex items-center px-3 py-1 bg-perfectify-purple/10 rounded-full text-perfectify-purple text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Tailored Resume
              </div>
            </div>

            {/* LinkedIn job target indicator - ENHANCED */}
            <div className="absolute -top-16 right-0 left-0 mx-auto md:mx-0 md:right-4 md:left-auto z-20">
              <div className="flex flex-col items-center">
                <div className="bg-white border-2 border-blue-600 rounded-lg shadow-lg p-3 max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Linkedin size={20} className="text-blue-600" />
                    <span className="font-semibold text-gray-800">LinkedIn Job</span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    Senior Frontend Developer @ Meta
                  </div>
                </div>
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
              </div>
            </div>

            {/* Match indicator */}
            <div className="absolute top-4 right-4 z-10">
              <div className="px-2.5 py-1.5 bg-green-50 border border-green-100 rounded-full">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#16A34A" strokeWidth="1.5" />
                    <path
                      d="M8 4L5.5 7.5L4 6"
                      stroke="#16A34A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs font-medium text-green-700">96% Match</span>
                </div>
              </div>
            </div>

            <Card className="border border-perfectify-teal/20 shadow-lg overflow-hidden p-0 relative">
              {/* Gradient border at the top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-perfectify-purple via-perfectify-teal to-perfectify-purple" />

              <div className="bg-white p-6">
                {/* Resume header */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">John Doe</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      <span className="font-medium text-perfectify-purple">
                        Senior Frontend Developer
                      </span>
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
                    <span className="font-medium text-perfectify-purple">
                      Senior Frontend Developer
                    </span>{' '}
                    with 5+ years experience specializing in{' '}
                    <span className="font-medium text-perfectify-purple">React ecosystem</span>.
                    Expert in building{' '}
                    <span className="font-medium text-perfectify-purple">
                      scalable UI components
                    </span>{' '}
                    and implementing{' '}
                    <span className="font-medium text-perfectify-purple">
                      performance optimizations
                    </span>
                    . Led teams in{' '}
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
                        <span className="font-medium text-perfectify-purple">CI/CD pipelines</span>{' '}
                        for automated testing and deployment
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
                        <span className="font-medium text-perfectify-purple">
                          pixel-perfect UI/UX
                        </span>{' '}
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

            {/* Transformation arrow for small screens */}
            <div className="lg:hidden flex justify-center my-4">
              <div className="bg-perfectify-purple/10 p-2 rounded-full">
                <ArrowRight className="h-5 w-5 text-perfectify-purple" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process illustration - NEW */}
      <div
        className="mt-22 max-w-4xl mx-auto feature-item-animate"
        style={{ transitionDelay: '400ms' }}
      >
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <h3 className="text-center font-semibold text-xl mb-6">How It Works</h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 flex flex-col items-center text-center p-3">
              <div className="bg-perfectify-purple/10 rounded-full p-3 mb-3">
                <FileText className="h-6 w-6 text-perfectify-purple" />
              </div>
              <h4 className="font-medium mb-2">1. Upload Your Resume</h4>
              <p className="text-sm text-gray-600">
                Use your <span className="font-semibold">existing</span> Google Doc or Word Document
              </p>
            </div>

            <div className="hidden md:block text-perfectify-purple">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div className="md:hidden text-perfectify-purple">
              <ArrowRight className="h-5 w-5 transform rotate-90" />
            </div>

            <div className="flex-1 flex flex-col items-center text-center p-3">
              <div className="bg-perfectify-purple/10 rounded-full p-3 mb-3">
                <Linkedin className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">2. Add LinkedIn Job URL</h4>
              <p className="text-sm text-gray-600">
                Paste the link to the job you&apos;re applying for
              </p>
            </div>

            <div className="hidden md:block text-perfectify-purple">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div className="md:hidden text-perfectify-purple">
              <ArrowRight className="h-5 w-5 transform rotate-90" />
            </div>

            <div className="flex-1 flex flex-col items-center text-center p-3">
              <div className="bg-perfectify-purple/10 rounded-full p-3 mb-3">
                <CheckCircle className="h-6 w-6 text-perfectify-purple" />
              </div>
              <h4 className="font-medium mb-2">3. Get Your Tailored Resume</h4>
              <p className="text-sm text-gray-600">
                Instantly optimized for the specific job requirements
              </p>
            </div>
          </div>
        </div>
      </div>

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
