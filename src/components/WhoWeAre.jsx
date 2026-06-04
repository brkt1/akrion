import ScrollAnimation from './ScrollAnimation'
import TiletDivider from './TiletDivider'

const pillars = [
  {
    number: '01',
    title: 'Design-Led',
    description: 'Every pixel is intentional. We lead with aesthetics that speak across cultures — because first impressions decide everything.',
  },
  {
    number: '02',
    title: 'Culture-First',
    description: 'Rooted in African creativity, built for a global visual language. We know where you come from — and where you\'re going.',
  },
  {
    number: '03',
    title: 'Results-Driven',
    description: 'Beautiful isn\'t enough. We build brands that move people to act. Real results. Measurable growth. Always with evidence.',
  },
]

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CREAM = '#F5EDD8'

// What we believe — the emotional core
const beliefs = [
  { text: 'African brands deserve world-class storytelling.' },
  { text: 'Great design is not decoration — it\'s the language of trust.' },
  { text: 'The unknown can become known. Every brand has a story worth telling.' },
]

const WhoWeAre = () => {
  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 relative overflow-hidden"
      style={{ background: '#0D1F13' }}>

      {/* Background layers */}
      <div className="absolute inset-0 eth-pattern-subtle pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none z-0"
        style={{ background: 'rgba(245,237,216,0.04)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'rgba(201,161,112,0.05)' }} />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* ── LEFT: text content ── */}
          <div className="flex flex-col gap-8">
            <ScrollAnimation animation="fadeLeft" delay={0.1}>
              <div className="section-label"><span className="section-dot" />About Us</div>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeLeft" delay={0.2} duration={0.8}>
              <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)]">WHO WE ARE</h2>
            </ScrollAnimation>

            <TiletDivider variant="center" className="my-0 opacity-40 !justify-start scale-75 -ml-28" />

            <ScrollAnimation animation="fadeLeft" delay={0.35} duration={0.8}>
              <p className="text-[clamp(1rem,2vw,1.2rem)] leading-[1.9] font-light"
                style={{ color: 'rgba(245,237,216,0.55)' }}>
                We help businesses build brands customers{' '}
                <span style={{ color: CREAM, fontWeight: 400 }}>actually remember.</span>{' '}
                We're not just a design studio — we're a{' '}
                <span style={{ color: GOLD_LIGHT, fontWeight: 400 }}>creative movement</span>{' '}
                born in Ethiopia, built to serve ambitious brands with world-class execution.
              </p>
            </ScrollAnimation>

            {/* What we believe */}
            <ScrollAnimation animation="fadeLeft" delay={0.45}>
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-black tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(201,161,112,0.5)' }}>
                  What We Believe
                </p>
                {beliefs.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: 'rgba(201,161,112,0.12)', border: '1px solid rgba(201,161,112,0.22)' }}>
                      <svg width="9" height="9" viewBox="0 0 20 20" fill="none">
                        <path d="M3 10L8 15L17 5" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base font-light leading-relaxed italic"
                      style={{ color: 'rgba(245,237,216,0.6)' }}>
                      &ldquo;{b.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </ScrollAnimation>

            {/* Pillars */}
            <ScrollAnimation animation="fadeLeft" delay={0.55}>
              <div className="flex flex-col gap-3">
                {pillars.map((p, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-default"
                    style={{ background: 'rgba(245,237,216,0.02)', borderColor: 'rgba(201,161,112,0.07)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(201,161,112,0.06)'
                      e.currentTarget.style.borderColor = 'rgba(201,161,112,0.20)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(245,237,216,0.02)'
                      e.currentTarget.style.borderColor = 'rgba(201,161,112,0.07)'
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black font-display transition-transform duration-300 group-hover:scale-110"
                      style={{ background: 'rgba(201,161,112,0.10)', border: '1px solid rgba(201,161,112,0.15)', color: GOLD }}
                    >
                      {p.number}
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-0.5" style={{ color: CREAM }}>{p.title}</p>
                      <p className="text-sm leading-relaxed font-light" style={{ color: 'rgba(245,237,216,0.4)' }}>
                        {p.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollAnimation>
          </div>

          {/* ── RIGHT: premium identity card ── */}
          <ScrollAnimation animation="fadeRight" delay={0.3} duration={0.9}>
            <div className="relative flex flex-col gap-5">

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

                <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-6">
                  {/* Corner accent */}
                  <div className="absolute top-3 right-3 w-24 h-24 eth-corner opacity-35 pointer-events-none" />

                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold tracking-[0.15em] uppercase"
                      style={{ color: 'rgba(201,161,112,0.65)' }}>
                      Our Identity
                    </p>
                    <h3 className="font-display font-bold text-2xl leading-tight" style={{ color: CREAM }}>
                      A Creative Movement,<br />Born in Ethiopia.
                    </h3>
                  </div>

                  <p className="text-sm leading-[1.9] font-light" style={{ color: 'rgba(245,237,216,0.45)' }}>
                    Founded on the belief that African brands deserve world-class execution.
                    Akrion Digitals bridges culture and technology to build brands that
                    resonate globally — with the warmth and authenticity that only a local
                    creative team can bring.
                  </p>

                  {/* Stat pills */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { v: '50+', l: 'Brands Built' },
                      { v: '3+', l: 'Years Active' },
                      { v: '100%', l: 'Client Satisfaction' },
                      { v: '5+', l: 'Industries Served' },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center p-3 rounded-xl text-center transition-all duration-300"
                        style={{ background: 'rgba(201,161,112,0.05)', border: '1px solid rgba(201,161,112,0.10)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,161,112,0.10)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.22)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,161,112,0.05)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.10)' }}
                      >
                        <span className="text-xl font-black" style={{ color: GOLD }}>{s.v}</span>
                        <span className="text-[10px] font-semibold tracking-wide uppercase mt-0.5"
                          style={{ color: 'rgba(245,237,216,0.35)' }}>{s.l}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Brand Identity', 'Web & Apps', 'Motion Design', 'Strategy', 'Social Media'].map((tag) => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-4 flex items-center gap-3"
                    style={{ borderTop: '1px solid rgba(201,161,112,0.10)' }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #C9A170, #9E7A4A)', boxShadow: '0 4px 12px rgba(201,161,112,0.3)' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#0D1F13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'rgba(245,237,216,0.45)' }}>
                      Crafted with creativity, precision, and passion
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Emotional quote card below ── */}
              <div
                className="relative rounded-2xl p-6 sm:p-7 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,161,112,0.09) 0%, rgba(245,237,216,0.03) 100%)',
                  border: '1px solid rgba(201,161,112,0.16)',
                }}
              >
                {/* Quote accent */}
                <div className="absolute top-3 right-4 text-[80px] leading-none font-black pointer-events-none select-none"
                  style={{ color: 'rgba(201,161,112,0.07)', fontFamily: 'Georgia, serif' }}>"</div>
                <p className="text-base sm:text-lg font-light leading-[1.85] relative z-10"
                  style={{ color: 'rgba(245,237,216,0.7)', fontStyle: 'italic' }}>
                  &ldquo;Your business deserves more than an average online presence.
                  You deserve a brand that makes people stop, feel something, and choose you.&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-4 pt-4"
                  style={{ borderTop: '1px solid rgba(201,161,112,0.10)' }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #C9A170, #9E7A4A)', color: '#0D1F13' }}
                  >
                    DA
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: CREAM }}>Dominic A.</p>
                    <p className="text-[11px] font-light" style={{ color: 'rgba(201,161,112,0.5)' }}>
                      Creative Director & Co-Founder, Akrion Digitals
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Social links strip ── */}
              <div
                className="flex items-center justify-between gap-3 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,161,112,0.08)' }}
              >
                <p className="text-xs font-light" style={{ color: 'rgba(245,237,216,0.35)' }}>
                  Follow our journey
                </p>
                <div className="flex gap-2">
                  {[
                    { label: 'IG', href: 'https://instagram.com/akriondigitals', title: 'Instagram' },
                    { label: 'TT', href: 'https://tiktok.com/@akriondigitals', title: 'TikTok' },
                    { label: 'TG', href: 'https://t.me/akriondigitals', title: 'Telegram' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.title}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300"
                      style={{ background: 'rgba(201,161,112,0.08)', color: GOLD, border: '1px solid rgba(201,161,112,0.15)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,161,112,0.18)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.35)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,161,112,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)' }}
                    >
                      {s.label}
                    </a>
                  ))}
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
