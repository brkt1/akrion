import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/brand/akrion-mark-gold.png'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header
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
                ? 'akrion-logo h-11 w-auto sm:h-12 lg:h-[3.75rem]'
                : 'akrion-logo h-10 w-auto sm:h-11 md:h-14'
              }
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-primary-nav items-center gap-1" role="navigation" aria-label="Main navigation">
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

        </div>
      </header>
    </>
  )
}

export default Header
