import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollAnimation, { ParallaxSection } from './ScrollAnimation'
import TiletDivider from './TiletDivider'

const words = ['WE BUILD.', 'WE DEVELOP.', 'WE CREATE.']

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '3+', label: 'Years of Experience' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '5+', label: 'Industries Served' },
]

// Brand colors
const GOLD = '#C9A170'
const GOLD_DARK = '#9E7A4A'

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  /* Typewriter effect */
  useEffect(() => {
    const current = words[wordIndex]
    let timeout

    if (!isDeleting) {
      if (displayText.length < current.length) {
        timeout = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), 80)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(current.slice(0, displayText.length - 1)), 45)
      } else {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex])

  /* Mouse parallax (desktop only) */
  useEffect(() => {
    if (isMobile) return
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden pt-20 sm:pt-24">
      {/* Background layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(201,161,112,0.10) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(45,107,63,0.12) 0%, transparent 50%), #0D1F13`,
        }}
      />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 z-0 dot-grid opacity-60" />

      {/* Ornamental Tilet Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 eth-corner opacity-20 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-32 h-32 eth-corner opacity-20 pointer-events-none z-0 transform rotate-90" />
      <div className="absolute bottom-0 left-0 w-32 h-32 eth-corner opacity-20 pointer-events-none z-0 transform -rotate-90" />
      <div className="absolute bottom-0 right-0 w-32 h-32 eth-corner opacity-20 pointer-events-none z-0 transform rotate-180" />


      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse" style={{ background: 'rgba(201,161,112,0.07)' }} />
      <div
        className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse"
        style={{ background: 'rgba(45,107,63,0.10)', animationDelay: '2s' }}
      />

      {/* Floating particles — gold dots and Tilet motifs */}
      {[...Array(8)].map((_, i) => {
        const isTilet = i >= 6;
        return (
          <div
            key={i}
            className="absolute rounded-full animate-float pointer-events-none"
            style={{
              width: isTilet ? '40px' : `${[2, 3, 2, 4, 2, 3][i]}px`,
              height: isTilet ? '40px' : `${[2, 3, 2, 4, 2, 3][i]}px`,
              background: isTilet ? 'none' : [GOLD, '#2D6B3F', GOLD, GOLD_DARK, '#2D6B3F', GOLD][i],
              backgroundImage: isTilet ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 2 L38 20 L20 38 L2 20 Z' stroke='%23C9A170' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%23C9A170' opacity='0.4'/%3E%3C/svg%3E")` : 'none',
              top: [`15%`, `30%`, `65%`, `20%`, `75%`, `45%`, `25%`, `80%`][i],
              left: [`10%`, `85%`, `75%`, `45%`, `15%`, `60%`, `80%`, `20%`][i],
              opacity: isTilet ? 0.4 : 0.55,
              animationDelay: `${i * 0.8}s`,
              animationDuration: isTilet ? '12s' : '6s',
              zIndex: 1
            }}
          />
        );
      })}

      {/* Main content */}
      <ParallaxSection speed={0.15} className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center text-center gap-6 sm:gap-8 lg:gap-10">

          {/* Label chip */}
          <ScrollAnimation animation="fadeDown" delay={0.1} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.12em] uppercase" style={{ border: '1px solid rgba(201,161,112,0.2)', background: 'rgba(201,161,112,0.06)', color: 'rgba(201,161,112,0.8)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A170' }} />
              Creative Agency · Addis Ababa, Ethiopia
            </div>
          </ScrollAnimation>

          {/* Headline with typewriter */}
          <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
            <h1 className="section-heading text-[clamp(2.8rem,9vw,7rem)] text-white leading-[1.0] tracking-[-0.04em]">
              <span
                className="relative inline-block gradient-text-gold"
                style={{ minWidth: '2ch' }}
              >
                {displayText}
                <span className="animate-blink" style={{ color: '#C9A170' }}>|</span>
              </span>
            </h1>
          </ScrollAnimation>

          {/* Sub-headline */}
          <ScrollAnimation animation="fadeUp" delay={0.35} duration={0.8}>
            <p className="text-[clamp(1rem,2.5vw,1.35rem)] leading-relaxed text-white/55 max-w-2xl font-light tracking-[-0.01em]">
              We&apos;re a creative agency transforming imagination into experience — blending{' '}
              <span className="text-white/80 font-normal">design</span>,{' '}
              <span className="text-white/80 font-normal">storytelling</span>, and{' '}
              <span className="text-white/80 font-normal">technology</span> to build digital products that deliver results.
            </p>
          </ScrollAnimation>

          {/* CTA Buttons */}
          <ScrollAnimation animation="fadeUp" delay={0.5} duration={0.7}>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/portfolio"
                className="btn-primary text-base px-8 py-4 rounded-2xl group min-h-[52px]"
              >
                View Our Work
                <svg
                  width="18" height="18"
                  viewBox="0 0 20 20" fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="https://wa.me/251976601172"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-base px-8 py-4 rounded-2xl min-h-[52px]"
              >
                Contact Us
              </a>
            </div>
          </ScrollAnimation>

          {/* Premium Ethiopian Tilet Divider */}
          <TiletDivider className="py-2 opacity-80" />

          {/* Stats row */}
          <ScrollAnimation animation="fadeUp" delay={0.75} duration={0.7}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(201,161,112,0.08)', border: '1px solid rgba(201,161,112,0.12)' }}>
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-0.5 px-6 sm:px-8 py-5 transition-all duration-300 hover:bg-white/[0.02]"
                  style={{ 
                    background: 'rgba(201,161,112,0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRight: i < stats.length - 1 ? '1px solid rgba(201,161,112,0.08)' : 'none'
                  }}
                >
                  <span className="counter-text text-2xl sm:text-3xl font-bold" style={{ color: '#C9A170', textShadow: '0 0 20px rgba(201,161,112,0.2)' }}>{stat.value}</span>
                  <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-center leading-tight" style={{ color: 'rgba(201,161,112,0.4)' }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollAnimation>

        </div>
      </ParallaxSection>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: '#C9A170' }}>Scroll</span>
        <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, rgba(201,161,112,0.5), transparent)' }} />
      </div>
    </section>
  )
}

export default Hero
