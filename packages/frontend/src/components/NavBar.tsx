import React from 'react'
import { Button } from './BasicButton'
import Link from 'next/link'
import DashboardButton from './DashboardButton'

const NavBar = () => {
  return (
    <nav
      className=" bg-white/90 backdrop-blur-xs py-1 shadow-xs"
      // These do not use tailwind so that they are applied before tailwind styles are applied
      // This prevents a layout shift when the page loads
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="ml-2">
            <div className="gradient-image" />
          </div>
        </Link>
        <div className="hidden md:flex items-center space-x-6 py-3">
          <a
            href="#features"
            className="text-perfectify-dark hover:text-perfectify-primary transition-colors"
          >
            About
          </a>
          <a
            href="#how-it-works"
            className="text-perfectify-dark hover:text-perfectify-primary transition-colors"
          >
            How it Works
          </a>
          <a
            href="/support-us"
            className="text-perfectify-dark hover:text-perfectify-primary transition-colors"
          >
            Support Us
          </a>
          <DashboardButton />
        </div>
        <div className="md:hidden">
          <Button variant="ghost" className="text-perfectify-primary">
            Menu
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
