import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ScrollAnimation, { StaggerContainer, StaggerItem } from '../components/ScrollAnimation'
import { portfolioAPI } from '../lib/api/portfolio'
import { uploadAPI } from '../lib/api/upload'

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CARD_BG = 'rgba(19,32,25,0.9)'
const CARD_BORDER = 'rgba(201,161,112,0.1)'
const INPUT_STYLE = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(201,161,112,0.05)',
  border: '1px solid rgba(201,161,112,0.15)',
  borderRadius: '12px', color: '#F0EAD6', fontSize: '14px',
  outline: 'none', transition: 'border-color 0.2s, background 0.2s',
}

const Portfolio = () => {
  const [projects, setProjects] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', image: '', category: '', link: '', tags: '' })

  useEffect(() => {
    loadProjects()
    const adminStatus = localStorage.getItem('portfolioAdminMode')
    setIsAdmin(adminStatus === 'true')
  }, [])

  const loadProjects = async () => {
    try { setLoading(true); setError(null); const data = await portfolioAPI.getAll(); setProjects(data) }
    catch (err) { console.error(err); setError('Failed to load portfolio projects.') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true); setError(null)
      if (editingProject) { await portfolioAPI.update(editingProject.id, formData) }
      else { await portfolioAPI.create(formData) }
      await loadProjects()
      setFormData({ title: '', description: '', image: '', category: '', link: '', tags: '' })
      setShowForm(false); setIsEditing(false); setEditingProject(null)
    } catch (err) { console.error(err); setError('Failed to save project.') }
    finally { setLoading(false) }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({ title: project.title, description: project.description, image: project.image||'', category: project.category||'', link: project.link||'', tags: project.tags||'' })
    setShowForm(true); setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try { setLoading(true); await portfolioAPI.delete(id); await loadProjects() }
      catch (err) { setError('Failed to delete project.') }
      finally { setLoading(false) }
    }
  }

  const toggleAdmin = () => {
    const next = !isAdmin; setIsAdmin(next)
    localStorage.setItem('portfolioAdminMode', next.toString())
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Image size must be less than 5MB'); return }
    try {
      setUploading(true); setError(null)
      const imageUrl = await uploadAPI.uploadImage(file, 'portfolio')
      setFormData({ ...formData, image: imageUrl })
    } catch (err) { setError('Failed to upload image.') }
    finally { setUploading(false) }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden" style={{ background: '#0D1F13' }}>
        <div className="fixed inset-0 dot-grid opacity-30 z-0 pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] z-0 pointer-events-none" style={{ background: 'rgba(201,161,112,0.04)' }} />

        <div className="relative z-10 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-10 sm:gap-14">

            {/* Header */}
            <div>
              <ScrollAnimation animation="fadeUp" delay={0.1}>
                <div className="section-label mb-4"><span className="section-dot" />Our Projects</div>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
                <h1 className="section-heading text-[clamp(3rem,8vw,5.5rem)]">PORTFOLIO</h1>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.35}>
                <p className="text-lg leading-relaxed mt-4 max-w-2xl font-light" style={{ color: 'rgba(201,161,112,0.5)' }}>
                  Explore our creative work and the stories behind each project.
                </p>
              </ScrollAnimation>
              <div className="flex items-center gap-4 mt-6 flex-wrap">
                {isAdmin && (
                  <button
                    onClick={() => { setShowForm(!showForm); if (showForm) { setIsEditing(false); setEditingProject(null); setFormData({ title:'',description:'',image:'',category:'',link:'',tags:'' }) }}}
                    className="btn-primary text-sm px-5 py-2.5"
                  >
                    {showForm ? 'Cancel' : '+ New Project'}
                  </button>
                )}
                <button onClick={toggleAdmin} className="text-xs font-mono" style={{ color: 'rgba(201,161,112,0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,161,112,0.3)'}
                >
                  {isAdmin ? '[ exit admin ]' : '[ admin ]'}
                </button>
              </div>
            </div>

            {/* Admin form */}
            {showForm && (
              <div className="p-6 sm:p-8 rounded-2xl border" style={{ background: CARD_BG, borderColor: 'rgba(201,161,112,0.2)', backdropFilter: 'blur(20px)' }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#F0EAD6' }}>{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'title', placeholder: 'Project title', label: 'Title', required: true },
                      { name: 'category', placeholder: 'e.g. Web Development', label: 'Category' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>{f.label}</label>
                        <input type="text" name={f.name} value={formData[f.name]} onChange={handleChange} style={INPUT_STYLE} placeholder={f.placeholder} required={f.required}
                          onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={INPUT_STYLE} placeholder="Project description" required
                      onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="w-full text-sm cursor-pointer"
                      style={{ ...INPUT_STYLE, padding: '10px 16px' }} />
                    {uploading && <p className="text-xs mt-2" style={{ color: GOLD }}>Uploading…</p>}
                    {!uploading && (
                      <input type="url" name="image" value={formData.image} onChange={handleChange} style={{ ...INPUT_STYLE, marginTop: '8px' }} placeholder="Or paste image URL"
                        onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'link', placeholder: 'https://example.com', label: 'Project Link' },
                      { name: 'tags', placeholder: 'Tag1, Tag2, Tag3', label: 'Tags (comma separated)' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>{f.label}</label>
                        <input type="text" name={f.name} value={formData[f.name]} onChange={handleChange} style={INPUT_STYLE} placeholder={f.placeholder}
                          onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn-primary self-start px-7 py-3">{isEditing ? 'Update Project' : 'Create Project'}</button>
                </form>
              </div>
            )}

            {error && <div className="p-4 rounded-xl text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

            {/* Grid */}
            {loading && projects.length === 0 ? (
              <div className="text-center py-16 text-sm" style={{ color: 'rgba(201,161,112,0.4)' }}>Loading portfolio…</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 text-sm" style={{ color: 'rgba(201,161,112,0.4)' }}>No projects yet. {isAdmin && 'Create your first project!'}</div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" staggerDelay={0.08}>
                {projects.map((project) => (
                  <StaggerItem key={project.id}>
                    <div className="group cursor-pointer relative rounded-2xl overflow-hidden border transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl"
                      style={{ borderColor: CARD_BORDER, background: CARD_BG }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = CARD_BORDER}
                    >
                      {/* Image */}
                      <div className="aspect-[4/5] relative overflow-hidden">
                        {project.image ? (
                          <>
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,26,15,0.95) 0%, rgba(10,26,15,0.4) 50%, transparent 100%)' }} />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(201,161,112,0.05)' }}>
                            <span className="text-4xl font-display font-black" style={{ color: 'rgba(201,161,112,0.15)' }}>{project.title?.charAt(0)}</span>
                          </div>
                        )}

                        {/* Category badge */}
                        {project.category && (
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                              style={{ background: 'rgba(201,161,112,0.15)', color: GOLD_LIGHT, border: `1px solid rgba(201,161,112,0.25)` }}>
                              {project.category}
                            </span>
                          </div>
                        )}

                        {/* Arrow */}
                        <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                          style={{ background: 'rgba(201,161,112,0.15)', border: `1px solid ${CARD_BORDER}`, backdropFilter: 'blur(8px)' }}>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                            <path d="M5 15L15 5M15 5H7M15 5V13" stroke={GOLD_LIGHT} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>

                        {/* Bottom text */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="text-base sm:text-lg font-bold mb-1 leading-tight" style={{ color: '#F0EAD6' }}>{project.title}</h3>
                          <p className="text-xs leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" style={{ color: 'rgba(201,161,112,0.6)' }}>
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* Tags + admin */}
                      {(project.tags || isAdmin) && (
                        <div className="px-5 py-4" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                          {project.tags && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {project.tags.split(',').map((tag, idx) => (
                                <span key={idx} className="tag-pill">{tag.trim()}</span>
                              ))}
                            </div>
                          )}
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="text-xs font-semibold tracking-wide uppercase transition-colors" style={{ color: GOLD }}
                              onMouseEnter={e => e.currentTarget.style.color = GOLD_LIGHT}
                              onMouseLeave={e => e.currentTarget.style.color = GOLD}
                            >
                              View Project →
                            </a>
                          )}
                          {isAdmin && (
                            <div className="flex gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                              <button onClick={(e) => { e.stopPropagation(); handleEdit(project) }} className="text-xs" style={{ color: GOLD }}>Edit</button>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(project.id) }} className="text-xs text-red-400">Delete</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Portfolio
