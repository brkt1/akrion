import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  BLOG_FILTERS,
  getArticlePath,
  mergeBlogRecords,
  slugifyArticleTitle,
} from '../../data/blogArticles'
import { adminAPI } from '../../lib/api/admin'
import { blogAPI, calculateReadingTime } from '../../lib/api/blog'
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

const DEFAULT_PUBLISHER = 'Akrion Digitals'
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const EMPTY_ARTICLE = {
  title: '',
  slug: '',
  category: '',
  publisher: DEFAULT_PUBLISHER,
  publicationDate: '',
  excerpt: '',
  content: '',
  image: '',
  imageAlt: '',
  readingTimeOverride: '',
  featured: false,
  status: 'draft',
  scheduledAt: '',
  seoTitle: '',
  seoDescription: '',
  relatedArticleIds: [],
  publishedAt: '',
  archivedAt: '',
}

const normalizePublisher = (value) => {
  const publisher = String(value || '').trim()
  return !publisher || publisher === 'Akrion Team' ? DEFAULT_PUBLISHER : publisher
}

const toLocalDateTimeInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (part) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const toForm = (record = {}) => ({
  ...EMPTY_ARTICLE,
  title: record.title || '',
  slug: record.slug || slugifyArticleTitle(record.title || ''),
  category: record.category || '',
  publisher: normalizePublisher(record.publisher || record.author),
  publicationDate: record.status
    ? (record.publication_date || '')
    : (record.date || ''),
  excerpt: record.excerpt || '',
  content: record.content || '',
  image: record.image || '',
  imageAlt: record.image_alt || record.alt_text || '',
  readingTimeOverride: record.reading_time ? String(record.reading_time) : '',
  featured: Boolean(record.featured),
  status: record.status || 'published',
  scheduledAt: toLocalDateTimeInput(record.scheduled_at),
  seoTitle: record.seo_title || '',
  seoDescription: record.seo_description || '',
  relatedArticleIds: Array.isArray(record.related_article_ids)
    ? record.related_article_ids.map(String)
    : [],
  publishedAt: record.published_at || '',
  archivedAt: record.archived_at || '',
})

const buildPayload = (form, advanced) => ({
  advanced,
  title: form.title,
  slug: form.slug,
  category: form.category,
  publisher: form.publisher,
  author: form.publisher,
  publicationDate: form.publicationDate,
  date: form.publicationDate,
  excerpt: form.excerpt,
  content: form.content,
  image: form.image,
  imageAlt: form.imageAlt,
  readingTime: form.readingTimeOverride || calculateReadingTime(form.content),
  featured: form.featured,
  status: form.status,
  scheduledAt: form.scheduledAt,
  seoTitle: form.seoTitle,
  seoDescription: form.seoDescription,
  relatedArticleIds: form.relatedArticleIds,
  publishedAt: form.publishedAt,
  archivedAt: form.archivedAt,
})

const getUniqueSlug = (value, records) => {
  const root = slugifyArticleTitle(value)
  const existing = new Set(records.map((record) => String(record.slug || '').toLowerCase()).filter(Boolean))
  if (!existing.has(root)) return root

  let suffix = 2
  while (existing.has(`${root}-${suffix}`)) suffix += 1
  return `${root}-${suffix}`
}

