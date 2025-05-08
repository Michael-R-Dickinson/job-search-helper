'use client'
import React from 'react'
import { Button } from './BasicButton'
import { useRouter } from 'next/navigation'

const DashboardButton = () => {
  const router = useRouter()
  return (
    <Button className="cta-button font-semibold" onClick={() => router.push('/dashboard')}>
      Dashboard
    </Button>
  )
}

export default DashboardButton
