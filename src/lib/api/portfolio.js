import { loadSupabase } from '../loadSupabase'
import { serializeMediaItems } from '../../data/portfolioMedia'

const isLegacyWorkflowSchemaError = (error) => {
  const code = String(error?.code || '')
  const message = String(error?.message || '')
  return code === '42703'
    || code === 'PGRST204'
    || /(?:column|field).*(?:status|archived_at|sort_order).*(?:does not exist|schema cache)/i.test(message)
}

const getAllPortfolioProjects = async (signal) => {
  const supabase = await loadSupabase()
  const query = supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false })
  const { data, error } = await (signal ? query.abortSignal(signal) : query)

  if (error) {
    console.error('Error fetching portfolio projects:', error)
    throw error
  }
  return data || []
}

const fetchPublishedPortfolioProjects = async (signal) => {
  const supabase = await loadSupabase()
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('status', 'published')
    .is('archived_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .abortSignal(signal)

  if (!error) return { data: data || [], workflow: 'advanced' }
  if (isLegacyWorkflowSchemaError(error)) {
    return { data: await getAllPortfolioProjects(signal), workflow: 'legacy' }
  }

  console.error('Error fetching published portfolio projects:', error)
  throw error
}

let publishedRequest
let publishedResult
let publishedUntil = 0

const invalidatePublishedProjects = () => {
  publishedResult = undefined
  publishedRequest = undefined
  publishedUntil = 0
}

const getPublishedPortfolioProjectsResult = async () => {
  if (publishedResult && Date.now() < publishedUntil) return publishedResult
  if (publishedRequest) return publishedRequest
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  const request = fetchPublishedPortfolioProjects(controller.signal).then(result => {
    if (publishedRequest === request) {
      publishedResult = result
      publishedUntil = Date.now() + 15000
    }
    return result
  }).finally(() => {
    clearTimeout(timeout)
    if (publishedRequest === request) publishedRequest = undefined
  })
  publishedRequest = request
  return request
}

const buildPortfolioPayload = (project) => {
  const payload = {
    title: project.title,
    description: project.cardDescription || project.description || '',
    image: project.image || null,
    category: project.category || null,
    link: project.link || null,
    tags: project.tags || null,
  }

  if (project.advanced === true) {
    const status = project.status || 'draft'
    Object.assign(payload, {
      slug: project.slug || null,
      client_name: project.clientName || null,
      industry: project.industry || null,
      project_year: project.year || null,
      card_description: project.cardDescription || null,
      project_summary: project.summary || null,
      challenge: project.challenge || null,
      approach: project.approach || {},
      work_delivered: project.workDelivered || null,
      services: project.services || null,
      result: project.result || null,
      metrics: Array.isArray(project.metrics) ? project.metrics : [],
      testimonial_quote: project.testimonialQuote || null,
      testimonial_name: project.testimonialName || null,
      testimonial_role: project.testimonialRole || null,
      testimonial_organization: project.testimonialOrganization || null,
      alt_text: project.altText || null,
      image_caption: project.imageCaption || null,
      featured_image: project.image || null,
      gallery: Array.isArray(project.gallery) ? project.gallery : [],
      video_url: project.videoUrl || null,
      seo_title: project.seoTitle || null,
      seo_description: project.seoDescription || null,
      status,
      homepage_featured: Boolean(project.homepageFeatured),
      featured: Boolean(project.featured),
      sort_order: Number.isFinite(Number(project.sortOrder)) ? Number(project.sortOrder) : 0,
      published_at: status === 'published' ? (project.publishedAt || new Date().toISOString()) : null,
      archived_at: status === 'archived' ? (project.archivedAt || new Date().toISOString()) : null,
    })
  }

  if (project.collectionsEnabled === true) {
    payload.collection_type = project.collectionType === 'company' ? 'company' : 'project'
    payload.media_items = serializeMediaItems(project.mediaItems || [])
    // Keep the original fields as a recoverable compatibility source. New
    // collections use media_items exclusively; do not flatten old metadata.
    delete payload.gallery
    delete payload.video_url
  }

  return payload
}

export const portfolioAPI = {
  // Get all portfolio projects
  async getAll() {
    return getAllPortfolioProjects()
  },

  async getPublished() {
    const result = await getPublishedPortfolioProjectsResult()
    return result.data
  },

  // Public pages use this marker to avoid reintroducing a CMS draft through
  // the bundled legacy content registry.
  async getPublishedResult() {
    return getPublishedPortfolioProjectsResult()
  },

  // Get a single project by ID
  async getById(id) {
    const supabase = await loadSupabase()
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching portfolio project:', error)
      throw error
    }
    return data
  },

  // Create a new project
  async create(project) {
    const supabase = await loadSupabase()
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([buildPortfolioPayload(project)])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating portfolio project:', error)
      throw error
    }
    invalidatePublishedProjects()
    return data
  },

  // Update a project
  async update(id, project) {
    const supabase = await loadSupabase()
    const { data, error } = await supabase
      .from('portfolio_projects')
      .update({
        ...buildPortfolioPayload(project),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating portfolio project:', error)
      throw error
    }
    invalidatePublishedProjects()
    return data
  },

  // Delete a project
  async delete(id) {
    const supabase = await loadSupabase()
    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting portfolio project:', error)
      throw error
    }
    invalidatePublishedProjects()
    return true
  }
}

