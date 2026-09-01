import { supabase } from '../supabase'

const BLOG_STATUSES = new Set(['draft', 'scheduled', 'published', 'archived'])

const cleanText = (value) => String(value || '').trim()

const toPositiveInteger = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.max(1, Math.round(parsed)) : null
}

const toIsoOrNull = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

const normalizeRelatedArticleIds = (value) => (
  Array.isArray(value)
    ? value
        .map((id) => Number(id))
        .filter((id) => Number.isSafeInteger(id) && id > 0)
    : []
)

export const calculateReadingTime = (content, wordsPerMinute = 220) => {
  const words = String(content || '')
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!words.length) return 0
  const pace = Number(wordsPerMinute)
  return Math.max(1, Math.ceil(words.length / (Number.isFinite(pace) && pace > 0 ? pace : 220)))
}

const buildBlogPayload = (post) => {
  const publisher = cleanText(post.publisher || post.author) || 'Akrion Digitals'
  const publicationDate = cleanText(post.publicationDate || post.date)
  const payload = {
    title: cleanText(post.title),
    content: String(post.content || ''),
    author: publisher,
    image: cleanText(post.image) || null,
    category: cleanText(post.category) || null,
  }

  // The legacy table supplies CURRENT_DATE by default. Avoid fabricating a
  // publication date for advanced drafts when the editor intentionally leaves
  // it empty.
  if (publicationDate) payload.date = publicationDate

  if (post.advanced === true) {
    const requestedStatus = cleanText(post.status).toLowerCase()
    const status = BLOG_STATUSES.has(requestedStatus) ? requestedStatus : 'draft'
    const readingTime = toPositiveInteger(post.readingTime)

    Object.assign(payload, {
      slug: cleanText(post.slug) || null,
      excerpt: cleanText(post.excerpt) || null,
      image_alt: cleanText(post.imageAlt) || null,
      publisher,
      publication_date: publicationDate || null,
      reading_time: readingTime,
      featured: Boolean(post.featured),
      status,
      scheduled_at: status === 'scheduled' ? toIsoOrNull(post.scheduledAt) : null,
      seo_title: cleanText(post.seoTitle) || null,
      seo_description: cleanText(post.seoDescription) || null,
      related_article_ids: normalizeRelatedArticleIds(post.relatedArticleIds),
      published_at: status === 'published'
        ? (toIsoOrNull(post.publishedAt) || new Date().toISOString())
        : null,
      archived_at: status === 'archived'
        ? (toIsoOrNull(post.archivedAt) || new Date().toISOString())
        : null,
    })
  }

  return payload
}

const isLegacyWorkflowSchemaError = (error) => {
  const code = String(error?.code || '')
  const message = String(error?.message || '')
  return code === '42703'
    || code === 'PGRST204'
    || /(?:column|field).*(?:status|archived_at|publication_date).*(?:does not exist|schema cache)/i.test(message)
}

const getAllBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    throw error
  }
  return data || []
}

const getPublishedBlogPostsResult = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .is('archived_at', null)
    .order('publication_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (!error) return { data: data || [], workflow: 'advanced' }
  if (isLegacyWorkflowSchemaError(error)) {
    return { data: await getAllBlogPosts(), workflow: 'legacy' }
  }

  console.error('Error fetching published blog posts:', error)
  throw error
}

export const blogAPI = {
  // Get all blog posts
  async getAll() {
    return getAllBlogPosts()
  },

  // Public-safe read. Legacy schemas have no workflow column, so every
  // existing row is treated as published and returned by the fallback query.
  async getPublished() {
    const result = await getPublishedBlogPostsResult()
    return result.data
  },

  // Public pages use the workflow marker to know when Supabase is the complete
  // source of truth. This prevents a draft or archived CMS article from being
  // reintroduced by the bundled legacy fallback collection.
  async getPublishedResult() {
    return getPublishedBlogPostsResult()
  },

  // Get a single blog post by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching blog post:', error)
      throw error
    }
    return data
  },

  // Create a new blog post
  async create(post) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([buildBlogPayload(post)])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating blog post:', error)
      throw error
    }
    return data
  },

  // Update a blog post
  async update(id, post) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...buildBlogPayload(post),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating blog post:', error)
      throw error
    }
    return data
  },

  // Delete a blog post
  async delete(id) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting blog post:', error)
      throw error
    }
    return true
  }
}

