import { useState, useEffect } from 'react'
import ScrollAnimation, { StaggerContainer, StaggerItem } from './ScrollAnimation'
import TiletDivider from './TiletDivider'
import { portfolioAPI } from '../lib/api/portfolio'

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CREAM = '#F5EDD8'

const ACCENTS = [GOLD, '#2D6B3F', '#9E7A4A', '#E2C49A', '#7AB48C']

const staticProjects = [
  {
    name: 'Cassopia Tour',
    category: 'Web Development',
    tag: 'Travel & Hospitality',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: GOLD,
    problem: 'Cassopia had no digital presence — potential customers couldn’t find or book tours online, and the brand felt untrustworthy.',
    strategy: 'Built a full-stack booking platform with live availability, secure payments, and a cinematic visual identity that inspired wanderlust.',
    result: '3× increase in booking inquiries within 60 days of launch. Google Page 1 ranking for key travel search terms.',
    metrics: [
      { value: '3×', label: 'More Inquiries' },
      { value: '#1', label: 'Google Ranking' },
      { value: '60', label: 'Days to Result' },
    ],
    postLink: 'https://instagram.com/p/cassopia',
  },
  {
    name: 'Yenege Games',
    category: 'Game Development',
    tag: 'Entertainment & Tech',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: '#2D6B3F',
    featured: true,
    problem: 'An Ethiopian gaming startup needed a brand identity and launch strategy to compete in an already crowded mobile market.',
    strategy: 'Designed an immersive, culturally-rooted brand with Ethiopian-themed game mechanics, then executed a viral launch campaign across social media.',
    result: '10,000+ downloads in the first week. Featured on 3 local news outlets. Top 5 gaming app in Ethiopia on launch day.',
    metrics: [
      { value: '10K+', label: 'Week 1 Downloads' },
      { value: 'Top 5', label: 'App Store Rank' },
      { value: '3', label: 'Media Features' },
    ],
    postLink: 'https://instagram.com/p/yenegegames',
  },
  {
    name: "Corno D'Africa",
    category: 'Brand Film',
    tag: 'Culture & Hospitality',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: '#9E7A4A',
    problem: 'A Horn of Africa restaurant wanted to attract an international clientele but had no video content to communicate its unique culture and warmth.',
    strategy: 'Produced a documentary-style brand film that opened with a personal story, then revealed the food, atmosphere and human connection behind the brand.',
    result: '50,000+ organic views. The film is now shown at the restaurant entrance and used in all tourist marketing materials.',
    metrics: [
      { value: '50K+', label: 'Organic Views' },
      { value: '2×', label: 'Walk-In Traffic' },
      { value: '100%', label: 'Client Satisfaction' },
    ],
    postLink: 'https://instagram.com/p/cornodafrica',
  },
  {
    name: 'Akrion Run Campaign',
    category: 'Campaign',
    tag: 'Sports & Community',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: '#E2C49A',
    problem: 'A city marathon had struggled with low registration numbers and weak community engagement for two consecutive years.',
    strategy: 'Created an emotional campaign anchored in community pride — "Run for something bigger" — with targeted social ads, influencer content, and event branding.',
    result: '3,000+ registrations, 1M+ social impressions, and partnerships with 5 local brands who used the event for co-marketing.',
    metrics: [
      { value: '3K+', label: 'Registrations' },
      { value: '1M+', label: 'Impressions' },
      { value: '5', label: 'Brand Partners' },
    ],
    postLink: 'https://instagram.com/p/akrionrun',
  },
  {
    name: 'Teff & Bula',
    category: 'Brand Identity',
    tag: 'Food & Beverage',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: GOLD,
    problem: 'An Ethiopian F&B startup with a premium product was perceived as local and affordable — making it impossible to enter international markets.',
    strategy: 'Repositioned the brand from "local food" to "artisan heritage" — premium packaging, bilingual identity, and a visual system inspired by Ethiopian patterns.',
    result: 'Successfully launched in 2 UAE markets. Featured in a regional food magazine. Price point increased by 40% after rebrand.',
    metrics: [
      { value: '2', label: 'New Markets' },
      { value: '+40%', label: 'Price Point Lift' },
      { value: '1', label: 'Magazine Feature' },
    ],
    postLink: 'https://instagram.com/p/teffandbula',
  },
]

