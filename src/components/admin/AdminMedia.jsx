import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { adminAPI, formatBytes } from '../../lib/api/admin'
import { uploadAPI } from '../../lib/api/upload'
import AdminIcon from './AdminIcons'
import {
  AdminEmpty,
  AdminField,
  AdminLoading,
  AdminNotice,
  AdminPageHeader,
  formatAdminDate,
} from './AdminUi'

const MEDIA_FOLDERS = [
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'blog', label: 'Blog' },
]

const MEDIA_TYPES = [
  { value: 'all', label: 'All file types' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'other', label: 'Other files' },
]

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024
const SAFE_ACTIONS_EXPLANATION = 'Replace and delete stay disabled until the CMS can verify every place a file is used.'

const getMediaKind = (item) => {
  if (item.mimeType?.startsWith('image/')) return 'image'
  if (item.mimeType?.startsWith('video/')) return 'video'
  return 'other'
}

const formatMediaType = (mimeType = '') => {
  const labels = {
    'image/jpeg': 'JPEG image',
    'image/png': 'PNG image',
    'image/webp': 'WebP image',
    'image/gif': 'GIF image',
    'image/svg+xml': 'SVG image',
    'video/mp4': 'MP4 video',
    'video/webm': 'WebM video',
  }

  return labels[mimeType] || mimeType || 'Unknown file type'
}

const validateUpload = (file) => {
  if (!file) return 'Choose an image to upload.'
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_IMAGE_TYPES.includes(file.type) || !ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
    return 'Use a JPEG, PNG, or WebP image.'
  }
  if (file.size > MAX_UPLOAD_SIZE) return 'Images must be 5 MB or smaller.'
  return ''
}

const MediaPreview = ({ item }) => {
  const kind = getMediaKind(item)

  if (!item.url) {
    return (
      <div className="admin-media-preview admin-media-preview--fallback" role="img" aria-label={`Preview unavailable for ${item.name}`}>
        <AdminIcon name="media" size={28} />
        <span>Preview unavailable</span>
      </div>
    )
  }

  if (kind === 'image') {
    return (
      <div className="admin-media-preview">
        <img
          src={item.url}
          alt={`Preview of ${item.name}`}
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  if (kind === 'video') {
    return (
      <div className="admin-media-preview admin-media-preview--video">
        <video
          src={item.url}
          controls
          muted
          playsInline
          preload="metadata"
          aria-label={`Video preview of ${item.name}`}
        />
      </div>
    )
  }

  return (
    <div className="admin-media-preview admin-media-preview--fallback" role="img" aria-label={`${item.name}, ${formatMediaType(item.mimeType)}`}>
      <AdminIcon name="media" size={28} />
      <span>No preview</span>
    </div>
  )
}

const MediaItem = ({ item }) => (
  <article className="admin-media-item" role="listitem">
    <MediaPreview item={item} />
    <div className="admin-media-item-body">
      <div className="admin-media-item-heading">
        <div>
          <h3 title={item.name}>{item.name}</h3>
          <p>{item.folder}</p>
        </div>
        {item.isPlaceholder && <span className="admin-media-placeholder-badge">Placeholder</span>}
      </div>

      <dl className="admin-media-metadata">
        <div><dt>Size</dt><dd>{formatBytes(item.size)}</dd></div>
        <div><dt>Type</dt><dd>{formatMediaType(item.mimeType)}</dd></div>
        <div><dt>Updated</dt><dd>{formatAdminDate(item.updatedAt)}</dd></div>
        <div><dt>Usage</dt><dd>Not tracked</dd></div>
      </dl>

      <div className="admin-media-item-actions">
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="admin-media-open-link">
            <AdminIcon name="external" size={16} />
            Open file
          </a>
        )}
        <button type="button" disabled title={SAFE_ACTIONS_EXPLANATION}>
          <AdminIcon name="refresh" size={16} />
          Replace
        </button>
        <button type="button" disabled title={SAFE_ACTIONS_EXPLANATION}>
          <AdminIcon name="trash" size={16} />
          Delete
        </button>
      </div>
    </div>
  </article>
)

