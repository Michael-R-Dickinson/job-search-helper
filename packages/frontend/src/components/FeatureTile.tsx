import React from 'react'

interface FeatureTileProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureTile: React.FC<FeatureTileProps> = ({ icon, title, description }) => (
  <div className="bg-linear-to-br from-perfectify-light via-white to-perfectify-light/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-perfectify-light/30 group">
    <div className="w-16 h-16 rounded-full bg-perfectify-primary text-white flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex items-center justify-center gap-2 mb-3">
      <span className="font-bold text-xl text-perfectify-primary">{title}</span>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </div>
)

export default FeatureTile
