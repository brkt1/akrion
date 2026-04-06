import ScrollAnimation from './ScrollAnimation'

const reasons = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'End-to-End Expertise',
    description: 'From brand strategy and identity to web development and video production — one partner for your entire creative journey.',
    accent: '#8B5CF6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Premium Quality',
    description: 'We apply international design standards to every deliverable. No shortcuts — only work we\'re proud to stand behind.',
    accent: '#FF7F3E',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Culture-Embedded',
    description: 'We understand the Ethiopian and African creative landscape — your audience, your context, your story.',
    accent: '#06B6D4',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Results That Matter',
    description: 'Beautiful work is only the start. We measure success by the real impact we create — engagement, conversion, growth.',
    accent: '#F59E0B',
  },
]

const WhyChooseUs = () => {
  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 bg-bg-darker relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-purple/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 mb-12 sm:mb-16 lg:mb-20">
          <ScrollAnimation animation="fadeUp" delay={0.1}>
            <div className="section-label">
              <span className="section-dot" />
              Why Us
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
            <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)] text-white">
              WHY CHOOSE US
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.3}>
            <p className="text-base text-white/40 max-w-md leading-relaxed font-light">
              We create designs that connect emotionally, perform technically, and evolve with your audience.
            </p>
          </ScrollAnimation>
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {reasons.map((reason, index) => (
            <ScrollAnimation key={index} animation="fadeUp" delay={0.15 + index * 0.1}>
              <div className="group flex items-start gap-5 p-6 sm:p-7 rounded-2xl border border-white/[0.07] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 cursor-default">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${reason.accent}12`,
                    color: reason.accent,
                    border: `1px solid ${reason.accent}20`,
                  }}
                >
                  {reason.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-white leading-tight">{reason.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-light">{reason.description}</p>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Bottom CTA band */}
        <ScrollAnimation animation="fadeUp" delay={0.5}>
          <div className="mt-10 sm:mt-14 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-accent-orange mb-2">Ready to Start?</p>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white leading-tight">
                Let's build something great together.
              </h3>
            </div>
            <a href="/contact" className="btn-primary flex-shrink-0 px-8 py-4">
              Get in Touch
            </a>
          </div>
        </ScrollAnimation>

      </div>
    </section>
  )
}

export default WhyChooseUs
