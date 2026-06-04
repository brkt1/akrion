import ScrollAnimation from './ScrollAnimation'

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CREAM = '#F5EDD8'

const reasons = [
  {
    number: '01',
    title: 'End-to-End Expertise',
    description: 'From brand strategy and identity to web development and video production — one partner for your entire creative journey. No agency-hopping, no broken vision.',
    accent: '#C9A170',
    proof: '5 creative disciplines under one roof',
  },
  {
    number: '02',
    title: 'Results With Evidence',
    description: "We don't just deliver beautifully — we show you the numbers. Every project comes with measurable outcomes you can see, verify, and build on.",
    accent: '#7AB48C',
    proof: '100% of clients track real business growth',
  },
  {
    number: '03',
    title: 'Affordable to Premium',
    description: "We have tiers for every business stage. Normal for clean and effective. Package for value. Premium for brands that demand excellence and lasting impact.",
    accent: '#E2C49A',
    proof: 'Starts at 3,500 ETB — scales to your ambition',
  },
  {
    number: '04',
    title: 'Culture-Embedded',
    description: "We understand the Ethiopian and African creative landscape deeply — your audience, your context, your story. We don't adapt a foreign template; we speak your language.",
    accent: '#C9A170',
    proof: 'Born in Addis Ababa, thinking globally',
  },
]

// Before / after comparison — what changes when you invest in your brand
const transformations = [
  {
    before: 'Invisible online — no one can find you',
    after: 'Discoverable brand with a digital presence that works while you sleep',
  },
  {
    before: 'Generic logo customers forget instantly',
    after: 'Distinctive identity customers recognize, trust, and choose again',
  },
  {
    before: 'Competing on price because nothing else stands out',
    after: 'Charging what you\'re worth because your brand commands respect',
  },
  {
    before: 'Inconsistent content that confuses your audience',
    after: 'A clear, consistent voice across every platform and touchpoint',
  },
]

const WhyChooseUs = () => {
  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 relative overflow-hidden"
      style={{ background: '#0D1F13' }}>
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: 'rgba(245,237,216,0.025)' }} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'rgba(201,161,112,0.04)' }} />
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 mb-14 sm:mb-20">
          <ScrollAnimation animation="fadeUp" delay={0.1}>
            <div className="section-label">
              <span className="section-dot" />
              Why Us
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
            <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)]">
              WHY CHOOSE US
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.3}>
            <p className="text-base max-w-md leading-relaxed font-light" style={{ color: 'rgba(245,237,216,0.4)' }}>
              Affordable for the everyday business. Premium for brands that demand more. Always evidence-backed, always culture-first.
            </p>
          </ScrollAnimation>
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-14 sm:mb-20">
          {reasons.map((reason, index) => (
            <ScrollAnimation key={index} animation="fadeUp" delay={0.15 + index * 0.1}>
              <div
                className="group flex flex-col gap-4 p-6 sm:p-7 rounded-2xl border h-full transition-all duration-300 cursor-default"
                style={{
                  background: 'rgba(19,32,25,0.7)',
                  borderColor: 'rgba(201,161,112,0.08)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(19,32,25,0.95)'
                  e.currentTarget.style.borderColor = `${reason.accent}30`
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 30px ${reason.accent}08`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(19,32,25,0.7)'
                  e.currentTarget.style.borderColor = 'rgba(201,161,112,0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Top row */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black font-display transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${reason.accent}10`,
                      border: `1px solid ${reason.accent}20`,
                      color: reason.accent,
                    }}
                  >
                    {reason.number}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-base font-bold leading-tight" style={{ color: CREAM }}>{reason.title}</h3>
                    <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.4)' }}>
                      {reason.description}
                    </p>
                  </div>
                </div>

                {/* Proof tag */}
                <div className="flex items-center gap-2 pt-1 mt-auto"
                  style={{ borderTop: '1px solid rgba(201,161,112,0.06)' }}>
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                    <path d="M3 10L8 15L17 5" stroke={reason.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[11px] font-semibold" style={{ color: `${reason.accent}90` }}>
                    {reason.proof}
                  </span>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Before / After — brand transformation */}
        <ScrollAnimation animation="fadeUp" delay={0.4}>
          <div
            className="relative rounded-3xl border overflow-hidden p-6 sm:p-10 mb-10"
            style={{
              background: 'rgba(19,32,25,0.85)',
              borderColor: 'rgba(201,161,112,0.12)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,112,0.5), transparent)' }} />

            {/* Section title */}
            <div className="flex flex-col items-center text-center gap-3 mb-8">
              <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                What Changes When You Work With Us
              </p>
              <h3 className="font-display font-bold text-xl sm:text-2xl leading-tight" style={{ color: CREAM }}>
                The Before & After of a Strong Brand
              </h3>
              <p className="text-sm font-light max-w-sm leading-relaxed" style={{ color: 'rgba(245,237,216,0.4)' }}>
                Your brand is speaking right now — the question is what it's saying. We make sure it's saying the right things.
              </p>
            </div>

            {/* Comparison table */}
            <div className="flex flex-col gap-3">
              {/* Column headers */}
              <div className="grid grid-cols-2 gap-4 mb-1 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 opacity-70" />
                  <span className="text-[11px] font-black tracking-[0.15em] uppercase text-red-400 opacity-70">Before</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                  <span className="text-[11px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>After Akrion</span>
                </div>
              </div>

              {transformations.map((t, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 sm:gap-4 group">
                  {/* Before */}
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: 'rgba(255,60,60,0.04)', border: '1px solid rgba(255,60,60,0.10)' }}
                  >
                    <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M5 5L15 15M15 5L5 15" stroke="rgba(255,100,100,0.6)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.4)' }}>
                      {t.before}
                    </span>
                  </div>
                  {/* After */}
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: 'rgba(201,161,112,0.06)', border: '1px solid rgba(201,161,112,0.14)' }}
                  >
                    <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M3 10L8 15L17 5" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.65)' }}>
                      {t.after}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimation>

        {/* Bottom CTA band */}
        <ScrollAnimation animation="fadeUp" delay={0.5}>
          <div
            className="rounded-2xl border p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
            style={{
              background: 'linear-gradient(135deg, rgba(201,161,112,0.06), rgba(45,107,63,0.04))',
              borderColor: 'rgba(201,161,112,0.14)',
            }}
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: GOLD }}>Ready to Start?</p>
              <h3 className="font-display font-bold text-xl sm:text-2xl leading-tight" style={{ color: CREAM }}>
                Let&apos;s build your brand together.
              </h3>
              <p className="text-sm font-light mt-1" style={{ color: 'rgba(245,237,216,0.4)' }}>
                One call. Real strategy. No pressure.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="https://wa.me/251976601172?text=Hi!%20I'd%20like%20a%20free%20strategy%20call%20to%20discuss%20building%20my%20brand."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-shrink-0 px-8 py-4 group inline-flex"
              >
                Free Strategy Call
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="/contact" className="btn-ghost flex-shrink-0 px-8 py-4 inline-flex">
                Other Ways to Reach Us
              </a>
            </div>
          </div>
        </ScrollAnimation>

      </div>
    </section>
  )
}

export default WhyChooseUs
