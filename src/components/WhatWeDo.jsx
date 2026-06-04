import { useState } from 'react'
import ScrollAnimation from './ScrollAnimation'
import TiletDivider from './TiletDivider'

// ── Service tiers — Normal → Package → Premium
const tiers = [
  {
    id: 'normal',
    name: 'Normal',
    tagline: 'Affordable, clear & effective',
    description: 'Essential services built with care. Perfect for businesses that need quality work without the luxury price tag.',
    badge: 'Starter',
    badgeColor: 'rgba(120,180,140,0.2)',
    badgeText: 'rgba(120,200,140,0.9)',
    accentColor: '#7AB48C',
    icon: '✦',
    services: [
      { name: 'Logo Design', what: 'Professional logo + 3 variations', price: 'From 5,000 ETB' },
      { name: 'Social Media Pack', what: '10 branded post templates', price: 'From 3,500 ETB' },
      { name: 'Landing Page', what: 'Single-page website with contact form', price: 'From 12,000 ETB' },
      { name: 'Brand Guidelines', what: 'Colors, fonts & usage rules PDF', price: 'From 4,000 ETB' },
    ],
  },
  {
    id: 'package',
    name: 'Package',
    tagline: 'More value, bundled together',
    description: 'The smart choice. Bundled services that work together to give your brand a consistent, professional appearance and more reach.',
    badge: 'Best Value',
    badgeColor: 'rgba(201,161,112,0.18)',
    badgeText: '#E2C49A',
    accentColor: '#C9A170',
    icon: '◆',
    featured: true,
    services: [
      { name: 'Full Brand Identity', what: 'Logo + Guidelines + Social Templates + Business Cards', price: 'From 18,000 ETB' },
      { name: 'Starter Website', what: '5-page website + SEO setup + 1 month support', price: 'From 35,000 ETB' },
      { name: 'Content Creation Pack', what: '20 posts + 4 reels/month + captions + strategy', price: 'From 9,000 ETB/mo' },
      { name: 'Launch Campaign', what: 'Brand reveal strategy + ads + content calendar', price: 'From 22,000 ETB' },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Luxury execution. Lasting impact.',
    description: 'For brands that demand excellence. End-to-end creative partnership with international quality standards and bespoke attention.',
    badge: 'Elite',
    badgeColor: 'rgba(245,237,216,0.10)',
    badgeText: '#F5EDD8',
    accentColor: '#F0DDB0',
    icon: '❋',
    services: [
      { name: 'Full Brand Experience', what: 'Complete identity system, motion logo, brand film, web app & ongoing strategy', price: 'Custom Quote' },
      { name: 'Premium Web Platform', what: 'Custom-built website with CMS, animations & e-commerce', price: 'From 80,000 ETB' },
      { name: 'Documentary / Brand Film', what: 'Cinematic production, script, shoot & full edit', price: 'From 60,000 ETB' },
      { name: 'Ongoing Growth Partner', what: 'Monthly retainer — content, ads, analytics & consulting', price: 'From 25,000 ETB/mo' },
    ],
  },
]

// ── Individual service categories
const categories = [
  { name: 'Brand Identity', number: '01', desc: 'Logos, visual systems, brand guidelines that make you unmistakable.' },
  { name: 'Web Development', number: '02', desc: 'Websites and apps that convert visitors into customers.' },
  { name: 'Video & Motion', number: '03', desc: 'Cinematic content that makes people stop scrolling.' },
  { name: 'Social Media', number: '04', desc: 'Strategy, content & community management that grows your audience.' },
  { name: 'Creative Consulting', number: '05', desc: 'Strategic guidance to position, launch, and scale your brand.' },
]

const GOLD = '#C9A170'
const CREAM = '#F5EDD8'
const whatsappNumber = '251976601172'

const WhatWeDo = () => {
  const [activeTier, setActiveTier] = useState('package')

  const handleGetStarted = (tierName, serviceName) => {
    const message = encodeURIComponent(`Hello Akrion Digitals! 👋\n\nI'm interested in your ${tierName} tier — specifically "${serviceName}". Could we talk about this?`)
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  const activeTierData = tiers.find(t => t.id === activeTier)

  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 bg-bg-darker relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(245,237,216,0.03)' }} />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 sm:mb-16 lg:mb-20">
          <ScrollAnimation animation="fadeUp" delay={0.1}>
            <div className="section-label"><span className="section-dot" />Our Services</div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
            <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)] text-white">
              WHAT WE DO
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.3}>
            <p className="text-base max-w-xl leading-relaxed font-light" style={{ color: 'rgba(245,237,216,0.4)' }}>
              From simple and affordable to fully bespoke — we meet you where you are and grow with you.
            </p>
          </ScrollAnimation>
        </div>

        {/* Tilet Divider */}
        <TiletDivider className="mb-12 sm:mb-16 -mt-4 opacity-70" />

        {/* Service Categories */}
        <ScrollAnimation animation="fadeUp" delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-14">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl border transition-all duration-300 cursor-default group"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(201,161,112,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,161,112,0.06)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.22)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.08)' }}
              >
                <span className="text-sm font-black font-display" style={{ color: GOLD }}>{cat.number}</span>
                <p className="text-xs font-bold tracking-wide" style={{ color: CREAM }}>{cat.name}</p>
                <p className="text-xs font-light leading-tight" style={{ color: 'rgba(245,237,216,0.35)' }}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </ScrollAnimation>

        {/* Tier Selector Tabs */}
        <ScrollAnimation animation="fadeUp" delay={0.3}>
          <div className="flex items-center justify-center mb-8">
            <div
              className="inline-flex rounded-2xl p-1 gap-1"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,161,112,0.10)' }}
            >
              {tiers.map(tier => (
                <button
                  key={tier.id}
                  onClick={() => setActiveTier(tier.id)}
                  className="relative px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300"
                  style={{
                    background: activeTier === tier.id
                      ? tier.id === 'normal' ? 'rgba(120,180,140,0.12)'
                        : tier.id === 'package' ? 'rgba(201,161,112,0.15)'
                        : 'rgba(245,237,216,0.08)'
                      : 'transparent',
                    color: activeTier === tier.id ? tier.accentColor : 'rgba(255,255,255,0.35)',
                    border: activeTier === tier.id ? `1px solid ${tier.accentColor}30` : '1px solid transparent',
                  }}
                >
                  {tier.featured && activeTier === tier.id && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: GOLD, color: '#0D1F13' }}>
                      Popular
                    </span>
                  )}
                  {tier.icon} {tier.name}
                </button>
              ))}
            </div>
          </div>
        </ScrollAnimation>

        {/* Active Tier Details */}
        {activeTierData && (
          <ScrollAnimation animation="fadeUp" delay={0.1} key={activeTier}>
            <div
              className="relative rounded-3xl border p-6 sm:p-10 mb-8"
              style={{
                background: 'rgba(19,32,25,0.85)',
                borderColor: `${activeTierData.accentColor}28`,
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-10 right-10 h-px" style={{ background: `linear-gradient(90deg, transparent, ${activeTierData.accentColor}60, transparent)` }} />

              {/* Tier header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide"
                      style={{ background: activeTierData.badgeColor, color: activeTierData.badgeText, border: `1px solid ${activeTierData.accentColor}20` }}
                    >
                      {activeTierData.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold" style={{ color: CREAM }}>
                      {activeTierData.name} Services
                    </h3>
                  </div>
                  <p className="text-sm font-light leading-relaxed max-w-lg" style={{ color: 'rgba(245,237,216,0.45)' }}>
                    {activeTierData.description}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(activeTierData.name)}%20tier.%20Let's%20talk!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-shrink-0 px-6 py-3 text-sm group"
                >
                  Let's Build Your Brand
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              {/* Services list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeTierData.services.map((service, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(201,161,112,0.07)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${activeTierData.accentColor}08`; e.currentTarget.style.borderColor = `${activeTierData.accentColor}22` }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.07)' }}
                    onClick={() => handleGetStarted(activeTierData.name, service.name)}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${activeTierData.accentColor}15`, color: activeTierData.accentColor, border: `1px solid ${activeTierData.accentColor}22` }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="text-sm font-semibold" style={{ color: CREAM }}>{service.name}</p>
                      <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.4)' }}>{service.what}</p>
                      <p className="text-xs font-bold mt-1" style={{ color: activeTierData.accentColor }}>{service.price}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1 mt-1 flex-shrink-0" style={{ color: activeTierData.accentColor }}>
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        )}

        {/* Bottom CTA */}
        <ScrollAnimation animation="fadeUp" delay={0.4}>
          <div
            className="text-center p-6 sm:p-8 rounded-2xl border"
            style={{ background: 'rgba(201,161,112,0.04)', borderColor: 'rgba(201,161,112,0.10)' }}
          >
            <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: GOLD }}>Not sure what you need?</p>
            <h3 className="font-display font-bold text-xl sm:text-2xl mb-4" style={{ color: CREAM }}>
              Let's talk — we'll figure it out together.
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi!%20I%27d%20like%20a%20free%20strategy%20call%20to%20figure%20out%20what%20I%20need.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 group inline-flex"
              >
                Book Free Strategy Call
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="/services" className="btn-ghost px-8 py-4 inline-flex">
                View Full Services Page
              </a>
            </div>
          </div>
        </ScrollAnimation>

      </div>
    </section>
  )
}

export default WhatWeDo
