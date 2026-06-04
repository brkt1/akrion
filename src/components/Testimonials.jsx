import { useState, useEffect } from 'react'
import ScrollAnimation from './ScrollAnimation'

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CREAM = '#F5EDD8'

const testimonials = [
  {
    name: 'Kalkidan Tesfaye',
    role: 'Founder, Teff & Bula',
    text: "Akrion didn't just design our brand — they built our identity from scratch and made it feel alive. Customers recognize us now. The investment paid off in the first month.",
    stars: 5,
    avatar: 'KT',
    accentColor: '#C9A170',
    result: '40% price increase after rebrand',
  },
  {
    name: 'Samuel Girma',
    role: 'CEO, Cassopia Tours',
    text: "I was skeptical at first — we'd tried other agencies before. But Akrion delivered a website that actually converts. Booking inquiries went up 3× after launch.",
    stars: 5,
    avatar: 'SG',
    accentColor: '#E2C49A',
    result: '3× more booking inquiries',
  },
  {
    name: 'Meron Alemu',
    role: 'Marketing Director, CornodAfrica',
    text: "The video they produced for us got 50K+ views organically. The storytelling quality is unmatched — they understood exactly the emotion we wanted to convey.",
    stars: 5,
    avatar: 'MA',
    accentColor: '#C9A170',
    result: '50K+ organic views, zero ad spend',
  },
  {
    name: 'Biruk Haile',
    role: 'CEO, Yenege Games',
    text: "From brand design to launch strategy — Akrion handled everything with professionalism and passion. We went from zero to 10,000 downloads in our first week.",
    stars: 5,
    avatar: 'BH',
    accentColor: '#9E7A4A',
    result: '10,000+ downloads, week one',
  },
  {
    name: 'Tigist Wolde',
    role: 'Event Director, Akrion Run',
    text: "They turned a local marathon into a city-wide movement. The campaign had energy and emotion — people weren't just registering, they were sharing it everywhere.",
    stars: 5,
    avatar: 'TW',
    accentColor: '#E2C49A',
    result: '3,000+ registrations, 1M+ impressions',
  },
]

