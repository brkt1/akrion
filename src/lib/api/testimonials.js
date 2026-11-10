import { loadSupabase } from '../loadSupabase'

const fields = 'id,client_name,client_role,client_company,quotation,project_image,verified_result,rating,is_verified,status,sort_order,published_at,archived_at,created_at,updated_at'

export const testimonialsAPI = {
  async getPublished() {
    const supabase = await loadSupabase()
    const { data, error } = await supabase.from('testimonials').select(fields).eq('status', 'published').eq('is_verified', true).is('archived_at', null).order('sort_order').order('created_at')
    if (error) throw error
    return data || []
  },
  async getAll() {
    const supabase = await loadSupabase()
    const { data, error } = await supabase.from('testimonials').select(fields).order('sort_order').order('created_at')
    if (error) throw error
    return data || []
  },
  async create(values) {
    const supabase = await loadSupabase()
    const { data, error } = await supabase.from('testimonials').insert(values).select(fields).single()
    if (error) throw error
    return data
  },
  async update(id, values) {
    const supabase = await loadSupabase()
    const { data, error } = await supabase.from('testimonials').update(values).eq('id', id).select(fields).single()
    if (error) throw error
    return data
  },
  async archive(id) {
    return this.update(id, { status: 'archived', archived_at: new Date().toISOString() })
  },
}
