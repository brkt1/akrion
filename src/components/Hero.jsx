import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/brand/akrion-mark-gold.png'
import brandIdentityLarge from '../assets/services/service-brand-identity-1200.webp'
import brandIdentitySmall from '../assets/services/service-brand-identity-720.webp'
import webDevelopmentLarge from '../assets/services/service-web-development-1200.webp'
import webDevelopmentSmall from '../assets/services/service-web-development-720.webp'
import videoProductionLarge from '../assets/portfolio/documentary-film-1400.webp'
import videoProductionSmall from '../assets/portfolio/documentary-film-720.webp'
import videoMotionLarge from '../assets/services/service-video-motion-1200.webp'
import videoMotionSmall from '../assets/services/service-video-motion-720.webp'
import socialMediaLarge from '../assets/services/service-social-media-1200.webp'
import socialMediaSmall from '../assets/services/service-social-media-720.webp'

const GOLD = '#C9A170'
const CREAM = '#F5EDD8'
const HERO_BACKGROUND_INTERVAL = 6500

// Replace either responsive image pair below when real Akrion project imagery is ready.
const heroBackgrounds = [
  {
    id: 'brand-identity-and-packaging',
    src: brandIdentityLarge,
    srcSet: `${brandIdentitySmall} 720w, ${brandIdentityLarge} 1200w`,
    position: 'center 48%',
    mobilePosition: '61% center',
    panFrom: '-0.45%',
    panTo: '0.45%',
  },
  {
    id: 'website-and-application-design',
    src: webDevelopmentLarge,
    srcSet: `${webDevelopmentSmall} 720w, ${webDevelopmentLarge} 1200w`,
    position: '58% center',
    mobilePosition: '57% center',
    panFrom: '0.5%',
    panTo: '-0.4%',
  },
  {
    id: 'video-production',
    src: videoProductionLarge,
    srcSet: `${videoProductionSmall} 720w, ${videoProductionLarge} 1400w`,
    position: 'center 46%',
    mobilePosition: '45% center',
    panFrom: '-0.35%',
    panTo: '0.5%',
  },
  {
    id: 'motion-design',
    src: videoMotionLarge,
    srcSet: `${videoMotionSmall} 720w, ${videoMotionLarge} 1200w`,
    position: '58% center',
    mobilePosition: '60% center',
    panFrom: '0.45%',
    panTo: '-0.5%',
  },
  {
    id: 'social-media-campaigns',
    src: socialMediaLarge,
    srcSet: `${socialMediaSmall} 720w, ${socialMediaLarge} 1200w`,
    position: '56% center',
    mobilePosition: '70% center',
    panFrom: '-0.4%',
    panTo: '0.45%',
  },
]

const particles = [
  { size: 2, top: '15%', left: '10%', color: GOLD, depth: 7, delay: 0 },
  { size: 3, top: '30%', left: '85%', color: '#2D6B3F', depth: 12, delay: 0.8 },
  { size: 2, top: '65%', left: '75%', color: CREAM, depth: 17, delay: 1.6 },
  { size: 4, top: '20%', left: '45%', color: GOLD, depth: 9, delay: 2.4 },
  { size: 2, top: '75%', left: '15%', color: '#2D6B3F', depth: 15, delay: 3.2 },
  { size: 3, top: '45%', left: '60%', color: GOLD, depth: 20, delay: 4 },
]

const ParallaxLayer = ({ cursorX, cursorY, depth, className = '', style, children }) => {
  const x = useTransform(cursorX, [-1, 1], [-depth, depth])
  const y = useTransform(cursorY, [-1, 1], [-depth, depth])

  return (
    <motion.div className={`hero-parallax-layer ${className}`} style={{ ...style, x, y }}>
      {children}
    </motion.div>
  )
}

const TiletParticle = ({ cursorX, cursorY, depth, className = '', delay = '0s' }) => (
  <ParallaxLayer
    cursorX={cursorX}
    cursorY={cursorY}
    depth={depth}
    className={`pointer-events-none absolute z-[1] ${className}`}
  >
    <div
      className="hero-ambient-motion h-10 w-10 animate-float"
      style={{ animationDelay: delay, animationDuration: '12s' }}
    >
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 2L38 20L20 38L2 20L20 2Z" stroke={GOLD} strokeWidth="0.5" opacity="0.3" />
        <circle cx="20" cy="20" r="1.5" fill={GOLD} opacity="0.4" />
      </svg>
    </div>
  </ParallaxLayer>
)

