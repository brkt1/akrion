import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import socialMedia1200 from '../assets/services/service-social-media-1200.webp'
import socialMedia720 from '../assets/services/service-social-media-720.webp'
import webDevelopment1200 from '../assets/services/service-web-development-1200.webp'
import webDevelopment720 from '../assets/services/service-web-development-720.webp'
import benediktaFoundation1200 from '../assets/portfolio/benedikta-foundation-1200.webp'
import benediktaFoundation720 from '../assets/portfolio/benedikta-foundation-720.webp'
import documentaryFilm1400 from '../assets/portfolio/documentary-film-1400.webp'
import documentaryFilm720 from '../assets/portfolio/documentary-film-720.webp'

const REASONS = [
  {
    id: 'strategy',
    number: '01',
    title: 'STRATEGY BEFORE DECORATION',
    description: 'Every creative decision begins with your business, your audience, and the outcome you want to achieve.',
    visual: {
      src: benediktaFoundation720,
      srcSet: `${benediktaFoundation720} 720w, ${benediktaFoundation1200} 1200w`,
      width: 720,
      height: 540,
      alt: 'Benedikta Foundation identity presentation with purple-and-gold logo applications on a mug, tote bag, pattern, stationery, and lanyard.',
      caption: 'Brand Identity',
      context: 'Akrion project',
      objectPosition: 'center top',
    },
  },
  {
    id: 'connected-team',
    number: '02',
    title: 'ONE CONNECTED TEAM',
    description: 'Branding, websites, applications, social media, video, and motion—planned and executed as one connected experience.',
    visual: {
      src: webDevelopment720,
      srcSet: `${webDevelopment720} 720w, ${webDevelopment1200} 1200w`,
      width: 720,
      height: 480,
      alt: 'Branded concept visual showing a responsive emerald and cream digital experience on desktop and mobile.',
      caption: 'Digital Experiences',
      context: 'Concept visual · replaceable media',
      objectPosition: 'center',
    },
  },
  {
    id: 'cultural-insight',
    number: '03',
    title: 'CULTURAL INSIGHT, GLOBAL STANDARD',
    description: 'We bring an Ethiopian and African perspective to work designed to communicate confidently across markets and cultures.',
    visual: {
      src: documentaryFilm720,
      srcSet: `${documentaryFilm720} 720w, ${documentaryFilm1400} 1400w`,
      width: 720,
      height: 405,
      alt: 'An Ethiopian fashion professional speaking on camera among garments and mannequins during an Akrion documentary interview.',
      caption: 'Documentary Production',
      context: 'Akrion production still',
      objectPosition: 'center',
    },
  },
  {
    id: 'performance',
    number: '04',
    title: 'CREATIVITY BUILT TO PERFORM',
    description: 'We create work that does more than attract attention. It builds clarity, trust, action, and sustainable growth.',
    visual: {
      src: socialMedia720,
      srcSet: `${socialMedia720} 720w, ${socialMedia1200} 1200w`,
      width: 720,
      height: 480,
      alt: 'Branded concept visual showing a coordinated emerald, cream, and gold social media system.',
      caption: 'Social Media Systems',
      context: 'Concept visual · replaceable media',
      objectPosition: 'center',
    },
  },
]

// Replace these null media fields with an approved, like-for-like client transformation pair.
const TRANSFORMATION_MEDIA = {
  before: null,
  after: null,
  isPlaceholder: true,
}

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ProjectReel = ({ activeIndex, reducedMotion }) => {
  const scene = REASONS[activeIndex].visual

  return (
    <div id="why-project-reel" className="why-us-reel" role="region" aria-label="Akrion creative project reel">
      <div className="why-us-reel-pattern eth-pattern" aria-hidden="true" />
      <AnimatePresence initial={false} mode="sync">
        <motion.figure
          key={REASONS[activeIndex].id}
          className="why-us-reel-scene"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.82, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={scene.src}
            srcSet={scene.srcSet}
            sizes="(min-width: 1280px) 46vw, (min-width: 1024px) 48vw, 100vw"
            width={scene.width}
            height={scene.height}
            alt={scene.alt}
            loading="lazy"
            decoding="async"
            draggable="false"
            style={{ objectPosition: scene.objectPosition }}
            initial={false}
            animate={reducedMotion ? { scale: 1 } : { scale: 1.045, x: -3 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 8, ease: 'easeOut' }}
          />
          <div className="why-us-reel-overlay" aria-hidden="true" />
          <figcaption className="why-us-reel-caption">
            <div>
              <span>{scene.context}</span>
              <p>{scene.caption}</p>
            </div>
            <span className="why-us-reel-count" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, '0')} / {String(REASONS.length).padStart(2, '0')}
            </span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </div>
  )
}

