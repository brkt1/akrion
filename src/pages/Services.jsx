import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Services = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const services = [
    {
      title: 'Branding',
      description: 'We create compelling brand identities that tell your story and connect with your audience.'
    },
    {
      title: 'Development',
      description: 'Custom web and app development that brings your vision to life with cutting-edge technology.'
    },
    {
      title: 'Video',
      description: 'Cinematic video production and motion design that captivates and communicates your message.'
    },
    {
      title: 'Social Media',
      description: 'Strategic social media campaigns that engage, grow, and convert your audience.'
    },
    {
      title: 'Consulting',
      description: 'Creative consulting to guide your brand strategy and digital transformation journey.'
    }
  ]

  const bgImageUrl = 'https://images.unsplash.com/photo-1697311622332-184b7bb19a46?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29ueSUyMGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000'

  return (
    <>
      <Header />
      <div 
        className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen relative"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Frosted glass content */}
        <section className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
            <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-4 sm:mb-6 text-white drop-shadow-lg">
                SERVICES
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-3xl drop-shadow-md">
                We merge imagination with execution to help your brand rise above the noise.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="p-6 sm:p-8 rounded-xl backdrop-blur-md bg-black/20 border border-white/10 hover:border-accent-orange/50 transition-all duration-300"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 drop-shadow-md">{service.title}</h3>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed drop-shadow-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Services

