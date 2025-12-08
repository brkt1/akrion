import { supabase } from '../supabase'

export const contactsAPI = {
  // Create a new contact message
  async create(contact) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: contact.name,
          email: contact.email,
          message: contact.message
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating contact message:', error)
      throw error
    }
    return data
  },

  // Get all contact messages (admin only)
  async getAll() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching contact messages:', error)
      throw error
    }
    return data || []
  },

  // Delete a contact message
  async delete(id) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting contact message:', error)
      throw error
    }
    return true
  }
}