const validateArticle = (form, records, editingId, advanced) => {
  const errors = {}
  const normalizedSlug = form.slug.trim().toLowerCase()

  if (!form.title.trim()) errors.title = 'Enter an article title.'
  if (!form.category.trim()) errors.category = 'Choose a category.'
  if (!form.publisher.trim()) errors.publisher = 'Enter the verified publisher name.'
  if (!form.content.trim()) errors.content = 'Add the article body.'
  if ((!advanced || form.status === 'published') && !form.publicationDate) {
    errors.publicationDate = 'Choose the real publication date.'
  }
  if (advanced && !form.slug.trim()) errors.slug = 'Enter a URL slug.'
  if (
    advanced
    && records.some((record) => String(record.id) !== String(editingId) && String(record.slug || '').toLowerCase() === normalizedSlug)
  ) {
    errors.slug = 'This slug is already in use.'
  }
  if (advanced && !form.excerpt.trim()) errors.excerpt = 'Add a concise article excerpt.'
  if (form.image && !/^https?:\/\//i.test(form.image)) errors.image = 'Use a complete http:// or https:// image URL.'
  if (advanced && form.image && !form.imageAlt.trim()) errors.imageAlt = 'Describe the featured image.'

  if (form.readingTimeOverride) {
    const readingTime = Number(form.readingTimeOverride)
    if (!Number.isInteger(readingTime) || readingTime < 1) errors.readingTimeOverride = 'Use a whole number of at least 1 minute.'
  }

  if (advanced && form.status === 'scheduled') {
    const scheduledAt = new Date(form.scheduledAt)
    if (!form.scheduledAt || Number.isNaN(scheduledAt.getTime())) {
      errors.scheduledAt = 'Choose a schedule date and time.'
    } else if (scheduledAt.getTime() <= Date.now()) {
      errors.scheduledAt = 'Choose a future schedule date and time.'
    }
  }

  return errors
}

const AdminBlog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [records, setRecords] = useState([])
  const [advanced, setAdvanced] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(null)
  const [initialForm, setInitialForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    const [recordsResult, capabilities] = await Promise.all([
      blogAPI.getAll()
        .then((data) => ({ data, failed: false }))
        .catch((error) => {
          console.error('Unable to load blog records:', error)
          return { data: [], failed: true }
        }),
      adminAPI.getCapabilities(),
    ])
    setRecords(recordsResult.data)
    setAdvanced(Boolean(capabilities.advancedBlog))
    setLoadError(recordsResult.failed)
    setLoading(false)
    return recordsResult.data
  }, [])

  useEffect(() => { load() }, [load])

  const mergedArticles = useMemo(() => mergeBlogRecords(records), [records])
  const previewByRecordId = useMemo(
    () => new Map(
      mergedArticles
        .filter((article) => article.sourceRecord)
        .map((article) => [String(article.sourceRecord.id), getArticlePath(article)]),
    ),
    [mergedArticles],
  )
  const categories = useMemo(
    () => [...new Set([
      ...BLOG_FILTERS.filter((item) => item !== 'All'),
      ...records.map((record) => record.category).filter(Boolean),
    ])].sort(),
    [records],
  )
  const automaticReadingTime = useMemo(
    () => calculateReadingTime(form?.content || ''),
    [form?.content],
  )
  const dirty = Boolean(form && initialForm && JSON.stringify(form) !== JSON.stringify(initialForm))
  useUnsavedWarning(dirty)

  const openEditor = useCallback((record = null, preset = null) => {
    const nextForm = preset || (record
      ? toForm(record)
      : { ...EMPTY_ARTICLE, status: advanced ? 'draft' : 'published' })
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
  }, [advanced, searchParams, setSearchParams])

  useEffect(() => {
    if (loading || editingId) return
    if (searchParams.get('new') === '1') {
      openEditor()
      return
    }
    const editId = searchParams.get('edit')
    if (editId) {
      const record = records.find((item) => String(item.id) === editId)
      if (record) openEditor(record)
    }
  }, [editingId, loading, openEditor, records, searchParams])

  const closeEditor = () => {
    if (dirty && !window.confirm('Discard your unsaved article changes?')) return
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

  const updateTitle = (value) => {
    setForm((current) => {
      const slugTracksTitle = editingId === 'new'
        && (!current.slug || current.slug === slugifyArticleTitle(current.title))
      return {
        ...current,
        title: value,
        slug: slugTracksTitle ? slugifyArticleTitle(value) : current.slug,
      }
    })
    if (errors.title || errors.slug) {
      setErrors((current) => ({ ...current, title: '', slug: '' }))
    }
  }

  const save = async (event) => {
    event.preventDefault()
    const nextErrors = validateArticle(form, records, editingId === 'new' ? null : editingId, advanced)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      document.getElementById(`blog-${Object.keys(nextErrors)[0]}`)?.focus()
      return
    }

    setSaving(true)
    setNotice(null)
    try {
      const payload = buildPayload(form, advanced)
      const saved = editingId === 'new'
        ? await blogAPI.create(payload)
        : await blogAPI.update(editingId, payload)
      await load()
      const savedForm = toForm(saved)
      setEditingId(saved.id)
      setForm(savedForm)
      setInitialForm(savedForm)
      setSearchParams({ edit: String(saved.id) }, { replace: true })
      setNotice({
        type: 'success',
        text: advanced
          ? 'Article saved with its current workflow status.'
          : 'The supported article fields were saved and are treated as published. Drafts, scheduling, SEO, related articles, and image alt text require the CMS migration.',
      })
    } catch (error) {
      console.error(error)
      const duplicateSlug = String(error?.code || '') === '23505'
      setNotice({
        type: 'error',
        text: duplicateSlug
          ? 'That article slug is already in use. Choose a different slug.'
          : 'The article could not be saved. Check your admin permissions and try again.',
      })
      if (duplicateSlug) setErrors((current) => ({ ...current, slug: 'This slug is already in use.' }))
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((current) => ({ ...current, image: 'Use a JPEG, PNG, or WebP image.' }))
      event.target.value = ''
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((current) => ({ ...current, image: 'Images must be 5 MB or smaller.' }))
      event.target.value = ''
      return
    }

    setUploading(true)
    try {
      const url = await uploadAPI.uploadImage(file, 'blog')
      updateField('image', url)
    } catch (error) {
      console.error(error)
      setErrors((current) => ({ ...current, image: 'Upload failed. Check storage permissions and try again.' }))
    } finally {
      setUploading(false)
    }
  }

  const duplicate = (record) => {
    const title = `${record.title || 'Untitled article'} Copy`
    const copy = {
      ...toForm(record),
      title,
      slug: getUniqueSlug(`${record.slug || slugifyArticleTitle(record.title)}-copy`, records),
      publicationDate: '',
      status: advanced ? 'draft' : 'published',
      scheduledAt: '',
      publishedAt: '',
      archivedAt: '',
      featured: false,
    }
    openEditor(null, copy)
    setInitialForm(EMPTY_ARTICLE)
    setNotice({
      type: advanced ? 'success' : 'warning',
      text: advanced
        ? 'A draft copy is ready for review. It has not been saved yet.'
        : 'A copy is ready for review. The legacy schema publishes it when saved because draft storage is unavailable.',
    })
  }

  const archive = async (record) => {
    try {
      await blogAPI.update(record.id, buildPayload({ ...toForm(record), status: 'archived' }, true))
      await load()
      setNotice({ type: 'success', text: 'Article archived.' })
    } catch (error) {
      console.error(error)
      setNotice({ type: 'error', text: 'The article could not be archived.' })
    }
  }

  const permanentlyDelete = async (record) => {
    try {
      await blogAPI.delete(record.id)
      await load()
      setNotice({
        type: 'success',
        text: 'Article permanently deleted. A bundled fallback article may still appear publicly until all editorial content is migrated.',
      })
    } catch (error) {
      console.error(error)
      setNotice({ type: 'error', text: 'The article could not be deleted.' })
    }
  }

  const confirmPendingAction = async () => {
    const action = pendingAction
    setPendingAction(null)
    if (!action) return
    if (action.type === 'archive') await archive(action.record)
    else await permanentlyDelete(action.record)
  }

  const filtered = records.filter((record) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [
      record.title,
      record.excerpt,
      record.content,
      record.category,
      record.publisher,
      record.author,
    ].some((value) => String(value || '').toLowerCase().includes(query))
    const matchesCategory = category === 'all' || record.category === category
    const recordStatus = record.status || 'published'
    return matchesSearch && matchesCategory && (status === 'all' || recordStatus === status)
  })

  const currentPreviewPath = editingId !== 'new'
    ? previewByRecordId.get(String(editingId))
    : null

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Editorial library"
        title="Blog"
        description="Write, review, publish, and organize Akrion Digitals articles."
        actions={!editingId ? <button type="button" className="admin-button" onClick={() => openEditor()}><AdminIcon name="plus" />Write Blog Post</button> : null}
      />

      {!advanced && (
        <AdminNotice tone="warning" title="Editorial workflow needs the CMS migration">
          <p>Title, body, publisher, date, category, and one image save with the current database. Drafts, scheduling, custom slugs, excerpts, image alt text, reading time, featured state, SEO, related articles, and archiving stay disabled until their columns are available.</p>
        </AdminNotice>
      )}
      {loadError && <AdminNotice tone="error" title="Blog records could not be loaded"><p>Check the Supabase connection and your admin permissions, then try again.</p></AdminNotice>}
      {notice && <AdminNotice tone={notice.type} title={notice.type === 'success' ? 'Blog updated' : notice.type === 'warning' ? 'Review before saving' : 'Unable to update blog'}><p>{notice.text}</p></AdminNotice>}

      {editingId && form ? (
        <form className="admin-editor" onSubmit={save}>
          <header className="admin-editor-header">
            <div>
              <p className="admin-page-eyebrow">{editingId === 'new' ? 'New article' : 'Article editor'}</p>
              <h3>{form.title || 'Untitled article'}</h3>
              <span>{dirty ? 'Unsaved changes' : 'All current changes saved'}</span>
            </div>
            <div>
              <button type="button" className="admin-button admin-button--secondary" onClick={closeEditor}>Close</button>
              <button type="submit" className="admin-button" disabled={saving || uploading || !dirty}>
                {saving ? 'Saving…' : advanced && form.status === 'published' ? 'Update article' : 'Save changes'}
              </button>
            </div>
          </header>

          <div className="admin-editor-layout">
            <div className="admin-editor-main">
              <section className="admin-editor-section">
                <div className="admin-editor-section-heading"><span>01</span><div><h4>Article basics</h4><p>Core editorial content and public article details.</p></div></div>
                <div className="admin-form-grid admin-form-grid--two">
                  <AdminField label="Article title" htmlFor="blog-title" required error={errors.title}>
                    <input id="blog-title" value={form.title} onChange={(event) => updateTitle(event.target.value)} required aria-invalid={Boolean(errors.title)} />
                  </AdminField>
                  <AdminField label="URL slug" htmlFor="blog-slug" required={advanced} error={errors.slug} help={!advanced ? 'Stable custom slugs require the CMS migration.' : 'Lowercase words separated by hyphens.'}>
                    <input id="blog-slug" value={form.slug} disabled={!advanced} onChange={(event) => updateField('slug', slugifyArticleTitle(event.target.value))} aria-invalid={Boolean(errors.slug)} />
                  </AdminField>
                  <AdminField label="Category" htmlFor="blog-category" required error={errors.category}>
                    <input id="blog-category" list="blog-category-options" value={form.category} onChange={(event) => updateField('category', event.target.value)} required aria-invalid={Boolean(errors.category)} />
                    <datalist id="blog-category-options">{categories.map((item) => <option value={item} key={item} />)}</datalist>
                  </AdminField>
                  <AdminField label="Publisher" htmlFor="blog-publisher" required error={errors.publisher} help="Use a verified person or organization name.">
                    <input id="blog-publisher" value={form.publisher} onChange={(event) => updateField('publisher', event.target.value)} required aria-invalid={Boolean(errors.publisher)} />
                  </AdminField>
                  <AdminField label="Publication date" htmlFor="blog-publicationDate" required={!advanced || form.status === 'published'} error={errors.publicationDate} help={advanced && form.status !== 'published' ? 'Optional until the article is published.' : 'Use the real publication date.'}>
                    <input id="blog-publicationDate" type="date" value={form.publicationDate} onChange={(event) => updateField('publicationDate', event.target.value)} aria-invalid={Boolean(errors.publicationDate)} />
                  </AdminField>
                </div>
                <AdminField label="Short excerpt" htmlFor="blog-excerpt" required={advanced} error={errors.excerpt} help={!advanced ? 'Dedicated excerpts require the CMS migration; the public site derives its summary from the article body.' : 'A concise introduction used on cards and in search descriptions.'}>
                  <textarea id="blog-excerpt" rows="3" value={form.excerpt} disabled={!advanced} onChange={(event) => updateField('excerpt', event.target.value)} aria-invalid={Boolean(errors.excerpt)} />
                </AdminField>
                <AdminField label="Article body" htmlFor="blog-content" required error={errors.content} help="Separate paragraphs with a blank line. The current public renderer preserves this paragraph structure.">
                  <textarea id="blog-content" rows="16" value={form.content} onChange={(event) => updateField('content', event.target.value)} required aria-invalid={Boolean(errors.content)} />
                </AdminField>
              </section>

              <section className="admin-editor-section">
                <div className="admin-editor-section-heading"><span>02</span><div><h4>Featured image</h4><p>Upload an optimized editorial image or use a verified URL.</p></div></div>
                <div className="admin-media-field-layout">
                  <div className="admin-image-preview">
                    {form.image
                      ? <img src={form.image} alt={form.imageAlt || 'Selected article preview'} />
                      : <span><AdminIcon name="media" size={28} />No image selected</span>}
                  </div>
                  <div className="admin-form-stack">
                    <AdminField label="Upload image" htmlFor="blog-image" error={errors.image} help="JPEG, PNG, or WebP · maximum 5 MB.">
                      <input id="blog-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploading} />
                      {uploading && <progress className="admin-upload-progress" aria-label="Uploading featured image" />}
                    </AdminField>
                    <AdminField label="Image URL" htmlFor="blog-imageUrl" optional error={errors.image}>
                      <input id="blog-imageUrl" type="url" value={form.image} onChange={(event) => updateField('image', event.target.value)} placeholder="https://" aria-invalid={Boolean(errors.image)} />
                    </AdminField>
                    <AdminField label="Alternative text" htmlFor="blog-imageAlt" required={advanced && Boolean(form.image)} error={errors.imageAlt} help={!advanced ? 'Alternative-text storage requires the CMS migration.' : 'Describe the image’s useful visual meaning.'}>
                      <input id="blog-imageAlt" value={form.imageAlt} disabled={!advanced} onChange={(event) => updateField('imageAlt', event.target.value)} aria-invalid={Boolean(errors.imageAlt)} />
                    </AdminField>
                  </div>
                </div>
              </section>

              <fieldset className="admin-editor-section" disabled={!advanced}>
                <div className="admin-editor-section-heading"><span>03</span><div><h4>Search and discovery</h4><p>Optional metadata and intentional related-article choices.</p></div>{!advanced && <span className="admin-locked-badge">Migration required</span>}</div>
                <AdminField label="SEO title" htmlFor="blog-seoTitle" optional>
                  <input id="blog-seoTitle" value={form.seoTitle} onChange={(event) => updateField('seoTitle', event.target.value)} />
                </AdminField>
                <AdminField label="SEO description" htmlFor="blog-seoDescription" optional>
                  <textarea id="blog-seoDescription" rows="3" value={form.seoDescription} onChange={(event) => updateField('seoDescription', event.target.value)} />
                </AdminField>
                <AdminField label="Related articles" htmlFor="blog-relatedArticleIds" optional help="Use Ctrl or Command to select more than one article.">
                  <select
                    id="blog-relatedArticleIds"
                    multiple
                    size={Math.min(6, Math.max(3, records.length - 1))}
                    value={form.relatedArticleIds}
                    onChange={(event) => updateField('relatedArticleIds', [...event.target.selectedOptions].map((option) => option.value))}
                  >
                    {records.filter((record) => String(record.id) !== String(editingId)).map((record) => (
                      <option value={String(record.id)} key={record.id}>{record.title || `Article ${record.id}`}</option>
                    ))}
                  </select>
                </AdminField>
              </fieldset>
            </div>

            <aside className="admin-editor-sidebar">
              <section className="admin-editor-sidecard">
                <h4>Publishing</h4>
                <AdminField label="Status" htmlFor="blog-status">
                  <select id="blog-status" value={form.status} disabled={!advanced} onChange={(event) => updateField('status', event.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </AdminField>
                {form.status === 'scheduled' && (
                  <AdminField label="Schedule date and time" htmlFor="blog-scheduledAt" required error={errors.scheduledAt} help="This stores the intended time. Automatic publishing still requires a configured server-side scheduler.">
                    <input id="blog-scheduledAt" type="datetime-local" value={form.scheduledAt} disabled={!advanced} onChange={(event) => updateField('scheduledAt', event.target.value)} aria-invalid={Boolean(errors.scheduledAt)} />
                  </AdminField>
                )}
                <AdminField label="Manual reading time" htmlFor="blog-readingTimeOverride" optional error={errors.readingTimeOverride} help={`Automatic estimate: ${automaticReadingTime || 0} min. Leave blank to use it.`}>
                  <input id="blog-readingTimeOverride" type="number" min="1" step="1" value={form.readingTimeOverride} disabled={!advanced} onChange={(event) => updateField('readingTimeOverride', event.target.value)} aria-invalid={Boolean(errors.readingTimeOverride)} />
                </AdminField>
                <label className="admin-checkbox">
                  <input type="checkbox" checked={form.featured} disabled={!advanced} onChange={(event) => updateField('featured', event.target.checked)} />
                  <span><strong>Featured article</strong><small>Prominent Blog placement</small></span>
                </label>
                {!advanced && <p className="admin-sidecard-help">Current records are treated as published. Workflow controls require the CMS migration.</p>}
              </section>

              <section className="admin-editor-sidecard">
                <h4>Current draft preview</h4>
                {form.image && <div className="admin-image-preview"><img src={form.image} alt="" /></div>}
                <p className="admin-page-eyebrow">{form.category || 'Uncategorized'}</p>
                <strong>{form.title || 'Untitled article'}</strong>
                <p className="admin-sidecard-help">{form.excerpt || form.content.slice(0, 180) || 'Your article summary will appear here.'}</p>
                {currentPreviewPath && (!advanced || form.status === 'published')
                  ? <Link to={currentPreviewPath} target="_blank" rel="noopener noreferrer" className="admin-button admin-button--secondary"><AdminIcon name="eye" />Open saved article</Link>
                  : <p className="admin-sidecard-help">{editingId === 'new' ? 'Save this article before opening its public URL.' : 'Only published articles open on the public route.'} This card reflects unsaved text and image changes.</p>}
              </section>
            </aside>
          </div>
        </form>
      ) : (
        <>
          <section className="admin-toolbar" aria-label="Blog filters">
            <label className="admin-search"><AdminIcon name="search" /><span className="sr-only">Search articles</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles…" /></label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft" disabled={!advanced}>Draft</option>
              <option value="scheduled" disabled={!advanced}>Scheduled</option>
              <option value="archived" disabled={!advanced}>Archived</option>
            </select>
            <span>{filtered.length} of {records.length} articles</span>
          </section>

          {loading ? <AdminLoading label="Loading blog articles…" /> : filtered.length ? (
            <div className="admin-content-table" role="table" aria-label="Blog articles">
              <div className="admin-content-table-head" role="row"><span>Article</span><span>Category</span><span>Featured</span><span>Status</span><span>Updated</span><span>Actions</span></div>
              {filtered.map((record) => (
                <article className="admin-content-row" role="row" key={record.id}>
                  <div className="admin-content-primary" role="cell">
                    {record.image ? <img src={record.image} alt="" /> : <span className="admin-content-thumb-fallback"><AdminIcon name="blog" /></span>}
                    <span><strong>{record.title || 'Untitled article'}</strong><small>{record.slug || `article-${record.id}`}</small></span>
                  </div>
                  <span role="cell">{record.category || 'Uncategorized'}</span>
                  <span role="cell">{record.featured ? 'Yes' : '—'}</span>
                  <span role="cell"><AdminStatusBadge status={record.status || 'published'} /></span>
                  <span role="cell">{formatAdminDate(record.updated_at || record.created_at || record.date)}</span>
                  <div className="admin-row-actions" role="cell">
                    <button type="button" onClick={() => openEditor(record)} aria-label={`Edit ${record.title}`} title="Edit"><AdminIcon name="edit" /></button>
                    {previewByRecordId.get(String(record.id)) && <Link to={previewByRecordId.get(String(record.id))} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${record.title}`} title="Preview"><AdminIcon name="eye" /></Link>}
                    <button type="button" onClick={() => duplicate(record)} aria-label={`Duplicate ${record.title}`} title="Duplicate"><AdminIcon name="copy" /></button>
                    <button type="button" onClick={() => setPendingAction({ type: 'archive', record })} disabled={!advanced} aria-label={`Archive ${record.title}`} title={advanced ? 'Archive' : 'Archive requires CMS migration'}><AdminIcon name="archive" /></button>
                    <button type="button" className="is-danger" onClick={() => setPendingAction({ type: 'delete', record })} aria-label={`Permanently delete ${record.title}`} title="Permanently delete"><AdminIcon name="trash" /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : <AdminEmpty icon="blog" title="No articles found" description="Try a different search or filter." />}
        </>
      )}

      <AdminConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.type === 'archive' ? 'Archive this article?' : 'Permanently delete this article?'}
        description={pendingAction?.type === 'archive'
          ? 'The article will leave the public Blog and remain available to administrators.'
          : 'Permanent deletion removes the Supabase record. Archiving is safer when the advanced workflow is available.'}
        confirmLabel={pendingAction?.type === 'archive' ? 'Archive article' : 'Delete permanently'}
        danger={pendingAction?.type === 'delete'}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmPendingAction}
      />
    </div>
  )
}

export default AdminBlog
