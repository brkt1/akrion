import { Link, useLocation } from 'react-router-dom'

const icons = {
  home: (
    <><path d="M3.5 10.8 12 3.7l8.5 7.1"/><path d="M5.6 9.2v10h12.8v-10"/><path d="M9.5 19.2v-5.6h5v5.6"/></>
  ),
  services: (
    <><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="1.7"/><circle cx="16" cy="12" r="1.7"/><circle cx="10" cy="18" r="1.7"/></>
  ),
  portfolio: (
    <><rect x="3.5" y="6.5" width="17" height="12.5" rx="2.2"/><path d="M8.5 6.5V4.8c0-1 .8-1.8 1.8-1.8h3.4c1 0 1.8.8 1.8 1.8v1.7M3.5 11.5h17M9.5 11.5v2h5v-2"/></>
  ),
  about: (
    <><circle cx="12" cy="12" r="9"/><path d="M12 10.7v5.8M12 7.4h.01"/></>
  ),
  contact: (
    <><rect x="3" y="5" width="18" height="14" rx="2.4"/><path d="m4.2 7 7.8 6 7.8-6"/></>
  ),
}

const items = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Services', path: '/services', icon: 'services' },
  { label: 'Portfolio', path: '/portfolio', icon: 'portfolio' },
  { label: 'About', path: '/about', icon: 'about' },
  { label: 'Contact', path: '/contact', icon: 'contact' },
]

const MobileBottomNav = () => {
  const { pathname } = useLocation()
  const isActive = (path) => path === '/' ? pathname === '/' : pathname.startsWith(path)

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav__inner">
        {items.map((item) => {
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-bottom-nav__item${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="mobile-bottom-nav__active-surface" aria-hidden="true" />
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {icons[item.icon]}
              </svg>
              <span className="mobile-bottom-nav__label">{item.label}</span>
              <span className="mobile-bottom-nav__dot" aria-hidden="true" />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
