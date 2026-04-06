import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ScrollAnimation from '../components/ScrollAnimation'
import { servicesAPI } from '../lib/api/services'

// Brand constants
const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CARD_BG = 'rgba(19,32,25,0.9)'
const CARD_BORDER = 'rgba(201,161,112,0.1)'
const INPUT_STYLE = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(201,161,112,0.05)',
  border: '1px solid rgba(201,161,112,0.15)',
  borderRadius: '12px',
  color: '#F0EAD6',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
}

// Icon components
const BrandIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
)
const DevIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
)
const VideoIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
)
const SocialIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const ConsultingIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
)

const iconMap = {
  'Branding': <BrandIcon />,
  'Development': <DevIcon />,
  'Video': <VideoIcon />,
  'Social Media': <SocialIcon />,
  'Consulting': <ConsultingIcon />,
}

const Services = () => {
  const [services, setServices] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', icon: '' })

  useEffect(() => {
    loadServices()
    const adminStatus = localStorage.getItem('servicesAdminMode')
    setIsAdmin(adminStatus === 'true')
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await servicesAPI.getAll()
      setServices(data)
    } catch (err) {
      console.error('Error loading services:', err)
      setError('Failed to load services. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      if (editingService) {
        await servicesAPI.update(editingService.id, formData)
      } else {
        await servicesAPI.create(formData)
      }
      await loadServices()
      setFormData({ title: '', description: '', icon: '' })
      setShowForm(false)
      setIsEditing(false)
      setEditingService(null)
    } catch (err) {
      console.error('Error saving service:', err)
      setError('Failed to save service.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({ title: service.title, description: service.description, icon: service.icon || '' })
    setShowForm(true)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        setLoading(true)
        await servicesAPI.delete(id)
        await loadServices()
      } catch (err) {
        setError('Failed to delete service.')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleAdmin = () => {
    const next = !isAdmin
    setIsAdmin(next)
    localStorage.setItem('servicesAdminMode', next.toString())
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden" style={{ background: '#0D1F13' }}>
        <div className="fixed inset-0 dot-grid opacity-30 z-0 pointer-events-none" />
        <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[160px] z-0 pointer-events-none" style={{ background: 'rgba(201,161,112,0.05)' }} />

        <div className="relative z-10 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-12 sm:gap-16">

            {/* Header */}
            <div>
              <ScrollAnimation animation="fadeUp" delay={0.1}>
                <div className="section-label mb-4"><span className="section-dot" />What We Offer</div>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
                <h1 className="section-heading text-[clamp(3rem,8vw,5.5rem)]">SERVICES</h1>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.35}>
                <p className="text-lg leading-relaxed mt-4 max-w-2xl font-light" style={{ color: 'rgba(201,161,112,0.5)' }}>
                  We merge imagination with execution to help your brand rise above the noise.
                </p>
              </ScrollAnimation>

              <div className="flex items-center gap-4 mt-6 flex-wrap">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setShowForm(!showForm)
                      if (showForm) { setIsEditing(false); setEditingService(null); setFormData({ title: '', description: '', icon: '' }) }
                    }}
                    className="btn-primary text-sm px-5 py-2.5"
                  >
                    {showForm ? 'Cancel' : '+ New Service'}
                  </button>
                )}
                <button onClick={toggleAdmin} className="text-xs font-mono transition-colors" style={{ color: 'rgba(201,161,112,0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,161,112,0.3)'}
                >
                  {isAdmin ? '[ exit admin ]' : '[ admin ]'}
                </button>
              </div>
            </div>

            {/* Admin form */}
            {showForm && (
              <ScrollAnimation animation="fadeUp" delay={0.1}>
                <div className="p-6 sm:p-8 rounded-2xl border" style={{ background: CARD_BG, borderColor: 'rgba(201,161,112,0.2)', backdropFilter: 'blur(20px)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.4 }} />
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#F0EAD6' }}>
                    {isEditing ? 'Edit Service' : 'Create New Service'}
                  </h2>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} style={INPUT_STYLE} placeholder="Service title" required
                          onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>Icon Type</label>
                        <select name="icon" value={formData.icon} onChange={handleChange} style={{ ...INPUT_STYLE }}>
                          <option value="">Select Icon</option>
                          {['Branding', 'Development', 'Video', 'Social Media', 'Consulting'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>Description</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={INPUT_STYLE} placeholder="Service description" required
                        onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                    </div>
                    <button type="submit" className="btn-primary self-start px-7 py-3">
                      {isEditing ? 'Update Service' : 'Create Service'}
                    </button>
                  </form>
                </div>
              </ScrollAnimation>
            )}

            {error && (
              <div className="p-4 rounded-xl text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>
            )}

            {/* Services grid */}
            {loading && services.length === 0 ? (
              <div className="text-center py-16 text-sm" style={{ color: 'rgba(201,161,112,0.4)' }}>Loading services…</div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 text-sm" style={{ color: 'rgba(201,161,112,0.4)' }}>No services yet. Create your first service!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((service, index) => {
                  const IconComponent = iconMap[service.icon] || <BrandIcon />
                  const isHovered = hoveredIndex === index
                  return (
                    <ScrollAnimation key={service.id} animation="fadeUp" delay={0.1 + index * 0.07}>
                      <div
                        className="group relative flex flex-col gap-6 p-6 sm:p-7 rounded-2xl border transition-all duration-400 h-full cursor-default"
                        style={{
                          background: isHovered ? 'rgba(201,161,112,0.07)' : CARD_BG,
                          borderColor: isHovered ? CARD_BORDER.replace('0.1', '0.28') : CARD_BORDER,
                          boxShadow: isHovered ? '0 20px 60px rgba(0,0,0,0.4)' : 'none',
                          transform: isHovered ? 'translateY(-4px)' : 'none',
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Top accent line on hover */}
                        {isHovered && (
                          <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                        )}

                        {isAdmin && (
                          <div className="absolute top-3 right-3 flex gap-2 z-20">
                            <button onClick={() => handleEdit(service)} className="text-xs px-2 py-1 rounded-lg transition-colors" style={{ color: GOLD, background: 'rgba(201,161,112,0.1)' }}>Edit</button>
                            <button onClick={() => handleDelete(service.id)} className="text-xs text-red-400 px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>Delete</button>
                          </div>
                        )}

                        {/* Icon */}
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                          style={{
                            background: `rgba(201,161,112,${isHovered ? '0.15' : '0.08'})`,
                            color: GOLD,
                            border: `1px solid rgba(201,161,112,${isHovered ? '0.3' : '0.15'})`,
                            transform: isHovered ? 'scale(1.08) rotate(2deg)' : 'none',
                          }}
                        >
                          {React.cloneElement(IconComponent, { className: 'w-7 h-7' })}
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                          <h3 className="text-lg font-semibold leading-snug" style={{ color: '#F0EAD6' }}>{service.title}</h3>
                          <p className="text-sm leading-relaxed font-light" style={{ color: 'rgba(201,161,112,0.5)' }}>{service.description}</p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase pt-4 transition-colors duration-300"
                          style={{ color: isHovered ? GOLD : 'rgba(201,161,112,0.25)', borderTop: `1px solid rgba(201,161,112,0.08)` }}>
                          <span>Learn more</span>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </ScrollAnimation>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Services
