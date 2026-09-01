import { supabase } from '../supabase'

const IMAGE_BUCKET = 'images'
const MEDIA_FOLDERS = ['portfolio', 'blog']
const STORAGE_PAGE_SIZE = 1000
const DEFAULT_RECENT_LIMIT = 8
const INQUIRIES_UNAVAILABLE_REASON = 'The public contact form opens WhatsApp and does not store inquiries in the website database.'

const CAPABILITY_PROBES = {
  pageContent: {
    table: 'page_sections',
    columns: 'id,page_key,section_key,draft_content,published_content,status,updated_at',
  },
  advancedPortfolio: {
    table: 'portfolio_projects',
    columns: [
      'slug',
      'status',
      'featured',
      'sort_order',
      'client_name',
      'industry',
      'project_year',
      'card_description',
      'project_summary',
      'challenge',
      'approach',
      'work_delivered',
      'services',
      'result',
      'metrics',
      'verified_testimonial',
      'testimonial_quote',
      'testimonial_name',
      'testimonial_role',
      'testimonial_organization',
      'featured_image',
      'alt_text',
      'image_caption',
      'gallery',
      'video_url',
      'seo_title',
      'seo_description',
      'homepage_featured',
      'published_at',
      'archived_at',
    ].join(','),
  },
  advancedBlog: {
    table: 'blog_posts',
    columns: [
      'slug',
      'status',
      'excerpt',
      'image_alt',
      'publisher',
      'publication_date',
      'reading_time',
      'featured',
      'scheduled_at',
      'seo_title',
      'seo_description',
      'related_article_ids',
      'published_at',
      'archived_at',
    ].join(','),
  },
  advancedServices: {
    table: 'services',
    columns: 'slug,number,deliverables,main_image,secondary_images,sort_order,status,published_at,archived_at',
  },
  mediaMetadata: {
    table: 'media_assets',
    columns: 'id,name,path,folder,url,size,mime_type,updated_at,is_placeholder,alt_text',
  },
  siteSettings: {
    table: 'site_settings',
    columns: 'setting_key,draft_value,published_value,status,updated_at',
  },
}

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key)

const normalizeError = (scope, error, fallbackMessage = 'Unable to load this admin data.') => ({
  scope,
  code: error?.code || error?.name || 'admin_read_failed',
  message: error?.message || fallbackMessage,
})

const safeRead = async (scope, read, fallback = []) => {
  try {
    const response = await read()
    if (response?.error) {
      return { data: fallback, error: normalizeError(scope, response.error) }
    }

    return { data: response?.data ?? fallback, error: null, count: response?.count ?? null }
  } catch (error) {
    return { data: fallback, error: normalizeError(scope, error) }
  }
}

const probe = async (key, definition) => {
  const result = await safeRead(
    `capabilities.${key}`,
    () => supabase
      .from(definition.table)
      .select(definition.columns)
      .limit(1),
    null,
  )

  return {
    key,
    available: !result.error,
    error: result.error,
  }
}

const probeColumn = async (table, column) => {
  const result = await safeRead(
    `capabilities.${table}.${column}`,
    () => supabase.from(table).select(column).limit(1),
    null,
  )

  return !result.error
}

const cleanStatus = (status) => {
  if (typeof status !== 'string' || !status.trim()) return 'published'
  return status.trim().toLowerCase()
}

/**
 * Legacy content tables do not have a status column. Their existing public
 * records must remain visible, so an absent or empty status is classified as
 * published rather than draft.
 */
export const classifyLegacyRecord = (record, contentType = 'content') => {
  const hasStoredStatus = hasOwn(record, 'status') && typeof record.status === 'string' && Boolean(record.status.trim())

  return {
    ...record,
    status: cleanStatus(record?.status),
    contentType,
    isLegacy: !hasStoredStatus,
  }
}

export const classifyLegacyRecords = (records, contentType = 'content') => (
  Array.isArray(records)
    ? records.map((record) => classifyLegacyRecord(record, contentType))
    : []
)

