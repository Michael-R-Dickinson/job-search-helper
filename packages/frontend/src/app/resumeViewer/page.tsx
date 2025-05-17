'use client'
import PreviewTailoredResume from '@/components/ResumeViewer/PreviewTailoredResume'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const ResumeViewerPage: React.FC = () => {
  // Resume url is passed as a query parameter
  const params = useSearchParams()
  const resumePdfURL = params.get('resumeUrl')
  console.log('Resume URL:', resumePdfURL)

  if (!resumePdfURL) {
    return <div className="pt-24 text-2xl">No document specified in path</div>
  }

  fetch(resumePdfURL).then((response) => {
    if (response.status !== 200) {
      console.error('Error fetching resume:', response.statusText)
      return <div className="pt-24 text-2xl">Error fetching resume</div>
    }
  })

  return (
    <div className="h-screen">
      <PreviewTailoredResume resumePdfUrl={resumePdfURL} />
    </div>
  )
}

export default ResumeViewerPage
