import ScrollAnimation from './ScrollAnimation'

// Brand constants — warm cream + muted gold + deep green
const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CREAM = '#F5EDD8'

// Founder info
const founders = [
  {
    name: 'Dominic A.',
    role: 'Creative Director & Co-Founder',
    story: 'Started Akrion with a single belief — African brands deserve world-class storytelling. Design isn\'t decoration; it\'s the language of trust.',
    initials: 'DA',
    accentBg: 'linear-gradient(135deg, #C9A170, #9E7A4A)',
  },
  {
    name: 'The Akrion Team',
    role: 'Designers, Developers & Strategists',
    story: 'A collective of creatives united by one mission: turning unknown brands into names people recognize, trust, and choose again.',
    initials: 'AK',
    accentBg: 'linear-gradient(135deg, #2D6B3F, #0D1F13)',
  },
]

// Behind-the-scenes / workspace highlights
const workspaceHighlights = [
  { number: '01', label: 'Brand Studio', desc: 'Where every identity is born' },
  { number: '02', label: 'Dev Lab', desc: 'Code that powers growth' },
  { number: '03', label: 'Video Suite', desc: 'Stories in motion' },
  { number: '04', label: 'Addis Ababa', desc: 'Proudly Ethiopian' },
]

const OurFounders = () => {
  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 relative overflow-hidden" style={{ background: '#0D1F13' }}>
      {/* Warm cream glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none z-0" style={{ background: 'rgba(245,237,216,0.03)' }} />
      <div className="absolute inset-0 eth-pattern-subtle opacity-30 pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14 sm:mb-20">
          <ScrollAnimation animation="fadeUp" delay={0.1}>
            <div className="section-label"><span className="section-dot" />The People Behind the Work</div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
            <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)]">
              We're{' '}
              <span className="gradient-text-gold">Real People</span>
              {' '}—
              <br className="hidden sm:block" />
              Not a Faceless Agency
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.3}>
            <p className="text-base font-light max-w-xl leading-relaxed" style={{ color: 'rgba(245,237,216,0.45)' }}>
              We're a tight team of passionate creatives based in Addis Ababa. 
              Every brand we touch gets the full weight of our experience and care.
            </p>
          </ScrollAnimation>
        </div>

        {/* Two-column founders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {founders.map((founder, i) => (
            <ScrollAnimation key={i} animation="fadeUp" delay={0.2 + i * 0.15}>
              <div
                className="flex items-start gap-5 p-7 rounded-2xl border transition-all duration-300 h-full"
                style={{
                  background: 'rgba(19,32,25,0.8)',
                  borderColor: 'rgba(201,161,112,0.12)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,161,112,0.28)'; e.currentTarget.style.background = 'rgba(19,32,25,0.95)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,161,112,0.12)'; e.currentTarget.style.background = 'rgba(19,32,25,0.8)' }}
              >
                {/* Avatar */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-base font-black"
                  style={{ background: founder.accentBg, color: '#F5EDD8', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
                >
                  {founder.initials}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="font-bold text-base" style={{ color: CREAM }}>{founder.name}</p>
                    <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: GOLD }}>{founder.role}</p>
                  </div>
                  <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.5)' }}>
                    {founder.story}
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Workspace highlights — trust signal */}
        <ScrollAnimation animation="fadeUp" delay={0.5}>
          <div
            className="relative p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row gap-8 items-center"
            style={{
              background: 'rgba(201,161,112,0.04)',
              borderColor: 'rgba(201,161,112,0.12)',
            }}
          >
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-6" style={{ color: 'rgba(201,161,112,0.6)' }}>
                Our Workspace
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workspaceHighlights.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-sm font-black font-display" style={{ color: 'rgba(201,161,112,0.5)' }}>{item.number}</span>
                    <p className="text-sm font-semibold" style={{ color: GOLD_LIGHT }}>{item.label}</p>
                    <p className="text-xs font-light" style={{ color: 'rgba(245,237,216,0.4)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(201,161,112,0.08)' }}>
                <p className="text-sm font-light" style={{ color: 'rgba(245,237,216,0.45)' }}>
                  Curious about how we work?{' '}
                  <a
                    href="https://wa.me/251976601172?text=Hi!%20I'd%20love%20to%20see%20how%20you%20work."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold transition-colors duration-200"
                    style={{ color: GOLD }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD_LIGHT}
                    onMouseLeave={e => e.currentTarget.style.color = GOLD}
                  >
                    Reach out — we love showing people behind the scenes.
                  </a>
                </p>
              </div>
            </div>

            <div className="flex-1 relative w-full h-[300px] md:h-[350px] rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Akrion Digitals Workspace" 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F13] via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border"
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: CREAM }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live from Addis Ababa
                </span>
              </div>
            </div>
          </div>
        </ScrollAnimation>

      </div>
    </section>
  )
}

export default OurFounders
