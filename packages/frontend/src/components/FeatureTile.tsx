import Link from 'next/link'
import React from 'react'

interface FeatureTileProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}

const FeatureTile: React.FC<FeatureTileProps> = ({ icon, title, description, link }) => (
  <Link
    href={link}
    className="cursor-pointer p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-perfectify-light/30 group transition-all duration-300 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-linear-to-br from-perfectify-light via-white to-perfectify-light/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    <div className="relative">
      <div className="w-16 h-16 rounded-full bg-perfectify-primary text-white flex items-center justify-center mx-auto mb-4 shadow-md">
        {icon}
      </div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="font-bold text-xl text-perfectify-primary">{title}</span>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </Link>
)

export default FeatureTile
