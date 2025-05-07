'use client'
import { cn } from '@/utils'
import React, { useEffect, useRef } from 'react'
interface FeatureSectionProps {
  children: React.ReactNode
  className?: string
  bgClass?: string
}

const FeatureSection = ({ children, className, bgClass = 'bg-white' }: FeatureSectionProps) => {
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
              }, index * 150)
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
    <section ref={sectionRef} className={cn('py-16 md:py-24 overflow-hidden', bgClass, className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

export default FeatureSection