export const formatBytes = (bytes) => {
  const value = Number(bytes)
  if (!Number.isFinite(value) || value <= 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
  const amount = value / (1024 ** unitIndex)

  return `${amount.toFixed(unitIndex === 0 || amount >= 10 ? 0 : 1)} ${units[unitIndex]}`
}

const inferMimeType = (name = '') => {
  const extension = name.split('.').pop()?.toLowerCase()
  const mimeTypes = {
    avif: 'image/avif',
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    mp4: 'video/mp4',
    png: 'image/png',
    svg: 'image/svg+xml',
    webm: 'video/webm',
    webp: 'image/webp',
  }

  return mimeTypes[extension] || 'application/octet-stream'
}

const isPlaceholderMedia = (file, path) => {
  if (file?.metadata?.isPlaceholder === true || file?.metadata?.is_placeholder === true) return true
  return /(^|[\s/_-])(placeholder|sample|temporary)([\s/_.-]|$)/i.test(path)
}

const toMediaItem = (folder, file) => {
  const path = `${folder}/${file.name}`
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  const size = Number(file.metadata?.size ?? 0)

  return {
    id: file.id || path,
    name: file.name,
    path,
    folder,
    url: data?.publicUrl || '',
    size: Number.isFinite(size) ? size : 0,
    mimeType: file.metadata?.mimetype || file.metadata?.contentType || inferMimeType(file.name),
    updatedAt: file.updated_at || file.created_at || null,
    isPlaceholder: isPlaceholderMedia(file, path),
  }
}

const listStorageFolder = async (folder) => {
  const items = []
  const errors = []
  let offset = 0

  // Supabase Storage list responses are paginated. The safety cap prevents an
  // unexpected API response from creating an unbounded request loop.
  for (let page = 0; page < 100; page += 1) {
    const result = await safeRead(
      `media.${folder}`,
      () => supabase.storage.from(IMAGE_BUCKET).list(folder, {
        limit: STORAGE_PAGE_SIZE,
        offset,
        sortBy: { column: 'updated_at', order: 'desc' },
      }),
    )

    if (result.error) {
      errors.push(result.error)
      break
    }

    const files = result.data.filter((file) => file?.name && file.metadata)
    items.push(...files.map((file) => toMediaItem(folder, file)))

    if (result.data.length < STORAGE_PAGE_SIZE) break
    offset += STORAGE_PAGE_SIZE
  }

  return { items, errors }
}

const dashboardSelects = async () => {
  const [portfolioHasStatus, portfolioHasFeaturedImage, blogHasStatus, servicesHaveStatus, hasPageSections] = await Promise.all([
    probeColumn('portfolio_projects', 'status'),
    probeColumn('portfolio_projects', 'featured_image'),
    probeColumn('blog_posts', 'status'),
    probeColumn('services', 'status'),
    probe('pageContent', CAPABILITY_PROBES.pageContent).then((result) => result.available),
  ])

  const portfolioColumns = ['id', 'title', 'image', 'created_at', 'updated_at']
  if (portfolioHasStatus) portfolioColumns.push('status')
  if (portfolioHasFeaturedImage) portfolioColumns.push('featured_image')

  const blogColumns = ['id', 'title', 'image', 'date', 'created_at', 'updated_at']
  if (blogHasStatus) blogColumns.push('status')

  const serviceColumns = ['id', 'title', 'icon', 'created_at', 'updated_at']
  if (servicesHaveStatus) serviceColumns.push('status')

  const reads = [
    safeRead('portfolio', () => supabase.from('portfolio_projects').select(portfolioColumns.join(','))),
    safeRead('blog', () => supabase.from('blog_posts').select(blogColumns.join(','))),
    safeRead('services', () => supabase.from('services').select(serviceColumns.join(','))),
    hasPageSections
      ? safeRead(
          'pageContent',
          () => supabase.from('page_sections').select('id,page_key,section_key,status,created_at,updated_at'),
        )
      : Promise.resolve({ data: [], error: null }),
  ]

  const [projectsResult, postsResult, servicesResult, pagesResult] = await Promise.all(reads)

  return {
    projects: classifyLegacyRecords(projectsResult.data, 'project'),
    posts: classifyLegacyRecords(postsResult.data, 'post'),
    services: classifyLegacyRecords(servicesResult.data, 'service'),
    pages: classifyLegacyRecords(pagesResult.data, 'page'),
    errors: [projectsResult.error, postsResult.error, servicesResult.error, pagesResult.error].filter(Boolean),
  }
}

const getTimestamp = (record) => record.updated_at || record.created_at || record.date || null

const toRecentItem = (record) => ({
  id: `${record.contentType}:${record.id}`,
  recordId: record.id,
  type: record.contentType,
  title: record.title || record.section_key || record.page_key || 'Untitled content',
  status: record.status,
  updatedAt: getTimestamp(record),
  isLegacy: record.isLegacy,
})

const buildRecentItems = (collections, limit = DEFAULT_RECENT_LIMIT) => {
  const safeLimit = Number.isFinite(Number(limit)) ? Math.max(0, Math.floor(Number(limit))) : DEFAULT_RECENT_LIMIT

  return collections
    .flat()
    .map(toRecentItem)
    .filter((item) => item.updatedAt && !Number.isNaN(new Date(item.updatedAt).getTime()))
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, safeLimit)
}

