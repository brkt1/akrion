import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { productionPhotos } from '../data/productionPhotos'
import Footer from './Footer'
import { safeContentUrl, usePublishedSection } from '../lib/publishedContent'
import useConstrainedConnection from '../lib/useConstrainedConnection'

const HERO_ROTATION_MS = 6200
const PROCESS_ROTATION_MS = 6000

// Real production photography in the existing collage and process layout.
const projectVisuals = [
  productionPhotos.onLocation,
  productionPhotos.interviewSet,
  productionPhotos.warmLighting,
  productionPhotos.eventCoverage,
  productionPhotos.sceneSetup,
  productionPhotos.productionKit,
]

const heroVisualIndexes = [0, 1, 2, 3]

const principles = [
  {
    number: '01',
    title: 'Think With Purpose',
    description: 'Every idea begins with a clear goal.',
    visualIndex: 5,
  },
  {
    number: '02',
    title: 'Create With Character',
    description: 'We combine cultural insight with original thinking.',
    visualIndex: 0,
  },
  {
    number: '03',
    title: 'Build for Impact',
    description: 'Our work is designed to connect, perform, and grow.',
    visualIndex: 3,
  },
]

const processStages = [
  { name: 'Discover', visualIndex: 5 },
  { name: 'Define', visualIndex: 0 },
  { name: 'Create', visualIndex: 1 },
  { name: 'Refine', visualIndex: 4 },
]

const ResponsiveProjectImage = ({
  visual,
  className = '',
  isActive = true,
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes = '100vw',
  onLoad,
}) => (
  <picture className={className} aria-hidden={!isActive}>
    <img
      src={visual.large}
      srcSet={visual.srcSet}
      sizes={sizes}
      width={visual.width}
      height={visual.height}
      loading={loading}
      fetchpriority={fetchPriority}
      onLoad={onLoad}
      decoding="async"
      alt={isActive ? visual.alt : ''}
      style={{ '--about-image-position': visual.position }}
    />
  </picture>
)

const usePrefersReducedMotion = () => {
  const framerPreference = useReducedMotion()
  const [nativePreference, setNativePreference] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setNativePreference(motionQuery.matches)

    updatePreference()
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', updatePreference)
      return () => motionQuery.removeEventListener('change', updatePreference)
    }

    motionQuery.addListener(updatePreference)
    return () => motionQuery.removeListener(updatePreference)
  }, [])

  return Boolean(framerPreference || nativePreference)
}

const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(() => (
    typeof document === 'undefined' || document.visibilityState === 'visible'
  ))

  useEffect(() => {
    const updateVisibility = () => setIsVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  return isVisible
}

const reveal = (reducedMotion, delay = 0, distance = 22) => (
  reducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: distance },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.22 },
        transition: { duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] },
      }
)

