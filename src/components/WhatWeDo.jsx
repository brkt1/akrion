import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import brandIdentityImage720 from '../assets/services/service-brand-identity-720.webp'
import brandIdentityImage1200 from '../assets/services/service-brand-identity-1200.webp'
import webDevelopmentImage720 from '../assets/services/service-web-development-720.webp'
import webDevelopmentImage1200 from '../assets/services/service-web-development-1200.webp'
import videoMotionImage720 from '../assets/services/service-video-motion-720.webp'
import videoMotionImage1200 from '../assets/services/service-video-motion-1200.webp'
import socialMediaImage720 from '../assets/services/service-social-media-720.webp'
import socialMediaImage1200 from '../assets/services/service-social-media-1200.webp'
import creativeConsultingImage720 from '../assets/services/service-creative-consulting-720.webp'
import creativeConsultingImage1200 from '../assets/services/service-creative-consulting-1200.webp'

const services = [
  {
    id: 'brand-identity',
    number: '01',
    name: 'Brand Identity',
    description: 'Logos, visual systems, brand guidelines that make you unmistakable.',
    image: brandIdentityImage720,
    imageLarge: brandIdentityImage1200,
    alt: 'Premium brand identity system with packaging, mark studies, and emerald-and-gold color swatches',
  },
  {
    id: 'web-development',
    number: '02',
    name: 'Web Development',
    description: 'Websites and apps that convert visitors into customers.',
    image: webDevelopmentImage720,
    imageLarge: webDevelopmentImage1200,
    alt: 'Desktop and mobile interface mockups demonstrating responsive web development',
  },
  {
    id: 'video-motion',
    number: '03',
    name: 'Video & Motion',
    description: 'Cinematic content that makes people stop scrolling.',
    image: videoMotionImage720,
    imageLarge: videoMotionImage1200,
    alt: 'Cinematic video editing and motion-design workstation with an abstract production timeline',
    showPlayMark: true,
  },
  {
    id: 'social-media',
    number: '04',
    name: 'Social Media',
    description: 'Strategy, content & community management that grows your audience.',
    image: socialMediaImage720,
    imageLarge: socialMediaImage1200,
    alt: 'Original social media post, carousel, and vertical video content mockups',
  },
  {
    id: 'creative-consulting',
    number: '05',
    name: 'Creative Consulting',
    description: 'Strategic guidance to position, launch, and scale your brand.',
    image: creativeConsultingImage720,
    imageLarge: creativeConsultingImage1200,
    alt: 'Creative strategy workshop table with campaign sketches, notes, and color planning',
  },
]

