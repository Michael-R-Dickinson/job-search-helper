'use client'
import React from 'react'
import DocViewer, { DocViewerRenderers, IDocument } from 'react-doc-viewer'

interface ResumeDisplayProps {
  resumeUrl: string
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resumeUrl }) => {
  const documents: IDocument[] = [
    {
      uri: resumeUrl,
    },
  ]

  // const fetchResume = fetch(resumeUrl, {
  //   method: 'GET',
  // }).then(async (response) => {
  //   if (!response.ok) {
  //     console.error('Error fetching resume:', response, await response.json(), response.statusText)
  //   }
  //   console.log('Response:', response)
  // })

  // const documentView = <div className="h-full m-24">HELLO</div>

  const documentView = (
    <div className="h-full">
      <DocViewer
        documents={documents}
        pluginRenderers={DocViewerRenderers}
        className="h-full"
        key="resume"
      />
    </div>
  )
  return documentView
}

export default React.memo(ResumeDisplay)
