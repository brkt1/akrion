import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollAnimation, { ParallaxSection } from './ScrollAnimation'

const Hero = () => {
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
      className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 relative flex items-center"
      style={{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Frosted glass content container */}
      <ParallaxSection speed={0.3} className="max-w-[1400px] mx-auto w-full relative z-10">
        <ScrollAnimation animation="scale" delay={0.2} duration={0.8}>
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-12 items-center text-center backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 glow-effect">
            <ScrollAnimation animation="fadeUp" delay={0.3} duration={0.8}>
              <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white drop-shadow-lg">
                WE BUILD. WE DEVELOP. WE CREATE.
              </h1>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeUp" delay={0.5} duration={0.8}>
              <p className="text-[clamp(1.1rem,2vw,1.5rem)] leading-relaxed text-white/90 max-w-3xl drop-shadow-md">
                Akrion Digitals is a creative agency transforming imagination into experience. We blend design, storytelling, and technology to craft visuals that inspire and digital products that deliver results.
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeUp" delay={0.7} duration={0.8}>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center w-full sm:w-auto">
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-2 sm:gap-3 bg-accent-orange text-white border-none px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 hover:bg-[#FF6B2E] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,127,62,0.3)] group backdrop-blur-sm w-full sm:w-auto justify-center"
                >
                  <span>Watch Our Story</span>
                  <svg width="18" height="18" className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/50 w-full sm:w-auto justify-center"
                >
                  <span>Start a Project</span>
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>
        <ParallaxSection speed={0.5}>
          <div className="absolute -bottom-[5%] sm:-bottom-[10%] left-0 right-0 text-[clamp(4rem,12vw,14rem)] font-black text-white/[0.05] tracking-[-0.05em] z-[1] pointer-events-none leading-[0.8] text-center">
            AKRION
          </div>
        </ParallaxSection>
      </ParallaxSection>
    </section>
  )
}

export default Hero