const AdminMedia = () => {
  const fileInputRef = useRef(null)
  const [items, setItems] = useState([])
  const [capabilities, setCapabilities] = useState(null)
  const [inventoryErrors, setInventoryErrors] = useState([])
  const [fatalError, setFatalError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [folderFilter, setFolderFilter] = useState('all')
  const [uploadFolder, setUploadFolder] = useState('portfolio')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadNotice, setUploadNotice] = useState(null)

  const load = useCallback(async ({ background = false } = {}) => {
    if (background) setRefreshing(true)
    else setLoading(true)
    setFatalError('')

    try {
      const [inventory, nextCapabilities] = await Promise.all([
        adminAPI.getMediaInventory(),
        adminAPI.getCapabilities(),
      ])
      setItems(Array.isArray(inventory.items) ? inventory.items : [])
      setInventoryErrors(Array.isArray(inventory.errors) ? inventory.errors : [])
      setCapabilities(nextCapabilities)
    } catch (error) {
      console.error(error)
      setFatalError('The media inventory could not be loaded. Check the Supabase connection and try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSearch = !query || [item.name, item.path, item.folder, item.mimeType]
        .some((value) => String(value || '').toLowerCase().includes(query))
      const matchesType = typeFilter === 'all' || getMediaKind(item) === typeFilter
      const matchesFolder = folderFilter === 'all' || item.folder === folderFilter
      return matchesSearch && matchesType && matchesFolder
    })
  }, [folderFilter, items, search, typeFilter])
  const inventoryUnavailable = Boolean(fatalError || (inventoryErrors.length > 0 && items.length === 0))

  const selectFile = (event) => {
    const file = event.target.files?.[0] || null
    const error = validateUpload(file)
    setSelectedFile(error ? null : file)
    setUploadError(error)
    setUploadNotice(null)
    if (error) event.target.value = ''
  }

  const upload = async (event) => {
    event.preventDefault()
    const validationError = validateUpload(selectedFile)
    if (validationError) {
      setUploadError(validationError)
      fileInputRef.current?.focus()
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadNotice(null)

    try {
      await uploadAPI.uploadImage(selectedFile, uploadFolder)
      const uploadedName = selectedFile.name
      const folderLabel = MEDIA_FOLDERS.find((folder) => folder.value === uploadFolder)?.label || uploadFolder
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      await load({ background: true })
      setUploadNotice({
        tone: 'success',
        title: 'Upload complete',
        text: `${uploadedName} was uploaded to the ${folderLabel} folder.`,
      })
    } catch (error) {
      console.error(error)
      setUploadError('Upload failed. Check your storage permissions and try again.')
    } finally {
      setUploading(false)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setTypeFilter('all')
    setFolderFilter('all')
  }

  return (
    <div className="admin-page admin-media-page">
      <AdminPageHeader
        eyebrow="Shared website assets"
        title="Media Library"
        description="Browse uploaded project and blog media, and add optimized images without touching the code."
        actions={(
          <button type="button" className="admin-button admin-button--secondary" onClick={() => load({ background: true })} disabled={loading || refreshing || uploading}>
            <AdminIcon name="refresh" />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        )}
      />

      <AdminNotice tone="warning" title={capabilities?.mediaMetadata ? 'Reference checks are not connected' : 'Safe inventory mode'}>
        <p id="admin-media-safe-actions-note">
          {capabilities?.mediaMetadata
            ? 'Media metadata storage is available, but this inventory cannot yet verify every public reference. Replace and delete remain disabled to prevent broken images.'
            : 'The current schema stores files without alternative text or where-used records. Replace and delete remain disabled to prevent broken images across the website.'}
        </p>
      </AdminNotice>

      {uploadNotice && (
        <AdminNotice tone={uploadNotice.tone} title={uploadNotice.title}>
          <p>{uploadNotice.text}</p>
        </AdminNotice>
      )}

      <section className="admin-panel admin-media-upload-panel" aria-labelledby="admin-media-upload-title">
        <div className="admin-panel-header">
          <div>
            <p>Add an asset</p>
            <h3 id="admin-media-upload-title">Upload image</h3>
          </div>
          <span className="admin-code-badge">JPEG · PNG · WebP</span>
        </div>

        <form className="admin-media-upload-form" onSubmit={upload}>
          <AdminField label="Destination folder" htmlFor="admin-media-upload-folder">
            <select id="admin-media-upload-folder" value={uploadFolder} onChange={(event) => setUploadFolder(event.target.value)} disabled={uploading}>
              {MEDIA_FOLDERS.map((folder) => <option key={folder.value} value={folder.value}>{folder.label}</option>)}
            </select>
          </AdminField>
          <AdminField label="Image file" htmlFor="admin-media-upload-file" help={!uploadError ? 'Maximum file size: 5 MB.' : undefined} error={uploadError}>
            <input
              ref={fileInputRef}
              id="admin-media-upload-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={selectFile}
              disabled={uploading}
              aria-describedby={uploadError ? 'admin-media-upload-file-error' : undefined}
            />
          </AdminField>
          <div className="admin-media-upload-action">
            {selectedFile && <p><strong>{selectedFile.name}</strong><span>{formatBytes(selectedFile.size)}</span></p>}
            <button type="submit" className="admin-button" disabled={uploading || !selectedFile}>
              <AdminIcon name="upload" />
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
          </div>
          {uploading && <progress className="admin-upload-progress" aria-label={`Uploading ${selectedFile?.name || 'image'}`} />}
        </form>
      </section>

      {fatalError && (
        <AdminNotice tone="error" title="Unable to load media">
          <p>{fatalError}</p>
        </AdminNotice>
      )}

      {inventoryErrors.length > 0 && !fatalError && (
        <AdminNotice tone="error" title="Some media could not be loaded">
          <p>The library is showing the folders that are available. Refresh after checking the storage connection and permissions.</p>
        </AdminNotice>
      )}

      <section className="admin-toolbar admin-media-toolbar" aria-label="Media library filters">
        <div className="admin-search-field">
          <AdminIcon name="search" size={18} />
          <label className="sr-only" htmlFor="admin-media-search">Search media</label>
          <input
            id="admin-media-search"
            type="search"
            placeholder="Search file names…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <label className="admin-filter-field">
          <span className="sr-only">Filter by file type</span>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            {MEDIA_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </label>

        <label className="admin-filter-field">
          <span className="sr-only">Filter by folder</span>
          <select value={folderFilter} onChange={(event) => setFolderFilter(event.target.value)}>
            <option value="all">All folders</option>
            {MEDIA_FOLDERS.map((folder) => <option key={folder.value} value={folder.value}>{folder.label}</option>)}
          </select>
        </label>

        <div className="admin-view-toggle" role="group" aria-label="Media view">
          <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')} title="Grid view">
            <AdminIcon name="grid" />
            <span className="sr-only">Grid view</span>
          </button>
          <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')} title="List view">
            <AdminIcon name="list" />
            <span className="sr-only">List view</span>
          </button>
        </div>
      </section>

      <div className="admin-media-results-summary" aria-live="polite">
        <p>{filteredItems.length} {filteredItems.length === 1 ? 'file' : 'files'} shown</p>
        {(search || typeFilter !== 'all' || folderFilter !== 'all') && (
          <button type="button" onClick={resetFilters}>Clear filters</button>
        )}
      </div>

      {loading ? (
        <AdminLoading label="Loading media inventory…" />
      ) : filteredItems.length > 0 ? (
        <div className={`admin-media-items admin-media-items--${view}`} role="list" aria-label="Media files">
          {filteredItems.map((item) => <MediaItem key={item.id} item={item} />)}
        </div>
      ) : (
        <AdminEmpty
          icon="media"
          title={inventoryUnavailable ? 'Media inventory unavailable' : items.length ? 'No media matches these filters' : 'No uploaded media found'}
          description={inventoryUnavailable
            ? 'The storage inventory could not be read, so no conclusion has been made about which files exist.'
            : items.length
              ? 'Try a different file name, type, or folder.'
              : 'Upload a JPEG, PNG, or WebP image to the Portfolio or Blog folder.'}
        />
      )}
    </div>
  )
}

export default AdminMedia
