import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getProjectPath, portfolioProjects } from '../data/portfolioProjects'

const projects = portfolioProjects.slice(0, 5)

const ArrowIcon = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="17"
    height="17"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M4 10H15M10.5 5.5L15 10L10.5 14.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PlayIcon = () => (
  <span
    aria-hidden="true"
    className="selected-work-play"
  >
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" className="ml-0.5">
      <path d="M8.5 6.5V17.5L17 12L8.5 6.5Z" fill="currentColor" />
    </svg>
  </span>
)

const ResponsiveProjectImage = ({ project, className = '' }) => (
  <img
    src={project.image}
    srcSet={`${project.imageSmall} ${project.imageSmallWidth}w, ${project.image} ${project.width}w`}
    sizes={
      project.featured
        ? '(min-width: 1280px) 57vw, (min-width: 768px) 92vw, 100vw'
        : '(min-width: 1280px) 42vw, (min-width: 768px) 46vw, 100vw'
    }
    width={project.width}
    height={project.height}
    alt={project.alt}
    loading="lazy"
    decoding="async"
    className={className}
  />
)

const ProjectVisual = ({ project }) => {
  if (project.presentation === 'website') {
    return (
      <div className="selected-work-media bg-[radial-gradient(circle_at_30%_20%,rgba(201,161,112,0.16),transparent_42%),linear-gradient(145deg,#10291A,#07130C)]">
        <div className="selected-work-device">
          <div className="selected-work-device-bar" />
          <div className="selected-work-device-screen">
            <ResponsiveProjectImage
              project={project}
              className="selected-work-image"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="selected-work-media">
      <ResponsiveProjectImage
        project={project}
        className={`selected-work-image ${
          project.presentation === 'photography' || project.presentation === 'video'
            ? 'object-cover'
            : 'object-contain'
        }`}
      />
    </div>
  )
}

const ProjectCard = ({ project, index, reducedMotion }) => {
  const reveal = reducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: {
          duration: 0.64,
          delay: project.featured ? 0.08 : 0.17 + (index - 1) * 0.07,
          ease: [0.22, 1, 0.36, 1],
        },
      }

  const layoutClass = project.featured
    ? 'selected-work-card--featured'
    : project.id === 'wedding-special-event-media'
      ? 'selected-work-card--portrait'
      : 'selected-work-card--supporting'

  return (
    <motion.article className={`selected-work-card ${layoutClass}`} {...reveal}>
      <Link
        to={getProjectPath(project)}
        aria-label={`View the ${project.title} case study in the full portfolio`}
        className={`selected-work-card-link group flex h-full min-h-[inherit] w-full text-left ${project.presentation === 'website' ? 'selected-work-card--website' : ''}`}
      >
        <ProjectVisual project={project} />

        <div className="selected-work-overlay pointer-events-none" />

        <div className="pointer-events-none absolute inset-3 z-20 rounded-[1rem] border border-[#C9A170]/[0.08] transition-colors duration-500 group-hover:border-[#C9A170]/20 group-focus-visible:border-[#C9A170]/25 motion-reduce:transition-none sm:inset-4 sm:rounded-[1.2rem]" />

        {project.featured && (
          <span className="absolute left-5 top-5 z-30 inline-flex items-center gap-2 rounded-full border border-[#C9A170]/35 bg-[#081C11]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#E2C49A] backdrop-blur-md sm:left-7 sm:top-7">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A170] shadow-[0_0_10px_rgba(201,161,112,0.75)]" />
            Featured Project
          </span>
        )}

        {project.presentation === 'video' && <PlayIcon />}

        <div className="selected-work-content">
          <p className="selected-work-category mb-2.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#D6B782] sm:text-[11px]">
            {project.cardCategory || project.category}
          </p>
          <h3
            className={`font-display font-bold leading-[1.08] tracking-[-0.025em] text-[#F5EDD8] ${
              project.featured
                ? 'max-w-2xl text-[clamp(1.85rem,4vw,3.35rem)]'
                : 'text-[clamp(1.45rem,2.2vw,2rem)]'
            }`}
          >
            {project.cardTitle || project.title}
          </h3>
          <p
            className={`selected-work-description mt-3 font-light leading-relaxed text-[#F5EDD8]/75 transition duration-500 group-hover:text-[#F5EDD8]/90 group-focus-visible:text-[#F5EDD8]/90 motion-reduce:transition-none ${
              project.featured ? 'max-w-2xl text-sm sm:text-base' : 'max-w-xl text-sm'
            }`}
          >
            {project.description}
          </p>
          <span className="selected-work-action mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#E2C49A] sm:mt-5">
            View Case Study
            <ArrowIcon className="selected-work-arrow" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}

const OurWork = () => {
  const reducedMotion = useReducedMotion()
  const headingReveal = reducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.45 },
        transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
      }

  const ctaReveal = reducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.6 },
        transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <section
      id="portfolio"
      className="selected-work-section relative scroll-mt-24 overflow-hidden bg-[#0A1A0F] px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
      aria-labelledby="selected-work-heading"
    >
      <div className="selected-work-pattern eth-pattern-subtle pointer-events-none absolute inset-0 opacity-[0.14]" />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full bg-[#C9A170]/[0.045] blur-[150px]" />
      <div className="pointer-events-none absolute -left-48 bottom-0 h-[500px] w-[500px] rounded-full bg-[#2D6B3F]/[0.08] blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <motion.header className="selected-work-header max-w-3xl" {...headingReveal}>
          <div className="section-label">
            <span className="section-dot" />
            PORTFOLIO
          </div>
          <h2
            id="selected-work-heading"
            className="section-heading mt-3 text-[clamp(2.4rem,5vw,4.25rem)]"
          >
            OUR WORK.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-[#F5EDD8]/70 sm:text-lg">
            Selected projects shaped through strategy, creativity, and purposeful execution.
          </p>
        </motion.header>

        <div
          className="selected-work-divider my-7 flex items-center gap-3 sm:my-8 sm:gap-4"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-[#C9A170]/45 via-[#C9A170]/15 to-transparent" />
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L29 16L16 29L3 16L16 3Z" stroke="#C9A170" strokeOpacity="0.58" />
            <path d="M16 9L23 16L16 23L9 16L16 9Z" stroke="#E2C49A" strokeOpacity="0.82" />
            <circle cx="16" cy="16" r="2.5" fill="#C9A170" />
          </svg>
          <span className="h-px flex-1 bg-gradient-to-l from-[#C9A170]/45 via-[#C9A170]/15 to-transparent" />
        </div>

        <div className="selected-work-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <motion.div className="mt-9 text-center sm:mt-11" {...ctaReveal}>
          <Link to="/portfolio" className="selected-work-cta btn-primary group inline-flex px-8 py-4 sm:px-10">
            Explore All Projects
            <ArrowIcon className="selected-work-arrow" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default OurWork