const About = () => {
  const heroContent = usePublishedSection('about', 'about_hero')
  const principleContent = usePublishedSection('about', 'brand_principles')
  const processContent = usePublishedSection('about', 'how_we_think')
  const closingContent = usePublishedSection('about', 'closing_content')
  const displayedPrinciples = principles.map((item, index) => ({ ...item, title: principleContent[`principle_${index + 1}_title`] || item.title, description: principleContent[`principle_${index + 1}_description`] || item.description }))
  const reducedMotion = usePrefersReducedMotion()
  const constrained = useConstrainedConnection()
  const pageVisible = usePageVisibility()
  const heroRef = useRef(null)
  const processRef = useRef(null)
  const processButtonRefs = useRef([])
  const [heroActiveIndex, setHeroActiveIndex] = useState(0)
  const [collageReady, setCollageReady] = useState(false)
  const [activePrinciple, setActivePrinciple] = useState(0)
  const [activeStage, setActiveStage] = useState(0)
  const [processHasInteracted, setProcessHasInteracted] = useState(false)
  const [processHovered, setProcessHovered] = useState(false)
  const [processFocusWithin, setProcessFocusWithin] = useState(false)
  const heroInView = useInView(heroRef, { amount: 0.12 })
  const processInView = useInView(processRef, { amount: 0.18 })
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const patternParallax = useTransform(scrollYProgress, [0, 1], [0, 24])
  const collageParallax = useTransform(scrollYProgress, [0, 1], [0, 16])

  useEffect(() => {
    // Give the main image the connection first, but still show the visible
    // tiles if that request stalls.
    const deferredImagesTimer = window.setTimeout(() => setCollageReady(true), 2500)
    return () => window.clearTimeout(deferredImagesTimer)
  }, [])

  useEffect(() => {
    if (reducedMotion || constrained) {
      setHeroActiveIndex(0)
      return undefined
    }

    if (!pageVisible || !heroInView || !collageReady) return undefined

    const heroTimer = window.setTimeout(() => {
      setHeroActiveIndex(current => (current + 1) % heroVisualIndexes.length)
    }, HERO_ROTATION_MS)

    return () => window.clearTimeout(heroTimer)
  }, [collageReady, constrained, heroActiveIndex, heroInView, pageVisible, reducedMotion])

  useEffect(() => {
    if (
      reducedMotion
      || constrained
      || !pageVisible
      || !processInView
      || processHasInteracted
      || processHovered
      || processFocusWithin
    ) return undefined

    const processTimer = window.setTimeout(() => {
      setActiveStage(current => (current + 1) % processStages.length)
    }, PROCESS_ROTATION_MS)

    return () => window.clearTimeout(processTimer)
  }, [
    activeStage,
    constrained,
    pageVisible,
    processFocusWithin,
    processHasInteracted,
    processHovered,
    processInView,
    reducedMotion,
  ])

  const handleStageKeyDown = (event, index) => {
    const forwardKeys = ['ArrowRight', 'ArrowDown']
    const backwardKeys = ['ArrowLeft', 'ArrowUp']
    let nextIndex = index

    if (forwardKeys.includes(event.key)) nextIndex = (index + 1) % processStages.length
    else if (backwardKeys.includes(event.key)) nextIndex = (index - 1 + processStages.length) % processStages.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = processStages.length - 1
    else return

    event.preventDefault()
    setProcessHasInteracted(true)
    setActiveStage(nextIndex)
    window.requestAnimationFrame(() => processButtonRefs.current[nextIndex]?.focus())
  }

  const selectStage = index => {
    setProcessHasInteracted(true)
    setActiveStage(index)
  }

  return (
    <>
      <main className="about-story-page">
        <section ref={heroRef} className="about-story-hero" aria-labelledby="about-story-heading">
          <div aria-hidden="true" className="about-story-hero-glow" />
          <motion.div
            aria-hidden="true"
            className="about-story-pattern eth-pattern-subtle"
            style={reducedMotion ? undefined : { y: patternParallax }}
          />

          <div className="about-story-shell about-story-hero-grid">
            <div className="about-story-hero-copy">
              <motion.div className="section-label" {...reveal(reducedMotion, 0.04)}>
                <span className="section-dot" />
                WHO WE ARE
              </motion.div>
              <motion.h1
                id="about-story-heading"
                className="about-story-title section-heading"
                {...reveal(reducedMotion, 0.1, 28)}
              >
                {heroContent.heading || 'ABOUT.'}
              </motion.h1>
              <motion.p className="about-story-intro" {...reveal(reducedMotion, 0.17)}>
                {heroContent.introduction || 'Akrion Digitals is an Ethiopian creative and technology agency turning ideas into brands, digital experiences, and stories people remember.'}
              </motion.p>
              <motion.p className="about-story-location" {...reveal(reducedMotion, 0.24, 16)}>
                <span aria-hidden="true" />
                {heroContent.identity_statement || 'Rooted in Addis Ababa. Created for impact everywhere.'}
              </motion.p>
            </div>

            <motion.div
              className="about-story-collage"
              data-paused={!pageVisible || !heroInView || reducedMotion || constrained}
              style={reducedMotion ? undefined : { y: collageParallax }}
              {...reveal(reducedMotion, 0.14, 26)}
            >
              <div className="about-story-feature-frame">
                {heroVisualIndexes.map((visualIndex, index) => {
                  if (index !== 0 && (!collageReady || constrained || reducedMotion)) return null
                  const isActive = index === heroActiveIndex

                  return (
                    <ResponsiveProjectImage
                      key={projectVisuals[visualIndex].id}
                      visual={projectVisuals[visualIndex]}
                      className="about-story-feature-slide"
                      isActive={isActive}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'low'}
                      onLoad={index === 0 ? () => setCollageReady(true) : undefined}
                      sizes="(min-width: 1280px) 38vw, (min-width: 1024px) 44vw, (min-width: 640px) 70vw, 92vw"
                    />
                  )
                })}
                <div aria-hidden="true" className="about-story-feature-overlay" />
                <span aria-hidden="true" className="about-story-frame-corner about-story-frame-corner--top" />
                <span aria-hidden="true" className="about-story-frame-corner about-story-frame-corner--bottom" />
              </div>

              {[1, 2, 3].map((visualIndex, tileIndex) => (
                <div key={projectVisuals[visualIndex].id} className={`about-story-collage-tile about-story-collage-tile--${tileIndex + 1}`}>
                  {collageReady && (
                    <ResponsiveProjectImage
                      visual={projectVisuals[visualIndex]}
                      className="about-story-collage-tile-picture"
                      isActive={false}
                      loading="lazy"
                      fetchPriority="low"
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 44vw"
                    />
                  )}
                  <span aria-hidden="true" className="about-story-tile-overlay" />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="about-story-principles" aria-labelledby="about-principles-heading">
          <div aria-hidden="true" className="about-story-principles-pattern eth-pattern-subtle" />
          <div className="about-story-shell">
            <motion.header className="about-story-principles-header" {...reveal(reducedMotion, 0.04)}>
              <div className="section-label"><span className="section-dot" />WHAT WE STAND FOR</div>
              <h2 id="about-principles-heading" className="about-story-section-title section-heading">
                THREE PRINCIPLES.
              </h2>
            </motion.header>

            <div className="about-story-principles-grid">
              <div className="about-story-principle-list">
                {displayedPrinciples.map((principle, index) => (
                  <motion.div
                    key={principle.number}
                    {...reveal(reducedMotion, index * 0.06)}
                    onViewportEnter={() => setActivePrinciple(index)}
                    viewport={{ amount: 0.58 }}
                  >
                    <button
                      type="button"
                      className="about-story-principle-row"
                      data-active={activePrinciple === index}
                      aria-pressed={activePrinciple === index}
                      onClick={() => setActivePrinciple(index)}
                      onFocus={() => setActivePrinciple(index)}
                    >
                      <span className="about-story-principle-number">{principle.number}</span>
                      <span className="about-story-principle-copy">
                        <strong>{principle.title}</strong>
                        <span>{principle.description}</span>
                      </span>
                      <span aria-hidden="true" className="about-story-principle-line" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <motion.div className="about-story-principle-visual" {...reveal(reducedMotion, 0.12)}>
                {principles.map((principle, index) => (constrained && activePrinciple !== index ? null : (
                  <ResponsiveProjectImage
                    key={principle.number}
                    visual={projectVisuals[principle.visualIndex]}
                    className="about-story-principle-slide"
                    isActive={activePrinciple === index}
                    loading="lazy"
                    fetchPriority="low"
                    sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, calc(100vw - 2rem)"
                  />
                )))}
                <div aria-hidden="true" className="about-story-principle-overlay" />
                <span aria-hidden="true" className="about-story-principle-index">
                  {principles[activePrinciple].number}
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        <section ref={processRef} className="about-story-process" aria-labelledby="about-process-heading">
          <div aria-hidden="true" className="about-story-process-pattern eth-pattern-subtle" />
          <div
            className="about-story-shell about-story-process-grid"
            onMouseEnter={() => setProcessHovered(true)}
            onMouseLeave={() => setProcessHovered(false)}
            onFocusCapture={() => setProcessFocusWithin(true)}
            onBlurCapture={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) setProcessFocusWithin(false)
            }}
          >
            <motion.div className="about-story-process-copy" {...reveal(reducedMotion, 0.04)}>
              <p className="about-story-ivory-label">HOW WE THINK</p>
              <h2 id="about-process-heading">{processContent.heading || 'Strategy gives creativity direction.'}</h2>
              <p>
                {processContent.description || 'We understand the challenge, shape the idea, create the experience, and refine it until it works.'}
              </p>

              <div className="about-story-stage-nav" role="tablist" aria-label="How we think stages">
                {processStages.map((stage, index) => (
                  <button
                    key={stage.name}
                    ref={element => { processButtonRefs.current[index] = element }}
                    id={`about-stage-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={activeStage === index}
                    aria-controls="about-process-visual"
                    tabIndex={activeStage === index ? 0 : -1}
                    className="about-story-stage-button"
                    data-active={activeStage === index}
                    onClick={() => selectStage(index)}
                    onKeyDown={event => handleStageKeyDown(event, index)}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {stage.name}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              id="about-process-visual"
              className="about-story-process-visual"
              role="tabpanel"
              aria-labelledby={`about-stage-${activeStage}`}
              {...reveal(reducedMotion, 0.1, 26)}
            >
              {processStages.map((stage, index) => (constrained && activeStage !== index ? null : (
                <ResponsiveProjectImage
                  key={stage.name}
                  visual={projectVisuals[stage.visualIndex]}
                  className="about-story-process-slide"
                  isActive={activeStage === index}
                  loading="lazy"
                  fetchPriority="low"
                  sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, calc(100vw - 2rem)"
                />
              )))}
              <div aria-hidden="true" className="about-story-process-overlay" />
              <span className="about-story-process-stage" aria-hidden="true">
                {processStages[activeStage].name}
              </span>
            </motion.div>
          </div>
        </section>

        <section className="about-story-mission" aria-labelledby="about-mission-heading">
          <div aria-hidden="true" className="about-story-mission-pattern eth-pattern-subtle" />
          <div className="about-story-shell about-story-mission-grid">
            <motion.div {...reveal(reducedMotion, 0.03)}>
              <div className="section-label"><span className="section-dot" />OUR MISSION</div>
              <p className="about-story-mission-copy">
                {closingContent.mission_statement || 'To help ambitious businesses become clearer, stronger, and more memorable through creativity and technology.'}
              </p>
            </motion.div>
            <motion.div className="about-story-mission-action" {...reveal(reducedMotion, 0.1)}>
              <h2 id="about-mission-heading">{closingContent.heading || 'Let’s create something meaningful.'}</h2>
              <Link to={safeContentUrl(closingContent.final_cta_destination, '/contact')} className="about-story-mission-cta btn-primary">
                {closingContent.final_cta_label || 'Start a Project'}
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default About
