import { useState } from 'react'
import ScrollAnimation from './ScrollAnimation'

const GOLD = '#C9A170'
const CREAM = '#F5EDD8'

const OurStory = () => {
  const [isHovered, setIsHovered] = useState(false)
  const thumbnailUrl = 'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'

  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 bg-bg-dark relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(245,237,216,0.03)' }} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(201,161,112,0.04)' }} />

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-10 sm:mb-14">
          <ScrollAnimation animation="fadeUp" delay={0.1}>
            <div className="section-label">
              <span className="section-dot" />
              Behind the Work
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
            <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)]">
              WHERE IT ALL{' '}
              <span className="gradient-text-gold">STARTED</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.3}>
            <p className="text-base font-light max-w-lg leading-relaxed" style={{ color: 'rgba(245,237,216,0.4)' }}>
              A cinematic glimpse into who we are, why we started, and what drives our mission to build a world-class creative agency from Ethiopia.
            </p>
          </ScrollAnimation>
        </div>

        {/* Story teaser — text before video */}
        <ScrollAnimation animation="fadeUp" delay={0.35}>
          <div
            className="flex flex-col sm:flex-row gap-4 sm:gap-8 p-6 sm:p-8 rounded-2xl border mb-8"
            style={{
              background: 'rgba(201,161,112,0.04)',
              borderColor: 'rgba(201,161,112,0.10)',
            }}
          >
            {[
              { number: '01', label: 'The Idea', text: 'It started with one simple observation: Ethiopian brands were doing incredible things — but nobody was telling their story right.' },
              { number: '02', label: 'The Mission', text: 'We built Akrion to be the agency we wished existed — one that understands the culture and delivers international quality.' },
              { number: '03', label: 'The Vision', text: 'To put Ethiopian creative talent on the global map. To make "Made in Ethiopia" synonymous with premium and excellence.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black font-display" style={{ color: 'rgba(201,161,112,0.5)' }}>{item.number}</span>
                  <p className="text-xs font-bold tracking-[0.12em] uppercase" style={{ color: GOLD }}>{item.label}</p>
                </div>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(245,237,216,0.45)' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </ScrollAnimation>

        {/* Video player card */}
        <ScrollAnimation animation="scale" delay={0.4} duration={0.9}>
          <div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden border group cursor-pointer"
            style={{
              border: '1px solid rgba(201,161,112,0.12)',
              boxShadow: isHovered
                ? '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,161,112,0.20)'
                : '0 20px 60px rgba(0,0,0,0.4)',
              transition: 'box-shadow 0.4s ease, transform 0.4s ease',
              transform: isHovered ? 'scale(1.005)' : 'scale(1)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Thumbnail */}
            <div className="aspect-video w-full relative">
              <img
                src={thumbnailUrl}
                alt="Akrion Digitals — Our Story"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              {/* Warm cream glow on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at center, rgba(245,237,216,0.06) 0%, transparent 70%)',
                  opacity: isHovered ? 1 : 0,
                }}
              />

              {/* Center play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-400"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(135deg, #C9A170, #9E7A4A)'
                      : 'rgba(245,237,216,0.12)',
                    backdropFilter: 'blur(12px)',
                    border: isHovered ? '2px solid rgba(201,161,112,0.5)' : '2px solid rgba(245,237,216,0.2)',
                    transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: isHovered ? '0 0 40px rgba(201,161,112,0.35)' : 'none',
                  }}
                >
                  {/* Ping ring */}
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: 'rgba(201,161,112,0.18)', animationDuration: '2.5s' }}
                  />
                  <svg
                    width="22" height="22"
                    className="sm:w-7 sm:h-7 ml-1 relative z-10"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-5 right-5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-semibold text-white/70">
                3:42
              </div>

              {/* Bottom left overlay */}
              <div className="absolute bottom-5 left-5">
                <p className="text-xs font-bold tracking-[0.1em] uppercase mb-1" style={{ color: GOLD }}>Watch</p>
                <p className="text-base sm:text-xl font-bold" style={{ color: CREAM }}>The Akrion Story</p>
                <p className="text-xs font-light mt-0.5" style={{ color: 'rgba(245,237,216,0.5)' }}>
                  Behind the scenes · Founder interview · Our work
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Follow us for behind the scenes */}
        <ScrollAnimation animation="fadeUp" delay={0.5}>
          <div className="text-center mt-8">
            <p className="text-sm font-light mb-4" style={{ color: 'rgba(245,237,216,0.35)' }}>
              Follow us for behind-the-scenes content, client transformations & team updates
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { label: '📷 Instagram', href: 'https://instagram.com/akriondigitals' },
                { label: '🎵 TikTok', href: 'https://tiktok.com/@akriondigitals' },
                { label: '💬 Telegram', href: 'https://t.me/akriondigitals' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs px-5 py-2.5 inline-flex"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </ScrollAnimation>

      </div>
    </section>
  )
}

export default OurStory
