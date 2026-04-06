import { useState } from 'react'
import ScrollAnimation from './ScrollAnimation'

const OurStory = () => {
  const [isHovered, setIsHovered] = useState(false)
  const thumbnailUrl = 'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'

  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 bg-bg-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-orange/[0.04] rounded-full blur-[140px] pointer-events-none" />

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
            <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)] text-white">
              OUR STORY
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={0.3}>
            <p className="text-base text-white/40 max-w-lg leading-relaxed font-light">
              A cinematic glimpse into who we are, how we create, and what drives our mission to build a world-class creative agency from Ethiopia.
            </p>
          </ScrollAnimation>
        </div>

        {/* Video player card */}
        <ScrollAnimation animation="scale" delay={0.4} duration={0.9}>
          <div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] group cursor-pointer"
            style={{
              boxShadow: isHovered ? '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,127,62,0.15)' : '0 20px 60px rgba(0,0,0,0.4)',
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
                alt="Akrion Digitals Story Video"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,127,62,0.08) 0%, transparent 70%)',
                  opacity: isHovered ? 1 : 0,
                }}
              />

              {/* Center play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-400"
                  style={{
                    background: isHovered ? '#FF7F3E' : 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    border: isHovered ? '2px solid rgba(255,127,62,0.5)' : '2px solid rgba(255,255,255,0.2)',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isHovered ? '0 0 40px rgba(255,127,62,0.4)' : 'none',
                  }}
                >
                  {/* Ping ring */}
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: 'rgba(255,127,62,0.2)', animationDuration: '2s' }}
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
              <div className="absolute bottom-5 right-5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-semibold text-white/80">
                3:42
              </div>

              {/* Bottom left text overlay */}
              <div className="absolute bottom-5 left-5">
                <p className="text-xs font-semibold tracking-[0.1em] uppercase text-accent-orange mb-1">Watch</p>
                <p className="text-base sm:text-lg font-bold text-white">The Akrion Story</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

      </div>
    </section>
  )
}

export default OurStory
