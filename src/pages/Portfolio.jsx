import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { ResponsiveImage } from '../components/portfolio/ProjectGallery'
import ScrollAnimation, { StaggerContainer, StaggerItem } from '../components/ScrollAnimation'
import {
  getProjectPath,
  mergePortfolioRecords,
  portfolioProjects,
} from '../data/portfolioProjects'
import { authAPI } from '../lib/api/auth'
import { portfolioAPI } from '../lib/api/portfolio'
import { uploadAPI } from '../lib/api/upload'

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CREAM = '#F5EDD8'
const CARD_BG = 'rgba(19,32,25,0.9)'
const EMPTY_FORM = { title: '', description: '', image: '', category: '', link: '', tags: '' }
const INPUT_STYLE = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(201,161,112,0.05)',
  border: '1px solid rgba(201,161,112,0.15)',
  borderRadius: '12px',
  color: CREAM,
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
}

const ArrowIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M4 10H15M10.5 5.5L15 10L10.5 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const VideoPlayIcon = () => (
  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M5.25 3.75L11.5 8L5.25 12.25V3.75Z" fill="currentColor" />
  </svg>
)

const getCardGridClassName = (project, index, total) => {
  const classNames = ['portfolio-card-grid-item']

  if (project.featured) classNames.push('portfolio-card-grid-item--featured')
  if (index === total - 1) {
    if (total % 3 === 0) classNames.push('portfolio-card-grid-item--last-full')
    if (total % 3 === 1) classNames.push('portfolio-card-grid-item--last-wide')
    if (total % 2 === 0) classNames.push('portfolio-card-grid-item--tablet-full')
  }

  return classNames.join(' ')
}

