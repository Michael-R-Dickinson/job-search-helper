import { getTailoredResume } from '@/lib/api'
import React from 'react'

interface PreviewTailoredResumeProps {
  fileName: string
  linkedInJobUrl: string
}

const PreviewTailoredResume: React.FC<PreviewTailoredResumeProps> = ({}) => {
  // const res = await getTailoredResume(fileName, linkedInJobUrl, 'userId123')
  // const data = await res.json()

  // return <div>{data}</div>
  return <></>
}

export default PreviewTailoredResume
