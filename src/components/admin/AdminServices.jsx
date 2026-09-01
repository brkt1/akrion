import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { findServiceRecord, serviceStories } from '../../data/servicesContent'
import { adminAPI } from '../../lib/api/admin'
import { servicesAPI } from '../../lib/api/services'
import AdminIcon from './AdminIcons'
import { AdminField, AdminLoading, AdminNotice, AdminPageHeader, AdminStatusBadge, useUnsavedWarning } from './AdminUi'

const toForm = (story, record) => ({
  title: record?.title && !story.recordAliases.includes(String(record.title).trim().toLowerCase()) ? record.title : story.title,
  description: record?.description || story.description,
  number: record?.number || story.number,
  deliverables: Array.isArray(record?.deliverables) ? record.deliverables.join('\n') : story.included.join('\n'),
  mainImage: record?.main_image || '',
  status: record?.status || 'published',
})

const AdminServices = () => {
  const [records, setRecords] = useState([])
  const [advanced, setAdvanced] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(null)
  const [initialForm, setInitialForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [nextRecords, capabilities] = await Promise.all([
      servicesAPI.getAll().catch(() => []),
      adminAPI.getCapabilities(),
    ])
    setRecords(nextRecords)
    setAdvanced(Boolean(capabilities.advancedServices))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const dirty = Boolean(form && initialForm && JSON.stringify(form) !== JSON.stringify(initialForm))
  useUnsavedWarning(dirty)

  const beginEdit = (story) => {
    if (dirty && !window.confirm('Discard your unsaved service changes?')) return
    const nextForm = toForm(story, findServiceRecord(story, records))
    setEditingId(story.id)
    setForm(nextForm)
    setInitialForm(nextForm)
    setMessage(null)
  }

  const closeEditor = () => {
    if (dirty && !window.confirm('Discard your unsaved service changes?')) return
    setEditingId(null)
    setForm(null)
    setInitialForm(null)
  }

  const save = async (event) => {
    event.preventDefault()
    const story = serviceStories.find((item) => item.id === editingId)
    const record = findServiceRecord(story, records)
    if (!form.title.trim() || !form.description.trim()) return

    setSaving(true)
    setMessage(null)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        icon: record?.icon || story.recordIcon,
        advanced,
        slug: story.id,
        number: form.number.trim(),
        deliverables: form.deliverables.split('\n').map((item) => item.trim()).filter(Boolean),
        mainImage: form.mainImage.trim(),
        status: form.status,
        sortOrder: Number(story.number),
      }
      if (record) await servicesAPI.update(record.id, payload)
      else await servicesAPI.create(payload)
      await load()
      setInitialForm(form)
      setMessage({ type: 'success', text: `${story.title} was updated.` })
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'The service could not be saved. Check your admin permissions and try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Five public categories"
        title="Services Page"
        description="Manage the five redesigned service categories—without pricing tiers, packages, or fixed price tables."
        actions={<Link to="/services" target="_blank" rel="noopener noreferrer" className="admin-button admin-button--secondary"><AdminIcon name="external" />View page</Link>}
      />

      {!advanced && (
        <AdminNotice tone="info" title="Basic service editing is available">
          <p>Titles and descriptions save to the existing Supabase table and now feed the public Services page. Deliverables, images, ordering, and draft status unlock after the secure CMS migration is applied.</p>
        </AdminNotice>
      )}

      {message && <AdminNotice tone={message.type} title={message.type === 'success' ? 'Saved' : 'Unable to save'}><p>{message.text}</p></AdminNotice>}

      {loading ? <AdminLoading label="Loading service content…" /> : (
        <div className="admin-service-stack">
          {serviceStories.map((story) => {
            const record = findServiceRecord(story, records)
            const isEditing = editingId === story.id
            return (
              <section className={`admin-service-editor${isEditing ? ' is-editing' : ''}`} key={story.id}>
                <div className="admin-service-summary">
                  <span className="admin-service-number">{story.number}</span>
                  <img src={record?.main_image || story.image.small} alt="" width="120" height="80" />
                  <div>
                    <p>{story.id.replace(/-/g, ' ')}</p>
                    <h3>{record?.title && !story.recordAliases.includes(String(record.title).trim().toLowerCase()) ? record.title : story.title}</h3>
                    <span>{record?.description || story.description}</span>
                  </div>
                  <AdminStatusBadge status={record?.status || 'published'} />
                  <button type="button" className="admin-icon-button" onClick={() => isEditing ? closeEditor() : beginEdit(story)} aria-label={`${isEditing ? 'Close' : 'Edit'} ${story.title}`}>
                    <AdminIcon name={isEditing ? 'close' : 'edit'} />
                  </button>
                </div>

                {isEditing && form && (
                  <form className="admin-inline-editor" onSubmit={save}>
                    <div className="admin-form-grid admin-form-grid--two">
                      <AdminField label="Title" htmlFor={`service-${story.id}-title`} required>
                        <input id={`service-${story.id}-title`} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
                      </AdminField>
                      <AdminField label="Number" htmlFor={`service-${story.id}-number`} help={!advanced ? 'Requires the CMS migration.' : undefined}>
                        <input id={`service-${story.id}-number`} value={form.number} disabled={!advanced} onChange={(event) => setForm((current) => ({ ...current, number: event.target.value }))} />
                      </AdminField>
                    </div>
                    <AdminField label="Short description" htmlFor={`service-${story.id}-description`} required>
                      <textarea id={`service-${story.id}-description`} rows="3" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
                    </AdminField>
                    <div className="admin-form-grid admin-form-grid--two">
                      <AdminField label="Included deliverables" htmlFor={`service-${story.id}-deliverables`} help={!advanced ? 'Requires the CMS migration.' : 'One deliverable per line.'}>
                        <textarea id={`service-${story.id}-deliverables`} rows="5" value={form.deliverables} disabled={!advanced} onChange={(event) => setForm((current) => ({ ...current, deliverables: event.target.value }))} />
                      </AdminField>
                      <div className="admin-form-stack">
                        <AdminField label="Main image URL" htmlFor={`service-${story.id}-image`} help={!advanced ? 'Requires the CMS migration.' : undefined}>
                          <input id={`service-${story.id}-image`} type="url" value={form.mainImage} disabled={!advanced} onChange={(event) => setForm((current) => ({ ...current, mainImage: event.target.value }))} />
                        </AdminField>
                        <AdminField label="Status" htmlFor={`service-${story.id}-status`}>
                          <select id={`service-${story.id}-status`} value={form.status} disabled={!advanced} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
                            <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                          </select>
                        </AdminField>
                      </div>
                    </div>
                    <div className="admin-editor-actions">
                      <span>{dirty ? 'Unsaved changes' : 'No unsaved changes'}</span>
                      <button type="button" className="admin-button admin-button--secondary" onClick={closeEditor}>Cancel</button>
                      <button type="submit" className="admin-button" disabled={saving || !dirty}>{saving ? 'Saving…' : advanced ? 'Save service' : 'Save basic fields'}</button>
                    </div>
                  </form>
                )}
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminServices
