import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { mergeServiceStories, serviceStories as fallbackServiceStories } from '../data/servicesContent'
import { servicesAPI } from '../lib/api/services'

const HERO_ROTATION_MS = 6200

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
  const [serviceStories, setServiceStories] = useState(fallbackServiceStories)

  useEffect(() => {
    let active = true
    servicesAPI.getAll()
      .then((records) => {
        if (active && records.length) setServiceStories(mergeServiceStories(records))
      })
      .catch((error) => console.warn('Unable to load managed service copy; using verified local content.', error))
    return () => { active = false }
  }, [])

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
