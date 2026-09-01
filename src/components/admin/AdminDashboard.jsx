import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../lib/api/admin'
import AdminIcon from './AdminIcons'
import { AdminEmpty, AdminLoading, AdminNotice, AdminPageHeader, AdminStatusBadge, formatAdminDate } from './AdminUi'

const DEFAULT_OVERVIEW = {
  stats: { projects: 0, publishedPosts: 0, drafts: 0, inquiries: null, missingMedia: 0 },
  recent: [],
  errors: [],
}

const STAT_CARDS = [
  { key: 'projects', label: 'Portfolio projects', icon: 'portfolio', path: '/admin/portfolio' },
  { key: 'publishedPosts', label: 'Published blog posts', icon: 'blog', path: '/admin/blog' },
  { key: 'drafts', label: 'Draft content', icon: 'edit', path: '/admin/blog?status=draft' },
  { key: 'inquiries', label: 'New inquiries', icon: 'inquiries', path: '/admin/inquiries' },
  { key: 'missingMedia', label: 'Missing images', icon: 'media', path: '/admin/media' },
]

const QUICK_ACTIONS = [
  { label: 'Add Project', description: 'Create a portfolio entry', icon: 'plus', path: '/admin/portfolio?new=1' },
  { label: 'Write Blog Post', description: 'Start a new article', icon: 'edit', path: '/admin/blog?new=1' },
  { label: 'Edit Homepage', description: 'Review managed sections', icon: 'home', path: '/admin/homepage' },
  { label: 'View Inquiries', description: 'Check submission setup', icon: 'inquiries', path: '/admin/inquiries' },
]

const getRecentPath = (item) => {
  if (item.type === 'project') return `/admin/portfolio?edit=${item.recordId}`
  if (item.type === 'post') return `/admin/blog?edit=${item.recordId}`
  if (item.type === 'service') return '/admin/services'
  return '/admin/homepage'
}

const AdminDashboard = () => {
  const [overview, setOverview] = useState(DEFAULT_OVERVIEW)
  const [capabilities, setCapabilities] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [nextOverview, nextCapabilities] = await Promise.all([
      adminAPI.getOverview(),
      adminAPI.getCapabilities(),
    ])
    setOverview(nextOverview)
    setCapabilities(nextCapabilities)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="admin-page admin-dashboard-page">
      <AdminPageHeader
        eyebrow="Website overview"
        title="Good to see you."
        description="Manage Akrion’s public content from one practical workspace."
        actions={(
          <button type="button" className="admin-button admin-button--secondary" onClick={load} disabled={loading}>
            <AdminIcon name="refresh" />
            Refresh
          </button>
        )}
      />

      <AdminNotice tone="warning" title="Security migration required before production editing">
        <p>The current Supabase setup contains legacy public-write policies. This dashboard stays honest about unsupported workflows; apply the included secure CMS migration and rotate the exposed legacy password before relying on production administration.</p>
      </AdminNotice>

      {loading ? <AdminLoading label="Reading the current website content…" /> : (
        <>
          {overview.errors.length > 0 && (
            <AdminNotice tone="error" title="Some content could not be loaded">
              <p>The dashboard is showing the data that is currently available. Check the Supabase connection and policies before editing.</p>
            </AdminNotice>
          )}

          <section className="admin-stats-grid" aria-label="Website content totals">
            {STAT_CARDS.map((card) => {
              const value = overview.stats[card.key]
              return (
                <Link className="admin-stat-card" to={card.path} key={card.key}>
                  <span className="admin-stat-icon"><AdminIcon name={card.icon} /></span>
                  <span className="admin-stat-value">{value == null ? '—' : value}</span>
                  <span className="admin-stat-label">{card.label}</span>
                  {card.key === 'inquiries' && value == null && <small>Not stored</small>}
                </Link>
              )
            })}
          </section>

          <div className="admin-dashboard-grid">
            <section className="admin-panel admin-dashboard-recent">
              <div className="admin-panel-header">
                <div>
                  <p>Activity</p>
                  <h3>Recently updated</h3>
                </div>
              </div>
              {overview.recent.length ? (
                <div className="admin-recent-list">
                  {overview.recent.map((item) => (
                    <Link to={getRecentPath(item)} key={item.id} className="admin-recent-item">
                      <span className={`admin-recent-icon admin-recent-icon--${item.type}`}><AdminIcon name={item.type === 'project' ? 'portfolio' : item.type === 'post' ? 'blog' : item.type === 'service' ? 'services' : 'home'} /></span>
                      <span className="admin-recent-copy">
                        <strong>{item.title}</strong>
                        <small>{item.type} · Updated {formatAdminDate(item.updatedAt)}</small>
                      </span>
                      <AdminStatusBadge status={item.status} />
                    </Link>
                  ))}
                </div>
              ) : (
                <AdminEmpty icon="refresh" title="No recent updates" description="Updated projects, posts, and services will appear here." />
              )}
            </section>

            <section className="admin-panel admin-dashboard-actions">
              <div className="admin-panel-header">
                <div>
                  <p>Shortcuts</p>
                  <h3>Quick actions</h3>
                </div>
              </div>
              <div className="admin-quick-actions">
                {QUICK_ACTIONS.map((action) => (
                  <Link to={action.path} className="admin-quick-action" key={action.label}>
                    <span><AdminIcon name={action.icon} /></span>
                    <span><strong>{action.label}</strong><small>{action.description}</small></span>
                    <AdminIcon name="chevron" size={16} />
                  </Link>
                ))}
                <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-quick-action">
                  <span><AdminIcon name="external" /></span>
                  <span><strong>Open Website</strong><small>View the public site</small></span>
                  <AdminIcon name="chevron" size={16} />
                </Link>
              </div>
            </section>
          </div>

          <section className="admin-panel admin-readiness-panel">
            <div className="admin-panel-header">
              <div>
                <p>CMS readiness</p>
                <h3>What can be managed now</h3>
              </div>
              <span className="admin-readiness-count">
                {capabilities ? Object.entries(capabilities).filter(([key, value]) => key !== 'errors' && value === true).length : 0} advanced areas ready
              </span>
            </div>
            <div className="admin-readiness-grid">
              {[
                ['Portfolio', true, 'Basic project fields and images use the existing database.'],
                ['Blog', true, 'Basic articles and featured images use the existing database.'],
                ['Media library', true, 'Current Supabase image inventory is available read-only.'],
                ['Services', Boolean(capabilities?.advancedServices), capabilities?.advancedServices ? 'Extended service fields are ready.' : 'Legacy records exist; the redesigned page is still code-managed.'],
                ['Homepage & About', Boolean(capabilities?.pageContent), capabilities?.pageContent ? 'Page-section storage is available.' : 'Shared page-content storage is not configured.'],
                ['Inquiries', false, 'The public form opens WhatsApp and does not save submissions.'],
              ].map(([label, ready, description]) => (
                <div className="admin-readiness-item" key={label}>
                  <span className={ready ? 'is-ready' : 'is-pending'}><AdminIcon name={ready ? 'check' : 'warning'} size={16} /></span>
                  <div><strong>{label}</strong><p>{description}</p></div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default AdminDashboard
