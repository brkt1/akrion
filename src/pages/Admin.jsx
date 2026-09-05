import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AdminBlog from '../components/admin/AdminBlog'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminIcon from '../components/admin/AdminIcons'
import AdminMedia from '../components/admin/AdminMedia'
import AdminPortfolio from '../components/admin/AdminPortfolio'
import {
  AdminAboutPage,
  AdminHomepage,
  AdminInquiries,
  AdminSiteSettings,
} from '../components/admin/AdminReadinessPages'
import AdminServices from '../components/admin/AdminServices'
import AdminTestimonials from '../components/admin/AdminTestimonials'
import AdminShell from '../components/admin/AdminShell'
import { AdminNotice } from '../components/admin/AdminUi'
import PageMeta from '../components/PageMeta'
import { adminAPI } from '../lib/api/admin'
import { authAPI } from '../lib/api/auth'
import { isSupabaseConfigured } from '../lib/supabase'

const DEFAULT_CAPABILITIES = {
  pageContent: false,
  advancedPortfolio: false,
  advancedBlog: false,
  advancedServices: false,
  mediaMetadata: false,
  siteSettings: false,
  inquiries: false,
  errors: [],
}

const AdminAuthScreen = ({ mode, error, loading, onSubmit, onSignOut, values, onChange, previewAvailable = false }) => (
  <main className="admin-auth-page">
    <div className="admin-auth-pattern" aria-hidden="true" />
    <section className="admin-auth-card" aria-labelledby="admin-auth-title">
      <Link to="/" className="admin-auth-back"><AdminIcon name="arrowDown" size={16} />Back to website</Link>
      <div className="admin-auth-mark" aria-hidden="true">AD</div>
      {mode === 'unauthorized' ? (
        <>
          <p className="admin-page-eyebrow">Protected workspace</p>
          <h1 id="admin-auth-title">Admin access is not enabled for this account.</h1>
          <p>Your sign-in is valid, but the account does not have the server-controlled admin role required to edit Akrion’s website.</p>
          <div className="admin-auth-security-note"><AdminIcon name="warning" /><span>An administrator must add the role through Supabase app metadata. Browser-editable profile metadata is never accepted.</span></div>
          {error && <p className="admin-auth-error" role="alert">{error}</p>}
          <button type="button" className="admin-button" onClick={onSignOut} disabled={loading}>{loading ? 'Signing out…' : 'Sign out and use another account'}</button>
          {previewAvailable && <Link to="/admin/preview" className="admin-auth-preview-link"><AdminIcon name="eye" size={16} />Preview the interface (read only)</Link>}
        </>
      ) : (
        <>
          <p className="admin-page-eyebrow">Akrion Content Studio</p>
          <h1 id="admin-auth-title">Manage the website.</h1>
          <p>Sign in with an authorized Akrion administrator account.</p>
          {error && <p className="admin-auth-error" role="alert">{error}</p>}
          <form onSubmit={onSubmit} className="admin-auth-form">
            <label htmlFor="admin-email"><span>Email address</span><input id="admin-email" name="email" type="email" autoComplete="username" value={values.email} onChange={onChange} required disabled={loading} /></label>
            <label htmlFor="admin-password"><span>Password</span><input id="admin-password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={onChange} required minLength="8" disabled={loading} /></label>
            <button type="submit" className="admin-button" disabled={loading}>{loading ? 'Signing in…' : 'Sign in securely'}<AdminIcon name="chevron" size={17} /></button>
          </form>
          <Link to="/admin/setup-password" className="admin-auth-reset-link">Set or reset your password</Link>
          <p className="admin-auth-help">No credentials are stored in the website code. Access is checked against the authenticated user’s protected role.</p>
          {previewAvailable && <Link to="/admin/preview" className="admin-auth-preview-link"><AdminIcon name="eye" size={16} />Preview the interface (read only)</Link>}
        </>
      )}
    </section>
  </main>
)

const AdminNotFound = () => (
  <div className="admin-page">
    <div className="admin-unavailable-panel">
      <span className="admin-unavailable-icon"><AdminIcon name="warning" size={30} /></span>
      <p className="admin-page-eyebrow">Not found</p>
      <h3>This admin page does not exist.</h3>
      <p>Use the sidebar to return to a managed website area.</p>
      <Link className="admin-button" to="/admin">Open Dashboard</Link>
    </div>
  </div>
)

