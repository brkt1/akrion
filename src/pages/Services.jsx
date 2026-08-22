import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import brandIdentity1200 from '../assets/services/service-brand-identity-1200.webp'
import brandIdentity720 from '../assets/services/service-brand-identity-720.webp'
import creativeConsulting1200 from '../assets/services/service-creative-consulting-1200.webp'
import creativeConsulting720 from '../assets/services/service-creative-consulting-720.webp'
import socialMedia1200 from '../assets/services/service-social-media-1200.webp'
import socialMedia720 from '../assets/services/service-social-media-720.webp'
import videoMotion1200 from '../assets/services/service-video-motion-1200.webp'
import videoMotion720 from '../assets/services/service-video-motion-720.webp'
import webDevelopment1200 from '../assets/services/service-web-development-1200.webp'
import webDevelopment720 from '../assets/services/service-web-development-720.webp'

const HERO_ROTATION_MS = 6200

// Replace either responsive image pair here to swap in real Akrion project work.
const serviceStories = [
  {
    id: 'brand-identity',
    number: '01',
    title: 'Brand Identity',
    description: 'Distinctive identities built to make your business clear, consistent, and memorable.',
    included: ['Strategy', 'Logo design', 'Visual identity', 'Guidelines', 'Packaging', 'Brand applications'],
    image: {
      small: brandIdentity720,
      large: brandIdentity1200,
      width: 1200,
      height: 800,
      position: 'center 48%',
      alt: 'Brand identity and packaging presentation arranged in Akrion’s emerald and gold palette',
    },
  },
  {
    id: 'web-applications',
    number: '02',
    title: 'Web & Applications',
    description: 'Responsive digital experiences designed around your users and business goals.',
    included: ['Websites', 'Landing pages', 'Web applications', 'UI/UX', 'Ongoing support'],
    image: {
      small: webDevelopment720,
      large: webDevelopment1200,
      width: 1200,
      height: 800,
      position: '58% center',
      alt: 'Responsive website and application interfaces displayed across desktop and mobile devices',
    },
  },
  {
    id: 'video-motion-photography',
    number: '03',
    title: 'Video, Motion & Photography',
    description: 'Visual stories produced to capture attention, communicate clearly, and remain memorable.',
    included: ['Video production', 'Motion graphics', 'Photography', 'Documentaries', 'Event coverage'],
    image: {
      small: videoMotion720,
      large: videoMotion1200,
      width: 1200,
      height: 800,
      position: '58% center',
      alt: 'Cinematic video-production and motion-design editing workspace',
    },
  },
  {
    id: 'social-media-advertising',
    number: '04',
    title: 'Social Media & Advertising',
    description: 'Content and campaigns designed to build visibility, engagement, and meaningful action.',
    included: ['Strategy', 'Content production', 'Account management', 'Organic campaigns', 'Paid advertising'],
    image: {
      small: socialMedia720,
      large: socialMedia1200,
      width: 1200,
      height: 800,
      position: '60% center',
      alt: 'Coordinated social-media campaign with post, carousel, and Reel compositions',
    },
  },
  {
    id: 'creative-consulting',
    number: '05',
    title: 'Creative Consulting',
    description: 'Practical creative direction for businesses that need clarity before execution.',
    included: ['Brand audits', 'Campaign planning', 'Creative strategy', 'Digital guidance'],
    image: {
      small: creativeConsulting720,
      large: creativeConsulting1200,
      width: 1200,
      height: 800,
      position: 'center 46%',
      alt: 'Creative strategy workspace with moodboards, sketches, colors, and material studies',
    },
  },
]

const heroStoryIndexes = [0, 1, 2, 3]

const ResponsiveServiceImage = ({
  image,
  className = '',
  alt = image.alt,
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes = '100vw',
  hidden = false,
}) => (
  <picture className={className} aria-hidden={hidden || undefined}>
    <source media="(max-width: 767px)" srcSet={image.small} />
    <img
      src={image.large}
      srcSet={`${image.small} 720w, ${image.large} 1200w`}
      sizes={sizes}
      width={image.width}
      height={image.height}
      loading={loading}
      fetchpriority={fetchPriority}
      decoding="async"
      alt={hidden ? '' : alt}
      style={{ '--services-image-position': image.position }}
    />
  </picture>
)

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

const reveal = (reducedMotion, delay = 0, distance = 24) => (
  reducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: distance },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
      }
)

