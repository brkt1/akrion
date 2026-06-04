import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ScrollAnimation, { StaggerContainer, StaggerItem } from '../components/ScrollAnimation'
import { authAPI } from '../lib/api/auth'
import { portfolioAPI } from '../lib/api/portfolio'
import { uploadAPI } from '../lib/api/upload'

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CREAM = '#F5EDD8'
const CARD_BG = 'rgba(19,32,25,0.9)'
const CARD_BORDER = 'rgba(201,161,112,0.1)'
const INPUT_STYLE = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(201,161,112,0.05)',
  border: '1px solid rgba(201,161,112,0.15)',
  borderRadius: '12px', color: '#F5EDD8', fontSize: '14px',
  outline: 'none', transition: 'border-color 0.2s, background 0.2s',
}

// ── Static showcase projects with case-study structure
const showcaseProjects = [
  {
    id: 'showcase-1',
    title: 'Cassopia Tour',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    problem: 'No online booking system — losing customers to competitors with better digital presence.',
    strategy: 'Built a full-stack booking platform with live availability, WhatsApp integration & SEO optimization.',
    result: '3× increase in online bookings within 60 days of launch.',
    tags: ['React', 'Web App', 'Booking Platform'],
    link: null,
  },
  {
    id: 'showcase-2',
    title: 'Yenege Games',
    category: 'Game Development',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    problem: 'Ethiopian culture was underrepresented in mobile gaming — a massive untapped audience.',
    strategy: 'Created an immersive Ethiopian-themed mobile game with authentic storyline & local language support.',
    result: '10,000+ downloads in launch week — #1 trending in the App Store Ethiopia category.',
    tags: ['Game Dev', 'Mobile', 'Cultural Brand'],
    link: null,
  },
  {
    id: 'showcase-3',
    title: "Corno D'Africa",
    category: 'Brand Film',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    problem: 'Restaurant struggling to communicate its authentic Horn of Africa story to modern customers.',
    strategy: 'Produced a cinematic documentary-style brand film that told the founders\' real story with emotion.',
    result: '50,000+ organic views — dramatically increased walk-in customers and reservations.',
    tags: ['Video', 'Storytelling', 'Brand Film'],
    link: null,
  },
  {
    id: 'showcase-4',
    title: 'Akrion Run Campaign',
    category: 'Campaign',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    problem: 'City-wide event with no brand awareness or digital footprint to drive participation.',
    strategy: 'Launched a multi-platform campaign with countdown content, influencer collab & event branding.',
    result: '3,000+ registrations, 1M+ social impressions and 15 brand sponsors secured.',
    tags: ['Campaign', 'Social Media', 'Event Marketing'],
    link: null,
  },
  {
    id: 'showcase-5',
    title: 'Teff & Bula',
    category: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    problem: 'Entering international F&B markets with no brand identity — just a product idea.',
    strategy: 'Developed complete premium brand identity: logo, packaging, web presence & brand story.',
    result: 'Secured 2 international distribution agreements within 3 months of brand launch.',
    tags: ['Brand Identity', 'Packaging', 'F&B'],
    link: null,
  },
]

