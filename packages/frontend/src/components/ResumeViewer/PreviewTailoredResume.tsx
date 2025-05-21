'use client'
import React from 'react'
import DocViewer, { DocViewerRenderers, IDocument } from 'react-doc-viewer'

interface ResumeDisplayProps {
  resumePdfUrl: string
}

const PreviewTailoredResume: React.FC<ResumeDisplayProps> = ({ resumePdfUrl }) => {
  const documents: IDocument[] = [
    {
      uri: resumePdfUrl,
      // fileType: 'docx',
    },
  ]
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

export default PreviewTailoredResume
