import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { portfolioAPI } from '../lib/api/portfolio'
import { uploadAPI } from '../lib/api/upload'

const Portfolio = () => {
  const [projects, setProjects] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    link: '',
    tags: ''
  })

  // Load projects from Supabase on mount
  useEffect(() => {
    loadProjects()
    // Check if admin mode is enabled
    const adminStatus = localStorage.getItem('portfolioAdminMode')
    setIsAdmin(adminStatus === 'true')
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await portfolioAPI.getAll()
      setProjects(data)
    } catch (err) {
      console.error('Error loading projects:', err)
      setError('Failed to load portfolio projects. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      if (editingProject) {
        // Update existing project
        await portfolioAPI.update(editingProject.id, formData)
      } else {
        // Create new project
        await portfolioAPI.create(formData)
      }
      await loadProjects()
      setFormData({
        title: '',
        description: '',
        image: '',
        category: '',
        link: '',
        tags: ''
      })
      setShowForm(false)
      setIsEditing(false)
      setEditingProject(null)
    } catch (err) {
      console.error('Error saving project:', err)
      setError('Failed to save project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || '',
      category: project.category || '',
      link: project.link || '',
      tags: project.tags || ''
    })
    setShowForm(true)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setLoading(true)
        setError(null)
        await portfolioAPI.delete(id)
        await loadProjects()
      } catch (err) {
        console.error('Error deleting project:', err)
        setError('Failed to delete project. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleAdmin = () => {
    const newAdminStatus = !isAdmin
    setIsAdmin(newAdminStatus)
    localStorage.setItem('portfolioAdminMode', newAdminStatus.toString())
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
      const imageUrl = await uploadAPI.uploadImage(file, 'portfolio')
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
        <section className="max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-10 md:mb-12">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-4">
                  PORTFOLIO
                </h1>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-text-gray max-w-3xl">
                  Explore our creative work and the stories behind each project.
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setShowForm(!showForm)
                    if (showForm) {
                      setIsEditing(false)
                      setEditingProject(null)
                      setFormData({
                        title: '',
                        description: '',
                        image: '',
                        category: '',
                        link: '',
                        tags: ''
                      })
                    }
                  }}
                  className="bg-accent-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF6B2E] transition-colors"
                >
                  {showForm ? 'Cancel' : '+ New Project'}
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
                {isEditing ? 'Edit Project' : 'Create New Project'}
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
                      placeholder="Project title"
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
                  <label className="block text-sm text-text-gray mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors resize-none"
                    placeholder="Project description"
                    required
                  />
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
                  <label className="block text-sm text-text-gray mb-2">Project Link (optional)</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-gray mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                    placeholder="Tag1, Tag2, Tag3"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-accent-orange text-white px-8 py-3 rounded-lg font-medium hover:bg-[#FF6B2E] transition-colors self-start"
                >
                  {isEditing ? 'Update Project' : 'Create Project'}
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

          {/* Portfolio Grid */}
          {loading && projects.length === 0 ? (
            <div className="text-center py-12 text-text-gray">
              <p className="text-lg">Loading portfolio projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-text-gray">
              <p className="text-lg">No projects yet. Create your first project!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-xl sm:rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 border border-[rgba(255,255,255,0.05)] hover:border-accent-orange/50 relative">
                    {project.image && (
                      <div className="absolute inset-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-10">
                      {project.category && (
                        <span className="inline-block text-xs sm:text-sm text-accent-orange mb-2 font-medium">
                          {project.category}
                        </span>
                      )}
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-accent-orange transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm sm:text-base text-text-gray mb-4">
                        {project.description}
                      </p>
                      {project.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.split(',').map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-text-gray bg-white/5 px-2 py-1 rounded"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-accent-orange hover:underline inline-block"
                        >
                          View Project →
                        </a>
                      )}
                      {isAdmin && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(project)
                            }}
                            className="text-sm text-accent-orange hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(project.id)
                            }}
                            className="text-sm text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Portfolio
