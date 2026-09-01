import { supabase } from '../supabase'

const isLegacyWorkflowSchemaError = (error) => {
  const code = String(error?.code || '')
  const message = String(error?.message || '')
  return code === '42703'
    || code === 'PGRST204'
    || /(?:column|field).*(?:status|archived_at|sort_order).*(?:does not exist|schema cache)/i.test(message)
}

const getAllPortfolioProjects = async () => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching portfolio projects:', error)
    throw error
  }
  return data || []
}

const getPublishedPortfolioProjectsResult = async () => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('status', 'published')
    .is('archived_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (!error) return { data: data || [], workflow: 'advanced' }
  if (isLegacyWorkflowSchemaError(error)) {
    return { data: await getAllPortfolioProjects(), workflow: 'legacy' }
  }

  console.error('Error fetching published portfolio projects:', error)
  throw error
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
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([buildPortfolioPayload(project)])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating portfolio project:', error)
      throw error
    }
    return data
  },

  // Update a project
  async update(id, project) {
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
    return data
  },

  // Delete a project
  async delete(id) {
    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting portfolio project:', error)
      throw error
    }
    return true
  }
}

