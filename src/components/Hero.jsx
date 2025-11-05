import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollAnimation, { ParallaxSection } from './ScrollAnimation'

const Hero = () => {
  const bgImageUrl = 'https://images.unsplash.com/photo-1697311622332-184b7bb19a46?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29ueSUyMGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000'
  const [isMobile, setIsMobile] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section 
      className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-0 relative flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed'
      }}
    >
      {/* Gradient overlay with dynamic positioning */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,127,62,0.15) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.8) 100%)`
        }}
      ></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-orange/20 rounded-full blur-[100px] animate-pulse opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse opacity-50" style={{ animationDelay: '1s' }}></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-10 w-2 h-2 bg-accent-orange/60 rounded-full animate-float"></div>
      <div className="absolute top-40 left-20 w-3 h-3 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-cyan-400/50 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Frosted glass content container */}
      <ParallaxSection speed={0.3} className="w-full relative z-10">
        <ScrollAnimation animation="scale" delay={0.2} duration={0.8}>
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-14 items-center text-center justify-center backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/40 rounded-none sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-16 border-x-0 sm:border-x border-y border-white/20 shadow-2xl relative overflow-hidden group hover:border-white/30 transition-all duration-500 w-full min-h-screen max-w-full">
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-accent-orange/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <ScrollAnimation animation="fadeUp" delay={0.3} duration={0.8}>
              <div className="relative">
                <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] sm:text-[clamp(3rem,8vw,6.5rem)] font-black leading-[1.05] tracking-[-0.03em] text-white drop-shadow-2xl mb-4">
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-accent-orange via-purple-500 to-cyan-400 opacity-20 blur-2xl"></span>
                    <span className="relative bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                      WE BUILD.
                    </span>
                  </span>
                  <br />
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-accent-orange to-cyan-400 opacity-20 blur-2xl"></span>
                    <span className="relative bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                      WE DEVELOP.
                    </span>
                  </span>
                  <br />
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-accent-orange to-purple-500 opacity-20 blur-2xl"></span>
                    <span className="relative bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                      WE CREATE.
                    </span>
                  </span>
                </h1>
                {/* Accent line */}
                <div className="mx-auto mt-6 w-24 h-1 bg-gradient-to-r from-transparent via-accent-orange to-transparent rounded-full"></div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fadeUp" delay={0.5} duration={0.8}>
              <p className="text-[clamp(1rem,1.8vw,1.4rem)] sm:text-[clamp(1.1rem,2vw,1.6rem)] leading-relaxed text-white/95 max-w-4xl drop-shadow-lg font-light tracking-wide">
                Akrion Digitals is a creative agency transforming imagination into experience. We blend design, storytelling, and technology to craft visuals that inspire and digital products that deliver results.
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fadeUp" delay={0.7} duration={0.8}>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-5 justify-center w-full max-w-full px-2 sm:px-0 pt-2">
                <Link 
                  to="/about" 
                  className="group/btn relative inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-accent-orange to-[#FF6B2E] text-white border-none px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl text-sm sm:text-base md:text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,127,62,0.4)] overflow-hidden backdrop-blur-sm w-full sm:w-auto justify-center min-w-[200px] sm:min-w-0"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Watch Our Story</span>
                    <svg width="18" height="18" className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
                <Link 
                  to="/contact" 
                  className="group/btn2 relative inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md text-white border-2 border-white/40 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl text-sm sm:text-base md:text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/60 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] overflow-hidden w-full sm:w-auto justify-center min-w-[200px] sm:min-w-0"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn2:translate-x-[100%] transition-transform duration-700"></span>
                  <span className="relative z-10">Start a Project</span>
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>
        
        <ParallaxSection speed={0.5}>
          <div className="absolute -bottom-[5%] sm:-bottom-[10%] left-0 right-0 text-[clamp(4rem,12vw,14rem)] font-black text-white/[0.03] tracking-[-0.05em] z-[1] pointer-events-none leading-[0.8] text-center select-none">
            AKRION
          </div>
        </ParallaxSection>
      </ParallaxSection>
    </section>
  )
}

export default Hero

