import { supabase } from '../supabase'

export const servicesAPI = {
  // Get all services
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching services:', error)
      throw error
    }
    return data || []
  },

  // Get a single service by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching service:', error)
      throw error
    }
    return data
  },

  // Create a new service
  async create(service) {
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          title: service.title,
          description: service.description,
          icon: service.icon || null
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating service:', error)
      throw error
    }
    return data
  },

  // Update a service
  async update(id, service) {
    const { data, error } = await supabase
      .from('services')
      .update({
        title: service.title,
        description: service.description,
        icon: service.icon || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating service:', error)
      throw error
    }
    return data
  },

  // Delete a service
  async delete(id) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting service:', error)
      throw error
    }
    return true
  }
}

