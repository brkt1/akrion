import { useEffect, useRef } from 'react'
import AdminIcon from './AdminIcons'

export const AdminPageHeader = ({ eyebrow, title, description, actions }) => (
  <header className="admin-page-header">
    <div>
      {eyebrow && <p className="admin-page-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
    {actions && <div className="admin-page-actions">{actions}</div>}
  </header>
)

export const AdminNotice = ({ tone = 'info', title, children, actions }) => (
  <section className={`admin-notice admin-notice--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
    <span className="admin-notice-icon"><AdminIcon name={tone === 'success' ? 'check' : 'warning'} /></span>
    <div>
      <strong>{title}</strong>
      <div>{children}</div>
      {actions && <div className="admin-notice-actions">{actions}</div>}
    </div>
  </section>
)

export const AdminLoading = ({ label = 'Loading content…' }) => (
  <div className="admin-loading" role="status">
    <span aria-hidden="true" />
    <p>{label}</p>
  </div>
)

export const AdminEmpty = ({ icon = 'about', title, description }) => (
  <div className="admin-empty">
    <span><AdminIcon name={icon} size={24} /></span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
)

export const AdminStatusBadge = ({ status = 'published' }) => {
  const normalized = String(status || 'published').toLowerCase().replace(/\s+/g, '-')
  const label = normalized.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  return <span className={`admin-status-badge admin-status-badge--${normalized}`}><i />{label}</span>
}

export const AdminField = ({ label, htmlFor, help, error, required, optional, children }) => (
  <div className={`admin-field${error ? ' has-error' : ''}`}>
    <label htmlFor={htmlFor}>
      <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
      {optional && <small>Optional</small>}
    </label>
    {children}
    {help && !error && <p className="admin-field-help">{help}</p>}
    {error && <p className="admin-field-error" id={`${htmlFor}-error`} role="alert">{error}</p>}
  </div>
)

export const AdminConfirmDialog = ({ open, title, description, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) => {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    cancelRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="admin-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="admin-dialog" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" aria-describedby="admin-confirm-description">
        <span className={`admin-dialog-icon${danger ? ' is-danger' : ''}`}><AdminIcon name={danger ? 'trash' : 'warning'} /></span>
        <h2 id="admin-confirm-title">{title}</h2>
        <p id="admin-confirm-description">{description}</p>
        <div className="admin-dialog-actions">
          <button type="button" ref={cancelRef} className="admin-button admin-button--secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className={`admin-button${danger ? ' admin-button--danger' : ''}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  )
}

export const formatAdminDate = (value) => {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not recorded'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export const useUnsavedWarning = (dirty) => {
  useEffect(() => {
    if (!dirty) return undefined
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [dirty])
}
