// One shared vocabulary for the public filters, editor, and database payload.
export const MEDIA_CATEGORIES = Object.freeze([
  { id: 'tv-promo', label: 'TV & Promo' },
  { id: 'interview', label: 'Interviews' },
  { id: 'behind-the-scenes', label: 'Behind the Scenes' },
  { id: 'reels', label: 'Reels' },
  { id: 'photos', label: 'Photos' },
])
export const MAX_PROJECT_MEDIA = 100
export const MEDIA_RATIOS = Object.freeze({ landscape: '16 / 9', portrait: '9 / 16', square: '1 / 1' })
export const getMediaCategoryLabel = (category) => MEDIA_CATEGORIES.find((item) => item.id === category)?.label || 'Video'
export const isMediaCategory = (category) => MEDIA_CATEGORIES.some((item) => item.id === category)

export const safeMediaUrl = (value) => {
  const text = String(value || '').trim()
  if (!text || text.length > 2048 || /[\\\u0000-\u001f]/.test(text)) return ''
  if (/^\/(?!\/)/.test(text)) return text
  try {
    const url = new URL(text)
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''
  } catch { return '' }
}

export const getYouTubeVideoId = (value) => {
  try {
    const url = new URL(String(value || '').trim())
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return ''
    const host = url.hostname.toLowerCase()
    const path = url.pathname.split('/').filter(Boolean)
    let id = ''
    if (host === 'youtu.be') id = path[0] || ''
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v') || ''
      else if (['embed', 'shorts', 'live'].includes(path[0])) id = path[1] || ''
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : ''
  } catch { return '' }
}

