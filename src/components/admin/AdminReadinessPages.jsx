import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../lib/api/admin'
import AdminIcon from './AdminIcons'
import { AdminNotice, AdminPageHeader } from './AdminUi'

const PAGE_CONFIGS = {
  homepage: {
    eyebrow: 'Homepage content',
    title: 'Homepage',
    description: 'The sections below match the redesigned homepage—removed pricing, team, and founder-story content is intentionally excluded.',
    publicPath: '/',
    groups: [
      { title: 'Hero', fields: ['Heading and supporting text', 'CTA labels and destinations', 'Showreel video', 'Rotating background images', 'Image order and visibility'] },
      { title: 'Who We Are', fields: ['Short introduction', 'Identity statement', 'Three impact statistics', 'Three values', 'Main image', 'Creative-process visual'] },
      { title: 'What We Do', fields: ['Five service categories', 'Titles and descriptions', 'Project images', 'Display order', 'Services-page links'] },
      { title: 'Selected Work', fields: ['Choose 4–6 featured projects', 'Main featured project', 'Homepage project order'] },
      { title: 'Testimonials', fields: ['Verified client identity', 'Quotation', 'Project image or logo', 'Verified result', 'Optional supplied rating', 'Show or hide'] },
      { title: 'Why Choose Us', fields: ['Four concise reasons', 'Related project visual', 'Verified before-and-after media'] },
    ],
  },
  about: {
    eyebrow: 'About-page content',
    title: 'About Page',
    description: 'Manage the visual story and brand thinking behind Akrion without adding team profiles or department cards.',
    publicPath: '/about',
    groups: [
      { title: 'About hero', fields: ['Hero heading', 'Short introduction', 'Supporting identity statement', 'Hero collage images'] },
      { title: 'Brand principles', fields: ['Three principles', 'Principle titles', 'Concise explanations'] },
      { title: 'How We Think', fields: ['Process stages', 'Rotating process images', 'Image order and visibility'] },
      { title: 'Closing content', fields: ['Mission statement', 'Final CTA label', 'Final CTA destination'] },
    ],
  },
}

