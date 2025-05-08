'use client'
import { cn } from '@/utils'
import React, { useEffect, useRef } from 'react'
interface FeatureSectionProps {
  children: React.ReactNode
  className?: string
}

const FeatureSection = ({ children, className }: FeatureSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animatedElements = entry.target.querySelectorAll('.feature-item-animate')
            animatedElements.forEach((elem, index) => {
              setTimeout(() => {
                elem.classList.add('in-view')
              }, index * 75)
            })
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className={cn('overflow-hidden w-full', className)}>
      <div className="container">
        <div className="py-16 md:py-24 mx-auto px-4 sm:px-6 lg:px-8 mt-8">{children}</div>
      </div>
    </section>
  )
}

export default FeatureSection
