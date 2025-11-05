import React, { useEffect, useState } from 'react'
import ScrollAnimation, { ParallaxSection } from './ScrollAnimation'

const WhoWeAre = () => {
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
      <div className="absolute inset-0 bg-bg-dark"></div>
      <ParallaxSection speed={0.2} className="max-w-[1200px] mx-auto relative z-10">
        <ScrollAnimation animation="fadeLeft" delay={0.2} duration={0.8}>
          <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10">
            <ScrollAnimation animation="fadeRight" delay={0.3}>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white drop-shadow-lg mb-4 sm:mb-6">
                WHO WE ARE
              </h2>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeLeft" delay={0.5}>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-3xl drop-shadow-md">
                Creativity with purpose. Design with vision. We're not just a design studio — we're a creative movement that helps brands express who they are through art, culture, and innovation.
              </p>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>
      </ParallaxSection>
    </section>
  )
}

export default WhoWeAre

