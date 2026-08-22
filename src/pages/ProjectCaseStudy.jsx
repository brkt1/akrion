import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageMeta from '../components/PageMeta'
import ProjectGallery, { ResponsiveImage } from '../components/portfolio/ProjectGallery'
import {
  getNextProject,
  getProjectBySlug,
  getProjectPath,
  mergePortfolioRecords,
  portfolioProjects,
} from '../data/portfolioProjects'
import { portfolioAPI } from '../lib/api/portfolio'

const ArrowIcon = ({ direction = 'right' }) => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}
  >
    <path d="M4 10H15M10.5 5.5L15 10L10.5 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Reveal = ({ children, className = '', reducedMotion }) => (
  <motion.div
    className={className}
    initial={reducedMotion ? false : { opacity: 0, y: 22 }}
    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
    viewport={reducedMotion ? undefined : { once: true, amount: 0.18 }}
    transition={reducedMotion ? undefined : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

const Pattern = () => <div className="portfolio-case-pattern eth-pattern-subtle" aria-hidden="true" />

const SectionHeading = ({ eyebrow, title, id }) => (
  <header className="portfolio-case-section-heading">
    <p className="portfolio-case-eyebrow">{eyebrow}</p>
    <h2 id={id}>{title}</h2>
  </header>
)

const getOverviewFacts = (project) => {
  const overview = project.overview || {}
  return [
    overview.client && { label: 'Client', value: overview.client },
    overview.industry && { label: 'Industry', value: overview.industry },
    overview.services?.length && { label: 'Services', value: overview.services.join(' · ') },
    overview.year && { label: 'Year', value: overview.year },
  ].filter(Boolean)
}

const ProjectCaseStudy = () => {
  const { slug } = useParams()
  const reducedMotion = useReducedMotion()
  const canonicalProject = useMemo(() => getProjectBySlug(slug), [slug])
  const [project, setProject] = useState(canonicalProject || null)
  const [projectCollection, setProjectCollection] = useState(portfolioProjects)
  const [loading, setLoading] = useState(!canonicalProject)
  const [loadError, setLoadError] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const titleRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setProject(canonicalProject || null)
    setProjectCollection(portfolioProjects)
    setLoading(!canonicalProject)
    setLoadError(false)
    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo({ top: 0, behavior: 'auto' })
    root.style.scrollBehavior = previousScrollBehavior

    const loadProject = async () => {
      try {
        const records = await portfolioAPI.getAll()
        if (cancelled) return
        const merged = mergePortfolioRecords(records)
        setProjectCollection(merged)

        if (canonicalProject) {
          setProject(merged.find((item) => item.slug === canonicalProject.slug) || canonicalProject)
          return
        }

        setProject(merged.find((item) => item.slug === slug) || null)
      } catch (error) {
        if (!cancelled) {
          console.error('Unable to load portfolio case study:', error)
          setProject(canonicalProject || null)
          setLoadError(!canonicalProject)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProject()
    return () => {
      cancelled = true
    }
  }, [canonicalProject, loadAttempt, slug])

  useEffect(() => {
    if (loading) return undefined
    const frame = window.requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(frame)
  }, [loadError, loading, project?.slug])

  if (loading && !project) {
    return (
      <>
        <Header />
        <PageMeta
          title="Loading Project | Akrion Digitals"
          path={`/portfolio/${slug}`}
          noIndex
        />
        <main className="portfolio-case-loading" aria-live="polite">
          <span className="portfolio-case-loading-mark" aria-hidden="true" />
          <p>Loading project…</p>
        </main>
      </>
    )
  }

  if (!project && loadError) {
    return (
      <>
        <Header />
        <PageMeta
          title="Project Temporarily Unavailable | Akrion Digitals"
          description="This project could not be loaded right now."
          path={`/portfolio/${slug}`}
          noIndex
        />
        <main className="portfolio-case-not-found">
          <Pattern />
          <div className="portfolio-case-shell">
            <p className="portfolio-case-eyebrow">Portfolio</p>
            <h1 ref={titleRef} tabIndex="-1">Project temporarily unavailable.</h1>
            <p>We could not load this case study right now. Try again or return to the portfolio.</p>
            <div className="portfolio-case-error-actions">
              <button type="button" className="btn-primary inline-flex" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
                Try Again <ArrowIcon />
              </button>
              <Link to="/portfolio" className="portfolio-case-error-link">Back to Portfolio</Link>
            </div>
          </div>
        </main>
        <Footer hideCtaBanner />
      </>
    )
  }

  if (!project) {
    return (
      <>
        <Header />
        <PageMeta
          title="Project Not Found | Akrion Digitals"
          description="Return to the Akrion Digitals portfolio to explore available work."
          path={`/portfolio/${slug}`}
          noIndex
        />
        <main className="portfolio-case-not-found">
          <Pattern />
          <div className="portfolio-case-shell">
            <p className="portfolio-case-eyebrow">Portfolio</p>
            <h1 ref={titleRef} tabIndex="-1">Project not found.</h1>
            <p>This case study is not available. Explore the current Akrion Digitals portfolio instead.</p>
            <Link to="/portfolio" className="btn-primary inline-flex">
              Back to Portfolio <ArrowIcon />
            </Link>
          </div>
        </main>
        <Footer hideCtaBanner />
      </>
    )
  }

  const facts = getOverviewFacts(project)
  const contentSections = [
    facts.length && { key: 'overview' },
    project.challenge && { key: 'challenge' },
    project.approach && { key: 'approach' },
    project.gallery?.length && { key: 'work' },
    project.result?.statement && { key: 'result' },
    project.testimonial?.quote && project.testimonial?.name && { key: 'testimonial' },
  ].filter(Boolean)
  const nextProject = getNextProject(project.slug, projectCollection)
  const nextTone = contentSections.length % 2 === 0 ? 'emerald' : 'ivory'

  const renderSection = (section) => {
    switch (section.key) {
      case 'overview':
        return (
          <Reveal className="portfolio-case-shell" reducedMotion={reducedMotion}>
            <SectionHeading eyebrow="Project Overview" title="The project at a glance." id="project-overview-heading" />
            <dl className="portfolio-case-facts">
              {facts.map((fact) => (
                <div className="portfolio-case-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )
      case 'challenge':
        return (
          <Reveal className="portfolio-case-shell portfolio-case-prose-grid" reducedMotion={reducedMotion}>
            <SectionHeading eyebrow="The Challenge" title="What the work needed to solve." id="project-challenge-heading" />
            <p className="portfolio-case-lead">{project.challenge}</p>
          </Reveal>
        )
      case 'approach':
        return (
          <Reveal className="portfolio-case-shell" reducedMotion={reducedMotion}>
            <SectionHeading eyebrow="Our Approach" title="Understand. Create. Deliver." id="project-approach-heading" />
            <ol className="portfolio-case-approach">
              {[
                ['01', 'Understand', project.approach.understand],
                ['02', 'Create', project.approach.create],
                ['03', 'Deliver', project.approach.deliver],
              ].map(([number, label, copy]) => (
                <li className="portfolio-case-stage" key={label}>
                  <span aria-hidden="true">{number}</span>
                  <h3>{label}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        )
      case 'work':
        return (
          <Reveal className="portfolio-case-shell" reducedMotion={reducedMotion}>
            <SectionHeading eyebrow="The Work" title="A closer look at the project." id="project-work-heading" />
            <ProjectGallery key={project.slug} items={project.gallery} projectTitle={project.title} />
          </Reveal>
        )
      case 'result':
        return (
          <Reveal className="portfolio-case-shell portfolio-case-result" reducedMotion={reducedMotion}>
            <SectionHeading eyebrow="The Result" title="The completed outcome." id="project-result-heading" />
            <p className="portfolio-case-result-statement">{project.result.statement}</p>
            {project.result.metrics?.length > 0 && (
              <dl className="portfolio-case-metrics">
                {project.result.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt>{metric.value}</dt>
                    <dd>{metric.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        )
      case 'testimonial':
        return (
          <Reveal className="portfolio-case-shell portfolio-case-testimonial" reducedMotion={reducedMotion}>
            <SectionHeading eyebrow="Client Testimonial" title="In the client’s words." id="project-testimonial-heading" />
            <blockquote>
              <p>“{project.testimonial.quote}”</p>
              <footer>
                <strong>{project.testimonial.name}</strong>
                {(project.testimonial.role || project.testimonial.organization) && (
                  <span>{[project.testimonial.role, project.testimonial.organization].filter(Boolean).join(', ')}</span>
                )}
              </footer>
            </blockquote>
          </Reveal>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <PageMeta
        title={project.seo?.title || `${project.title} | Akrion Digitals`}
        description={project.seo?.description || project.summary}
        image={project.seo?.image || project.hero?.src}
        imageAlt={project.hero?.alt || ''}
        path={getProjectPath(project)}
        type="article"
      />

      <main className="portfolio-case-page">
        <section className="portfolio-case-hero" data-tone="ivory" aria-labelledby="project-title">
          <Pattern />
          <div className="portfolio-case-hero-glow" aria-hidden="true" />
          <div className="portfolio-case-shell portfolio-case-hero-grid">
            <motion.div
              className="portfolio-case-hero-copy"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={reducedMotion ? undefined : { duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/portfolio" className="portfolio-case-back-link">
                <ArrowIcon direction="left" /> Back to Portfolio
              </Link>
              <div className="portfolio-case-hero-meta" role="group" aria-label="Project details">
                {project.category && <span>{project.category}</span>}
                {project.overview?.client && <span>{project.overview.client}</span>}
                {project.overview?.year && <span>{project.overview.year}</span>}
              </div>
              <h1 id="project-title" ref={titleRef} tabIndex="-1">{project.title}</h1>
              {project.summary && <p className="portfolio-case-summary">{project.summary}</p>}
              {project.externalLink && (
                <a className="portfolio-case-live-link" href={project.externalLink} target="_blank" rel="noopener noreferrer">
                  Visit Live Project <ArrowIcon />
                </a>
              )}
            </motion.div>

            {project.hero && (
              <motion.figure
                className="portfolio-case-hero-media"
                data-fit={project.hero.fit || 'cover'}
                data-orientation={project.hero.width && project.hero.height && project.hero.height > project.hero.width ? 'portrait' : 'landscape'}
                style={{
                  '--portfolio-media-ratio': project.hero.width && project.hero.height
                    ? `${project.hero.width} / ${project.hero.height}`
                    : '16 / 10',
                }}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={reducedMotion ? undefined : { duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <ResponsiveImage
                  media={project.hero}
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 900px) 54vw, 100vw"
                  className="portfolio-case-hero-image"
                />
                <span className="portfolio-case-frame-corner portfolio-case-frame-corner--top" aria-hidden="true" />
                <span className="portfolio-case-frame-corner portfolio-case-frame-corner--bottom" aria-hidden="true" />
              </motion.figure>
            )}
          </div>
        </section>

        {contentSections.map((section, index) => (
          <section
            key={section.key}
            className={`portfolio-case-section portfolio-case-section--${section.key}`}
            data-tone={index % 2 === 0 ? 'emerald' : 'ivory'}
            aria-labelledby={`project-${section.key}-heading`}
          >
            <Pattern />
            {renderSection(section)}
          </section>
        ))}

        <section className="portfolio-case-next" data-tone={nextTone} aria-labelledby="next-project-heading">
          <Pattern />
          <div className="portfolio-case-shell">
            {nextProject && nextProject.slug !== project.slug && (
              <Reveal reducedMotion={reducedMotion}>
                <p className="portfolio-case-eyebrow">Next Project</p>
                <Link to={getProjectPath(nextProject)} className="portfolio-case-next-link group">
                  {nextProject.hero && (
                    <div
                      className="portfolio-case-next-media"
                      data-fit={nextProject.hero.fit || 'cover'}
                      data-orientation={nextProject.hero.width && nextProject.hero.height && nextProject.hero.height > nextProject.hero.width ? 'portrait' : 'landscape'}
                      style={{
                        '--portfolio-media-ratio': nextProject.hero.width && nextProject.hero.height
                          ? `${nextProject.hero.width} / ${nextProject.hero.height}`
                          : '16 / 10',
                      }}
                    >
                      <ResponsiveImage
                        media={nextProject.hero}
                        sizes="(min-width: 900px) 48vw, 100vw"
                        className="portfolio-case-next-image"
                      />
                    </div>
                  )}
                  <div className="portfolio-case-next-copy">
                    <span>{nextProject.category}</span>
                    <h2 id="next-project-heading">{nextProject.title}</h2>
                    <strong>View Next Project <ArrowIcon /></strong>
                  </div>
                </Link>
              </Reveal>
            )}

            <div className="portfolio-case-cta">
              <div>
                <p>Have a project in mind?</p>
                <span>Let’s create something clear, memorable, and built to move your business forward.</span>
              </div>
              <Link to="/contact" className="btn-primary inline-flex">
                Start a Project <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer hideCtaBanner />
    </>
  )
}

export default ProjectCaseStudy
