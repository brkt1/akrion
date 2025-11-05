import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../Artboard 2.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(88)
  const headerRef = useRef(null)

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  return (
    <>
      <header ref={headerRef} className="fixed top-0 left-0 right-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-[1000] bg-bg-dark/80 backdrop-blur-[10px]">
        <div className="flex justify-between items-center max-w-[1400px] mx-auto relative w-full">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 bg-[rgba(26,26,26,0.95)] backdrop-blur-[10px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-[50px] hover:opacity-90 hover:bg-[rgba(26,26,26,1)] transition-all shadow-lg">
            <img src={logo} alt="Akrion Digitals" className="h-8 sm:h-12 md:h-16 lg:h-20 w-auto max-w-full" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base">Home</Link>
            <Link to="/about" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base">About</Link>
            <Link to="/services" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base">Services</Link>
            <Link to="/portfolio" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base">Portfolio</Link>
            <Link to="/blog" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base">Blog</Link>
            <Link to="/contact" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base">Contact</Link>
          </nav>
          <button 
            className="bg-transparent border-none cursor-pointer flex flex-col gap-1 p-2 md:hidden z-50 relative" 
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <nav 
          className="md:hidden fixed left-0 right-0 bg-bg-dark/98 backdrop-blur-[10px] px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4 shadow-lg z-[1001]"
          style={{ top: `${headerHeight}px` }}
        >
          <Link to="/" className="text-white hover:text-accent-orange transition-colors text-lg py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/about" className="text-white hover:text-accent-orange transition-colors text-lg py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/services" className="text-white hover:text-accent-orange transition-colors text-lg py-2" onClick={() => setIsMenuOpen(false)}>Services</Link>
          <Link to="/portfolio" className="text-white hover:text-accent-orange transition-colors text-lg py-2" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
          <Link to="/blog" className="text-white hover:text-accent-orange transition-colors text-lg py-2" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          <Link to="/contact" className="text-white hover:text-accent-orange transition-colors text-lg py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </nav>
      )}
    </>
  )
}

export default Header

