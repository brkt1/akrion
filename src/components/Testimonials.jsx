import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'

const VERIFIED_TESTIMONIALS = [
  {
    id: 'yenege-games',
    name: 'Biruk Haile',
    title: 'CEO',
    company: 'Yenege Games',
    quote: 'From brand design to launch strategy — Akrion handled everything with professionalism and passion. We went from zero to 10,000 downloads in our first week.',
    result: '10,000+ downloads in the first week',
    initials: 'BH',
    companyInitials: 'YG',
    services: ['Brand Design', 'Launch Strategy'],
    rating: null,
    projectVisual: null,
    projectHref: null,
  },
]

const APPROVED_CLIENT_LOGOS = []
const AUTOPLAY_DELAY = 8000
const INTERACTION_PAUSE = 10000

const ArrowIcon = ({ direction = 'next' }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d={direction === 'previous' ? 'M12.5 5L7.5 10L12.5 15' : 'M7.5 15L12.5 10L7.5 5'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ProjectVisual = ({ testimonial, reduceMotion }) => {
  const visual = testimonial.projectVisual

  if (visual) {
    return (
      <div className="social-proof-visual social-proof-visual--image">
        <picture>
          {visual.srcSet && <source srcSet={visual.srcSet} sizes={visual.sizes} type="image/webp" />}
          <motion.img
            src={visual.src}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            loading="lazy"
            decoding="async"
            animate={reduceMotion ? undefined : { scale: [1.01, 1.045, 1.01] }}
            transition={reduceMotion ? undefined : { duration: 18, ease: 'easeInOut', repeat: Infinity }}
          />
        </picture>
        <div className="social-proof-visual-vignette" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div
      className="social-proof-visual social-proof-visual--snapshot"
      role="img"
      aria-label={`${testimonial.company} verified launch snapshot highlighting ${testimonial.result}.`}
    >
      <div className="social-proof-snapshot-pattern eth-pattern" aria-hidden="true" />
      <div className="social-proof-snapshot-glow" aria-hidden="true" />

      <div className="social-proof-snapshot-topline" aria-hidden="true">
        <span>Verified launch outcome</span>
        <span>01</span>
      </div>

      <div className="social-proof-snapshot-center" aria-hidden="true">
        <div className="social-proof-company-initial">{testimonial.companyInitials}</div>
        <div>
          <p>{testimonial.company}</p>
          <span>{testimonial.services.join(' · ')}</span>
        </div>
      </div>

      <div className="social-proof-snapshot-divider" aria-hidden="true"><span /></div>

      <div className="social-proof-snapshot-result" aria-hidden="true">
        <span>10,000+</span>
        <small>downloads · first week</small>
      </div>
    </div>
  )
}

const Testimonials = () => {
  const sectionRef = useRef(null)
  const selectorRefs = useRef([])
  const interactionTimerRef = useRef(null)
  const pointerStartRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(sectionRef, { amount: 0.25 })
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusWithin, setIsFocusWithin] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [pageIsHidden, setPageIsHidden] = useState(
    () => typeof document !== 'undefined' && document.visibilityState === 'hidden',
  )

  const testimonialCount = VERIFIED_TESTIMONIALS.length
  const hasMultipleTestimonials = testimonialCount > 1
  const current = VERIFIED_TESTIMONIALS[active]

  const pauseAfterInteraction = useCallback(() => {
    setIsInteracting(true)
    window.clearTimeout(interactionTimerRef.current)
    interactionTimerRef.current = window.setTimeout(() => setIsInteracting(false), INTERACTION_PAUSE)
  }, [])

  const goTo = useCallback((index, nextDirection = 1) => {
    if (!hasMultipleTestimonials || index === active) return
    setDirection(nextDirection)
    setActive((index + testimonialCount) % testimonialCount)
    pauseAfterInteraction()
  }, [active, hasMultipleTestimonials, pauseAfterInteraction, testimonialCount])

  const previous = useCallback(() => {
    goTo(active - 1, -1)
  }, [active, goTo])

  const next = useCallback(() => {
    goTo(active + 1, 1)
  }, [active, goTo])

  useEffect(() => {
    const handleVisibility = () => setPageIsHidden(document.visibilityState === 'hidden')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => () => window.clearTimeout(interactionTimerRef.current), [])

  useEffect(() => {
    const shouldRotate = hasMultipleTestimonials
      && isInView
      && !reduceMotion
      && !isHovered
      && !isFocusWithin
      && !isInteracting
      && !pageIsHidden

    if (!shouldRotate) return undefined

    const timer = window.setInterval(() => {
      setDirection(1)
      setActive((value) => (value + 1) % testimonialCount)
    }, AUTOPLAY_DELAY)

    return () => window.clearInterval(timer)
  }, [hasMultipleTestimonials, isFocusWithin, isHovered, isInView, isInteracting, pageIsHidden, reduceMotion, testimonialCount])

  const handleSelectorKeyDown = (event) => {
    if (!hasMultipleTestimonials) return
    let targetIndex = null

    if (event.key === 'ArrowLeft') targetIndex = (active - 1 + testimonialCount) % testimonialCount
    if (event.key === 'ArrowRight') targetIndex = (active + 1) % testimonialCount
    if (event.key === 'Home') targetIndex = 0
    if (event.key === 'End') targetIndex = testimonialCount - 1
    if (targetIndex == null) return

    event.preventDefault()
    goTo(targetIndex, targetIndex < active ? -1 : 1)
    window.requestAnimationFrame(() => selectorRefs.current[targetIndex]?.focus())
  }

  const handlePointerDown = (event) => {
    if (!hasMultipleTestimonials || event.pointerType !== 'touch') return
    pointerStartRef.current = { x: event.clientX, y: event.clientY }
    pauseAfterInteraction()
  }

  const handlePointerUp = (event) => {
    if (!pointerStartRef.current || event.pointerType !== 'touch') return
    const deltaX = event.clientX - pointerStartRef.current.x
    const deltaY = event.clientY - pointerStartRef.current.y
    pointerStartRef.current = null

    if (Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      if (deltaX > 0) previous()
      else next()
    }
  }

  const reveal = reduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      aria-labelledby="social-proof-heading"
      className="social-proof-section scroll-mt-24 sm:scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusWithin(false)
      }}
    >
      <div className="social-proof-pattern eth-pattern-subtle" aria-hidden="true" />
      <div className="social-proof-vignette" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <motion.header className="social-proof-header" {...reveal}>
          <div className="section-label"><span className="section-dot" />SOCIAL PROOF.</div>
          <h2 id="social-proof-heading" className="section-heading text-[clamp(2rem,5vw,3.5rem)]">
            Real Results, <span className="gradient-text-gold">Real People.</span>
          </h2>
          <p>
            Creative work should do more than look good—it should solve problems, earn attention, and create measurable value. Here’s what our clients experienced.
          </p>
        </motion.header>

        {hasMultipleTestimonials && (
          <motion.div className="social-proof-selector-wrap" {...reveal}>
            <div
              className="social-proof-selectors scrollbar-hide"
              role="tablist"
              aria-label="Verified client testimonials"
              onKeyDown={handleSelectorKeyDown}
            >
              {VERIFIED_TESTIMONIALS.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  id={`social-proof-selector-${testimonial.id}`}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-controls={`social-proof-panel-${testimonial.id}`}
                  aria-label={`Show testimonial from ${testimonial.name}, ${testimonial.company}`}
                  title={`${testimonial.name} · ${testimonial.company}`}
                  tabIndex={index === active ? 0 : -1}
                  className="social-proof-selector"
                  data-active={index === active}
                  ref={(node) => { selectorRefs.current[index] = node }}
                  onClick={() => goTo(index, index > active ? 1 : -1)}
                >
                  <span className="social-proof-selector-avatar" aria-hidden="true">{testimonial.initials}</span>
                  <span className="social-proof-selector-caption">{testimonial.company}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="social-proof-card-viewport"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { pointerStartRef.current = null }}
          {...reveal}
        >
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.article
              key={current.id}
              id={`social-proof-panel-${current.id}`}
              role={hasMultipleTestimonials ? 'tabpanel' : undefined}
              aria-labelledby={hasMultipleTestimonials ? `social-proof-selector-${current.id}` : undefined}
              aria-label={!hasMultipleTestimonials ? `Testimonial from ${current.name}, ${current.company}` : undefined}
              className="social-proof-card"
              custom={direction}
              initial={reduceMotion ? false : { opacity: 0, x: direction * 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: direction * -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="social-proof-media">
                <ProjectVisual testimonial={current} reduceMotion={reduceMotion} />
              </div>

              <div className="social-proof-copy">
                <span className="social-proof-verified-label">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M3 10L8 15L17 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Verified client outcome
                </span>

                {current.rating != null && (
                  <p className="social-proof-rating" aria-label={`${current.rating} out of 5 stars`}>
                    {current.rating} / 5
                  </p>
                )}

                <div className="social-proof-quote-mark" aria-hidden="true">“</div>
                <blockquote>“{current.quote}”</blockquote>

                <motion.div
                  className="social-proof-result-badge"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M3 10L8 15L17 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{current.result}</span>
                </motion.div>

                <div className="social-proof-client-row">
                  <div className="social-proof-client">
                    <span className="social-proof-client-avatar" aria-hidden="true">{current.initials}</span>
                    <div>
                      <p>{current.name}</p>
                      <span>{current.title}, {current.company}</span>
                    </div>
                  </div>

                  {hasMultipleTestimonials && (
                    <div className="social-proof-controls" aria-label="Testimonial controls">
                      <button type="button" onClick={previous} aria-label="Show previous testimonial">
                        <ArrowIcon direction="previous" />
                      </button>
                      <button type="button" onClick={next} aria-label="Show next testimonial">
                        <ArrowIcon />
                      </button>
                    </div>
                  )}
                </div>

                {current.projectHref && (
                  <a className="social-proof-project-link" href={current.projectHref}>
                    View Case Study <ArrowIcon />
                  </a>
                )}
              </div>
            </motion.article>
          </AnimatePresence>
        </motion.div>

        {APPROVED_CLIENT_LOGOS.length > 0 && (
          <div className="social-proof-trusted" aria-label="Trusted by">
            <span>Trusted By</span>
            {APPROVED_CLIENT_LOGOS.map((logo) => (
              <img key={logo.name} src={logo.src} alt={logo.name} width={logo.width} height={logo.height} loading="lazy" />
            ))}
          </div>
        )}

        <motion.div className="social-proof-cta" {...reveal}>
          <p>Ready to become our next success story?</p>
          <a
            href="https://wa.me/251976601172?text=Hi!%20I'd%20like%20to%20discuss%20building%20my%20brand."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group"
          >
            Let’s Build Your Brand
            <span className="social-proof-cta-arrow"><ArrowIcon /></span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