const OurWork = () => {
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [displayProjects, setDisplayProjects] = useState(staticProjects)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await portfolioAPI.getAll()
        if (data && data.length > 0) {
          const mappedProjects = data.map((p, i) => ({
            name: p.title,
            category: p.category || 'Portfolio',
            tag: typeof p.tags === 'string' ? p.tags : (Array.isArray(p.tags) ? p.tags.join(', ') : ''),
            image: p.image || '',
            accent: ACCENTS[i % ACCENTS.length],
            problem: p.problem || 'Client faced challenges requiring a digital upgrade.',
            strategy: p.strategy || 'Implemented a strategic solution.',
            result: p.result || 'Delivered successful outcomes.',
            metrics: [],
            postLink: p.link || null,
          }))
          setDisplayProjects([...mappedProjects, ...staticProjects].slice(0, 5))
        }
      } catch (err) {
        console.error('Failed to load portfolio projects for home page', err)
      }
    }
    loadProjects()
  }, [])

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 relative overflow-hidden"
      style={{ background: '#0A1A0F' }}>

      {/* Background */}
      <div className="absolute inset-0 eth-pattern-subtle opacity-60 pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-[200px] pointer-events-none z-0"
        style={{ background: 'rgba(201,161,112,0.04)' }} />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full blur-[160px] pointer-events-none z-0"
        style={{ background: 'rgba(245,237,216,0.02)' }} />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="flex flex-col gap-4">
            <ScrollAnimation animation="fadeLeft" delay={0.1}>
              <div className="section-label"><span className="section-dot" />Portfolio</div>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeLeft" delay={0.2} duration={0.8}>
              <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)]">OUR WORK</h2>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeLeft" delay={0.3}>
              <p className="text-sm font-light max-w-md leading-relaxed" style={{ color: 'rgba(245,237,216,0.4)' }}>
                Every project tells a story — the problem, the strategy, the transformation, and the proof.
              </p>
            </ScrollAnimation>
          </div>
          <ScrollAnimation animation="fadeRight" delay={0.3}>
            <a href="/portfolio" className="btn-ghost text-sm px-5 py-2.5 group flex-shrink-0">
              View All Projects
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </ScrollAnimation>
        </div>

        {/* Tilet Divider */}
        <TiletDivider className="mb-12 sm:mb-16 -mt-4 opacity-70" />

        {/* Project cards */}
        <StaggerContainer className="flex flex-col gap-5" staggerDelay={0.08}>
          {displayProjects.map((project, index) => {
            const isExpanded = expandedIndex === index
            return (
              <StaggerItem key={index}>
                <div
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-500"
                  style={{
                    border: `1px solid ${isExpanded ? project.accent + '35' : 'rgba(201,161,112,0.08)'}`,
                    background: 'rgba(13,31,19,0.9)',
                    boxShadow: isExpanded
                      ? `0 24px 80px rgba(0,0,0,0.5), 0 0 40px ${project.accent}10`
                      : '0 4px 20px rgba(0,0,0,0.25)',
                  }}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px transition-all duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${isExpanded ? project.accent + '80' : 'rgba(201,161,112,0.15)'}, transparent)` }} />

                  {/* Header row — always visible */}
                  <div
                    className="flex items-center gap-4 sm:gap-6 p-5 sm:p-7 cursor-pointer select-none"
                    onClick={() => toggleExpand(index)}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${project.accent}30, transparent)` }} />
                    </div>

                    {/* Title block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                          style={{ background: `${project.accent}15`, color: project.accent, border: `1px solid ${project.accent}25` }}
                        >
                          {project.category}
                        </span>
                        <span className="text-[10px] font-light tracking-wide" style={{ color: 'rgba(245,237,216,0.3)' }}>
                          {project.tag}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-xl font-bold leading-tight truncate" style={{ color: CREAM }}>
                        {project.name}
                      </h3>
                      {/* Collapsed: show problem teaser */}
                      {!isExpanded && (
                        <p className="text-xs font-light mt-0.5 line-clamp-1 hidden sm:block" style={{ color: 'rgba(245,237,216,0.35)' }}>
                          {project.problem}
                        </p>
                      )}
                    </div>

                    {/* Metrics pills (always visible on md+) */}
                    <div className="hidden md:flex gap-3 flex-shrink-0">
                      {project.metrics && project.metrics.map((m, mi) => (
                        <div key={mi} className="flex flex-col items-center px-4 py-2 rounded-xl text-center"
                          style={{ background: `${project.accent}08`, border: `1px solid ${project.accent}18` }}>
                          <span className="text-base font-black leading-tight" style={{ color: project.accent }}>{m.value}</span>
                          <span className="text-[9px] font-semibold tracking-wide uppercase leading-tight mt-0.5" style={{ color: 'rgba(245,237,216,0.3)' }}>{m.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Expand chevron */}
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isExpanded ? `${project.accent}20` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isExpanded ? project.accent + '40' : 'rgba(255,255,255,0.06)'}`,
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke={isExpanded ? project.accent : 'rgba(245,237,216,0.4)'}
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded case study */}
                  {isExpanded && (
                    <div className="animate-fadeIn border-t px-5 sm:px-7 pb-7 pt-6"
                      style={{ borderColor: `${project.accent}20` }}>

                      {/* Mobile metrics */}
                      {project.metrics && project.metrics.length > 0 && (
                        <div className="flex gap-3 mb-6 md:hidden">
                          {project.metrics.map((m, mi) => (
                            <div key={mi} className="flex flex-col items-center flex-1 px-3 py-2.5 rounded-xl text-center"
                              style={{ background: `${project.accent}08`, border: `1px solid ${project.accent}18` }}>
                              <span className="text-lg font-black leading-tight" style={{ color: project.accent }}>{m.value}</span>
                              <span className="text-[9px] font-semibold tracking-wide uppercase leading-tight mt-0.5" style={{ color: 'rgba(245,237,216,0.3)' }}>{m.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Full project image */}
                      <div className="relative w-full rounded-2xl overflow-hidden mb-6" style={{ aspectRatio: '16/7' }}>
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0" style={{
                          background: `linear-gradient(to right, ${project.accent}15, transparent 60%), linear-gradient(to top, rgba(13,31,19,0.8) 0%, transparent 50%)`
                        }} />
                        <div className="absolute bottom-4 left-4">
                          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: project.accent }}>
                            Visual Transformation
                          </span>
                        </div>
                      </div>

                      {/* 4-step case study grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Step 1: Problem */}
                        <div className="flex flex-col gap-3 p-5 rounded-2xl"
                          style={{ background: 'rgba(255,80,80,0.04)', border: '1px solid rgba(255,80,80,0.10)' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                              style={{ background: 'rgba(255,80,80,0.15)', color: '#FF8080' }}>1</div>
                            <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: '#FF8080' }}>The Problem</span>
                          </div>
                          <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.55)' }}>
                            {project.problem}
                          </p>
                        </div>

                        {/* Step 2: Strategy */}
                        <div className="flex flex-col gap-3 p-5 rounded-2xl"
                          style={{ background: 'rgba(45,107,63,0.08)', border: '1px solid rgba(45,107,63,0.18)' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                              style={{ background: 'rgba(45,107,63,0.25)', color: '#7AB48C' }}>2</div>
                            <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: '#7AB48C' }}>Our Strategy</span>
                          </div>
                          <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.55)' }}>
                            {project.strategy}
                          </p>
                        </div>

                        {/* Step 3: Transformation (or metrics) */}
                        <div className="flex flex-col gap-3 p-5 rounded-2xl"
                          style={{ background: `${project.accent}07`, border: `1px solid ${project.accent}18` }}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                              style={{ background: `${project.accent}20`, color: project.accent }}>3</div>
                            <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: project.accent }}>Transformation</span>
                          </div>
                          {project.metrics && project.metrics.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {project.metrics.map((m, mi) => (
                                <div key={mi} className="flex items-center justify-between">
                                  <span className="text-xs font-light" style={{ color: 'rgba(245,237,216,0.45)' }}>{m.label}</span>
                                  <span className="text-sm font-black" style={{ color: project.accent }}>{m.value}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.55)' }}>
                              Measurable growth and visual impact that elevates the brand presence.
                            </p>
                          )}
                        </div>

                        {/* Step 4: Results */}
                        <div className="flex flex-col gap-3 p-5 rounded-2xl"
                          style={{ background: 'rgba(245,237,216,0.04)', border: '1px solid rgba(245,237,216,0.08)' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                              style={{ background: 'rgba(245,237,216,0.12)', color: CREAM }}>4</div>
                            <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: 'rgba(245,237,216,0.6)' }}>The Result</span>
                          </div>
                          <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.55)' }}>
                            {project.result}
                          </p>
                        </div>
                      </div>

                      {/* CTA row */}
                      <div className="flex items-center justify-between gap-4 mt-5 pt-5 flex-wrap"
                        style={{ borderTop: '1px solid rgba(201,161,112,0.08)' }}>
                        <p className="text-xs font-light hidden sm:block" style={{ color: 'rgba(245,237,216,0.3)' }}>
                          Want results like this for your brand?
                        </p>
                        <div className="flex gap-3">
                            <a
                              href={`https://wa.me/251976601172?text=Hi!%20I%20saw%20the%20${encodeURIComponent(project.name)}%20case%20study%20on%20your%20website%20and%20I'd%20love%20to%20discuss%20a%20similar%20project.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary text-xs px-5 py-2.5 flex-shrink-0 group"
                            >
                              Let's Talk
                              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </a>
                            {project.postLink && (
                              <a
                                href={project.postLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost text-xs px-5 py-2.5 flex-shrink-0 group flex items-center gap-2"
                              >
                                View Client Post
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                  <polyline points="15 3 21 3 21 9"></polyline>
                                  <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                              </a>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Bottom CTA */}
        <ScrollAnimation animation="fadeUp" delay={0.5}>
          <div className="mt-10 text-center">
            <a href="/portfolio" className="btn-ghost px-8 py-4 inline-flex group">
              See All Case Studies
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </ScrollAnimation>

      </div>
    </section>
  )
}

export default OurWork