const buildMissingMediaItems = (projects, posts) => {
  const missingProjects = projects
    .filter((project) => !String(project.featured_image || project.image || '').trim())
    .map((project) => ({
      id: `project:${project.id}`,
      recordId: project.id,
      type: 'project',
      title: project.title || 'Untitled project',
      field: 'featured image',
    }))

  const missingPosts = posts
    .filter((post) => !String(post.image || '').trim())
    .map((post) => ({
      id: `post:${post.id}`,
      recordId: post.id,
      type: 'post',
      title: post.title || 'Untitled article',
      field: 'featured image',
    }))

  return [...missingProjects, ...missingPosts]
}

export const adminAPI = {
  classifyLegacyRecord,
  classifyLegacyRecords,
  formatBytes,

  async getPageSections(pageKey) {
    const { data, error } = await supabase.from('page_sections').select('*').eq('page_key', pageKey)
    if (error) throw error
    return data || []
  },

  async publishPageSection(pageKey, sectionKey, content) {
    const now = new Date().toISOString()
    const { data, error } = await supabase.from('page_sections').upsert({
      page_key: pageKey,
      section_key: sectionKey,
      draft_content: content,
      published_content: content,
      status: 'published',
      published_at: now,
    }, { onConflict: 'page_key,section_key' }).select().single()
    if (error) throw error
    return data
  },

  async getSiteSettings() {
    const { data, error } = await supabase.from('site_settings').select('*')
    if (error) throw error
    return data || []
  },

  async publishSiteSettings(values) {
    const now = new Date().toISOString()
    const rows = Object.entries(values).map(([setting_key, value]) => ({
      setting_key,
      draft_value: { value },
      published_value: { value },
      status: 'published',
      published_at: now,
    }))
    const { data, error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'setting_key' }).select()
    if (error) throw error
    return data || []
  },

  async getCapabilities() {
    const results = await Promise.all(
      Object.entries(CAPABILITY_PROBES).map(([key, definition]) => probe(key, definition)),
    )

    const capabilities = {
      pageContent: false,
      advancedPortfolio: false,
      advancedBlog: false,
      advancedServices: false,
      mediaMetadata: false,
      siteSettings: false,
      inquiries: false,
    }

    const errors = []
    results.forEach((result) => {
      capabilities[result.key] = result.available
      if (result.error) errors.push(result.error)
    })

    return { ...capabilities, errors }
  },

  async getMediaInventory() {
    const results = await Promise.all(MEDIA_FOLDERS.map(listStorageFolder))
    const items = results
      .flatMap((result) => result.items)
      .sort((left, right) => {
        const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0
        const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0
        return rightTime - leftTime
      })

    return {
      items,
      errors: results.flatMap((result) => result.errors),
    }
  },

  async getRecentUpdates(limit = DEFAULT_RECENT_LIMIT) {
    const records = await dashboardSelects()
    return {
      items: buildRecentItems([records.projects, records.posts, records.services, records.pages], limit),
      errors: records.errors,
    }
  },

  async getMissingMedia() {
    const records = await dashboardSelects()
    const items = buildMissingMediaItems(records.projects, records.posts)

    return {
      items,
      count: items.length,
      errors: records.errors,
    }
  },

  async getOverview() {
    const records = await dashboardSelects()
    const missingMedia = buildMissingMediaItems(records.projects, records.posts)
    const drafts = [...records.projects, ...records.posts, ...records.services, ...records.pages]
      .filter((record) => record.status === 'draft')
      .length

    return {
      stats: {
        projects: records.projects.length,
        publishedPosts: records.posts.filter((post) => post.status === 'published').length,
        drafts,
        inquiries: null,
        missingMedia: missingMedia.length,
      },
      recent: buildRecentItems([records.projects, records.posts, records.services, records.pages]),
      errors: records.errors,
      source: 'supabase',
    }
  },

  async getInquiries() {
    return {
      available: false,
      items: [],
      reason: INQUIRIES_UNAVAILABLE_REASON,
      errors: [],
    }
  },
}
