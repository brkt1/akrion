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
      { title: 'Hero', fields: ['Heading', 'Description', 'Primary button label', 'Primary button destination', 'Secondary button label', 'Secondary button destination', 'Supporting text', 'Showreel URL'], defaults: {
        heading: 'Built to Be Seen.', description: 'We help businesses build brands customers actually remember — with creativity, strategy, and evidence-backed results.', primary_button_label: 'See How We Grow Your Brand', primary_button_destination: '/portfolio', secondary_button_label: 'Book Free Strategy Call', secondary_button_destination: "https://wa.me/251976601172?text=Hi!%20I'd%20like%20a%20free%20strategy%20call%20to%20discuss%20my%20brand.", supporting_text: 'No commitment · 30-min call · Real results, not promises', showreel_url: '',
      } },
      { title: 'Who We Are', fields: ['Introduction', 'Identity heading', 'Identity description', 'Image URL', 'Image alternative text'], defaults: {
        introduction: 'Akrion Digitals is an Ethiopian creative and technology agency helping ambitious businesses build brands people remember, trust, and choose.', identity_heading: 'Rooted in Ethiopia.\nBuilt for global impact.', identity_description: 'We combine local insight, creative strategy, and technology to build brands that connect and grow.', image_url: '', image_alternative_text: '',
      } },
      { title: 'What We Do', fields: ['Five service categories', 'Titles and descriptions', 'Project images', 'Display order'], editorPath: '/admin/services' },
      { title: 'Selected Work', fields: ['Homepage featured projects', 'Main featured project', 'Display order'], editorPath: '/admin/portfolio' },
      { title: 'Testimonials', fields: ['Client identity and quotation', 'Portrait image', 'Verified result', 'Publish or archive'], editorPath: '/admin/testimonials' },
      { title: 'Why Choose Us', fields: ['Reason 1 title', 'Reason 1 description', 'Reason 2 title', 'Reason 2 description', 'Reason 3 title', 'Reason 3 description', 'Reason 4 title', 'Reason 4 description'], defaults: {
        reason_1_title: 'STRATEGY BEFORE DECORATION', reason_1_description: 'Every creative decision begins with your business, your audience, and the outcome you want to achieve.', reason_2_title: 'ONE CONNECTED TEAM', reason_2_description: 'Branding, websites, applications, social media, video, and motion—planned and executed as one connected experience.', reason_3_title: 'CULTURAL INSIGHT, GLOBAL STANDARD', reason_3_description: 'We bring an Ethiopian and African perspective to work designed to communicate confidently across markets and cultures.', reason_4_title: 'CREATIVITY BUILT TO PERFORM', reason_4_description: 'We create work that does more than attract attention. It builds clarity, trust, action, and sustainable growth.',
      } },
    ],
  },
  about: {
    eyebrow: 'About-page content',
    title: 'About Page',
    description: 'Manage the visual story and brand thinking behind Akrion without adding team profiles or department cards.',
    publicPath: '/about',
    groups: [
      { title: 'About hero', fields: ['Heading', 'Introduction', 'Identity statement'], defaults: { heading: 'ABOUT.', introduction: 'Akrion Digitals is an Ethiopian creative and technology agency turning ideas into brands, digital experiences, and stories people remember.', identity_statement: 'Rooted in Addis Ababa. Created for impact everywhere.' } },
      { title: 'Brand principles', fields: ['Principle 1 title', 'Principle 1 description', 'Principle 2 title', 'Principle 2 description', 'Principle 3 title', 'Principle 3 description'], defaults: { principle_1_title: 'Think With Purpose', principle_1_description: 'Every idea begins with a clear goal.', principle_2_title: 'Create With Character', principle_2_description: 'We combine cultural insight with original thinking.', principle_3_title: 'Build for Impact', principle_3_description: 'Our work is designed to connect, perform, and grow.' } },
      { title: 'How We Think', fields: ['Heading', 'Description'], defaults: { heading: 'Strategy gives creativity direction.', description: 'We understand the challenge, shape the idea, create the experience, and refine it until it works.' } },
      { title: 'Closing content', fields: ['Mission statement', 'Heading', 'Final CTA label', 'Final CTA destination'], defaults: { mission_statement: 'To help ambitious businesses become clearer, stronger, and more memorable through creativity and technology.', heading: 'Let’s create something meaningful.', final_cta_label: 'Start a Project', final_cta_destination: '/contact' } },
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
    setForm(Object.fromEntries(group.fields.map((field) => [keyFor(field), stored[keyFor(field)] ?? group.defaults?.[keyFor(field)] ?? ''])))
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
              <div><h3>{group.title}</h3><p>{group.editorPath ? 'Managed in the shared content collection.' : 'Published edits appear on the public page.'}</p></div>
              <span className="admin-code-badge">{records[keyFor(group.title)]?.status === 'published' ? 'Published' : 'Ready'}</span>
            </div>
            <ul>
              {group.fields.map((field) => <li key={field}><AdminIcon name="check" size={15} />{field}</li>)}
            </ul>
            {group.editorPath ? (
              <div className="admin-content-group-actions"><Link className="admin-button admin-button--secondary" to={group.editorPath}>Manage {group.title}</Link></div>
            ) : editing === keyFor(group.title) ? (
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
  ['Instagram link', 'https://instagram.com'],
  ['TikTok link', 'https://tiktok.com'],
  ['YouTube link', 'https://youtube.com'],
  ['LinkedIn link', 'https://linkedin.com'],
  ['Facebook link', 'https://facebook.com'],
  ['Location text', 'Addis Ababa, Ethiopia'],
  ['CEO name', 'Hailemichael Melaku'],
  ['Logo URL', ''],
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
      description="Keep contact details, social links, and the website logo consistent across the site."
      actions={<Link to="/" target="_blank" rel="noopener noreferrer" className="admin-button admin-button--secondary"><AdminIcon name="external" />Open website</Link>}
    />
    <AdminNotice tone={capabilities?.siteSettings ? 'success' : 'warning'} title={capabilities?.siteSettings ? 'Secure settings editing is active' : 'Settings storage is unavailable'}>
      <p>{capabilities?.siteSettings ? 'Published contact details, footer social links, and the header/footer logo use this protected shared settings source.' : 'Apply the secure CMS migration to enable editing.'}</p>
    </AdminNotice>
    {message && <AdminNotice tone={message.includes('success') ? 'success' : 'error'} title={message.includes('success') ? 'Published' : 'Unable to save'}><p>{message}</p></AdminNotice>}
    <section className="admin-panel admin-settings-panel">
      <div className="admin-panel-header"><div><p>Current values</p><h3>Public site settings</h3></div><button className="admin-button admin-button--secondary" type="button" disabled={!capabilities?.siteSettings} onClick={() => setEditing((value) => !value)}>{editing ? 'Cancel' : 'Edit settings'}</button></div>
      {editing ? <form className="admin-settings-form" onSubmit={save}>{SETTINGS.map(([label]) => <label key={label}><span>{label}</span><input value={values[label] || ''} onChange={(event) => setValues((current) => ({ ...current, [label]: event.target.value }))} /></label>)}<button className="admin-button" type="submit" disabled={saving}>{saving ? 'Publishing…' : 'Save & publish settings'}</button></form> : <dl className="admin-settings-list">{SETTINGS.map(([label]) => <div key={label}><dt>{label}</dt><dd>{values[label]}</dd><button type="button" disabled={!capabilities?.siteSettings} onClick={() => setEditing(true)} aria-label={`Edit ${label}`}><AdminIcon name="edit" size={17} /></button></div>)}</dl>}
    </section>
  </div>
  )
}
