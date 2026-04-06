import { useState } from 'react'
import ScrollAnimation from './ScrollAnimation'
import TiletDivider from './TiletDivider'

const services = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
      </svg>
    ),
    name: 'Brand Identity',
    description: 'Compelling visual identities that tell your story and connect with audiences on a deep level.',
    accentColor: '#8B5CF6',
    bgGlow: 'rgba(139,92,246,0.08)',
    borderHover: 'rgba(139,92,246,0.3)',
    number: '01',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    name: 'Web & App Development',
    description: 'Custom digital experiences built with cutting-edge technology and modern, accessible design.',
    accentColor: '#06B6D4',
    bgGlow: 'rgba(6,182,212,0.08)',
    borderHover: 'rgba(6,182,212,0.3)',
    number: '02',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    name: 'Video & Motion Design',
    description: 'Cinematic visuals and motion graphics that captivate, communicate, and leave a lasting impression.',
    accentColor: '#FF7F3E',
    bgGlow: 'rgba(255,127,62,0.08)',
    borderHover: 'rgba(255,127,62,0.3)',
    number: '03',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    name: 'Social Media Strategy',
    description: 'Data-driven campaigns that engage, grow, and convert your audience across all platforms.',
    accentColor: '#EC4899',
    bgGlow: 'rgba(236,72,153,0.08)',
    borderHover: 'rgba(236,72,153,0.3)',
    number: '04',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    name: 'Creative Consulting',
    description: 'Expert guidance for brand strategy and digital transformation — from vision to execution.',
    accentColor: '#F59E0B',
    bgGlow: 'rgba(245,158,11,0.08)',
    borderHover: 'rgba(245,158,11,0.3)',
    number: '05',
  },
]

const whatsappNumber = '251976601172'

const WhatWeDo = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const handleWhatsAppClick = (serviceName) => {
    const message = encodeURIComponent(`Hello! I'm interested in your ${serviceName} services.`)
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 bg-bg-darker relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-orange/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16 lg:mb-20">
          <div className="flex flex-col gap-4">
            <ScrollAnimation animation="fadeLeft" delay={0.1}>
              <div className="section-label">
                <span className="section-dot" />
                Our Services
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeLeft" delay={0.2} duration={0.8}>
              <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)] text-white">
                WHAT WE DO
              </h2>
            </ScrollAnimation>
          </div>
          <ScrollAnimation animation="fadeRight" delay={0.3}>
            <p className="text-sm sm:text-base text-white/40 max-w-xs leading-relaxed font-light">
              From concept to launch, we handle every creative and technical step.
            </p>
          </ScrollAnimation>
        </div>
        
        {/* Tilet Divider */}
        <TiletDivider className="mb-12 sm:mb-16 -mt-4 opacity-70" />

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {services.map((service, index) => (
            <ScrollAnimation key={index} animation="fadeUp" delay={0.15 + index * 0.08}>
              <div
                className="relative group flex flex-col gap-5 p-6 sm:p-7 rounded-2xl border transition-all duration-400 cursor-pointer overflow-hidden h-full"
                style={{
                  background: hoveredIndex === index ? service.bgGlow : 'rgba(255,255,255,0.02)',
                  borderColor: hoveredIndex === index ? service.borderHover : 'rgba(255,255,255,0.07)',
                  boxShadow: hoveredIndex === index ? `0 20px 60px -10px ${service.bgGlow}, 0 0 0 1px ${service.borderHover}` : 'none',
                  transform: hoveredIndex === index ? 'translateY(-4px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleWhatsAppClick(service.name)}
              >
                {/* Shimmer on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
                  }}
                />

                {/* Number + Icon row */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${service.accentColor}15`,
                      color: service.accentColor,
                      border: `1px solid ${service.accentColor}25`,
                    }}
                  >
                    {service.icon}
                  </div>
                  <span
                    className="text-xs font-bold tracking-[0.1em] transition-colors duration-300"
                    style={{ color: hoveredIndex === index ? service.accentColor : 'rgba(255,255,255,0.15)' }}
                  >
                    {service.number}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                {/* CTA arrow */}
                <div
                  className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase transition-all duration-300"
                  style={{ color: hoveredIndex === index ? service.accentColor : 'rgba(255,255,255,0.25)' }}
                >
                  <span>Get in Touch</span>
                  <svg
                    width="14" height="14" viewBox="0 0 20 20" fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo
