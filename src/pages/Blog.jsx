import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { blogAPI } from '../lib/api/blog'
import { uploadAPI } from '../lib/api/upload'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    category: ''
  })

  // Load posts from Supabase on mount
  useEffect(() => {
    loadPosts()
    // Check if admin mode is enabled (simple toggle for demo)
    const adminStatus = localStorage.getItem('blogAdminMode')
    setIsAdmin(adminStatus === 'true')
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogAPI.getAll()
      setPosts(data)
    } catch (err) {
      console.error('Error loading posts:', err)
      setError('Failed to load blog posts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      if (editingPost) {
        // Update existing post
        await blogAPI.update(editingPost.id, formData)
      } else {
        // Create new post
        await blogAPI.create(formData)
      }
      await loadPosts()
      setFormData({
        title: '',
        content: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        image: '',
        category: ''
      })
      setShowForm(false)
      setIsEditing(false)
      setEditingPost(null)
    } catch (err) {
      console.error('Error saving post:', err)
      setError('Failed to save post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      date: post.date,
      image: post.image || '',
      category: post.category || ''
    })
    setShowForm(true)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setLoading(true)
        setError(null)
        await blogAPI.delete(id)
        await loadPosts()
      } catch (err) {
        console.error('Error deleting post:', err)
        setError('Failed to delete post. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleAdmin = () => {
    const newAdminStatus = !isAdmin
    setIsAdmin(newAdminStatus)
    localStorage.setItem('blogAdminMode', newAdminStatus.toString())
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    try {
      setUploading(true)
      setError(null)
      const imageUrl = await uploadAPI.uploadImage(file, 'blog')
      setFormData({
        ...formData,
        image: imageUrl
      })
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <section className="max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-10 md:mb-12">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-4">
                  BLOG
                </h1>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-text-gray max-w-3xl">
                  Creative insights, digital storytelling, and design trends from the Akrion team.
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setShowForm(!showForm)
                    if (showForm) {
                      setIsEditing(false)
                      setEditingPost(null)
                      setFormData({
                        title: '',
                        content: '',
                        author: '',
                        date: new Date().toISOString().split('T')[0],
                        image: '',
                        category: ''
                      })
                    }
                  }}
                  className="bg-accent-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF6B2E] transition-colors"
                >
                  {showForm ? 'Cancel' : '+ New Post'}
                </button>
              )}
            </div>
            <button
              onClick={toggleAdmin}
              className="self-start text-sm text-text-gray hover:text-accent-orange transition-colors"
            >
              {isAdmin ? 'Exit Admin Mode' : 'Enter Admin Mode'}
            </button>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="mb-8 sm:mb-10 md:mb-12 backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm text-text-gray mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                      placeholder="Post title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-gray mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                      placeholder="Author name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm text-text-gray mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent-orange transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-gray mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                      placeholder="Category"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-gray mb-2">Image</label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-orange file:text-white hover:file:bg-[#FF6B2E] file:cursor-pointer cursor-pointer disabled:opacity-50"
                    />
                    {uploading && (
                      <p className="text-sm text-accent-orange">Uploading image...</p>
                    )}
                    {formData.image && (
                      <div className="mt-2">
                        <p className="text-xs text-text-gray mb-2">Current image:</p>
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <input
                          type="url"
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          className="mt-2 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                          placeholder="Or enter image URL"
                        />
                      </div>
                    )}
                    {!formData.image && (
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                        placeholder="Or enter image URL"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-gray mb-2">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors resize-none"
                    placeholder="Post content"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-accent-orange text-white px-8 py-3 rounded-lg font-medium hover:bg-[#FF6B2E] transition-colors self-start"
                >
                  {isEditing ? 'Update Post' : 'Create Post'}
                </button>
              </form>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && posts.length === 0 ? (
            <div className="text-center py-12 text-text-gray">
              <p className="text-lg">Loading blog posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-text-gray">
              <p className="text-lg">No blog posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-accent-orange/50 transition-all duration-300"
                >
                  {post.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-8">
                    {post.category && (
                      <span className="inline-block text-xs sm:text-sm text-accent-orange mb-3 font-medium">
                        {post.category}
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-accent-orange transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm sm:text-base text-text-gray mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex justify-between items-center text-xs sm:text-sm text-text-gray">
                      <span>{post.author}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(post)
                          }}
                          className="text-sm text-accent-orange hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(post.id)
                          }}
                          className="text-sm text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Blog