// ── Case study card component
const CaseStudyCard = ({ project, isAdmin, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="group relative rounded-2xl overflow-hidden border transition-all duration-500"
      style={{ borderColor: CARD_BORDER, background: CARD_BG }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = CARD_BORDER}
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden">
        {project.image ? (
          <>
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,26,15,0.97) 0%, rgba(10,26,15,0.5) 50%, transparent 100%)' }} />
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

        {/* Bottom project name */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-lg sm:text-xl font-bold leading-tight" style={{ color: CREAM }}>{project.title}</h3>
        </div>

        {/* Admin controls */}
        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <button onClick={() => onEdit(project)} className="text-xs px-2 py-1 rounded-lg" style={{ color: GOLD, background: 'rgba(201,161,112,0.1)' }}>Edit</button>
            <button onClick={() => onDelete(project.id)} className="text-xs text-red-400 px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>Delete</button>
          </div>
        )}
      </div>

      {/* Case Study Content */}
      <div className="p-5 flex flex-col gap-0">
        {/* Case study toggle button */}
        {(project.problem || project.strategy || project.result) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full py-3 text-xs font-semibold tracking-wide uppercase transition-colors duration-200"
            style={{
              color: expanded ? GOLD : 'rgba(201,161,112,0.4)',
              borderBottom: '1px solid rgba(201,161,112,0.06)',
            }}
          >
            <span>{expanded ? 'Hide Case Study' : 'View Case Study'}</span>
            <svg
              width="12" height="12" viewBox="0 0 20 20" fill="none"
              className="transition-transform duration-300"
              style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Expandable case study — Problem / Strategy / Result */}
        {expanded && (project.problem || project.strategy || project.result) && (
          <div className="flex flex-col gap-3 pt-4 pb-2 animate-fadeIn">
            {project.problem && (
              <div className="flex gap-3">
                <span className="text-xs font-black mt-0.5 flex-shrink-0" style={{ color: '#E05C5C' }}>THE CHALLENGE</span>
                <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.55)' }}>{project.problem}</p>
              </div>
            )}
            {project.strategy && (
              <div className="flex gap-3">
                <span className="text-xs font-black mt-0.5 flex-shrink-0" style={{ color: GOLD }}>OUR STRATEGY</span>
                <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.55)' }}>{project.strategy}</p>
              </div>
            )}
            {project.result && (
              <div
                className="flex gap-3 p-3 rounded-xl mt-1"
                style={{ background: 'rgba(201,161,112,0.07)', border: '1px solid rgba(201,161,112,0.12)' }}
              >
                <span className="text-xs font-black mt-0.5 flex-shrink-0" style={{ color: '#7AB48C' }}>✓ RESULT</span>
                <p className="text-xs font-semibold leading-relaxed" style={{ color: CREAM }}>{project.result}</p>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {project.tags && (
          <div className="flex flex-wrap gap-1.5 pt-4">
            {(typeof project.tags === 'string' ? project.tags.split(',') : project.tags).map((tag, idx) => (
              <span key={idx} className="tag-pill">{typeof tag === 'string' ? tag.trim() : tag}</span>
            ))}
          </div>
        )}

        {/* Link */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-xs font-semibold tracking-wide uppercase mt-3 transition-colors"
            style={{ color: GOLD }}
            onMouseEnter={e => e.currentTarget.style.color = GOLD_LIGHT}
            onMouseLeave={e => e.currentTarget.style.color = GOLD}
          >
            View Live Project →
          </a>
        )}
      </div>
    </div>
  )
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
  const [formData, setFormData] = useState({
    title: '', description: '', image: '', category: '', link: '', tags: '',
    problem: '', strategy: '', result: '',
  })

  useEffect(() => {
    loadProjects()
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const adminMode = localStorage.getItem('portfolioAdminMode') === 'true'
    if (adminMode) {
      const isActuallyAdmin = await authAPI.isAdmin()
      setIsAdmin(isActuallyAdmin)
      if (!isActuallyAdmin) localStorage.removeItem('portfolioAdminMode')
    } else {
      setIsAdmin(false)
    }
  }

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
      setFormData({ title: '', description: '', image: '', category: '', link: '', tags: '', problem: '', strategy: '', result: '' })
      setShowForm(false); setIsEditing(false); setEditingProject(null)
    } catch (err) { console.error(err); setError('Failed to save project.') }
    finally { setLoading(false) }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title, description: project.description || '',
      image: project.image || '', category: project.category || '',
      link: project.link || '', tags: project.tags || '',
      problem: project.problem || '', strategy: project.strategy || '', result: project.result || '',
    })
    setShowForm(true); setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try { setLoading(true); await portfolioAPI.delete(id); await loadProjects() }
      catch (err) { setError('Failed to delete project.') }
      finally { setLoading(false) }
    }
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

  // Combine database projects with showcase projects
  const allProjects = projects.length > 0
    ? projects.map(p => ({ ...p, isDb: true }))
    : showcaseProjects

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden" style={{ background: '#0D1F13' }}>
        <div className="fixed inset-0 dot-grid opacity-30 z-0 pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] z-0 pointer-events-none" style={{ background: 'rgba(245,237,216,0.03)' }} />

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
                <p className="text-lg leading-relaxed mt-4 max-w-2xl font-light" style={{ color: 'rgba(245,237,216,0.45)' }}>
                  Every project starts with a challenge. Here's how we solved them — and the results we delivered.
                </p>
              </ScrollAnimation>
              {isAdmin && (
                <button
                  onClick={() => { setShowForm(!showForm); if (showForm) { setIsEditing(false); setEditingProject(null); setFormData({ title: '', description: '', image: '', category: '', link: '', tags: '', problem: '', strategy: '', result: '' }) } }}
                  className="btn-primary text-sm px-5 py-2.5 mt-4"
                >
                  {showForm ? 'Cancel' : '+ New Project'}
                </button>
              )}
            </div>

            {/* Case Study Legend */}
            <ScrollAnimation animation="fadeUp" delay={0.2}>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <span style={{ color: 'rgba(245,237,216,0.35)' }}>Each project card shows:</span>
                <span className="flex items-center gap-1.5"><span style={{ color: '#E05C5C' }}>●</span> The Challenge</span>
                <span className="flex items-center gap-1.5"><span style={{ color: GOLD }}>●</span> Our Strategy</span>
                <span className="flex items-center gap-1.5"><span style={{ color: '#7AB48C' }}>●</span> The Result</span>
              </div>
            </ScrollAnimation>

            {/* Admin form */}
            {showForm && (
              <div className="p-6 sm:p-8 rounded-2xl border" style={{ background: CARD_BG, borderColor: 'rgba(201,161,112,0.2)', backdropFilter: 'blur(20px)' }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: CREAM }}>{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'title', placeholder: 'Project title', label: 'Title', required: true },
                      { name: 'category', placeholder: 'e.g. Brand Identity', label: 'Category' },
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
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="2" style={INPUT_STYLE} placeholder="Short project description"
                      onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                  </div>

                  {/* Case Study Fields */}
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(201,161,112,0.04)', border: '1px solid rgba(201,161,112,0.10)' }}>
                    <p className="text-xs font-bold tracking-wide uppercase mb-3" style={{ color: GOLD }}>Case Study Details</p>
                    {[
                      { name: 'problem', label: 'The Challenge / Problem', placeholder: 'What problem did the client face?' },
                      { name: 'strategy', label: 'Our Strategy / Solution', placeholder: 'How did you solve it?' },
                      { name: 'result', label: 'The Result / Outcome', placeholder: 'What were the measurable results?' },
                    ].map(f => (
                      <div key={f.name} className="mb-3">
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: 'rgba(201,161,112,0.45)' }}>{f.label}</label>
                        <textarea name={f.name} value={formData[f.name]} onChange={handleChange} rows="2" style={INPUT_STYLE} placeholder={f.placeholder}
                          onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                      </div>
                    ))}
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
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" staggerDelay={0.08}>
                {allProjects.map((project) => (
                  <StaggerItem key={project.id}>
                    <CaseStudyCard
                      project={project}
                      isAdmin={isAdmin && project.isDb}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}

            {/* Bottom CTA */}
            <ScrollAnimation animation="fadeUp" delay={0.3}>
              <div
                className="text-center p-8 sm:p-12 rounded-3xl border"
                style={{
                  background: 'rgba(201,161,112,0.04)',
                  borderColor: 'rgba(201,161,112,0.12)',
                }}
              >
                <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: GOLD }}>Want results like these?</p>
                <h3 className="font-display font-bold text-2xl sm:text-3xl mb-2" style={{ color: CREAM }}>
                  Your business deserves more than an average online presence.
                </h3>
                <p className="text-sm font-light mb-6 max-w-md mx-auto" style={{ color: 'rgba(245,237,216,0.4)' }}>
                  Let's talk about your project. First strategy call is completely free.
                </p>
                <a
                  href="https://wa.me/251976601172?text=Hi!%20I%20saw%20your%20portfolio%20and%20I%20want%20results%20like%20these%20for%20my%20brand."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex px-10 py-4 text-base group"
                >
                  Let's Build Your Brand
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </ScrollAnimation>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Portfolio
