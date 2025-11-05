import React, { useEffect, useState } from 'react'
import ScrollAnimation, { ParallaxSection } from './ScrollAnimation'

const OurStory = () => {
  const bgImageUrl = 'https://images.unsplash.com/photo-1697311622332-184b7bb19a46?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29ueSUyMGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000'
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section 
      className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <ParallaxSection speed={0.3} className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col gap-6 sm:gap-8 items-center text-center">
          <ScrollAnimation animation="scale" delay={0.2} duration={0.8}>
            <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <ScrollAnimation animation="fadeUp" delay={0.3}>
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white drop-shadow-lg mb-3 sm:mb-4">
                  OUR STORY VIDEO
                </h2>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.5}>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl drop-shadow-md">
                  A cinematic glimpse into who we are, how we create, and what drives our mission.
                </p>
              </ScrollAnimation>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="blur" delay={0.7} duration={1}>
            <div className="aspect-video w-full max-w-4xl backdrop-blur-md bg-black/30 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 relative overflow-hidden transition-all duration-300 mx-4 sm:mx-0">
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url(${bgImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <button className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-accent-orange rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg width="24" height="24" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </ScrollAnimation>
        </div>
      </ParallaxSection>
    </section>
  )
}

export default OurStory

