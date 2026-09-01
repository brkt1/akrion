import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/brand/akrion-mark-gold.png'
import AdminIcon from './AdminIcons'

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: 'dashboard', exact: true },
  { label: 'Homepage', path: '/admin/homepage', icon: 'home' },
  { label: 'About Page', path: '/admin/about', icon: 'about' },
  { label: 'Services Page', path: '/admin/services', icon: 'services' },
  { label: 'Portfolio', path: '/admin/portfolio', icon: 'portfolio' },
  { label: 'Blog', path: '/admin/blog', icon: 'blog' },
  { label: 'Testimonials', path: '/admin/testimonials', icon: 'about' },
  { label: 'Contact Inquiries', path: '/admin/inquiries', icon: 'inquiries' },
  { label: 'Media Library', path: '/admin/media', icon: 'media' },
  { label: 'Site Settings', path: '/admin/settings', icon: 'settings' },
]

const getPageTitle = (pathname) => (
  pathname === '/admin/preview' ? 'Dashboard Preview' :
  ADMIN_NAV_ITEMS.find((item) => item.exact ? pathname === item.path : pathname.startsWith(item.path))?.label || 'Admin'
)

const AdminShell = ({ children, user, onSignOut, previewMode = false }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const pageTitle = getPageTitle(location.pathname)

  useEffect(() => setMenuOpen(false), [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <div className="admin-app">
      <a className="admin-skip-link" href="#admin-main">Skip to content</a>

      <aside className={`admin-sidebar${menuOpen ? ' is-open' : ''}`} aria-label="Admin navigation">
        <div className="admin-sidebar-brand">
          <Link to="/admin" aria-label="Akrion Digitals admin dashboard">
            <img src={logo} alt="" />
            <span>
              <strong>Akrion</strong>
              <small>Content Studio</small>
            </span>
          </Link>
          <button type="button" className="admin-sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close admin menu">
            <AdminIcon name="close" />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <p>Manage website</p>
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
            >
              <AdminIcon name={item.icon} />
              <span>{item.label}</span>
              <AdminIcon name="chevron" size={16} className="admin-nav-chevron" />
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-summary">
            <span className="admin-user-avatar">{(user?.email || 'A').charAt(0).toUpperCase()}</span>
            <span>
              <strong>{previewMode ? 'Read-only preview' : 'Administrator'}</strong>
              <small title={user?.email}>{user?.email}</small>
            </span>
          </div>
          <button type="button" onClick={previewMode ? () => navigate('/admin') : onSignOut} className="admin-signout-button">
            <AdminIcon name={previewMode ? 'close' : 'logout'} />
            {previewMode ? 'Exit preview' : 'Sign out'}
          </button>
        </div>
      </aside>

      {menuOpen && <button type="button" className="admin-sidebar-scrim" onClick={() => setMenuOpen(false)} aria-label="Close admin menu" />}

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <button type="button" className="admin-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open admin menu" aria-expanded={menuOpen}>
              <AdminIcon name="menu" />
            </button>
            <div>
              <span>Akrion Digitals</span>
              <h1>{pageTitle}</h1>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-live-status"><i /> {previewMode ? 'Read-only preview' : 'Supabase connected'}</span>
            <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-open-site">
              Open website
              <AdminIcon name="external" size={17} />
            </Link>
          </div>
        </header>

        <main id="admin-main" className="admin-main" tabIndex="-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminShell
