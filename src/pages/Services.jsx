import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { servicesAPI } from '../lib/api/services'

const Services = () => {
  const [services, setServices] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: ''
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Custom SVG Icons
  const BrandIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
      <path d="M2 17l10 5 10-5"></path>
      <path d="M2 12l10 5 10-5"></path>
    </svg>
  )

  const DevIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  )

  const VideoIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  )

  const SocialIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  )

  const ConsultingIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
    </svg>
  )

  const iconMap = {
    'Branding': <BrandIcon />,
    'Development': <DevIcon />,
    'Video': <VideoIcon />,
    'Social Media': <SocialIcon />,
    'Consulting': <ConsultingIcon />
  }

  // Load services from Supabase on mount
  useEffect(() => {
    loadServices()
    // Check if admin mode is enabled
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
        // Update existing service
        await servicesAPI.update(editingService.id, formData)
      } else {
        // Create new service
        await servicesAPI.create(formData)
      }
      await loadServices()
      setFormData({
        title: '',
        description: '',
        icon: ''
      })
      setShowForm(false)
      setIsEditing(false)
      setEditingService(null)
    } catch (err) {
      console.error('Error saving service:', err)
      setError('Failed to save service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || ''
    })
    setShowForm(true)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        setLoading(true)
        setError(null)
        await servicesAPI.delete(id)
        await loadServices()
      } catch (err) {
        console.error('Error deleting service:', err)
        setError('Failed to delete service. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleAdmin = () => {
    const newAdminStatus = !isAdmin
    setIsAdmin(newAdminStatus)
    localStorage.setItem('servicesAdminMode', newAdminStatus.toString())
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const bgImageUrl = 'https://images.unsplash.com/photo-1697311622332-184b7bb19a46?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29ueSUyMGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000'

  // Staggered layout configuration for more organic feel
  const getCardStyle = (index) => {
    const styles = [
      { transform: 'rotate(-1deg)', marginTop: '0' },
      { transform: 'rotate(1deg)', marginTop: '2rem' },
      { transform: 'rotate(-0.5deg)', marginTop: '0' },
      { transform: 'rotate(1.5deg)', marginTop: '1.5rem' },
      { transform: 'rotate(-1.2deg)', marginTop: '0' }
    ]
    return styles[index % styles.length]
  }

  return (
    <>
      <Header />
      <div 
        className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen relative"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Content */}
        <section className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col gap-12 sm:gap-16 md:gap-20">
            {/* Header Section */}
            <div className="relative">
              <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
                <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[280px]">
                    <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-4 sm:mb-6 text-white drop-shadow-lg">
                      SERVICES
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl drop-shadow-md">
                      We merge imagination with execution to help your brand rise above the noise.
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setShowForm(!showForm)
                        if (showForm) {
                          setIsEditing(false)
                          setEditingService(null)
                          setFormData({
                            title: '',
                            description: '',
                            icon: ''
                          })
                        }
                      }}
                      className="bg-accent-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF6B2E] transition-colors whitespace-nowrap"
                    >
                      {showForm ? 'Cancel' : '+ New Service'}
                    </button>
                  )}
                </div>
                <button
                  onClick={toggleAdmin}
                  className="text-xs sm:text-sm text-white/50 hover:text-accent-orange transition-colors font-mono"
                >
                  {isAdmin ? '[ exit admin ]' : '[ admin ]'}
                </button>
              </div>
            </div>

            {/* Create/Edit Form */}
            {showForm && (
              <div className="backdrop-blur-md bg-black/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
                  {isEditing ? 'Edit Service' : 'Create New Service'}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                        placeholder="Service title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Icon Type</label>
                      <select
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent-orange transition-colors"
                      >
                        <option value="">Select Icon</option>
                        <option value="Branding">Branding</option>
                        <option value="Development">Development</option>
                        <option value="Video">Video</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Consulting">Consulting</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors resize-none"
                      placeholder="Service description"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-accent-orange text-white px-8 py-3 rounded-lg font-medium hover:bg-[#FF6B2E] transition-colors self-start"
                  >
                    {isEditing ? 'Update Service' : 'Create Service'}
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

            {/* Services - Asymmetrical Layout */}
            {loading && services.length === 0 ? (
              <div className="text-center py-12 text-white/70">
                <p className="text-lg">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12 text-white/70">
                <p className="text-lg">No services yet. Create your first service!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                {services.map((service, index) => {
                  const cardStyle = getCardStyle(index)
                  const IconComponent = iconMap[service.icon] || <BrandIcon />
                  
                  return (
                    <div
                      key={service.id}
                      className="group relative"
                      style={isMobile ? {} : cardStyle}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div 
                        className={`
                          relative backdrop-blur-md bg-black/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 
                          border border-white/10 transition-all duration-500 h-full
                          ${hoveredIndex === index ? 'border-accent-orange/60 scale-[1.02] shadow-2xl shadow-accent-orange/20' : 'hover:border-white/20'}
                        `}
                      >
                        {isAdmin && (
                          <div className="absolute top-3 right-3 flex gap-2 z-20">
                            <button
                              onClick={() => handleEdit(service)}
                              className="text-xs text-accent-orange hover:text-white bg-black/70 backdrop-blur-sm px-2 py-1 rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="text-xs text-red-400 hover:text-white bg-black/70 backdrop-blur-sm px-2 py-1 rounded transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}

                        {/* Icon with background */}
                        <div className="mb-6 sm:mb-8 relative">
                          <div className={`
                            inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl
                            bg-gradient-to-br from-accent-orange/20 to-accent-orange/5
                            border border-accent-orange/30
                            text-accent-orange
                            transition-all duration-500
                            ${hoveredIndex === index ? 'scale-110 rotate-3' : ''}
                          `}>
                            <div className="transition-transform duration-500">
                              {React.cloneElement(IconComponent, { className: "w-8 h-8 sm:w-10 sm:h-10" })}
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 drop-shadow-md leading-tight">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-white/80 leading-relaxed drop-shadow-sm">
                          {service.description}
                        </p>

                        {/* Decorative line */}
                        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
                          <div className="flex items-center gap-2 text-accent-orange/70 text-sm font-medium">
                            <span>Learn more</span>
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 20 20" 
                              fill="none"
                              className={`transition-transform duration-300 ${hoveredIndex === index ? 'translate-x-1' : ''}`}
                            >
                              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>

                        {/* Hover glow effect */}
                        {hoveredIndex === index && (
                          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent-orange/5 to-transparent pointer-events-none"></div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Services