const ArrowIcon = ({ className = '', ...props }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M7.5 15L12.5 10L7.5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ServicesDivider = () => (
  <div aria-hidden="true" className="mb-8 flex w-full items-center justify-center py-4 opacity-70 sm:mb-10">
    <div className="flex w-full max-w-[600px] items-center gap-3 px-4 opacity-90 sm:gap-5">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A170]/30 to-[#C9A170]/80" />
      <span className="flex items-center gap-2">
        {[0, 1, 2].map(index => (
          <svg
            key={index}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={index === 1 ? 'mx-2 scale-[1.35]' : 'scale-90 opacity-50'}
          >
            <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="#C9A170" fill={index === 1 ? 'rgba(201,161,112,0.08)' : 'transparent'} />
            <path d="M12 7L17 12L12 17L7 12L12 7Z" stroke="#C9A170" strokeWidth="1.2" opacity="0.85" />
            <circle cx="12" cy="12" r="2.5" fill="#C9A170" />
          </svg>
        ))}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C9A170]/30 to-[#C9A170]/80" />
    </div>
  </div>
)

const WhatWeDo = () => {
  const shouldReduceMotion = useReducedMotion()
  const [activeService, setActiveService] = useState(0)
  const [supportsFinePointer, setSupportsFinePointer] = useState(false)
  const [isGlowVisible, setIsGlowVisible] = useState(false)
  const serviceButtonRefs = useRef([])
  const glowX = useMotionValue(0)
  const glowY = useMotionValue(0)
  const smoothGlowX = useSpring(glowX, { stiffness: 70, damping: 24, mass: 0.45 })
  const smoothGlowY = useSpring(glowY, { stiffness: 70, damping: 24, mass: 0.45 })

  useEffect(() => {
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updatePointerSupport = () => setSupportsFinePointer(pointerQuery.matches)

    updatePointerSupport()
    if (pointerQuery.addEventListener) {
      pointerQuery.addEventListener('change', updatePointerSupport)
      return () => pointerQuery.removeEventListener('change', updatePointerSupport)
    }

    pointerQuery.addListener(updatePointerSupport)
    return () => pointerQuery.removeListener(updatePointerSupport)
  }, [])

  const canUsePointerMotion = supportsFinePointer && !shouldReduceMotion

  const reveal = (delay = 0) => shouldReduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
      }

  const handleServiceKeyDown = (event, index) => {
    const forwardKeys = ['ArrowRight', 'ArrowDown']
    const backwardKeys = ['ArrowLeft', 'ArrowUp']
    let nextIndex = index

    if (forwardKeys.includes(event.key)) nextIndex = (index + 1) % services.length
    else if (backwardKeys.includes(event.key)) nextIndex = (index - 1 + services.length) % services.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = services.length - 1
    else return

    event.preventDefault()
    setActiveService(nextIndex)
    serviceButtonRefs.current[nextIndex]?.focus()
  }

  const handleShowcasePointerMove = event => {
    if (!canUsePointerMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    glowX.set(event.clientX - bounds.left - 160)
    glowY.set(event.clientY - bounds.top - 160)
  }

  return (
    <section
      id="services"
      aria-labelledby="what-we-do-heading"
      className="what-we-do-section relative overflow-hidden bg-bg-darker px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-32"
    >
      <div aria-hidden="true" className="eth-pattern-subtle absolute inset-0 opacity-[0.16]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-0 h-[34rem] w-[34rem] rounded-full blur-[150px]"
        style={{ background: 'rgba(201,161,112,0.045)' }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <motion.header
          className="mx-auto mb-6 flex max-w-3xl flex-col items-center gap-4 text-center sm:mb-8"
          {...reveal(0.05)}
        >
          <div className="section-label"><span className="section-dot" />OUR SERVICES</div>
          <h2
            id="what-we-do-heading"
            className="section-heading text-[clamp(2.2rem,5vw,4rem)] text-white"
          >
            WHAT WE DO
          </h2>
          <p className="max-w-2xl text-base font-light leading-relaxed text-[rgba(245,237,216,0.68)] sm:text-lg">
            From bold ideas to complete digital experiences, we bring strategy, creativity, and technology together to move your brand forward.
          </p>
        </motion.header>

        <ServicesDivider />

        <motion.div {...reveal(0.12)}>
          <div
            className="services-showcase-shell relative"
            onPointerEnter={() => canUsePointerMotion && setIsGlowVisible(true)}
            onPointerLeave={() => setIsGlowVisible(false)}
            onPointerMove={handleShowcasePointerMove}
          >
            <motion.div
              aria-hidden="true"
              className="services-cursor-glow pointer-events-none absolute left-0 top-0 z-0 h-80 w-80 rounded-full blur-[90px]"
              animate={{ opacity: isGlowVisible && canUsePointerMotion ? 0.7 : 0 }}
              style={{
                x: smoothGlowX,
                y: smoothGlowY,
                background: 'radial-gradient(circle, rgba(201,161,112,0.24), rgba(201,161,112,0) 70%)',
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
            />

            <div
              className="services-showcase relative z-[1]"
              role="group"
              aria-label="Akrion Digitals services"
            >
              {services.map((service, index) => {
                const isActive = activeService === index

                return (
                  <article
                    key={service.id}
                    className="service-visual-panel group relative isolate min-h-[23rem] overflow-hidden rounded-[1.5rem] bg-[#102419]"
                    data-active={isActive ? 'true' : 'false'}
                    onFocusCapture={() => setActiveService(index)}
                    onPointerEnter={() => supportsFinePointer && setActiveService(index)}
                  >
                    <img
                      className="service-panel-image absolute inset-0 h-full w-full object-cover"
                      src={service.image}
                      srcSet={`${service.image} 720w, ${service.imageLarge} 1200w`}
                      sizes={isActive
                        ? '(min-width: 1280px) 55vw, (min-width: 768px) 50vw, 100vw'
                        : '(min-width: 1280px) 18vw, (min-width: 768px) 50vw, 100vw'}
                      width="1200"
                      height="800"
                      loading="lazy"
                      decoding="async"
                      alt={service.alt}
                    />
                    <div aria-hidden="true" className="service-panel-overlay absolute inset-0" />
                    <div aria-hidden="true" className="eth-pattern-subtle absolute inset-0 opacity-[0.12] mix-blend-screen" />

                    {service.showPlayMark && (
                      <span
                        aria-hidden="true"
                        className="service-panel-play service-play-indicator"
                      >
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                          <path d="M17 10L1 19V1L17 10Z" fill="currentColor" />
                        </svg>
                      </span>
                    )}

                    <button
                      ref={element => { serviceButtonRefs.current[index] = element }}
                      type="button"
                      className="service-panel-select absolute inset-0 z-[3] rounded-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#E2C49A]"
                      aria-label={`Select ${service.name}`}
                      aria-pressed={isActive}
                      aria-describedby={`service-description-${service.id}`}
                      onClick={() => setActiveService(index)}
                      onFocus={() => setActiveService(index)}
                      onKeyDown={event => handleServiceKeyDown(event, index)}
                    />

                    <div className="service-panel-content pointer-events-none absolute inset-x-0 bottom-0 z-[4] p-5 sm:p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="font-display text-sm font-black tracking-[0.14em] text-[#E2C49A]">
                          {service.number}
                        </span>
                        <span aria-hidden="true" className="h-px w-8 bg-[#C9A170]/55" />
                      </div>
                      <h3 className="max-w-md font-display text-2xl font-bold leading-tight text-[#F5EDD8] sm:text-[1.7rem]">
                        {service.name}
                      </h3>
                      <p
                        id={`service-description-${service.id}`}
                        className="service-panel-description mt-3 max-w-lg text-sm font-light leading-relaxed text-[rgba(245,237,216,0.72)] sm:text-[0.95rem]"
                      >
                        {service.description}
                      </p>
                      <Link
                        to="/services"
                        className="service-panel-link pointer-events-auto mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#E2C49A] focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2C49A]"
                        aria-label={`Learn more about ${service.name}`}
                      >
                        Learn More
                        <ArrowIcon className="service-panel-arrow" />
                      </Link>
                    </div>

                  </article>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhatWeDo
