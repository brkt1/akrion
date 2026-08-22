import ScrollAnimation from './ScrollAnimation'
import TiletDivider from './TiletDivider'
import WhoWeAreImage from './WhoWeAreImage'
import OurCreativeProcess from './OurCreativeProcess'

const pillars = [
  {
    number: '01',
    title: 'Purposeful Design',
    description: 'Creative work built with clarity and intention.',
  },
  {
    number: '02',
    title: 'Cultural Insight',
    description: 'Ethiopian perspective expressed at a global standard.',
  },
  {
    number: '03',
    title: 'Real Impact',
    description: 'Solutions designed to build trust and drive growth.',
  },
]

const impactStats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '3+', label: 'Years of Experience' },
  { value: '5+', label: 'Industries Served' },
]

const GOLD = '#C9A170'
const CREAM = '#F5EDD8'

const WhoWeAre = () => {
  return (
    <section
      aria-labelledby="who-we-are-heading"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden"
      style={{ background: '#0D1F13' }}>

      {/* Background layers */}
      <div className="absolute inset-0 eth-pattern-subtle pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none z-0"
        style={{ background: 'rgba(245,237,216,0.04)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'rgba(201,161,112,0.05)' }} />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-start">

          {/* ── LEFT: text content ── */}
          <div className="flex flex-col gap-6 sm:gap-7">
            <ScrollAnimation animation="fadeLeft" delay={0.1} respectReducedMotion>
              <div className="section-label"><span className="section-dot" />About Us</div>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeLeft" delay={0.2} duration={0.8} respectReducedMotion>
              <h2 id="who-we-are-heading" className="section-heading text-[clamp(2.2rem,5vw,4rem)]">WHO WE ARE</h2>
            </ScrollAnimation>

            <TiletDivider variant="center" className="!py-3 sm:!py-4 opacity-40 !justify-start" />

            <ScrollAnimation animation="fadeLeft" delay={0.3} duration={0.8} respectReducedMotion>
              <p
                className="max-w-[62ch] text-[clamp(1.05rem,1.7vw,1.18rem)] leading-[1.75] font-light"
                style={{ color: 'rgba(245,237,216,0.78)' }}
              >
                Akrion Digitals is an Ethiopian creative and technology agency helping ambitious
                businesses build brands people remember, trust, and choose.
              </p>
            </ScrollAnimation>

            <WhoWeAreImage />

            {/* Pillars */}
            <ScrollAnimation animation="fadeLeft" delay={0.4} respectReducedMotion>
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-black tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(226,196,154,0.78)' }}>
                  What Drives Us
                </h3>
                <ol className="flex flex-col gap-3" aria-label="What drives Akrion Digitals">
                  {pillars.map((pillar) => (
                    <li
                      key={pillar.number}
                      className="group flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-default"
                      style={{ background: 'rgba(245,237,216,0.025)', borderColor: 'rgba(201,161,112,0.10)' }}
                      onMouseEnter={event => {
                        event.currentTarget.style.background = 'rgba(201,161,112,0.06)'
                        event.currentTarget.style.borderColor = 'rgba(201,161,112,0.20)'
                      }}
                      onMouseLeave={event => {
                        event.currentTarget.style.background = 'rgba(245,237,216,0.025)'
                        event.currentTarget.style.borderColor = 'rgba(201,161,112,0.10)'
                      }}
                    >
                      <span
                        className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm font-black font-display transition-transform duration-300 group-hover:scale-105"
                        style={{ background: 'rgba(201,161,112,0.10)', border: '1px solid rgba(201,161,112,0.18)', color: GOLD }}
                      >
                        {pillar.number}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm sm:text-[0.95rem] font-bold uppercase tracking-[0.04em] mb-1" style={{ color: CREAM }}>
                          {pillar.title}
                        </p>
                        <p className="max-w-[60ch] text-[0.95rem] sm:text-base leading-[1.6] font-light" style={{ color: 'rgba(245,237,216,0.70)' }}>
                          {pillar.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </ScrollAnimation>
          </div>

          {/* ── RIGHT: premium identity card ── */}
          <ScrollAnimation
            animation="fadeRight"
            delay={0.25}
            duration={0.9}
            respectReducedMotion
          >
            <div className="relative flex flex-col gap-5 sm:gap-6">

              {/* Floating glow ring */}
              <div className="absolute inset-0 rounded-3xl blur-2xl scale-110 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(201,161,112,0.10), rgba(245,237,216,0.03), rgba(45,107,63,0.05))' }} />

              {/* Main identity card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-card"
                style={{ background: 'rgba(13,31,19,0.97)', border: '1px solid rgba(201,161,112,0.18)' }}
              >
                {/* Ethiopian pattern strip across top */}
                <div className="absolute top-0 left-0 right-0 h-20 eth-pattern opacity-50 pointer-events-none" />
                {/* Gold top line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,112,0.6), transparent)' }} />

                <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-5">
                  {/* Corner accent */}
                  <div className="absolute top-3 right-3 w-24 h-24 eth-corner opacity-35 pointer-events-none" />

                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold tracking-[0.15em] uppercase"
                      style={{ color: 'rgba(226,196,154,0.78)' }}>
                      Our Identity
                    </p>
                    <h3 className="font-display font-bold text-2xl leading-tight" style={{ color: CREAM }}>
                      Rooted in Ethiopia.<br />Built for global impact.
                    </h3>
                  </div>

                  <p
                    className="max-w-[60ch] text-[0.98rem] sm:text-base leading-[1.75] font-light"
                    style={{ color: 'rgba(245,237,216,0.72)' }}
                  >
                    We combine local insight, creative strategy, and technology to build brands that
                    connect and grow.
                  </p>

                  {/* Impact statistics */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: 'rgba(226,196,154,0.75)' }}>
                      Our Impact
                    </p>
                    <dl className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2 sm:gap-3">
                      {impactStats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex flex-col items-center p-2.5 sm:p-3 rounded-xl text-center transition-all duration-300"
                          style={{ background: 'rgba(201,161,112,0.05)', border: '1px solid rgba(201,161,112,0.10)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,161,112,0.10)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.22)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,161,112,0.05)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.10)' }}
                        >
                          <dt
                            className="order-2 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase mt-1 leading-snug"
                            style={{ color: 'rgba(245,237,216,0.60)' }}
                          >
                            {stat.label}
                          </dt>
                          <dd className="order-1 text-xl sm:text-2xl font-black" style={{ color: GOLD }}>
                            {stat.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                </div>
              </div>

              <OurCreativeProcess />

            </div>
          </ScrollAnimation>

        </div>
      </div>
    </section>
  )
}

export default WhoWeAre