const StarRow = ({ count, color }) => (
  <div className="flex gap-0.5">
    {[...Array(count)].map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
)

const Testimonials = () => {
  const [active, setActive] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setActive(prev => (prev + 1) % testimonials.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index) => {
    if (index === active) return
    setIsAnimating(true)
    setTimeout(() => {
      setActive(index)
      setIsAnimating(false)
    }, 250)
  }

  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length)
  const next = () => goTo((active + 1) % testimonials.length)

  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 relative overflow-hidden"
      style={{ background: '#0A1A0F' }}>
      <div className="absolute inset-0 eth-pattern-subtle opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none z-0"
        style={{ background: 'rgba(245,237,216,0.04)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'rgba(201,161,112,0.04)' }} />

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14 sm:mb-20">
          <ScrollAnimation animation="fadeUp" delay={0.1}>
            <div className="section-label"><span className="section-dot" />Social Proof</div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
            <h2 className="section-heading text-[clamp(2rem,5vw,3.5rem)]">
              Real Results,{' '}
              <span className="gradient-text-gold">Real People</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.3}>
            <p className="text-base font-light max-w-md leading-relaxed" style={{ color: 'rgba(245,237,216,0.45)' }}>
              We don't just make pretty things — we make things that work. Here's what our clients say.
            </p>
          </ScrollAnimation>
        </div>

        {/* Small avatar previews of all testimonials */}
        <ScrollAnimation animation="fadeUp" delay={0.3}>
          <div className="flex justify-center gap-3 mb-10">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative transition-all duration-300 rounded-full"
                style={{
                  transform: i === active ? 'scale(1.18)' : 'scale(1)',
                  zIndex: i === active ? 10 : 1,
                }}
                title={t.name}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300"
                  style={{
                    background: i === active
                      ? `linear-gradient(135deg, ${t.accentColor}, #9E7A4A)`
                      : 'rgba(255,255,255,0.05)',
                    color: i === active ? '#0D1F13' : 'rgba(245,237,216,0.4)',
                    border: i === active ? `2px solid ${t.accentColor}80` : '2px solid rgba(255,255,255,0.07)',
                    boxShadow: i === active ? `0 0 20px ${t.accentColor}40` : 'none',
                  }}
                >
                  {t.avatar}
                </div>
              </button>
            ))}
          </div>
        </ScrollAnimation>

        {/* Main testimonial card */}
        <ScrollAnimation animation="fadeUp" delay={0.4}>
          <div
            className="relative p-8 sm:p-12 rounded-3xl border"
            style={{
              background: 'rgba(19,32,25,0.90)',
              borderColor: `${testimonials[active].accentColor}20`,
              backdropFilter: 'blur(24px)',
              boxShadow: `0 24px 80px rgba(0,0,0,0.4), 0 0 60px ${testimonials[active].accentColor}08`,
              transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
            }}
          >
            {/* Gold top accent */}
            <div className="absolute top-0 left-12 right-12 h-px transition-all duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${testimonials[active].accentColor}70, transparent)` }} />

            {/* Giant quote mark */}
            <div className="absolute top-6 right-10 text-[120px] leading-none font-black pointer-events-none select-none"
              style={{ color: `${testimonials[active].accentColor}08`, fontFamily: 'Georgia, serif' }}>"</div>

            <div
              className="transition-all duration-300"
              style={{ opacity: isAnimating ? 0 : 1, transform: isAnimating ? 'translateY(8px)' : 'translateY(0)' }}
            >
              {/* Stars */}
              <div className="mb-6">
                <StarRow count={testimonials[active].stars} color={testimonials[active].accentColor} />
              </div>

              {/* Quote */}
              <blockquote
                className="text-[clamp(1.1rem,2.5vw,1.45rem)] leading-[1.8] font-light mb-8 relative z-10"
                style={{ color: CREAM, letterSpacing: '-0.01em' }}
              >
                &ldquo;{testimonials[active].text}&rdquo;
              </blockquote>

              {/* Result pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: `${testimonials[active].accentColor}12`,
                  border: `1px solid ${testimonials[active].accentColor}28`,
                }}>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10L8 15L17 5" stroke={testimonials[active].accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-bold" style={{ color: testimonials[active].accentColor }}>
                  {testimonials[active].result}
                </span>
              </div>

              {/* Author row */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${testimonials[active].accentColor}, #9E7A4A)`,
                      color: '#0D1F13',
                    }}
                  >
                    {testimonials[active].avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: CREAM }}>{testimonials[active].name}</p>
                    <p className="text-xs font-light" style={{ color: 'rgba(201,161,112,0.5)' }}>{testimonials[active].role}</p>
                  </div>
                </div>

                {/* Arrow controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,161,112,0.12)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.25)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M12.5 5L7.5 10L12.5 15" stroke="rgba(245,237,216,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,161,112,0.12)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.25)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="rgba(245,237,216,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="transition-all duration-400 rounded-full"
                    style={{
                      width: i === active ? '28px' : '6px',
                      height: '6px',
                      background: i === active ? testimonials[active].accentColor : 'rgba(201,161,112,0.18)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Trust strip */}
        <ScrollAnimation animation="fadeUp" delay={0.55}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-6"
            style={{ borderTop: '1px solid rgba(201,161,112,0.08)', borderBottom: '1px solid rgba(201,161,112,0.08)' }}>
            {[
              { value: '50+', label: 'Happy Clients' },
              { value: '100%', label: 'Satisfaction Rate' },
              { value: '3+', label: 'Years Delivering' },
              { value: '5★', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span className="text-xl font-black" style={{ color: GOLD }}>{stat.value}</span>
                <span className="text-[10px] font-semibold tracking-widest uppercase mt-0.5" style={{ color: 'rgba(245,237,216,0.3)' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollAnimation>

        {/* CTA */}
        <ScrollAnimation animation="fadeUp" delay={0.6}>
          <div className="text-center mt-10">
            <p className="text-sm font-light mb-4" style={{ color: 'rgba(245,237,216,0.4)' }}>
              Ready to become our next success story?
            </p>
            <a
              href="https://wa.me/251976601172?text=Hi!%20I'd%20like%20to%20discuss%20building%20my%20brand."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex px-8 py-4 group"
            >
              Let's Build Your Brand
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </ScrollAnimation>

      </div>
    </section>
  )
}

export default Testimonials
