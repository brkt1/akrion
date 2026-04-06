import ScrollAnimation from './ScrollAnimation'
import TiletDivider from './TiletDivider'

// Brand pillars
const pillars = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Design-Led',
    description: 'Every pixel is intentional. We lead with aesthetics that speak across cultures.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Culture-First',
    description: 'Rooted in African creativity, speaking a global visual language.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Results-Driven',
    description: "Beautiful isn't enough. We build work that moves people to act.",
  },
]

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'

const WhoWeAre = () => {
  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 relative overflow-hidden" style={{ background: '#0D1F13' }}>

      {/* Ethiopian pattern — subtle across full section */}
      <div className="absolute inset-0 eth-pattern-subtle pointer-events-none z-0" />

      {/* Glow orb */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none z-0"
        style={{ background: 'rgba(201,161,112,0.05)' }} />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left – text */}
          <div className="flex flex-col gap-8">
            <ScrollAnimation animation="fadeLeft" delay={0.1}>
              <div className="section-label"><span className="section-dot" />About Us</div>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeLeft" delay={0.2} duration={0.8}>
              <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)]">WHO WE ARE</h2>
            </ScrollAnimation>

            <TiletDivider variant="center" className="my-0 opacity-40 !justify-start scale-75 -ml-28" />


            <ScrollAnimation animation="fadeLeft" delay={0.35} duration={0.8}>
              <p className="text-[clamp(1rem,2vw,1.2rem)] leading-[1.85] font-light" style={{ color: 'rgba(201,161,112,0.55)' }}>
                Creativity with purpose. Design with vision. We&apos;re not just a design studio —
                we&apos;re a <span style={{ color: GOLD_LIGHT, fontWeight: 400 }}>creative movement</span> that
                helps brands express who they are through art, culture, and innovation.
              </p>
            </ScrollAnimation>

            {/* Pillars */}
            <ScrollAnimation animation="fadeLeft" delay={0.5}>
              <div className="flex flex-col gap-4">
                {pillars.map((p, i) => (
                  <div key={i} className="group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-default"
                    style={{ background: 'rgba(201,161,112,0.03)', borderColor: 'rgba(201,161,112,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(201,161,112,0.07)'; e.currentTarget.style.borderColor='rgba(201,161,112,0.2)' }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(201,161,112,0.03)'; e.currentTarget.style.borderColor='rgba(201,161,112,0.08)' }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{ background: 'rgba(201,161,112,0.10)', border: '1px solid rgba(201,161,112,0.18)', color: GOLD }}>
                      {p.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: '#F0EAD6' }}>{p.title}</p>
                      <p className="text-sm leading-relaxed font-light" style={{ color: 'rgba(201,161,112,0.45)' }}>{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollAnimation>
          </div>

          {/* Right – decorative identity card */}
          <ScrollAnimation animation="fadeRight" delay={0.3} duration={0.9}>
            <div className="relative">
              {/* Outer shadow ring */}
              <div className="absolute inset-0 rounded-3xl blur-2xl scale-105"
                style={{ background: 'linear-gradient(135deg, rgba(201,161,112,0.12), rgba(45,107,63,0.08))' }} />

              <div className="relative rounded-3xl overflow-hidden shadow-card" style={{ background: 'rgba(13,31,19,0.95)', border: '1px solid rgba(201,161,112,0.18)' }}>
                {/* Ethiopian pattern strip across top */}
                <div className="absolute top-0 left-0 right-0 h-20 eth-pattern opacity-60 pointer-events-none" />
                {/* Gold top line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,112,0.6), transparent)' }} />

                <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-6">
                  {/* Pattern tile accent top-right */}
                  <div className="absolute top-3 right-3 w-24 h-24 eth-corner opacity-40 pointer-events-none" />

                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: 'rgba(201,161,112,0.65)' }}>
                      Our Identity
                    </p>
                    <h3 className="font-display font-bold text-2xl leading-tight" style={{ color: '#F0EAD6' }}>
                      A Creative Movement,<br />Born in Ethiopia.
                    </h3>
                  </div>

                  <p className="text-sm leading-[1.9] font-light" style={{ color: 'rgba(201,161,112,0.45)' }}>
                    Founded on the belief that African storytelling deserves world-class execution,
                    Akrion Digitals bridges culture and technology to produce experiences that resonate globally.
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Brand Identity', 'Web & Apps', 'Motion Design', 'Strategy', 'Social Media'].map((tag) => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>

                  {/* Bottom divider + CTA */}
                  <div className="pt-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(201,161,112,0.10)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #C9A170, #9E7A4A)', boxShadow: '0 4px 12px rgba(201,161,112,0.3)' }}>
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#0D1F13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'rgba(201,161,112,0.5)' }}>
                      Crafted with creativity, precision, and passion
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>

        </div>
      </div>
    </section>
  )
}

export default WhoWeAre
