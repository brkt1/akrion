import { supabase } from '../supabase'

export const blogAPI = {
  // Get all blog posts
  async getAll() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }
    return data || []
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
      .insert([
        {
          title: post.title,
          content: post.content,
          author: post.author,
          date: post.date,
          image: post.image || null,
          category: post.category || null
        }
      ])
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
        title: post.title,
        content: post.content,
        author: post.author,
        date: post.date,
        image: post.image || null,
        category: post.category || null,
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

