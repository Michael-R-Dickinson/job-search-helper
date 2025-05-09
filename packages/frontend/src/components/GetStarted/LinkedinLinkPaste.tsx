import React, { useState } from 'react'
import { Linkedin, Wand2 } from 'lucide-react'

interface LinkedinLinkPasteProps {
  onLinkInputted: (link: string) => void
}

const LinkedinLinkPaste: React.FC<LinkedinLinkPasteProps> = ({ onLinkInputted }) => {
  const [link, setLink] = useState('')
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Paste your LinkedIn profile URL</h1>
      <p className="text-gray-600">We&apos;ll use this to automatically fill out your profile.</p>
      <div className="flex items-center my-4">
        <Linkedin className="w-8 h-8 text-blue-500 mx-3" />
        <input
          type="text"
          placeholder="www.linkedin.com/jobs/your-job-title"
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <button
        className={`text-blue-500 relative w-full h-12 overflow-hidden rounded-full border-2 cursor-pointer hover:bg-blue-50 ${link ? 'border-sky-500' : 'border-gray-300 opacity-60 cursor-not-allowed'}`}
        onClick={() => onLinkInputted(link)}
        style={{
          pointerEvents: !link ? 'none' : 'auto',
        }}
      >
        <span className="relative z-10 flex items-center justify-center h-full w-full font-semibold">
          <Wand2 className="w-4.5 h-4.5 mr-2" />
          Tailor Resume
        </span>
      </button>
    </div>
  )
}

export default LinkedinLinkPaste