export const getPlayableVideo = (value) => {
  const youtubeId = getYouTubeVideoId(value)
  if (youtubeId) return {
    provider: 'youtube',
    // The player is only mounted after an explicit click. Preserve YouTube's
    // controls/branding and send an origin referrer to avoid playback error 153.
    src: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0`,
    thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  }
  const url = safeMediaUrl(value)
  if (url && /\.(mp4|webm)$/i.test(new URL(url, 'https://www.akriondigitals.com').pathname)) {
    return { provider: 'file', src: url, thumbnail: '' }
  }
  return null
}

export const normalizeMediaItem = (item, index = 0) => {
  if (!item || typeof item !== 'object') return null
  const type = item.type === 'video' ? 'video' : 'image'
  const url = safeMediaUrl(item.url || item.src)
  const playback = type === 'video' ? getPlayableVideo(item.url || item.src) : null
  if (type === 'video' ? !playback : !url || getPlayableVideo(url)) return null
  const category = isMediaCategory(item.category) ? item.category : type === 'image' ? 'photos' : ''
  if ((type === 'image' && category !== 'photos') || (type === 'video' && category === 'photos')) return null
  const title = String(item.title || item.caption || item.alt || `${type === 'image' ? 'Photo' : 'Video'} ${index + 1}`).trim()
  return {
    ...item,
    id: String(item.id || `media-${index}`), type, category, title,
    url: type === 'video' ? String(item.url || item.src).trim() : url,
    src: type === 'image' ? url : playback.src,
    thumbnail: safeMediaUrl(item.thumbnail) || playback?.thumbnail || '',
    alt: String(item.alt || title), caption: String(item.caption || ''),
    orientation: Object.hasOwn(MEDIA_RATIOS, item.orientation) ? item.orientation : category === 'reels' ? 'portrait' : 'landscape',
    playback,
  }
}

// NULL means "not migrated yet". An explicitly saved [] means intentionally
// empty, so removing media never resurrects an old video or gallery entry.
export const getProjectMedia = (record = {}, fallbackGallery = [], title = 'Project') => {
  if (Array.isArray(record.media_items)) return record.media_items.map(normalizeMediaItem).filter(Boolean)
  const legacyGallery = Array.isArray(record.gallery) && record.gallery.length ? record.gallery : fallbackGallery
  const items = legacyGallery.filter(Boolean).map((entry, index) => ({
    ...(typeof entry === 'string' ? { url: entry } : entry),
    type: 'image', category: 'photos',
    title: entry.title || entry.caption || `${title} — photo ${index + 1}`,
  }))
  if (record.video_url) items.unshift({ type: 'video', category: '', title: `${title} — video`, url: record.video_url })
  return items.map(normalizeMediaItem).filter(Boolean)
}

export const getEditableProjectMedia = (record = {}) => {
  const source = Array.isArray(record.media_items) ? record.media_items : [
    ...(record.video_url ? [{ type: 'video', category: '', url: record.video_url, title: 'Project video' }] : []),
    ...(Array.isArray(record.gallery) && record.gallery.length ? record.gallery.filter(Boolean).map((entry, index) => ({
      ...(typeof entry === 'string' ? { url: entry } : entry), type: 'image', category: 'photos',
      title: entry.title || entry.caption || `Photo ${index + 1}`,
    })) : record.featured_image || record.image ? [{
      type: 'image', category: 'photos', url: record.featured_image || record.image,
      title: `${record.title || 'Project'} — photo`, alt: record.alt_text || record.image_alt || `${record.title || 'Project'} project visual`, caption: record.image_caption || '',
    }] : []),
  ]
  return source.map((item, index) => ({
    id: String(item.id || `existing-${record.id || 'project'}-${index}`),
    type: item.type === 'video' ? 'video' : 'image',
    category: item.category || (item.type === 'video' ? '' : 'photos'),
    title: String(item.title || ''), url: String(item.url || item.src || ''),
    thumbnail: String(item.thumbnail || ''), alt: String(item.alt || ''), caption: String(item.caption || ''),
    orientation: item.orientation || (item.category === 'reels' ? 'portrait' : 'landscape'),
  }))
}

export const validateMediaItems = (items) => {
  if (!Array.isArray(items) || items.length > MAX_PROJECT_MEDIA) return { mediaItems: `Use up to ${MAX_PROJECT_MEDIA} media items per collection.` }
  const errors = {}
  const ids = new Set()
  items.forEach((item, index) => {
    const key = `mediaItems.${index}`
    if (!item.id || ids.has(item.id)) errors[`${key}.title`] = 'Each media item needs a unique identifier.'
    ids.add(item.id)
    if (!item.title?.trim() || item.title.trim().length > 200) errors[`${key}.title`] = 'Add a title of 200 characters or fewer.'
    if (!isMediaCategory(item.category) || (item.type === 'image') !== (item.category === 'photos')) errors[`${key}.category`] = 'Choose the content type for this item.'
    if (!normalizeMediaItem(item, index)) errors[`${key}.url`] = item.type === 'video' ? 'Use a YouTube video link or a secure .mp4 / .webm URL.' : 'Use a secure image URL or upload a photo.'
    if (!String(item.url || '').startsWith('https://') && !getYouTubeVideoId(item.url)) errors[`${key}.url`] = 'Use a complete, secure https:// media URL.'
    if (item.thumbnail && (!safeMediaUrl(item.thumbnail) || !item.thumbnail.startsWith('https://'))) errors[`${key}.thumbnail`] = 'Use a secure thumbnail image URL.'
    if (!Object.hasOwn(MEDIA_RATIOS, item.orientation)) errors[`${key}.orientation`] = 'Choose a supported orientation.'
    if ((item.caption || '').length > 1000) errors[`${key}.caption`] = 'Keep the caption within 1,000 characters.'
    if ((item.alt || '').length > 500) errors[`${key}.alt`] = 'Keep alternative text within 500 characters.'
  })
  return errors
}

export const serializeMediaItems = (items) => {
  const errors = validateMediaItems(items)
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0])
  return items.map((item) => {
    const { id, type, category, title, thumbnail, alt, caption, orientation } = item
    const youtubeId = getYouTubeVideoId(item.url)
    return { id, type, category, title: title.trim(), url: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : item.url.trim(), thumbnail: (thumbnail || '').trim(), alt: (alt || '').trim(), caption: (caption || '').trim(), orientation }
  })
}

export const getMediaCounts = (items = []) => Object.fromEntries(MEDIA_CATEGORIES.map(({ id }) => [id, items.filter((item) => item.category === id).length]))
export const matchesMediaFilter = (project, filter) => filter === 'all' || project.mediaItems?.some((item) => item.category === filter)