const Services = () => {
  const reducedMotion = useReducedMotion()
  const pageVisible = usePageVisibility()
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { amount: 0.12 })
  const [heroActiveIndex, setHeroActiveIndex] = useState(0)
  const [collageReady, setCollageReady] = useState(false)

  useEffect(() => {
    const preloadAttribute = 'data-akrion-services-hero-preload'
    if (document.head.querySelector(`link[${preloadAttribute}]`)) return undefined

    const firstImage = serviceStories[heroStoryIndexes[0]].image
    const preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.as = 'image'
    preloadLink.href = firstImage.large
    preloadLink.imageSrcset = `${firstImage.small} 720w, ${firstImage.large} 1200w`
    preloadLink.imageSizes = '(min-width: 1024px) 42vw, 92vw'
    preloadLink.fetchPriority = 'high'
    preloadLink.setAttribute(preloadAttribute, 'true')
    document.head.appendChild(preloadLink)

    return () => preloadLink.remove()
  }, [])

  useEffect(() => {
    const deferredImagesTimer = window.setTimeout(() => setCollageReady(true), 700)
    return () => window.clearTimeout(deferredImagesTimer)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setHeroActiveIndex(0)
      return undefined
    }

    if (!pageVisible || !heroInView || !collageReady) return undefined

    const heroTimer = window.setTimeout(() => {
      setHeroActiveIndex(current => (current + 1) % heroStoryIndexes.length)
    }, HERO_ROTATION_MS)

    return () => window.clearTimeout(heroTimer)
  }, [collageReady, heroActiveIndex, heroInView, pageVisible, reducedMotion])

  return (
    <>
      <Header />
      <main className="services-editorial-page">
        <section ref={heroRef} className="services-editorial-hero" aria-labelledby="services-editorial-heading">
          <div aria-hidden="true" className="services-editorial-hero-glow" />
          <div aria-hidden="true" className="services-editorial-pattern eth-pattern-subtle" />

          <div className="services-editorial-shell services-editorial-hero-grid">
            <div className="services-editorial-hero-copy">
              <motion.div className="section-label" {...reveal(reducedMotion, 0.03, 16)}>
                <span className="section-dot" />
                WHAT WE OFFER
              </motion.div>
              <motion.h1
                id="services-editorial-heading"
                className="services-editorial-title section-heading"
                {...reveal(reducedMotion, 0.09, 26)}
              >
                SERVICES
              </motion.h1>
              <motion.p className="services-editorial-intro" {...reveal(reducedMotion, 0.16, 18)}>
                Strategy, creativity, and technology—brought together to build brands that connect and grow.
              </motion.p>
            </div>

            <motion.div
              className="services-editorial-collage"
              data-paused={!pageVisible || !heroInView || reducedMotion}
              role="img"
              aria-label="Akrion services represented through brand identity, web design, video production, and social-media project visuals"
              {...reveal(reducedMotion, 0.12, 24)}
            >
              <div className="services-editorial-feature-frame">
                {heroStoryIndexes.map((storyIndex, index) => {
                  if (index !== 0 && !collageReady) return null
                  const isActive = index === heroActiveIndex
                  const story = serviceStories[storyIndex]

                  return (
                    <ResponsiveServiceImage
                      key={story.id}
                      image={story.image}
                      className="services-editorial-feature-slide"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'low'}
                      sizes="(min-width: 1280px) 38vw, (min-width: 900px) 44vw, 92vw"
                      hidden={!isActive}
                    />
                  )
                })}
                <span aria-hidden="true" className="services-editorial-feature-wash" />
                <span aria-hidden="true" className="services-editorial-frame-corner services-editorial-frame-corner--top" />
                <span aria-hidden="true" className="services-editorial-frame-corner services-editorial-frame-corner--bottom" />
              </div>

              {[1, 2, 3].map((storyIndex, tileIndex) => {
                const story = serviceStories[storyIndex]
                return (
                  <div key={story.id} className={`services-editorial-tile services-editorial-tile--${tileIndex + 1}`} aria-hidden="true">
                    {collageReady && (
                      <ResponsiveServiceImage
                        image={story.image}
                        className="services-editorial-tile-picture"
                        sizes="(min-width: 900px) 14vw, 38vw"
                        hidden
                      />
                    )}
                    <span className="services-editorial-tile-wash" />
                  </div>
                )
              })}
            </motion.div>
          </div>
        </section>

        <div className="services-editorial-stories">
          {serviceStories.map((service, index) => {
            const isIvory = index === 1 || index === 3
            const isReversed = index % 2 === 1

            return (
              <section
                key={service.id}
                id={service.id}
                className="services-editorial-story"
                data-tone={isIvory ? 'ivory' : 'emerald'}
                data-reversed={isReversed}
                aria-labelledby={`${service.id}-heading`}
              >
                <div aria-hidden="true" className="services-editorial-story-pattern eth-pattern-subtle" />
                <div className="services-editorial-shell services-editorial-story-grid">
                  <motion.div className="services-editorial-visual" {...reveal(reducedMotion, 0.04, 26)}>
                    <ResponsiveServiceImage
                      image={service.image}
                      className="services-editorial-story-picture"
                      sizes="(min-width: 1280px) 620px, (min-width: 900px) 48vw, calc(100vw - 2rem)"
                    />
                    <span aria-hidden="true" className="services-editorial-visual-wash" />
                    <span aria-hidden="true" className="services-editorial-visual-index">{service.number}</span>
                    <span aria-hidden="true" className="services-editorial-visual-corner" />
                  </motion.div>

                  <motion.div className="services-editorial-story-copy" {...reveal(reducedMotion, 0.1, 20)}>
                    <div className="services-editorial-story-label">
                      <span>{service.number}</span>
                      <span aria-hidden="true" />
                      SERVICE
                    </div>
                    <h2 id={`${service.id}-heading`}>{service.title}</h2>
                    <p>{service.description}</p>

                    <details className="services-editorial-included">
                      <summary>
                        <span>What’s Included</span>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </summary>
                      <div className="services-editorial-included-body">
                        <ul>
                          {service.included.map(item => <li key={item}>{item}</li>)}
                        </ul>
                      </div>
                    </details>
                  </motion.div>
                </div>
              </section>
            )
          })}
        </div>

        <section className="services-editorial-cta" aria-labelledby="services-editorial-cta-heading">
          <div aria-hidden="true" className="services-editorial-cta-pattern eth-pattern-subtle" />
          <div className="services-editorial-shell services-editorial-cta-inner">
            <motion.div {...reveal(reducedMotion, 0.03, 18)}>
              <div className="section-label"><span className="section-dot" />NOT SURE WHERE TO START?</div>
              <h2 id="services-editorial-cta-heading">
                Tell us what you’re building. We’ll help shape the right direction.
              </h2>
              <Link to="/contact" className="services-editorial-cta-button btn-primary">
                Start a Conversation
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer hideCtaBanner />
    </>
  )
}

export default Services
