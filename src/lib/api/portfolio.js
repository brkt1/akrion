import { supabase } from '../supabase'

export const portfolioAPI = {
  // Get all portfolio projects
  async getAll() {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching portfolio projects:', error)
      throw error
    }
    return data || []
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
      .insert([
        {
          title: project.title,
          description: project.description,
          image: project.image || null,
          category: project.category || null,
          link: project.link || null,
          tags: project.tags || null
        }
      ])
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
        title: project.title,
        description: project.description,
        image: project.image || null,
        category: project.category || null,
        link: project.link || null,
        tags: project.tags || null,
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

