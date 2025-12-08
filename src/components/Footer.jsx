import React, { useEffect, useState } from 'react'
import { authAPI } from '../lib/api/auth'

const Footer = () => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'TikTok', url: 'https://tiktok.com' },
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Facebook', url: 'https://facebook.com' },
  ]

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
    
    // Listen to auth state changes
    const { data: { subscription } } = authAPI.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true)
        setUser(session?.user || null)
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
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
        // Enable admin mode for all pages
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
      // Disable admin mode
      localStorage.setItem('blogAdminMode', 'false')
      localStorage.setItem('portfolioAdminMode', 'false')
      localStorage.setItem('servicesAdminMode', 'false')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <>
      <footer className="py-10 sm:py-12 md:py-16 px-4 xs:px-6 sm:px-6 lg:px-8 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <p className="text-sm sm:text-base text-text-gray text-center md:text-left px-2">
              © 2025 Akrion Digitals. Crafted with creativity, precision, and passion.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-end items-center">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-text-gray hover:text-accent-orange transition-colors touch-target min-h-[44px] min-w-[44px] flex items-center justify-center px-2 active:opacity-70"
                >
                  {link.name}
                </a>
              ))}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-gray">
                    {user?.email || 'Admin'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm sm:text-base text-text-gray hover:text-accent-orange transition-colors touch-target min-h-[44px] px-4 py-2 rounded-lg border border-white/20 hover:border-accent-orange/50 active:opacity-70"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm sm:text-base text-text-gray hover:text-accent-orange transition-colors touch-target min-h-[44px] px-4 py-2 rounded-lg border border-white/20 hover:border-accent-orange/50 active:opacity-70"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            className="backdrop-blur-md bg-black/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Login</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-text-gray hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-text-gray mb-2">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-text-gray mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-accent-orange text-white px-8 py-3 rounded-lg font-medium hover:bg-[#FF6B2E] transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="mt-4 text-xs text-text-gray text-center">
              Admin access for content management
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Footer