const CaseStudyCard = ({ project, isAdmin, onEdit, onDelete }) => {
  const cardRef = useRef(null)
  const tiltFrameRef = useRef(null)
  const result = project.result?.statement

  useEffect(
    () => () => {
      if (tiltFrameRef.current) window.cancelAnimationFrame(tiltFrameRef.current)
    },
    [],
  )

  const resetTilt = () => {
    if (tiltFrameRef.current) window.cancelAnimationFrame(tiltFrameRef.current)
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--portfolio-card-rotate-x', '0deg')
    card.style.setProperty('--portfolio-card-rotate-y', '0deg')
  }

  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse') return
    if (event.target.closest('button')) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const card = cardRef.current
    if (!card) return
    const { clientX, clientY } = event

    if (tiltFrameRef.current) window.cancelAnimationFrame(tiltFrameRef.current)
    tiltFrameRef.current = window.requestAnimationFrame(() => {
      const bounds = card.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width))
      const y = Math.max(0, Math.min(1, (clientY - bounds.top) / bounds.height))
      const rotateX = (0.5 - y) * 2
      const rotateY = (x - 0.5) * 2.4
      card.style.setProperty('--portfolio-card-rotate-x', `${rotateX.toFixed(2)}deg`)
      card.style.setProperty('--portfolio-card-rotate-y', `${rotateY.toFixed(2)}deg`)
    })
  }

  return (
    <article
      ref={cardRef}
      className="portfolio-editorial-card group"
      data-featured={project.featured ? 'true' : undefined}
      data-presentation={project.presentation || undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      onBlur={resetTilt}
    >
      <Link
        to={getProjectPath(project)}
        aria-label={`View the ${project.title} case study`}
        className="portfolio-grid-card-link"
      >
        <div className="portfolio-card-media">
          {project.hero ? (
            <ResponsiveImage
              media={project.hero}
              sizes={project.featured
                ? '(min-width: 1100px) 64vw, (min-width: 640px) 96vw, 100vw'
                : '(min-width: 1100px) 31vw, (min-width: 640px) 48vw, 100vw'}
              className="portfolio-grid-card-image"
            />
          ) : (
            <div className="portfolio-card-image-fallback" aria-hidden="true">
              <span>{project.title?.charAt(0)}</span>
            </div>
          )}

          <span className="portfolio-card-media-wash" aria-hidden="true" />

          {project.featured && (
            <span className="portfolio-card-featured-label">Featured Project</span>
          )}

          {project.presentation === 'video' && (
            <span className="portfolio-card-play-mark" aria-hidden="true">
              <VideoPlayIcon />
            </span>
          )}

          <span className="portfolio-card-media-action" aria-hidden="true">
            View Case Study <span className="portfolio-card-arrow"><ArrowIcon /></span>
          </span>
        </div>

        <div className="portfolio-card-info">
          {project.category && (
            <div className="portfolio-card-category-row">
              <span>{project.category}</span>
              <i aria-hidden="true" />
            </div>
          )}

          <h2>{project.title}</h2>

          {project.summary && <p className="portfolio-card-summary">{project.summary}</p>}

          <ul className="portfolio-card-tags" aria-label="Project tags">
            {project.tags?.slice(0, 2).map((tag) => (
              <li key={tag} className="portfolio-card-tag">{tag}</li>
            ))}
          </ul>

          <div className={`portfolio-card-result${result ? '' : ' portfolio-card-result--empty'}`}>
            {result && (
              <>
                <span>Completed outcome</span>
                <p title={result}>{result}</p>
              </>
            )}
          </div>

          <span className="portfolio-card-footer-action">
            View Case Study <span className="portfolio-card-arrow"><ArrowIcon /></span>
          </span>
        </div>
      </Link>

      {isAdmin && project.sourceRecord && (
        <div className="absolute right-4 top-4 z-20 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(project.sourceRecord)}
            className="rounded-lg px-2.5 py-1.5 text-xs backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C49A]"
            style={{ color: GOLD_LIGHT, background: 'rgba(7,26,15,0.88)', border: '1px solid rgba(201,161,112,0.24)' }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(project.sourceRecord.id)}
            className="rounded-lg px-2.5 py-1.5 text-xs text-red-300 backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
            style={{ background: 'rgba(45,12,12,0.88)', border: '1px solid rgba(248,113,113,0.24)' }}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  )
}

const Portfolio = () => {
  const [records, setRecords] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await portfolioAPI.getAll()
        setRecords(data)
      } catch (loadError) {
        console.error('Unable to load live portfolio records; using the verified local portfolio.', loadError)
      } finally {
        setLoading(false)
      }
    }

    const checkAdmin = async () => {
      const adminMode = localStorage.getItem('portfolioAdminMode') === 'true'
      if (!adminMode) {
        setIsAdmin(false)
        return
      }
      const isActuallyAdmin = await authAPI.isAdmin()
      setIsAdmin(isActuallyAdmin)
      if (!isActuallyAdmin) localStorage.removeItem('portfolioAdminMode')
    }

    load()
    checkAdmin()
  }, [])

  const loadProjects = async () => {
    const data = await portfolioAPI.getAll()
    setRecords(data)
  }

  const resetForm = () => {
    setFormData(EMPTY_FORM)
    setEditingProject(null)
    setShowForm(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError(null)
      if (editingProject) await portfolioAPI.update(editingProject.id, formData)
      else await portfolioAPI.create(formData)
      await loadProjects()
      resetForm()
    } catch (saveError) {
      console.error(saveError)
      setError('Failed to save the project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title || '',
      description: project.description || '',
      image: project.image || '',
      category: project.category || '',
      link: project.link || '',
      tags: project.tags || '',
    })
    setShowForm(true)
    window.requestAnimationFrame(() => document.getElementById('portfolio-admin-form')?.scrollIntoView({ block: 'start' }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      setLoading(true)
      setError(null)
      await portfolioAPI.delete(id)
      await loadProjects()
    } catch (deleteError) {
      console.error(deleteError)
      setError('Failed to delete the project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.')
      return
    }

    try {
      setUploading(true)
      setError(null)
      const imageUrl = await uploadAPI.uploadImage(file, 'portfolio')
      setFormData((current) => ({ ...current, image: imageUrl }))
    } catch (uploadError) {
      console.error(uploadError)
      setError('Failed to upload the image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const displayedProjects = records.length
    ? mergePortfolioRecords(records)
    : portfolioProjects

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden" style={{ background: '#0D1F13' }}>
        <div className="dot-grid pointer-events-none fixed inset-0 z-0 opacity-30" />
        <div className="pointer-events-none fixed bottom-0 right-0 z-0 h-[600px] w-[600px] rounded-full blur-[160px]" style={{ background: 'rgba(245,237,216,0.03)' }} />

        <div className="relative z-10 px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-10 sm:gap-14">
            <div>
              <ScrollAnimation animation="fadeUp" delay={0.1} respectReducedMotion>
                <div className="section-label mb-4"><span className="section-dot" />Our Projects</div>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8} respectReducedMotion>
                <h1 className="section-heading text-[clamp(3rem,8vw,5.5rem)]">PORTFOLIO</h1>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.35} respectReducedMotion>
                <p className="mt-4 max-w-2xl text-lg font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.65)' }}>
                  Explore the thinking, craft, and completed outcomes behind selected Akrion projects.
                </p>
              </ScrollAnimation>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    if (showForm) resetForm()
                    else setShowForm(true)
                  }}
                  className="btn-primary mt-4 px-5 py-2.5 text-sm"
                >
                  {showForm ? 'Cancel' : '+ New Project'}
                </button>
              )}
            </div>

            <ScrollAnimation animation="fadeUp" delay={0.2} respectReducedMotion>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <span style={{ color: 'rgba(245,237,216,0.62)' }}>Open any project for the full case study:</span>
                <span className="flex items-center gap-1.5"><span style={{ color: GOLD }}>●</span> Approach</span>
                <span className="flex items-center gap-1.5"><span style={{ color: GOLD }}>●</span> Work &amp; outcome</span>
              </div>
            </ScrollAnimation>

            {showForm && (
              <div id="portfolio-admin-form" className="scroll-mt-28 rounded-2xl border p-6 sm:p-8" style={{ background: CARD_BG, borderColor: 'rgba(201,161,112,0.2)', backdropFilter: 'blur(20px)' }}>
                <h2 className="mb-6 text-xl font-bold" style={{ color: CREAM }}>{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[
                      { name: 'title', label: 'Title', placeholder: 'Project title', required: true },
                      { name: 'category', label: 'Category', placeholder: 'e.g. Brand Identity' },
                    ].map((field) => (
                      <div key={field.name}>
                        <label htmlFor={`portfolio-${field.name}`} className="mb-2 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(201,161,112,0.58)' }}>{field.label}</label>
                        <input
                          id={`portfolio-${field.name}`}
                          type="text"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={(event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))}
                          style={INPUT_STYLE}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label htmlFor="portfolio-description" className="mb-2 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(201,161,112,0.58)' }}>Description</label>
                    <textarea
                      id="portfolio-description"
                      name="description"
                      value={formData.description}
                      onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                      rows="3"
                      style={INPUT_STYLE}
                      placeholder="Concise, verified project summary"
                    />
                  </div>
                  <div>
                    <label htmlFor="portfolio-image" className="mb-2 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(201,161,112,0.58)' }}>Image</label>
                    <input id="portfolio-image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="w-full cursor-pointer text-sm" style={{ ...INPUT_STYLE, padding: '10px 16px' }} />
                    {uploading ? (
                      <p className="mt-2 text-xs" style={{ color: GOLD }}>Uploading…</p>
                    ) : (
                      <input
                        aria-label="Image URL"
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={(event) => setFormData((current) => ({ ...current, image: event.target.value }))}
                        style={{ ...INPUT_STYLE, marginTop: '8px' }}
                        placeholder="Or paste an image URL"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[
                      { name: 'link', label: 'Project Link', placeholder: 'https://example.com' },
                      { name: 'tags', label: 'Tags (comma separated)', placeholder: 'Tag1, Tag2, Tag3' },
                    ].map((field) => (
                      <div key={field.name}>
                        <label htmlFor={`portfolio-${field.name}`} className="mb-2 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(201,161,112,0.58)' }}>{field.label}</label>
                        <input
                          id={`portfolio-${field.name}`}
                          type="text"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={(event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))}
                          style={INPUT_STYLE}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn-primary self-start px-7 py-3" disabled={loading || uploading}>
                    {loading ? 'Saving…' : editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                </form>
              </div>
            )}

            {error && <div className="rounded-xl p-4 text-sm text-red-300" role="alert" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

            <StaggerContainer className="portfolio-card-grid" staggerDelay={0.08} respectReducedMotion>
              {displayedProjects.map((project, index) => (
                <StaggerItem
                  key={project.slug}
                  className={getCardGridClassName(project, index, displayedProjects.length)}
                >
                  <CaseStudyCard
                    project={project}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {loading && !showForm && <p className="text-center text-xs" aria-live="polite" style={{ color: 'rgba(201,161,112,0.45)' }}>Checking for the latest projects…</p>}

            <ScrollAnimation animation="fadeUp" delay={0.3} respectReducedMotion>
              <div className="rounded-3xl border p-8 text-center sm:p-12" style={{ background: 'rgba(201,161,112,0.04)', borderColor: 'rgba(201,161,112,0.12)' }}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: GOLD }}>Have a project in mind?</p>
                <h2 className="font-display mb-2 text-2xl font-bold sm:text-3xl" style={{ color: CREAM }}>Let’s build something people remember.</h2>
                <p className="mx-auto mb-6 max-w-md text-sm font-light" style={{ color: 'rgba(245,237,216,0.58)' }}>Tell us what you are building and where you want it to go.</p>
                <Link to="/contact" className="btn-primary group inline-flex px-10 py-4 text-base">
                  Start a Project <ArrowIcon />
                </Link>
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
