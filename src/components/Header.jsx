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
      <header ref={headerRef} className="fixed top-0 left-0 right-0 px-4 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 z-[1000] bg-bg-dark/90 backdrop-blur-[10px] w-full max-w-full overflow-hidden border-b border-white/5">
        <div className="flex justify-between items-center max-w-[1400px] mx-auto relative w-full">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 bg-[rgba(26,26,26,0.95)] backdrop-blur-[10px] px-3 sm:px-3 md:px-4 py-2 sm:py-1.5 md:py-2 rounded-[50px] hover:opacity-90 hover:bg-[rgba(26,26,26,1)] transition-all shadow-lg touch-target min-h-[44px]">
            <img src={logo} alt="Akrion Digitals" className="h-7 sm:h-10 md:h-14 lg:h-16 w-auto max-w-[100px] xs:max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-none" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base py-2 px-1 touch-target min-h-[44px] flex items-center">Home</Link>
            <Link to="/about" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base py-2 px-1 touch-target min-h-[44px] flex items-center">About</Link>
            <Link to="/services" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base py-2 px-1 touch-target min-h-[44px] flex items-center">Services</Link>
            <Link to="/portfolio" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base py-2 px-1 touch-target min-h-[44px] flex items-center">Portfolio</Link>
            <Link to="/blog" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base py-2 px-1 touch-target min-h-[44px] flex items-center">Blog</Link>
            <Link to="/contact" className="text-white hover:text-accent-orange transition-colors text-sm lg:text-base py-2 px-1 touch-target min-h-[44px] flex items-center">Contact</Link>
          </nav>
          <button 
            className="bg-transparent border-none cursor-pointer flex flex-col gap-1.5 p-3 md:hidden z-50 relative touch-target min-h-[44px] min-w-[44px] justify-center items-center rounded-lg active:bg-white/10 transition-colors" 
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]"
            style={{ top: `${headerHeight}px` }}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <nav 
            className="md:hidden fixed left-0 right-0 bg-bg-dark/98 backdrop-blur-[15px] px-6 py-8 flex flex-col gap-2 shadow-2xl z-[1001] w-full max-w-full overflow-y-auto border-t border-white/10"
            style={{ top: `${headerHeight}px`, maxHeight: `calc(100vh - ${headerHeight}px)` }}
          >
            <Link to="/" className="text-white hover:text-accent-orange transition-colors text-lg py-4 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 touch-target min-h-[48px] flex items-center" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/about" className="text-white hover:text-accent-orange transition-colors text-lg py-4 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 touch-target min-h-[48px] flex items-center" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/services" className="text-white hover:text-accent-orange transition-colors text-lg py-4 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 touch-target min-h-[48px] flex items-center" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link to="/portfolio" className="text-white hover:text-accent-orange transition-colors text-lg py-4 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 touch-target min-h-[48px] flex items-center" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
            <Link to="/blog" className="text-white hover:text-accent-orange transition-colors text-lg py-4 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 touch-target min-h-[48px] flex items-center" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <Link to="/contact" className="text-white hover:text-accent-orange transition-colors text-lg py-4 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 touch-target min-h-[48px] flex items-center" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </nav>
        </>
      )}
    </>
  )
}

export default Header

