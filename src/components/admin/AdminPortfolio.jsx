import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProjectPath, mergePortfolioRecords, slugifyProjectTitle } from '../../data/portfolioProjects'
import { adminAPI } from '../../lib/api/admin'
import { portfolioAPI } from '../../lib/api/portfolio'
import { uploadAPI } from '../../lib/api/upload'
import AdminIcon from './AdminIcons'
import {
  AdminConfirmDialog,
  AdminEmpty,
  AdminField,
  AdminLoading,
  AdminNotice,
  AdminPageHeader,
  AdminStatusBadge,
  formatAdminDate,
  useUnsavedWarning,
} from './AdminUi'

const EMPTY_PROJECT = {
  title: '', slug: '', clientName: '', category: '', tags: '', industry: '', year: '',
  cardDescription: '', summary: '', challenge: '', understand: '', create: '', deliver: '',
  workDelivered: '', services: '', result: '', metrics: '', testimonialQuote: '',
  testimonialName: '', testimonialRole: '', testimonialOrganization: '', image: '', altText: '',
  imageCaption: '', gallery: '', videoUrl: '', link: '', seoTitle: '', seoDescription: '',
  status: 'draft', featured: false, homepageFeatured: false, sortOrder: 0,
}

const toForm = (record = {}) => ({
  ...EMPTY_PROJECT,
  title: record.title || '',
  slug: record.slug || slugifyProjectTitle(record.title || ''),
  clientName: record.client_name || '',
  category: record.category || '',
  tags: Array.isArray(record.tags) ? record.tags.join(', ') : record.tags || '',
  industry: record.industry || '',
  year: record.project_year || '',
  cardDescription: record.card_description || record.description || '',
  summary: record.project_summary || '',
  challenge: record.challenge || record.problem || '',
  understand: record.approach?.understand || record.approach_understand || '',
  create: record.approach?.create || record.approach_create || '',
  deliver: record.approach?.deliver || record.approach_deliver || '',
  workDelivered: record.work_delivered || '',
  services: Array.isArray(record.services) ? record.services.join(', ') : record.services || '',
  result: record.result || '',
  metrics: Array.isArray(record.metrics)
    ? record.metrics.map((metric) => `${metric.label || ''}: ${metric.value || ''}`.trim()).join('\n')
    : '',
  testimonialQuote: record.testimonial_quote || '',
  testimonialName: record.testimonial_name || '',
  testimonialRole: record.testimonial_role || '',
  testimonialOrganization: record.testimonial_organization || '',
  image: record.featured_image || record.image || '',
  altText: record.alt_text || record.image_alt || '',
  imageCaption: record.image_caption || '',
  gallery: Array.isArray(record.gallery) ? record.gallery.map((item) => item.url || item.src || '').filter(Boolean).join('\n') : '',
  videoUrl: record.video_url || '',
  link: record.link || '',
  seoTitle: record.seo_title || '',
  seoDescription: record.seo_description || '',
  status: record.status || 'published',
  featured: Boolean(record.featured),
  homepageFeatured: Boolean(record.homepage_featured),
  sortOrder: record.sort_order ?? 0,
})

const parseMetrics = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
  const [label, ...rest] = line.split(':')
  return { label: label.trim(), value: rest.join(':').trim() }
}).filter((metric) => metric.label && metric.value)

const getUniqueProjectSlug = (value, records) => {
  const root = slugifyProjectTitle(value)
  const existing = new Set(records.map((record) => String(record.slug || '').toLowerCase()).filter(Boolean))
  if (!existing.has(root)) return root
  let suffix = 2
  while (existing.has(`${root}-${suffix}`)) suffix += 1
  return `${root}-${suffix}`
}

const buildPayload = (form, advanced) => ({
  ...form,
  advanced,
  description: form.cardDescription,
  tags: form.tags,
  approach: { understand: form.understand.trim(), create: form.create.trim(), deliver: form.deliver.trim() },
  metrics: parseMetrics(form.metrics),
  gallery: form.gallery.split('\n').map((url) => url.trim()).filter(Boolean).map((url) => ({ url })),
})