const ShowreelPlaceholder = () => (
  <div
    className="showreel-card group relative aspect-video w-full overflow-hidden rounded-[1.5rem] border border-[rgba(201,161,112,0.30)] bg-bg-card shadow-[0_24px_70px_rgba(0,0,0,0.34),0_0_42px_rgba(201,161,112,0.07)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[rgba(201,161,112,0.62)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.42),0_0_52px_rgba(201,161,112,0.14)] motion-reduce:transform-none"
    role="img"
    aria-label="Akrion Digitals YouTube showreel placeholder"
  >
    {/* Replace this placeholder content with a responsive YouTube iframe when the showreel URL is ready. */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_22%,rgba(201,161,112,0.24),transparent_32%),linear-gradient(135deg,#173621_0%,#0D1F13_52%,#09160E_100%)]" />
    <div className="eth-pattern absolute -right-12 -top-10 h-56 w-56 rotate-12 opacity-25" />
    <div className="dot-grid absolute inset-0 opacity-30" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/70 to-transparent" />
    <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-green-light/20 blur-3xl" />

    <img
      src={logo}
      alt=""
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 h-[72%] w-auto max-w-[46%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.09]"
    />

    <div className="absolute inset-0 flex items-center justify-center">
      <span className="showreel-play flex h-20 w-20 items-center justify-center rounded-full border border-accent-gold-light/70 bg-gradient-to-br from-accent-gold-light to-accent-gold text-bg-dark shadow-[0_12px_36px_rgba(201,161,112,0.38)] transition-transform duration-500 ease-out group-hover:scale-110 sm:h-24 sm:w-24 motion-reduce:transform-none">
        <svg className="ml-1 h-7 w-7 sm:h-8 sm:w-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M11.5 8.5L24 16L11.5 23.5V8.5Z" fill="currentColor" />
        </svg>
      </span>
    </div>

    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-5 pb-5 pt-16 sm:px-7 sm:pb-6">
      <div>
        <p className="font-display text-base font-semibold tracking-tight text-[#F5EDD8] sm:text-lg">
          Discover Akrion Digitals.
        </p>
        <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent-gold-light/70 sm:text-xs">
          YouTube showreel · Coming soon
        </p>
      </div>
      <span className="hidden rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[rgba(245,237,216,0.55)] backdrop-blur-sm sm:inline-flex">
        16:9
      </span>
    </div>
  </div>
)

const Hero = () => {
  const shouldReduceMotion = useReducedMotion()
  const [supportsPointerParallax, setSupportsPointerParallax] = useState(false)
  const [activeBackground, setActiveBackground] = useState(0)
  const [mountedBackgrounds, setMountedBackgrounds] = useState(() => new Set([0]))
  const [prefersReducedSlideshowMotion, setPrefersReducedSlideshowMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))
  const [isPageVisible, setIsPageVisible] = useState(() => (
    typeof document === 'undefined' || document.visibilityState === 'visible'
  ))
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const smoothX = useSpring(cursorX, { stiffness: 45, damping: 24, mass: 0.8 })
  const smoothY = useSpring(cursorY, { stiffness: 45, damping: 24, mass: 0.8 })
  const shouldReduceSlideshowMotion = Boolean(shouldReduceMotion || prefersReducedSlideshowMotion)

  useEffect(() => {
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updatePointerSupport = () => setSupportsPointerParallax(pointerQuery.matches)

    updatePointerSupport()
    pointerQuery.addEventListener('change', updatePointerSupport)
    return () => pointerQuery.removeEventListener('change', updatePointerSupport)
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedSlideshowMotion(motionQuery.matches)

    updateMotionPreference()
    motionQuery.addEventListener('change', updateMotionPreference)
    return () => motionQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const preloadAttribute = 'data-akrion-hero-preload'
    if (document.head.querySelector(`link[${preloadAttribute}]`)) return undefined

    const preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.as = 'image'
    preloadLink.href = heroBackgrounds[0].src
    preloadLink.imageSrcset = heroBackgrounds[0].srcSet
    preloadLink.imageSizes = '100vw'
    preloadLink.fetchPriority = 'high'
    preloadLink.setAttribute(preloadAttribute, 'true')
    document.head.appendChild(preloadLink)

    return () => preloadLink.remove()
  }, [])

  useEffect(() => {
    const updatePageVisibility = () => {
      setIsPageVisible(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', updatePageVisibility)
    return () => document.removeEventListener('visibilitychange', updatePageVisibility)
  }, [])

  useEffect(() => {
    if (shouldReduceSlideshowMotion) {
      setActiveBackground(0)
      setMountedBackgrounds(new Set([0]))
      return undefined
    }

    if (!isPageVisible) return undefined

    const nextBackground = (activeBackground + 1) % heroBackgrounds.length
    const stageTimer = window.setTimeout(() => {
      setMountedBackgrounds((current) => {
        if (current.has(nextBackground)) return current

        const next = new Set(current)
        next.add(nextBackground)
        return next
      })
    }, HERO_BACKGROUND_INTERVAL - 1800)

    const rotationTimer = window.setTimeout(() => {
      setActiveBackground(nextBackground)
    }, HERO_BACKGROUND_INTERVAL)

    return () => {
      window.clearTimeout(stageTimer)
      window.clearTimeout(rotationTimer)
    }
  }, [activeBackground, isPageVisible, shouldReduceSlideshowMotion])

  const handlePointerMove = (event) => {
    if (!supportsPointerParallax || shouldReduceMotion || event.pointerType !== 'mouse') return

    const bounds = event.currentTarget.getBoundingClientRect()
    cursorX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
    cursorY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
  }

  const resetParallax = () => {
    cursorX.set(0)
    cursorY.set(0)
  }

  const entrance = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  })

  return (
    <section
      className="hero-section relative flex min-h-[calc(100svh-80px)] items-center overflow-hidden py-14 sm:py-16 lg:py-20"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetParallax}
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_72%_24%,rgba(201,161,112,0.10)_0%,transparent_43%),radial-gradient(ellipse_at_18%_76%,rgba(45,107,63,0.13)_0%,transparent_48%),#0D1F13]" />

      <div
        className="hero-background-slideshow pointer-events-none absolute inset-0 z-0"
        data-paused={!isPageVisible || shouldReduceSlideshowMotion}
        aria-hidden="true"
      >
        {heroBackgrounds.map((background, index) => {
          if ((shouldReduceSlideshowMotion && index !== 0) || !mountedBackgrounds.has(index)) return null

          return (
            <img
              key={background.id}
              src={background.src}
              srcSet={background.srcSet}
              sizes="100vw"
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              decoding="async"
              className={`hero-background-image ${index === activeBackground ? 'is-active' : ''}`}
              style={{
                '--hero-background-position': background.position,
                '--hero-background-mobile-position': background.mobilePosition,
                '--hero-background-pan-from': background.panFrom,
                '--hero-background-pan-to': background.panTo,
              }}
            />
          )
        })}
      </div>
      <div className="hero-background-wash pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <ParallaxLayer cursorX={smoothX} cursorY={smoothY} depth={5} className="absolute -inset-6 z-0">
        <div className="hero-pattern-grid dot-grid h-full w-full" />
      </ParallaxLayer>

      <ParallaxLayer cursorX={smoothX} cursorY={smoothY} depth={8} className="pointer-events-none absolute left-0 top-0 z-0">
        <div className="hero-pattern-corner eth-corner h-32 w-32" />
      </ParallaxLayer>
      <ParallaxLayer cursorX={smoothX} cursorY={smoothY} depth={13} className="pointer-events-none absolute right-0 top-0 z-0">
        <div className="hero-pattern-corner eth-corner h-32 w-32 rotate-90" />
      </ParallaxLayer>
      <ParallaxLayer cursorX={smoothX} cursorY={smoothY} depth={10} className="pointer-events-none absolute bottom-0 left-0 z-0">
        <div className="hero-pattern-corner eth-corner h-32 w-32 -rotate-90" />
      </ParallaxLayer>
      <ParallaxLayer cursorX={smoothX} cursorY={smoothY} depth={16} className="pointer-events-none absolute bottom-0 right-0 z-0">
        <div className="hero-pattern-corner eth-corner h-32 w-32 rotate-180" />
      </ParallaxLayer>

      <ParallaxLayer cursorX={smoothX} cursorY={smoothY} depth={7} className="pointer-events-none absolute left-[12%] top-[8%] z-0">
        <div className="hero-ambient-motion h-[420px] w-[420px] animate-pulse rounded-full bg-[rgba(245,237,216,0.035)] blur-[130px]" />
      </ParallaxLayer>
      <ParallaxLayer cursorX={smoothX} cursorY={smoothY} depth={18} className="pointer-events-none absolute bottom-[5%] right-[8%] z-0">
        <div className="hero-ambient-motion h-[360px] w-[360px] animate-pulse rounded-full bg-[rgba(201,161,112,0.065)] blur-[100px] [animation-delay:2s]" />
      </ParallaxLayer>

      {particles.map((particle) => (
        <ParallaxLayer
          key={`${particle.top}-${particle.left}`}
          cursorX={smoothX}
          cursorY={smoothY}
          depth={particle.depth}
          className="pointer-events-none absolute z-[1]"
          style={{ top: particle.top, left: particle.left }}
        >
          <span
            className="hero-ambient-motion block animate-float rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.color,
              opacity: 0.55,
              animationDelay: `${particle.delay}s`,
            }}
          />
        </ParallaxLayer>
      ))}

      <TiletParticle cursorX={smoothX} cursorY={smoothY} depth={19} className="left-[8%] top-[46%]" />
      <TiletParticle cursorX={smoothX} cursorY={smoothY} depth={14} className="right-[8%] top-[32%]" delay="1.4s" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-12 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] xl:gap-16 2xl:gap-20">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-start text-left xl:mx-0 xl:max-w-none">
            <motion.div {...entrance(0.05)}>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-gold/25 bg-[rgba(245,237,216,0.05)] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[rgba(245,237,216,0.70)] backdrop-blur-sm sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-gold motion-safe:animate-pulse" />
                Creative Agency · Addis Ababa, Ethiopia
              </div>
            </motion.div>

            <motion.h1
              {...entrance(0.13)}
              className="section-heading mt-6 max-w-[12ch] text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.98] tracking-[-0.045em] sm:mt-7"
            >
              <span className="gradient-text-gold">We Make the Unknown Known.</span>
            </motion.h1>

            <motion.p
              {...entrance(0.21)}
              className="mt-6 max-w-2xl text-[clamp(1rem,1.55vw,1.2rem)] font-light leading-relaxed text-[rgba(245,237,216,0.78)] sm:mt-7"
            >
              We help businesses build brands customers{' '}
              <span className="font-normal text-[#F5EDD8]">actually remember</span>
              {' '}— with creativity, strategy, and{' '}
              <span className="font-normal text-accent-gold-light">evidence-backed results.</span>
            </motion.p>

            <motion.div {...entrance(0.29)} className="mt-8 w-full sm:mt-9">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  to="/portfolio"
                  className="hero-primary-cta btn-primary group min-h-[52px] rounded-2xl px-5 py-4 text-center text-sm sm:px-8 sm:text-base"
                >
                  See How We Grow Your Brand
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transform-none" aria-hidden="true">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                <a
                  href="https://wa.me/251976601172?text=Hi!%20I'd%20like%20a%20free%20strategy%20call%20to%20discuss%20my%20brand."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-secondary-cta btn-ghost group min-h-[52px] rounded-2xl px-5 py-4 text-center text-sm sm:px-8 sm:text-base"
                >
                  Book Free Strategy Call
                </a>
              </div>

              <p className="mt-4 hidden text-left text-xs font-medium tracking-[0.015em] text-accent-gold-light/[0.68] xs:block sm:text-sm">
                No commitment · 30-min call · Real results, not promises
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto w-full max-w-4xl xl:max-w-none"
          >
            <ShowreelPlaceholder />
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-40 xl:flex">
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-accent-gold">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-accent-gold/50 to-transparent" />
      </div>
    </section>
  )
}

export default Hero
