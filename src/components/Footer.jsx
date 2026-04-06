import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../Artboard 2.png'
import { authAPI } from '../lib/api/auth'
import TiletDivider from './TiletDivider'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

const services = [
  'Brand Identity',
  'Web & App Development',
  'Video & Motion Design',
  'Social Media Strategy',
  'Creative Consulting',
]

// Real brand contact info (from business card)
const CONTACT = {
  email:    'Akriondigitals@gmail.com',
  phone:    '+2519 7660 1172',
  whatsapp: '251976601172',
  website:  'Akriondigials.com',
  location: 'Addis Ababa, Ethiopia',
  ceo:      'Hailemichael Melaku',
}

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.83a8.16 8.16 0 0 0 4.78 1.52V6.89a4.85 4.85 0 0 1-1.01-.2z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
]

const Footer = () => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuth()
    const { data: { subscription } } = authAPI.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true)
        setUser(session?.user || null)
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setUser(null)
      }
    })
    return () => { subscription.unsubscribe() }
  }, [])

  const checkAuth = async () => {
    try {
      const session = await authAPI.getSession()
      if (session) {
        setIsAuthenticated(true)
        setUser(session.user)
      }
    } catch (err) {
      console.error('Error checking auth:', err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await authAPI.signIn(loginData.email, loginData.password)
      if (data.user) {
        setIsAuthenticated(true)
        setUser(data.user)
        setShowLoginModal(false)
        setLoginData({ email: '', password: '' })
        localStorage.setItem('blogAdminMode', 'true')
        localStorage.setItem('portfolioAdminMode', 'true')
        localStorage.setItem('servicesAdminMode', 'true')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.signOut()
      setIsAuthenticated(false)
      setUser(null)
      localStorage.setItem('blogAdminMode', 'false')
      localStorage.setItem('portfolioAdminMode', 'false')
      localStorage.setItem('servicesAdminMode', 'false')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <>
      <footer className="bg-bg-darker border-t border-white/[0.06] relative overflow-hidden">
        {/* Ethiopian Tilet Border Top */}
        <TiletDivider variant="strip" className="opacity-40" />

        {/* CTA Banner */}
        <div className="border-b py-14 sm:py-20 px-4 sm:px-6 lg:px-10 relative" style={{ borderColor: 'rgba(201,161,112,0.08)' }}>
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-center md:text-left">
              <p className="section-label mb-3">
                <span className="section-dot" />
                Let&apos;s Collaborate
              </p>
              <h2 className="section-heading text-[clamp(1.8rem,4vw,3rem)] leading-tight">
                Ready to bring your<br className="hidden sm:block" /> vision to life?
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/contact" className="btn-primary px-8 py-4 text-base">
                Start a Project
              </Link>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost px-8 py-4 text-base gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.533 5.849L0 24l6.335-1.521A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 0 1-5.032-1.385l-.36-.213-3.728.896.928-3.612-.236-.373A9.808 9.808 0 0 1 2.182 12C2.182 6.573 6.573 2.182 12 2.182c5.428 0 9.818 4.391 9.818 9.818 0 5.428-4.39 9.818-9.818 9.818z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Main footer columns */}
        <div className="py-14 sm:py-16 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
              <Link to="/" className="inline-block">
                <img src={logo} alt="Akrion Digitals" className="h-10 w-auto" />
              </Link>
              <p className="text-sm leading-relaxed font-light max-w-xs" style={{ color: 'rgba(201,161,112,0.5)' }}>
                A creative agency transforming imagination into experience — from Addis Ababa to the world.
              </p>
              <p className="text-xs font-medium" style={{ color: 'rgba(201,161,112,0.35)' }}>{CONTACT.ceo} &mdash; CEO &amp; Manager</p>
              {/* Social icons */}
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'rgba(201,161,112,0.06)',
                      border: '1px solid rgba(201,161,112,0.12)',
                      color: 'rgba(201,161,112,0.5)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(201,161,112,0.14)'; e.currentTarget.style.color='#C9A170'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(201,161,112,0.06)'; e.currentTarget.style.color='rgba(201,161,112,0.5)'; }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-white/30 mb-1">Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-light"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Services */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-white/30 mb-1">Services</p>
              {services.map((service) => (
                <Link
                  key={service}
                  to="/services"
                  className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-light"
                >
                  {service}
                </Link>
              ))}
            </div>

            {/* Contact / Admin */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(201,161,112,0.3)' }}>Contact</p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-sm font-light transition-colors duration-200"
                style={{ color: 'rgba(201,161,112,0.5)' }}
                onMouseEnter={e => e.currentTarget.style.color='#C9A170'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(201,161,112,0.5)'}
              >
                {CONTACT.email}
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light transition-colors duration-200"
                style={{ color: 'rgba(201,161,112,0.5)' }}
                onMouseEnter={e => e.currentTarget.style.color='#C9A170'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(201,161,112,0.5)'}
              >
                {CONTACT.phone}
              </a>
              <p className="text-sm font-light" style={{ color: 'rgba(201,161,112,0.35)' }}>{CONTACT.location}</p>

              <div className="pt-3" style={{ borderTop: '1px solid rgba(201,161,112,0.08)' }}>
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-white/30 truncate">{user?.email}</p>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-white/40 hover:text-accent-orange transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    Admin Login
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Divider */}
          <TiletDivider variant="strip" className="opacity-15 -mb-6" />

          {/* Bottom bar */}
          <div className="max-w-[1400px] mx-auto mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(201,161,112,0.07)' }}>
            <p className="text-xs font-light" style={{ color: 'rgba(201,161,112,0.25)' }}>
              © 2025 Akrion Digitals. All rights reserved.
            </p>
            <p className="text-xs font-light" style={{ color: 'rgba(201,161,112,0.18)' }}>
              Crafted with creativity, precision &amp; passion.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] flex items-center justify-center p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-bg-darker rounded-2xl p-6 sm:p-8 border border-white/[0.1] max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-0.5">Admin Login</h2>
                <p className="text-xs text-white/40">Content management access</p>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-white/40 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-accent-orange/50 focus:bg-white/[0.06] transition-all"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-white/40 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-accent-orange/50 focus:bg-white/[0.06] transition-all"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-3.5 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Footer
