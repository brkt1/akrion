import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminIcon from '../components/admin/AdminIcons'
import PageMeta from '../components/PageMeta'
import { authAPI } from '../lib/api/auth'

const MIN_PASSWORD_LENGTH = 16

const getLinkError = () => {
  const search = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  return search.get('error_description') || hash.get('error_description') || ''
}

const AdminPasswordSetup = () => {
  const [mode, setMode] = useState('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)

  useEffect(() => {
    let mounted = true
    const linkError = getLinkError()

    const useSession = (session) => {
      if (!mounted) return
      if (session?.user) {
        setMode('password')
        setError('')
      } else {
        setMode('request')
        if (linkError) setError('This setup link is invalid or has expired. Request a fresh link below.')
      }
    }

    authAPI.getSession()
      .then(useSession)
      .catch(() => {
        if (mounted) {
          setMode('request')
          setError('The secure setup session could not be verified. Request a fresh link below.')
        }
      })

    const { data: { subscription } } = authAPI.onAuthStateChange((_event, session) => {
      useSession(session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const requestLink = async (event) => {
    event.preventDefault()
    setWorking(true)
    setError('')
    try {
      await authAPI.requestPasswordSetup(email.trim())
      setMode('sent')
    } catch (requestError) {
      if (requestError?.status === 429) {
        setError('Too many setup emails were requested. Wait a few minutes, then try again.')
      } else {
        setError('The setup email could not be sent. Check the address and try again.')
      }
    } finally {
      setWorking(false)
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setError('')

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`)
      return
    }
    if (password !== confirmation) {
      setError('The two passwords do not match.')
      return
    }

    setWorking(true)
    try {
      await authAPI.updatePassword(password)
      setPassword('')
      setConfirmation('')
      setMode('complete')
    } catch (updateError) {
      setError(updateError?.message || 'The password could not be saved. Request a fresh setup link and try again.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <>
      <PageMeta title="Set Admin Password | Akrion Digitals" description="Secure Akrion Content Studio account setup." path="/admin/setup-password" noIndex />
      <main className="admin-auth-page">
        <div className="admin-auth-pattern" aria-hidden="true" />
        <section className="admin-auth-card" aria-labelledby="admin-password-title">
          <Link to="/admin" className="admin-auth-back"><AdminIcon name="arrowDown" size={16} />Back to admin sign in</Link>
          <div className="admin-auth-mark" aria-hidden="true">AD</div>

          {mode === 'checking' && (
            <div className="admin-auth-loading" role="status"><span /><p>Verifying your secure setup link…</p></div>
          )}

          {mode === 'request' && (
            <>
              <p className="admin-page-eyebrow">Secure account setup</p>
              <h1 id="admin-password-title">Request a fresh link.</h1>
              <p>Enter your authorized admin email. Supabase will send a private link to set or reset your password.</p>
              {error && <p className="admin-auth-error" role="alert">{error}</p>}
              <form className="admin-auth-form" onSubmit={requestLink}>
                <label htmlFor="admin-setup-email"><span>Email address</span><input id="admin-setup-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={working} /></label>
                <button type="submit" className="admin-button" disabled={working}>{working ? 'Sending…' : 'Send secure setup link'}<AdminIcon name="chevron" size={17} /></button>
              </form>
              <p className="admin-auth-help">For security, the page does not reveal whether an email address belongs to an administrator.</p>
            </>
          )}

          {mode === 'sent' && (
            <>
              <p className="admin-page-eyebrow">Email sent</p>
              <h1 id="admin-password-title">Check your inbox.</h1>
              <p>Open the newest Akrion password email on this computer. The link will return you to this secure setup page.</p>
              <div className="admin-auth-security-note"><AdminIcon name="warning" /><span>Check the spam folder if it does not arrive. Use only the newest link; older links may expire.</span></div>
              <button type="button" className="admin-button" onClick={() => setMode('request')}>Send another link</button>
            </>
          )}

          {mode === 'password' && (
            <>
              <p className="admin-page-eyebrow">Secure account setup</p>
              <h1 id="admin-password-title">Create your password.</h1>
              <p>Choose a private password with at least {MIN_PASSWORD_LENGTH} characters. It is sent directly to Supabase and is never stored by this website.</p>
              {error && <p className="admin-auth-error" role="alert">{error}</p>}
              <form className="admin-auth-form" onSubmit={savePassword}>
                <label htmlFor="admin-new-password"><span>New password</span><input id="admin-new-password" name="password" type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} value={password} onChange={(event) => setPassword(event.target.value)} required disabled={working} /></label>
                <label htmlFor="admin-confirm-password"><span>Confirm new password</span><input id="admin-confirm-password" name="confirmation" type="password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required disabled={working} /></label>
                <button type="submit" className="admin-button" disabled={working}>{working ? 'Saving securely…' : 'Save password'}<AdminIcon name="chevron" size={17} /></button>
              </form>
            </>
          )}

          {mode === 'complete' && (
            <>
              <p className="admin-page-eyebrow">Setup complete</p>
              <h1 id="admin-password-title">Your password is ready.</h1>
              <p>The account is secured and authorized. You can now open the Akrion Content Studio.</p>
              <p className="admin-auth-success" role="status">Password saved successfully.</p>
              <Link className="admin-button admin-auth-primary-link" to="/admin">Open Content Studio<AdminIcon name="chevron" size={17} /></Link>
            </>
          )}
        </section>
      </main>
    </>
  )
}

export default AdminPasswordSetup