const AdminConfigurationScreen = () => (
  <main className="admin-auth-page">
    <div className="admin-auth-pattern" aria-hidden="true" />
    <section className="admin-auth-card" aria-labelledby="admin-auth-title">
      <Link to="/" className="admin-auth-back"><AdminIcon name="arrowDown" size={16} />Back to website</Link>
      <div className="admin-auth-mark" aria-hidden="true">AD</div>
      <p className="admin-page-eyebrow">Configuration required</p>
      <h1 id="admin-auth-title">Admin sign-in is temporarily unavailable.</h1>
      <p>The website is online, but its secure content connection has not been configured for this deployment.</p>
      <div className="admin-auth-security-note">
        <AdminIcon name="warning" />
        <span>Add the Supabase URL and anonymous browser key to the deployment environment, then redeploy the site.</span>
      </div>
    </section>
  </main>
)

const Admin = () => {
  const location = useLocation()
  const isLocalPreview = import.meta.env.DEV && location.pathname === '/admin/preview'
  const [authState, setAuthState] = useState('loading')
  const [session, setSession] = useState(null)
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const [capabilities, setCapabilities] = useState(DEFAULT_CAPABILITIES)

  const evaluateSession = useCallback((nextSession) => {
    setSession(nextSession || null)
    if (!nextSession?.user) {
      setAuthState('signed-out')
      return
    }
    setAuthState(authAPI.isAdminUser(nextSession.user) ? 'authorized' : 'unauthorized')
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthState('configuration-error')
      return undefined
    }

    let mounted = true
    authAPI.getSession()
      .then((nextSession) => { if (mounted) evaluateSession(nextSession) })
      .catch(() => { if (mounted) { setError('The secure session could not be checked. Please try again.'); setAuthState('signed-out') } })

    const { data: { subscription } } = authAPI.onAuthStateChange((_event, nextSession) => {
      if (mounted) evaluateSession(nextSession)
    })
    return () => { mounted = false; subscription.unsubscribe() }
  }, [evaluateSession])

  useEffect(() => {
    if (authState !== 'authorized') return
    let active = true
    adminAPI.getCapabilities().then((nextCapabilities) => {
      if (active) setCapabilities(nextCapabilities)
    })
    return () => { active = false }
  }, [authState])

  const handleLogin = async (event) => {
    event.preventDefault()
    setWorking(true)
    setError('')
    try {
      const result = await authAPI.signIn(values.email.trim(), values.password)
      evaluateSession(result.session)
      setValues({ email: '', password: '' })
    } catch (loginError) {
      setError(loginError?.message === 'Invalid login credentials' ? 'The email or password is incorrect.' : 'Sign-in failed. Check your connection and try again.')
    } finally {
      setWorking(false)
    }
  }

  const handleSignOut = async () => {
    setWorking(true)
    setError('')
    try {
      await authAPI.signOut()
      evaluateSession(null)
    } catch {
      setError('Sign-out failed. Please try again.')
    } finally {
      setWorking(false)
    }
  }

  if (isLocalPreview) {
    return (
      <>
        <PageMeta title="Akrion Content Studio Preview" description="Read-only local preview of Akrion Digitals website administration." path="/admin/preview" noIndex />
        <AdminShell user={{ email: 'Local interface preview' }} onSignOut={() => {}} previewMode>
          <div className="admin-page">
            <AdminNotice tone="info" title="Read-only local interface preview">
              <p>This development-only view reads public content totals but cannot open editors or save changes. Apply the secure CMS migration and server-controlled admin role to use the protected workspace.</p>
            </AdminNotice>
            <AdminDashboard />
          </div>
        </AdminShell>
      </>
    )
  }

  if (!isSupabaseConfigured) {
    return (
      <>
        <PageMeta title="Admin Configuration Required | Akrion Digitals" description="Akrion Content Studio configuration status." path="/admin" noIndex />
        <AdminConfigurationScreen />
      </>
    )
  }

  return (
    <>
      <PageMeta title="Akrion Content Studio" description="Protected Akrion Digitals website administration." path="/admin" noIndex />
      {authState === 'loading' && <main className="admin-auth-page"><div className="admin-auth-loading" role="status"><span /><p>Checking secure access…</p></div></main>}
      {authState === 'signed-out' && <AdminAuthScreen mode="login" error={error} loading={working} onSubmit={handleLogin} values={values} onChange={(event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))} previewAvailable={import.meta.env.DEV} />}
      {authState === 'unauthorized' && <AdminAuthScreen mode="unauthorized" error={error} loading={working} onSignOut={handleSignOut} values={values} onChange={() => {}} previewAvailable={import.meta.env.DEV} />}
      {authState === 'authorized' && (
        <AdminShell user={session?.user} onSignOut={handleSignOut}>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="homepage" element={<AdminHomepage capabilities={capabilities} />} />
            <Route path="about" element={<AdminAboutPage capabilities={capabilities} />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="settings" element={<AdminSiteSettings capabilities={capabilities} />} />
            <Route path="dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<AdminNotFound />} />
          </Routes>
        </AdminShell>
      )}
    </>
  )
}

export default Admin
