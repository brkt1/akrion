import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../Artboard 2.png'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(72)
  const headerRef = useRef(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }

    updateHeaderHeight()
    const resizeObserver = new ResizeObserver(updateHeaderHeight)
    if (headerRef.current) resizeObserver.observe(headerRef.current)
    window.addEventListener('resize', updateHeaderHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`top-0 z-[1000] w-full transition-all duration-500 ${
          isHome
            ? `sticky border-b ${
                scrolled
                  ? 'py-2.5 border-[rgba(201,161,112,0.16)] shadow-[0_12px_36px_rgba(0,0,0,0.28)]'
                  : 'py-3 border-[rgba(201,161,112,0.10)] shadow-[0_8px_28px_rgba(0,0,0,0.18)]'
              }`
            : `fixed left-0 right-0 ${
                scrolled
                  ? 'py-3 border-b border-white/[0.07]'
                  : 'py-4 border-b border-transparent'
              }`
        }`}
        style={{
          background: isHome
            ? scrolled
              ? 'rgba(8, 28, 17, 0.88)'
              : 'rgba(9, 31, 19, 0.72)'
            : scrolled
              ? 'rgba(17,17,17,0.92)'
              : 'rgba(17,17,17,0.5)',
          backdropFilter: isHome
            ? 'blur(16px) saturate(145%)'
            : 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: isHome
            ? 'blur(16px) saturate(145%)'
            : 'blur(20px) saturate(180%)',
        }}
      >
        <div className="flex justify-between items-center max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <Link
            to="/"
            className={`${isHome ? 'akrion-logo-link' : ''} flex items-center gap-2 touch-target group`}
            aria-label="Akrion Digitals Home"
          >
            <img
              src={logo}
              alt="Akrion Digitals"
              className={isHome
                ? 'akrion-logo h-10 w-auto sm:h-11 lg:h-14'
                : 'h-8 w-auto transition-all duration-300 group-hover:opacity-80 sm:h-10 md:h-12'
              }
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-accent-orange bg-accent-orange/8'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-3 btn-primary text-sm px-5 py-2.5"
            >
              Let&apos;s Talk
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="flex flex-col gap-[5px] p-2.5 md:hidden z-50 relative touch-target rounded-lg hover:bg-white/5 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span
              className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
                isMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 ${
                isMenuOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
                isMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
          style={{ top: `${headerHeight}px` }}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <nav
        className={`md:hidden fixed left-0 right-0 z-[999] transition-all duration-400 ease-out ${
          isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{
          top: `${headerHeight}px`,
          background: isHome ? 'rgba(8, 28, 17, 0.97)' : 'rgba(15,15,15,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: isHome
            ? '1px solid rgba(201,161,112,0.14)'
            : '1px solid rgba(255,255,255,0.08)',
          maxHeight: `calc(100vh - ${headerHeight}px)`,
          overflowY: 'auto',
        }}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="px-4 py-6 flex flex-col gap-1">
          {navItems.map((item, i) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-accent-orange bg-accent-orange/10 border border-accent-orange/15'
                  : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
              }`}
              style={{ transitionDelay: isMenuOpen ? `${i * 30}ms` : '0ms' }}
            >
              {isActive(item.path) && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent-orange flex-shrink-0" />
              )}
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="mt-3 btn-primary justify-center"
          >
            Let&apos;s Talk
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Header
