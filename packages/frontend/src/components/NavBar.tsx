import React from 'react'
import { Button } from './BasicButton'

const NavBar = () => {
  return (
    <nav
      className=" bg-white/90 backdrop-blur-xs py-4 shadow-xs"
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
        <div className="flex items-center">
          <h1 className="text-xl font-bold gradient-text">Perfectify</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="#features"
            className="text-perfectify-dark hover:text-perfectify-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-perfectify-dark hover:text-perfectify-primary transition-colors"
          >
            How it Works
          </a>
          <Button className="cta-button">Get Started - Free</Button>
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