const ReasonItem = ({ reason, index, active, reducedMotion, onActivate }) => {
  const itemVariants = {
    hidden: {},
    visible: {
      transition: reducedMotion ? undefined : { staggerChildren: 0.12 },
    },
  }
  const leadVariants = reducedMotion
    ? {}
    : {
        hidden: { opacity: 0, x: -14 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
      }
  const copyVariants = reducedMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.66, ease: [0.22, 1, 0.36, 1] } },
      }

  return (
    <motion.li
      className="why-us-reason-item"
      variants={itemVariants}
      initial={reducedMotion ? false : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.button
        type="button"
        className="why-us-reason"
        data-active={active}
        aria-pressed={active}
        aria-controls="why-project-reel"
        aria-label={`${reason.number} — ${reason.title}. Show matching project visual.`}
        onClick={() => onActivate(index)}
        onFocus={() => onActivate(index)}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') onActivate(index)
        }}
      >
        <motion.span className="why-us-reason-lead" variants={leadVariants} aria-hidden="true">
          <span className="why-us-reason-number">{reason.number}</span>
          <span className="why-us-reason-line" />
        </motion.span>
        <motion.span className="why-us-reason-copy" variants={copyVariants}>
          <span className="why-us-reason-title">{reason.title}</span>
          <span className="why-us-reason-description">{reason.description}</span>
        </motion.span>
      </motion.button>
    </motion.li>
  )
}

const TransformationImage = ({ media }) => (
  <picture className="why-transform-media-picture">
    {media.srcSet && <source srcSet={media.srcSet} sizes="(min-width: 1280px) 1200px, 100vw" type="image/webp" />}
    <img
      className="why-transform-media-image"
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  </picture>
)

const BeforeAfterSlider = ({ media }) => {
  const [position, setPosition] = useState(50)
  const instructionsId = 'why-transform-instructions'
  const positionStyle = { '--why-transform-position': `${position}%` }

  const handleKeyDown = (event) => {
    let nextPosition = null

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextPosition = position - 1
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextPosition = position + 1
    if (event.key === 'PageDown') nextPosition = position - 10
    if (event.key === 'PageUp') nextPosition = position + 10
    if (event.key === 'Home') nextPosition = 0
    if (event.key === 'End') nextPosition = 100
    if (nextPosition == null) return

    event.preventDefault()
    setPosition(Math.max(0, Math.min(100, nextPosition)))
  }

  return (
    <div className="why-transform-comparison">
      <div className="why-transform-frame" style={positionStyle} data-placeholder={media.isPlaceholder}>
        <div className="why-transform-layer why-transform-layer--after" aria-hidden={!media.after}>
          {media.after ? (
            <TransformationImage media={media.after} />
          ) : (
            <>
              <div className="why-transform-after-pattern eth-pattern" />
              <div className="why-transform-after-system">
                <div className="why-transform-after-mark">AD</div>
                <div className="why-transform-after-copy">
                  <span>DEFINE · CREATE · LAUNCH</span>
                  <strong>One connected brand system</strong>
                  <div><i /><i /><i /></div>
                </div>
              </div>
              <div className="why-transform-after-grid">
                <span /><span /><span /><span />
              </div>
            </>
          )}
        </div>

        <div className="why-transform-layer why-transform-layer--before" aria-hidden={!media.before}>
          {media.before ? (
            <TransformationImage media={media.before} />
          ) : (
            <>
              <div className="why-transform-before-notes">
                <span>IDEA 01</span>
                <span>IDEA 04</span>
                <span>?</span>
              </div>
              <div className="why-transform-before-wireframe">
                <span /><span /><span /><span />
              </div>
              <p>Scattered direction</p>
            </>
          )}
        </div>

        <span className="why-transform-side-label why-transform-side-label--before" aria-hidden="true">Before</span>
        <span className="why-transform-side-label why-transform-side-label--after" aria-hidden="true">After Akrion.</span>

        <label className="sr-only" htmlFor="why-transformation-range">Before and after comparison divider</label>
        <input
          id="why-transformation-range"
          className="why-transform-range"
          type="range"
          min="0"
          max="100"
          step="1"
          value={position}
          aria-describedby={instructionsId}
          aria-valuetext={`${position}% Before visible; ${100 - position}% After Akrion visible`}
          onChange={(event) => setPosition(Number(event.target.value))}
          onKeyDown={handleKeyDown}
        />

        <div className="why-transform-divider" aria-hidden="true">
          <span className="why-transform-handle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 7L4 12L9 17M15 7L20 12L15 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="why-transform-meta">
        <p id={instructionsId}>Drag the gold divider, or focus it and use the arrow keys.</p>
        {media.isPlaceholder && (
          <p className="why-transform-placeholder-note">
            Illustrative Akrion placeholder · awaiting an approved client transformation pair.
          </p>
        )}
      </div>
    </div>
  )
}