const AdminPageReadiness = ({ page, capabilityReady = false }) => {
  const config = PAGE_CONFIGS[page]
  const [records, setRecords] = useState({})
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!capabilityReady) return
    adminAPI.getPageSections(page).then((rows) => {
      setRecords(Object.fromEntries(rows.map((row) => [row.section_key, row])))
    }).catch(() => setMessage('Page content could not be loaded.'))
  }, [capabilityReady, page])

  const keyFor = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  const beginEdit = (group) => {
    const sectionKey = keyFor(group.title)
    const stored = records[sectionKey]?.draft_content || records[sectionKey]?.published_content || {}
    setEditing(sectionKey)
    setForm(Object.fromEntries(group.fields.map((field) => [keyFor(field), stored[keyFor(field)] || ''])))
    setMessage('')
  }
  const publish = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const row = await adminAPI.publishPageSection(page, editing, form)
      setRecords((current) => ({ ...current, [editing]: row }))
      setEditing(null)
      setMessage('Content published successfully.')
    } catch { setMessage('Content could not be published. Check your connection and permissions.') }
    finally { setSaving(false) }
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        actions={(
          <Link to={config.publicPath} target="_blank" rel="noopener noreferrer" className="admin-button admin-button--secondary">
            <AdminIcon name="external" />
            View page
          </Link>
        )}
      />

      <AdminNotice tone={capabilityReady ? 'success' : 'warning'} title={capabilityReady ? 'Secure page editing is active' : 'This page is still code-managed'}>
        <p>
          {capabilityReady
            ? 'Content is stored in the protected page-section table. Saving below publishes the section through the shared CMS source.'
            : 'The current Supabase schema has no shared page-content table. These controls stay read-only so the dashboard never implies that an edit was saved when it was not.'}
        </p>
      </AdminNotice>
      {message && <AdminNotice tone={message.includes('success') ? 'success' : 'error'} title={message.includes('success') ? 'Published' : 'Unable to save'}><p>{message}</p></AdminNotice>}

      <div className="admin-content-groups">
        {config.groups.map((group) => (
          <section className="admin-content-group" key={group.title}>
            <div className="admin-content-group-heading">
              <span><AdminIcon name={page === 'homepage' ? 'home' : 'about'} /></span>
              <div><h3>{group.title}</h3><p>Ready for the shared CMS source.</p></div>
              <span className="admin-code-badge">{records[keyFor(group.title)]?.status === 'published' ? 'Published' : 'Ready'}</span>
            </div>
            <ul>
              {group.fields.map((field) => <li key={field}><AdminIcon name="check" size={15} />{field}</li>)}
            </ul>
            {editing === keyFor(group.title) ? (
              <form className="admin-section-inline-form" onSubmit={publish}>
                {group.fields.map((field) => {
                  const fieldKey = keyFor(field)
                  return <label key={fieldKey}><span>{field}</span><textarea rows="3" value={form[fieldKey] || ''} onChange={(event) => setForm((current) => ({ ...current, [fieldKey]: event.target.value }))} /></label>
                })}
                <div className="admin-content-group-actions"><button className="admin-button" type="submit" disabled={saving}>{saving ? 'Publishing…' : 'Save & publish'}</button><button className="admin-button admin-button--secondary" type="button" onClick={() => setEditing(null)}>Cancel</button></div>
              </form>
            ) : (
              <div className="admin-content-group-actions"><button type="button" className="admin-button admin-button--secondary" disabled={!capabilityReady} onClick={() => beginEdit(group)}>Edit content</button><small>{capabilityReady ? 'Secure CMS storage connected.' : 'Apply the secure content migration to enable editing.'}</small></div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

export const AdminHomepage = ({ capabilities }) => <AdminPageReadiness page="homepage" capabilityReady={capabilities?.pageContent} />
export const AdminAboutPage = ({ capabilities }) => <AdminPageReadiness page="about" capabilityReady={capabilities?.pageContent} />

export const AdminInquiries = () => (
  <div className="admin-page">
    <AdminPageHeader
      eyebrow="Contact workflow"
      title="Contact Inquiries"
      description="Track website project inquiries only when a submission has actually been stored."
      actions={<Link to="/contact" target="_blank" rel="noopener noreferrer" className="admin-button admin-button--secondary"><AdminIcon name="external" />View contact page</Link>}
    />
    <section className="admin-unavailable-panel">
      <span className="admin-unavailable-icon"><AdminIcon name="inquiries" size={30} /></span>
      <p className="admin-page-eyebrow">Storage not configured</p>
      <h3>Inquiries are currently unavailable.</h3>
      <p>The public contact form opens WhatsApp with a prefilled message. It does not submit or save the visitor’s details to the website backend, so there are no website inquiries to display here.</p>
      <div className="admin-unavailable-facts">
        <span><AdminIcon name="check" size={16} />No false “saved” claims</span>
        <span><AdminIcon name="check" size={16} />WhatsApp remains the live contact path</span>
        <span><AdminIcon name="warning" size={16} />Enable only after server-side storage and consent are configured</span>
      </div>
    </section>
  </div>
)

const SETTINGS = [
  ['WhatsApp number', '+251 97 660 1172'],
  ['Email address', 'akriondigitals@gmail.com'],
  ['Telegram handle', '@akriondigitals'],
  ['Instagram link', 'Footer configuration'],
  ['Location text', 'Addis Ababa, Ethiopia'],
  ['Public office / map', 'Not published'],
  ['Default SEO', 'Defined in the application'],
  ['Logo and favicon', 'Repository assets'],
]

export const AdminSiteSettings = ({ capabilities }) => {
  const defaults = Object.fromEntries(SETTINGS.map(([label, value]) => [label, value]))
  const [values, setValues] = useState(defaults)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!capabilities?.siteSettings) return
    adminAPI.getSiteSettings().then((rows) => setValues((current) => ({ ...current, ...Object.fromEntries(rows.map((row) => [row.setting_key, row.draft_value?.value ?? row.published_value?.value ?? ''])) }))).catch(() => setMessage('Settings could not be loaded.'))
  }, [capabilities?.siteSettings])

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage('')
    try { await adminAPI.publishSiteSettings(values); setEditing(false); setMessage('Settings published successfully.') }
    catch { setMessage('Settings could not be published.') }
    finally { setSaving(false) }
  }

  return (
  <div className="admin-page">
    <AdminPageHeader
      eyebrow="Brand and contact defaults"
      title="Site Settings"
      description="Keep contact details, SEO defaults, social links, and brand assets consistent across the site."
      actions={<Link to="/" target="_blank" rel="noopener noreferrer" className="admin-button admin-button--secondary"><AdminIcon name="external" />Open website</Link>}
    />
    <AdminNotice tone={capabilities?.siteSettings ? 'success' : 'warning'} title={capabilities?.siteSettings ? 'Secure settings editing is active' : 'Settings storage is unavailable'}>
      <p>{capabilities?.siteSettings ? 'Contact, social, SEO, and brand defaults can now be saved to the protected shared settings source.' : 'Apply the secure CMS migration to enable editing.'}</p>
    </AdminNotice>
    {message && <AdminNotice tone={message.includes('success') ? 'success' : 'error'} title={message.includes('success') ? 'Published' : 'Unable to save'}><p>{message}</p></AdminNotice>}
    <section className="admin-panel admin-settings-panel">
      <div className="admin-panel-header"><div><p>Current values</p><h3>Public site settings</h3></div><button className="admin-button admin-button--secondary" type="button" disabled={!capabilities?.siteSettings} onClick={() => setEditing((value) => !value)}>{editing ? 'Cancel' : 'Edit settings'}</button></div>
      {editing ? <form className="admin-settings-form" onSubmit={save}>{SETTINGS.map(([label]) => <label key={label}><span>{label}</span><input value={values[label] || ''} onChange={(event) => setValues((current) => ({ ...current, [label]: event.target.value }))} /></label>)}<button className="admin-button" type="submit" disabled={saving}>{saving ? 'Publishing…' : 'Save & publish settings'}</button></form> : <dl className="admin-settings-list">{SETTINGS.map(([label]) => <div key={label}><dt>{label}</dt><dd>{values[label]}</dd><button type="button" disabled={!capabilities?.siteSettings} onClick={() => setEditing(true)} aria-label={`Edit ${label}`}><AdminIcon name="edit" size={17} /></button></div>)}</dl>}
    </section>
  </div>
  )
}