const validateProject = (form, records, editingId, advanced) => {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Enter a project title.'
  if (!form.category.trim()) errors.category = 'Choose a primary category.'
  if (!form.cardDescription.trim()) errors.cardDescription = 'Add a concise card description.'
  if (advanced && !form.slug.trim()) errors.slug = 'Enter a URL slug.'
  if (advanced && records.some((record) => record.id !== editingId && record.slug === form.slug.trim())) errors.slug = 'This slug is already in use.'
  if (form.link && !/^https?:\/\//i.test(form.link)) errors.link = 'Use a complete http:// or https:// URL.'
  if (form.videoUrl && !/^https?:\/\//i.test(form.videoUrl)) errors.videoUrl = 'Use a complete http:// or https:// URL.'
  if (form.tags.split(',').map((tag) => tag.trim()).filter(Boolean).length > 2) errors.tags = 'Use no more than two visible supporting tags.'
  if ((form.testimonialQuote && !form.testimonialName) || (!form.testimonialQuote && form.testimonialName)) errors.testimonialQuote = 'A verified quotation and client name are both required.'
  return errors
}

const AdminPortfolio = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [records, setRecords] = useState([])
  const [advanced, setAdvanced] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(null)
  const [initialForm, setInitialForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [deleteRecord, setDeleteRecord] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    const [nextRecords, capabilities] = await Promise.all([
      portfolioAPI.getAll().catch(() => []),
      adminAPI.getCapabilities(),
    ])
    setRecords(nextRecords)
    setAdvanced(Boolean(capabilities.advancedPortfolio))
    setLoading(false)
    return nextRecords
  }, [])

  useEffect(() => { load() }, [load])

  const mergedProjects = useMemo(() => mergePortfolioRecords(records), [records])
  const previewByRecordId = useMemo(() => new Map(mergedProjects.filter((project) => project.sourceRecord).map((project) => [String(project.sourceRecord.id), getProjectPath(project)])), [mergedProjects])
  const categories = useMemo(() => [...new Set(records.map((record) => record.category).filter(Boolean))].sort(), [records])
  const dirty = Boolean(form && initialForm && JSON.stringify(form) !== JSON.stringify(initialForm))
  useUnsavedWarning(dirty)

  const openEditor = useCallback((record = null, preset = null) => {
    const nextForm = preset || (record ? toForm(record) : EMPTY_PROJECT)
    setEditingId(record?.id || 'new')
    setForm(nextForm)
    setInitialForm(nextForm)
    setErrors({})
    setNotice(null)
    const params = new URLSearchParams(searchParams)
    params.delete('new')
    params.delete('edit')
    if (record) params.set('edit', record.id)
    else params.set('new', '1')
    setSearchParams(params, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (loading || editingId) return
    if (searchParams.get('new') === '1') openEditor()
    const editId = searchParams.get('edit')
    if (editId) {
      const record = records.find((item) => String(item.id) === editId)
      if (record) openEditor(record)
    }
  }, [editingId, loading, openEditor, records, searchParams])

  const closeEditor = () => {
    if (dirty && !window.confirm('Discard your unsaved project changes?')) return
    setEditingId(null)
    setForm(null)
    setInitialForm(null)
    setErrors({})
    setSearchParams({}, { replace: true })
  }

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  const save = async (event) => {
    event.preventDefault()
    const nextErrors = validateProject(form, records, editingId === 'new' ? null : editingId, advanced)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      document.getElementById(`project-${Object.keys(nextErrors)[0]}`)?.focus()
      return
    }

    setSaving(true)
    setNotice(null)
    try {
      const payload = buildPayload(form, advanced)
      const saved = editingId === 'new'
        ? await portfolioAPI.create(payload)
        : await portfolioAPI.update(editingId, payload)
      await load()
      const savedForm = toForm(saved)
      setEditingId(saved.id)
      setForm(savedForm)
      setInitialForm(savedForm)
      setSearchParams({ edit: String(saved.id) }, { replace: true })
      setNotice({ type: 'success', text: advanced ? 'Project saved with its current workflow status.' : 'Basic project fields saved. Advanced case-study fields remain unavailable until the CMS migration is applied.' })
    } catch (error) {
      console.error(error)
      setNotice({ type: 'error', text: 'The project could not be saved. Check your admin permissions and try again.' })
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((current) => ({ ...current, image: 'Use a JPEG, PNG, or WebP image.' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({ ...current, image: 'Images must be 5 MB or smaller.' }))
      return
    }
    setUploading(true)
    try {
      const url = await uploadAPI.uploadImage(file, 'portfolio')
      updateField('image', url)
    } catch (error) {
      console.error(error)
      setErrors((current) => ({ ...current, image: 'Upload failed. Check storage permissions and try again.' }))
    } finally {
      setUploading(false)
    }
  }

  const duplicate = (record) => {
    const copy = {
      ...toForm(record),
      title: `${record.title || 'Untitled project'} Copy`,
      slug: getUniqueProjectSlug(`${record.slug || slugifyProjectTitle(record.title)}-copy`, records),
      status: advanced ? 'draft' : 'published',
      featured: false,
      homepageFeatured: false,
    }
    openEditor(null, copy)
    setInitialForm(EMPTY_PROJECT)
    setNotice({
      type: advanced ? 'success' : 'warning',
      text: advanced
        ? 'A draft copy is ready for review. It has not been saved yet.'
        : 'A copy is ready for review. The legacy schema publishes it when saved because draft storage is unavailable.',
    })
  }

  const archive = async (record) => {
    if (!advanced) return
    try {
      await portfolioAPI.update(record.id, buildPayload({ ...toForm(record), status: 'archived' }, true))
      await load()
      setNotice({ type: 'success', text: 'Project archived.' })
    } catch (error) {
      console.error(error)
      setNotice({ type: 'error', text: 'The project could not be archived.' })
    }
  }

  const confirmDelete = async () => {
    const record = deleteRecord
    setDeleteRecord(null)
    try {
      await portfolioAPI.delete(record.id)
      await load()
      setNotice({ type: 'success', text: 'Project permanently deleted. Bundled fallback projects may still appear publicly until all content is migrated.' })
    } catch (error) {
      console.error(error)
      setNotice({ type: 'error', text: 'The project could not be deleted.' })
    }
  }

  const filtered = records.filter((record) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [record.title, record.description, record.category].some((value) => String(value || '').toLowerCase().includes(query))
    const matchesCategory = category === 'all' || record.category === category
    const recordStatus = record.status || 'published'
    return matchesSearch && matchesCategory && (status === 'all' || recordStatus === status)
  })

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Case-study library"
        title="Portfolio"
        description="Manage public projects, their case-study content, images, status, and homepage visibility."
        actions={<button type="button" className="admin-button" onClick={() => openEditor()}><AdminIcon name="plus" />Add Project</button>}
      />

      {!advanced && <AdminNotice tone="warning" title="Advanced case-study fields need the CMS migration"><p>Basic project content and one image save now. Drafts, custom slugs, galleries, verified results, testimonials, SEO, ordering, and archive controls stay disabled so nothing appears persistent when it is not.</p></AdminNotice>}
      {notice && <AdminNotice tone={notice.type} title={notice.type === 'success' ? 'Portfolio updated' : notice.type === 'warning' ? 'Review before saving' : 'Unable to update portfolio'}><p>{notice.text}</p></AdminNotice>}

      {editingId && form ? (
        <form className="admin-editor" onSubmit={save}>
          <header className="admin-editor-header">
            <div><p className="admin-page-eyebrow">{editingId === 'new' ? 'New project' : 'Project editor'}</p><h3>{form.title || 'Untitled project'}</h3><span>{dirty ? 'Unsaved changes' : 'All current changes saved'}</span></div>
            <div><button type="button" className="admin-button admin-button--secondary" onClick={closeEditor}>Close</button><button type="submit" className="admin-button" disabled={saving || uploading || !dirty}>{saving ? 'Saving…' : advanced && form.status === 'published' ? 'Update project' : 'Save changes'}</button></div>
          </header>

          <div className="admin-editor-layout">
            <div className="admin-editor-main">
              <section className="admin-editor-section">
                <div className="admin-editor-section-heading"><span>01</span><div><h4>Project basics</h4><p>Content used by the Portfolio grid and URL.</p></div></div>
                <div className="admin-form-grid admin-form-grid--two">
                  <AdminField label="Project title" htmlFor="project-title" required error={errors.title}><input id="project-title" value={form.title} onChange={(event) => updateField('title', event.target.value)} required aria-invalid={Boolean(errors.title)} /></AdminField>
                  <AdminField label="URL slug" htmlFor="project-slug" required={advanced} error={errors.slug} help={!advanced ? 'Stable custom slugs require the CMS migration.' : 'Lowercase words separated by hyphens.'}><input id="project-slug" value={form.slug} disabled={!advanced} onChange={(event) => updateField('slug', slugifyProjectTitle(event.target.value))} aria-invalid={Boolean(errors.slug)} /></AdminField>
                  <AdminField label="Client name" htmlFor="project-clientName" optional help={!advanced ? 'Requires the CMS migration.' : 'Leave empty when not verified.'}><input id="project-clientName" value={form.clientName} disabled={!advanced} onChange={(event) => updateField('clientName', event.target.value)} /></AdminField>
                  <AdminField label="Primary category" htmlFor="project-category" required error={errors.category}><input id="project-category" value={form.category} onChange={(event) => updateField('category', event.target.value)} required aria-invalid={Boolean(errors.category)} /></AdminField>
                  <AdminField label="Supporting tags" htmlFor="project-tags" error={errors.tags} help="Maximum two, separated by commas."><input id="project-tags" value={form.tags} onChange={(event) => updateField('tags', event.target.value)} aria-invalid={Boolean(errors.tags)} /></AdminField>
                  <AdminField label="Industry" htmlFor="project-industry" optional help={!advanced ? 'Requires the CMS migration.' : undefined}><input id="project-industry" value={form.industry} disabled={!advanced} onChange={(event) => updateField('industry', event.target.value)} /></AdminField>
                  <AdminField label="Year" htmlFor="project-year" optional help={!advanced ? 'Requires the CMS migration.' : 'Publish only when verified.'}><input id="project-year" value={form.year} disabled={!advanced} onChange={(event) => updateField('year', event.target.value)} /></AdminField>
                  <AdminField label="External live-project URL" htmlFor="project-link" optional error={errors.link}><input id="project-link" type="url" value={form.link} onChange={(event) => updateField('link', event.target.value)} aria-invalid={Boolean(errors.link)} placeholder="https://" /></AdminField>
                </div>
                <AdminField label="Short card description" htmlFor="project-cardDescription" required error={errors.cardDescription}><textarea id="project-cardDescription" rows="3" value={form.cardDescription} onChange={(event) => updateField('cardDescription', event.target.value)} required aria-invalid={Boolean(errors.cardDescription)} /></AdminField>
                <AdminField label="Full project summary" htmlFor="project-summary" optional help={!advanced ? 'Requires the CMS migration.' : 'This leads the case-study page.'}><textarea id="project-summary" rows="4" value={form.summary} disabled={!advanced} onChange={(event) => updateField('summary', event.target.value)} /></AdminField>
              </section>

              <fieldset className="admin-editor-section" disabled={!advanced}>
                <div className="admin-editor-section-heading"><span>02</span><div><h4>Case-study story</h4><p>Optional sections hide automatically when empty.</p></div>{!advanced && <span className="admin-locked-badge">Migration required</span>}</div>
                <AdminField label="Challenge" htmlFor="project-challenge" optional><textarea id="project-challenge" rows="4" value={form.challenge} onChange={(event) => updateField('challenge', event.target.value)} /></AdminField>
                <div className="admin-form-grid admin-form-grid--three">
                  <AdminField label="Understand" htmlFor="project-understand" optional><textarea id="project-understand" rows="4" value={form.understand} onChange={(event) => updateField('understand', event.target.value)} /></AdminField>
                  <AdminField label="Create" htmlFor="project-create" optional><textarea id="project-create" rows="4" value={form.create} onChange={(event) => updateField('create', event.target.value)} /></AdminField>
                  <AdminField label="Deliver" htmlFor="project-deliver" optional><textarea id="project-deliver" rows="4" value={form.deliver} onChange={(event) => updateField('deliver', event.target.value)} /></AdminField>
                </div>
                <div className="admin-form-grid admin-form-grid--two">
                  <AdminField label="Work delivered" htmlFor="project-workDelivered" optional><textarea id="project-workDelivered" rows="4" value={form.workDelivered} onChange={(event) => updateField('workDelivered', event.target.value)} /></AdminField>
                  <AdminField label="Services" htmlFor="project-services" optional help="Comma-separated"><textarea id="project-services" rows="4" value={form.services} onChange={(event) => updateField('services', event.target.value)} /></AdminField>
                </div>
              </fieldset>

              <fieldset className="admin-editor-section admin-verification-section" disabled={!advanced}>
                <div className="admin-editor-section-heading"><span>03</span><div><h4>Result and testimonial</h4><p>Optional proof shown only when authentic.</p></div>{!advanced && <span className="admin-locked-badge">Migration required</span>}</div>
                <AdminNotice tone="warning" title="Publish only verified client information."><p>Do not invent metrics, outcomes, quotation text, client names, roles, or ratings.</p></AdminNotice>
                <AdminField label="Result" htmlFor="project-result" optional><textarea id="project-result" rows="4" value={form.result} onChange={(event) => updateField('result', event.target.value)} /></AdminField>
                <AdminField label="Verified metrics" htmlFor="project-metrics" optional help="One per line in Label: Value format."><textarea id="project-metrics" rows="4" value={form.metrics} onChange={(event) => updateField('metrics', event.target.value)} /></AdminField>
                <AdminField label="Verified testimonial" htmlFor="project-testimonialQuote" optional error={errors.testimonialQuote}><textarea id="project-testimonialQuote" rows="4" value={form.testimonialQuote} onChange={(event) => updateField('testimonialQuote', event.target.value)} /></AdminField>
                <div className="admin-form-grid admin-form-grid--three">
                  <AdminField label="Client name" htmlFor="project-testimonialName" optional><input id="project-testimonialName" value={form.testimonialName} onChange={(event) => updateField('testimonialName', event.target.value)} /></AdminField>
                  <AdminField label="Role" htmlFor="project-testimonialRole" optional><input id="project-testimonialRole" value={form.testimonialRole} onChange={(event) => updateField('testimonialRole', event.target.value)} /></AdminField>
                  <AdminField label="Company" htmlFor="project-testimonialOrganization" optional><input id="project-testimonialOrganization" value={form.testimonialOrganization} onChange={(event) => updateField('testimonialOrganization', event.target.value)} /></AdminField>
                </div>
              </fieldset>

              <section className="admin-editor-section">
                <div className="admin-editor-section-heading"><span>04</span><div><h4>Media</h4><p>Use real project imagery and meaningful alternative text.</p></div></div>
                <div className="admin-media-field-layout">
                  <div className="admin-image-preview">{form.image ? <img src={form.image} alt="Selected project preview" /> : <span><AdminIcon name="media" size={28} />No image selected</span>}</div>
                  <div className="admin-form-stack">
                    <AdminField label="Featured image" htmlFor="project-image" error={errors.image} help="JPEG, PNG, or WebP · maximum 5 MB."><input id="project-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploading} />{uploading && <progress className="admin-upload-progress" aria-label="Uploading featured image" />}</AdminField>
                    <AdminField label="Image URL" htmlFor="project-imageUrl" optional><input id="project-imageUrl" type="url" value={form.image} onChange={(event) => updateField('image', event.target.value)} placeholder="https://" /></AdminField>
                    <AdminField label="Alternative text" htmlFor="project-altText" optional help={!advanced ? 'Requires the CMS migration.' : 'Describe the project visual for visitors using assistive technology.'}><input id="project-altText" value={form.altText} disabled={!advanced} onChange={(event) => updateField('altText', event.target.value)} /></AdminField>
                  </div>
                </div>
                <fieldset disabled={!advanced} className="admin-subfieldset">
                  <div className="admin-form-grid admin-form-grid--two">
                    <AdminField label="Gallery image URLs" htmlFor="project-gallery" optional help="One URL per line."><textarea id="project-gallery" rows="5" value={form.gallery} onChange={(event) => updateField('gallery', event.target.value)} /></AdminField>
                    <div className="admin-form-stack">
                      <AdminField label="Image caption" htmlFor="project-imageCaption" optional><input id="project-imageCaption" value={form.imageCaption} onChange={(event) => updateField('imageCaption', event.target.value)} /></AdminField>
                      <AdminField label="Optional video URL" htmlFor="project-videoUrl" optional error={errors.videoUrl}><input id="project-videoUrl" type="url" value={form.videoUrl} onChange={(event) => updateField('videoUrl', event.target.value)} /></AdminField>
                    </div>
                  </div>
                </fieldset>
              </section>

              <fieldset className="admin-editor-section" disabled={!advanced}>
                <div className="admin-editor-section-heading"><span>05</span><div><h4>SEO</h4><p>Search and social-sharing copy for this case study.</p></div>{!advanced && <span className="admin-locked-badge">Migration required</span>}</div>
                <AdminField label="SEO title" htmlFor="project-seoTitle" optional><input id="project-seoTitle" value={form.seoTitle} onChange={(event) => updateField('seoTitle', event.target.value)} /></AdminField>
                <AdminField label="SEO description" htmlFor="project-seoDescription" optional><textarea id="project-seoDescription" rows="3" value={form.seoDescription} onChange={(event) => updateField('seoDescription', event.target.value)} /></AdminField>
              </fieldset>
            </div>

            <aside className="admin-editor-sidebar">
              <section className="admin-editor-sidecard">
                <h4>Publishing</h4>
                <AdminField label="Status" htmlFor="project-status"><select id="project-status" value={form.status} disabled={!advanced} onChange={(event) => updateField('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></AdminField>
                <label className="admin-checkbox"><input type="checkbox" checked={form.featured} disabled={!advanced} onChange={(event) => updateField('featured', event.target.checked)} /><span><strong>Featured project</strong><small>Prominent Portfolio card</small></span></label>
                <label className="admin-checkbox"><input type="checkbox" checked={form.homepageFeatured} disabled={!advanced} onChange={(event) => updateField('homepageFeatured', event.target.checked)} /><span><strong>Show on homepage</strong><small>Selected Work placement</small></span></label>
                {!advanced && <p className="admin-sidecard-help">Current records are treated as published. Workflow controls require the CMS migration.</p>}
              </section>
              <section className="admin-editor-sidecard">
                <h4>Preview</h4>
                {editingId !== 'new' && previewByRecordId.get(String(editingId)) ? <Link to={previewByRecordId.get(String(editingId))} target="_blank" rel="noopener noreferrer" className="admin-button admin-button--secondary"><AdminIcon name="eye" />Open case study</Link> : <p className="admin-sidecard-help">Save this project before opening its public case-study page.</p>}
                <p className="admin-sidecard-help">Desktop, tablet, and mobile preview controls will be enabled when draft preview routes are configured.</p>
              </section>
            </aside>
          </div>
        </form>
      ) : (
        <>
          <section className="admin-toolbar" aria-label="Portfolio filters">
            <label className="admin-search"><AdminIcon name="search" /><span className="sr-only">Search projects</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects…" /></label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option value="all">All statuses</option><option value="published">Published</option><option value="draft" disabled={!advanced}>Draft</option><option value="archived" disabled={!advanced}>Archived</option></select>
            <span>{filtered.length} of {records.length} projects</span>
          </section>

          {loading ? <AdminLoading label="Loading portfolio projects…" /> : filtered.length ? (
            <div className="admin-content-table" role="table" aria-label="Portfolio projects">
              <div className="admin-content-table-head" role="row"><span>Project</span><span>Category</span><span>Featured</span><span>Status</span><span>Updated</span><span>Actions</span></div>
              {filtered.map((record) => (
                <article className="admin-content-row" role="row" key={record.id}>
                  <div className="admin-content-primary" role="cell">{record.image ? <img src={record.image} alt="" /> : <span className="admin-content-thumb-fallback"><AdminIcon name="media" /></span>}<span><strong>{record.title || 'Untitled project'}</strong><small>{record.slug || `project-${record.id}`}</small></span></div>
                  <span role="cell">{record.category || 'Uncategorized'}</span>
                  <span role="cell">{record.featured || record.homepage_featured ? 'Yes' : '—'}</span>
                  <span role="cell"><AdminStatusBadge status={record.status || 'published'} /></span>
                  <span role="cell">{formatAdminDate(record.updated_at || record.created_at)}</span>
                  <div className="admin-row-actions" role="cell">
                    <button type="button" onClick={() => openEditor(record)} aria-label={`Edit ${record.title}`} title="Edit"><AdminIcon name="edit" /></button>
                    {previewByRecordId.get(String(record.id)) && <Link to={previewByRecordId.get(String(record.id))} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${record.title}`} title="Preview"><AdminIcon name="eye" /></Link>}
                    <button type="button" onClick={() => duplicate(record)} aria-label={`Duplicate ${record.title}`} title="Duplicate"><AdminIcon name="copy" /></button>
                    <button type="button" onClick={() => archive(record)} disabled={!advanced} aria-label={`Archive ${record.title}`} title={advanced ? 'Archive' : 'Archive requires CMS migration'}><AdminIcon name="archive" /></button>
                    <button type="button" className="is-danger" onClick={() => setDeleteRecord(record)} aria-label={`Permanently delete ${record.title}`} title="Permanently delete"><AdminIcon name="trash" /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : <AdminEmpty icon="portfolio" title="No projects found" description="Try a different search or filter." />}

          <div className="admin-order-note"><AdminIcon name="warning" /><span><strong>Project ordering</strong> Drag-and-drop plus keyboard move controls become available when `sort_order` is stored by the CMS migration.</span></div>
        </>
      )}

      <AdminConfirmDialog open={Boolean(deleteRecord)} title="Permanently delete this project?" description="Archiving is safer. Permanent deletion removes the Supabase record, although a bundled fallback project may still appear until the content migration is complete." confirmLabel="Delete permanently" danger onCancel={() => setDeleteRecord(null)} onConfirm={confirmDelete} />
    </div>
  )
}

export default AdminPortfolio