const WhyChooseUs = () => {
  const reasonsRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [activeReason, setActiveReason] = useState(0)

  useEffect(() => {
    if (reducedMotion || !reasonsRef.current) return undefined

    let animationFrame = 0

    const syncReasonToScroll = () => {
      animationFrame = 0
      const list = reasonsRef.current
      if (!list) return

      const bounds = list.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const startLine = viewportHeight * 0.35
      const endLine = viewportHeight * 0.55
      const travel = Math.max(1, bounds.height + startLine - endLine)
      const progress = Math.max(0, Math.min(1, (startLine - bounds.top) / travel))
      const nextIndex = Math.round(progress * (REASONS.length - 1))

      setActiveReason((current) => (current === nextIndex ? current : nextIndex))
    }

    const requestSync = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(syncReasonToScroll)
    }

    syncReasonToScroll()
    window.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', requestSync)

    return () => {
      window.removeEventListener('scroll', requestSync)
      window.removeEventListener('resize', requestSync)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [reducedMotion])

  const reveal = reducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <section id="why-us" className="why-us-section scroll-mt-24 sm:scroll-mt-28" aria-labelledby="why-us-heading">
      <div className="why-us-dark">
        <div className="why-us-pattern eth-pattern-subtle" aria-hidden="true" />
        <div className="why-us-vignette" aria-hidden="true" />

        <div className="why-us-container">
          <motion.header className="why-us-header" {...reveal}>
            <div className="section-label"><span className="section-dot" />WHY US</div>
            <h2 id="why-us-heading" className="section-heading text-[clamp(2.2rem,5vw,4rem)]">WHY CHOOSE US</h2>
            <p>Strategy, creativity, and technology—connected by one team and built around your business goals.</p>
          </motion.header>

          <div className="why-us-editorial">
            <motion.div className="why-us-reel-column" {...reveal}>
              <ProjectReel activeIndex={activeReason} reducedMotion={reducedMotion} />
            </motion.div>

            <ol ref={reasonsRef} className="why-us-reasons" aria-label="Reasons to choose Akrion Digitals">
              {REASONS.map((reason, index) => (
                <ReasonItem
                  key={reason.id}
                  reason={reason}
                  index={index}
                  active={index === activeReason}
                  reducedMotion={reducedMotion}
                  onActivate={setActiveReason}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>

      <section className="why-transform-section" aria-labelledby="why-transform-heading">
        <div className="why-transform-corner eth-pattern-subtle" aria-hidden="true" />
        <div className="why-us-container why-transform-container">
          <motion.header className="why-transform-header" {...reveal}>
            <p>WHAT CHANGES WHEN YOU WORK WITH US</p>
            <h3 id="why-transform-heading">Your brand shouldn’t only look better. It should work better.</h3>
            <span>We help turn scattered ideas into a clear identity, a consistent experience, and a brand people understand, trust, and choose.</span>
          </motion.header>

          <motion.div {...reveal}>
            <BeforeAfterSlider media={TRANSFORMATION_MEDIA} />
          </motion.div>

          <motion.div className="why-us-cta" {...reveal}>
            <div className="why-us-cta-copy">
              <p>READY TO START?</p>
              <h3>Let’s build your brand together.</h3>
              <span>One conversation. Clear direction. No pressure.</span>
            </div>
            <div className="why-us-cta-actions">
              <a
                href="https://wa.me/251976601172?text=Hi!%20I'd%20like%20a%20free%20strategy%20call%20to%20discuss%20my%20brand."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary why-us-primary group"
              >
                Free Strategy Call
                <span className="why-us-primary-arrow"><ArrowIcon /></span>
              </a>
              <Link to="/contact" className="why-us-contact-link">
                Contact Us <ArrowIcon />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </section>
  )
}

export default WhyChooseUs
