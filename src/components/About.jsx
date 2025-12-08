import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Header from './Header'

const About = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const bgImageUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2000'

  const values = [
    {
      title: 'Creativity First',
      description: 'We believe in pushing boundaries and exploring new creative territories.'
    },
    {
      title: 'Client-Centric',
      description: 'Your vision is our mission. We work closely with you to bring your ideas to life.'
    },
    {
      title: 'Quality Excellence',
      description: 'Every project is crafted with attention to detail and a commitment to excellence.'
    },
    {
      title: 'Innovation',
      description: 'We stay ahead of trends and leverage cutting-edge tools and technologies.'
    }
  ]

  const team = [
    {
      name: 'Creative Team',
      role: 'Design & Strategy',
      description: 'Our talented designers and strategists bring fresh perspectives to every project.'
    },
    {
      name: 'Development Team',
      role: 'Technology & Innovation',
      description: 'Expert developers who turn creative visions into functional digital experiences.'
    },
    {
      name: 'Content Team',
      role: 'Storytelling & Branding',
      description: 'Master storytellers who craft compelling narratives that resonate with audiences.'
    }
  ]

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
        
        {/* Content */}
        <section className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
            {/* Hero Section */}
            <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-4 sm:mb-6 text-white drop-shadow-lg">
                ABOUT
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-3xl drop-shadow-md mb-6">
                Akrion Digitals was built on the belief that creativity is more than design — it's transformation. Our mission is to design meaningful experiences that connect people, purpose, and performance.
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-white/80 max-w-3xl drop-shadow-sm">
                Based in Addis Ababa, Ethiopia, we're a creative digital agency that specializes in branding, web development, video production, and social media strategy. We work with forward-thinking brands and businesses to create digital experiences that make an impact.
              </p>
            </div>

            {/* Values Section */}
            <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 drop-shadow-md">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-accent-orange/50 transition-all duration-300"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 drop-shadow-md">
                      {value.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed drop-shadow-sm">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Section */}
            <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 drop-shadow-md">
                Our Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-accent-orange/50 transition-all duration-300"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 drop-shadow-md">
                      {member.name}
                    </h3>
                    <p className="text-sm text-accent-orange mb-3 drop-shadow-sm">
                      {member.role}
                    </p>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed drop-shadow-sm">
                      {member.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Statement */}
            <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow-md">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 drop-shadow-md">
                To empower businesses and brands with creative digital solutions that drive growth, engage audiences, and create lasting impact. We're committed to excellence, innovation, and building meaningful relationships with our clients.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default About
