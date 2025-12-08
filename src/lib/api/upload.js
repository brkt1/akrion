import { supabase } from '../supabase'

export const uploadAPI = {
  // Upload image to Supabase Storage
  async uploadImage(file, folder = 'uploads') {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Upload file
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading file:', error)
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  },

  // Delete image from Supabase Storage
  async deleteImage(filePath) {
    try {
      // Extract file path from URL
      const fileName = filePath.split('/').slice(-2).join('/') // Get folder/filename
      
      const { error } = await supabase.storage
        .from('images')
        .remove([fileName])

      if (error) {
        console.error('Error deleting file:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }
}

