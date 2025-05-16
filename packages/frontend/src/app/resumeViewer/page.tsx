'use client'
import ResumeDisplay from '@/components/ResumeViewer/ResumeDisplay'
import { useSearchParams } from 'next/navigation'
import React from 'react'

// Resume url in this pattern
// https://storage.googleapis.com/jobsearchhelper-231cf.firebasestorage.app/resumes/testUserId/tailored/business_resume_16_19-45-29.docx
const validateUrl = (url: string): boolean => {
  const regex = /^https:\/\/storage\.googleapis\.com\/[-\w.]+\/(?:[\w.\-]+\/)*[\w.\-]+\.docx$/i

  return regex.test(url)
}

const ResumeViewerPage: React.FC = () => {
  // Resume url is passed as a query parameter
  const params = useSearchParams()
  const resumeUrl = params.get('resumeUrl')
  console.log('Resume URL:', resumeUrl)

  if (!resumeUrl) {
    return <div>No document specified in path</div>
  }
  if (!validateUrl(resumeUrl)) {
    return <div>Invalid document URL</div>
  }

  return (
    <div className="h-screen">
      <ResumeDisplay resumeUrl={resumeUrl} />
    </div>
  )
}

export default ResumeViewerPage
