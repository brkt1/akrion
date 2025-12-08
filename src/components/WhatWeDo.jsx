import React, { useState } from 'react'
import ScrollAnimation from './ScrollAnimation'

const WhatWeDo = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Enhanced icon components with better styling
  const BrandIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
      <path d="M2 12h20"></path>
    </svg>
  )

  const CodeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  )

  const VideoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  )

  const SocialIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  )

  const ConsultingIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  )

  const services = [
    {
      name: 'Brand Identity',
      description: 'Crafting compelling visual identities that tell your story and connect with audiences.',
      icon: <BrandIcon />,
      gradient: 'from-purple-500/20 via-purple-600/20 to-pink-500/20',
      iconGradient: 'from-purple-400 to-pink-400',
      borderColor: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-400/60'
    },
    {
      name: 'Web & App Development',
      description: 'Building custom digital experiences with cutting-edge technology and modern design.',
      icon: <CodeIcon />,
      gradient: 'from-blue-500/20 via-cyan-600/20 to-teal-500/20',
      iconGradient: 'from-blue-400 to-cyan-400',
      borderColor: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-400/60'
    },
    {
      name: 'Video & Motion Design',
      description: 'Creating cinematic visuals and motion graphics that captivate and communicate.',
      icon: <VideoIcon />,
      gradient: 'from-red-500/20 via-orange-600/20 to-amber-500/20',
      iconGradient: 'from-red-400 to-orange-400',
      borderColor: 'border-red-500/30',
      hoverBorder: 'hover:border-red-400/60'
    },
    {
      name: 'Social Media Strategy',
      description: 'Developing strategic campaigns that engage, grow, and convert your audience.',
      icon: <SocialIcon />,
      gradient: 'from-pink-500/20 via-rose-600/20 to-fuchsia-500/20',
      iconGradient: 'from-pink-400 to-fuchsia-400',
      borderColor: 'border-pink-500/30',
      hoverBorder: 'hover:border-pink-400/60'
    },
    {
      name: 'Creative Consulting',
      description: 'Guiding your brand strategy and digital transformation with expert insights.',
      icon: <ConsultingIcon />,
      gradient: 'from-orange-500/20 via-amber-600/20 to-yellow-500/20',
      iconGradient: 'from-orange-400 to-amber-400',
      borderColor: 'border-orange-500/30',
      hoverBorder: 'hover:border-orange-400/60'
    }
  ]

  // WhatsApp number (remove + and spaces for wa.me link)
  const whatsappNumber = '251976601172'
  
  const handleWhatsAppClick = (serviceName) => {
    const message = encodeURIComponent(`Hello! I'm interested in learning more about your ${serviceName} services.`)
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  return (
    <section className="py-12 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-bg-dark relative overflow-hidden">
      {/* Background gradient effects - hidden on mobile */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none"></div>
      <div className="hidden md:block absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse opacity-50"></div>
      <div className="hidden md:block absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse opacity-50" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <ScrollAnimation animation="fadeUp" delay={0.2}>
          <div className="mb-8 md:mb-16 lg:mb-20">
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-3 md:mb-6 text-white">
              WHAT WE DO
            </h2>
            <p className="hidden md:block text-base sm:text-lg md:text-xl leading-relaxed text-text-gray max-w-3xl">
              We transform ideas into digital experiences that drive results and inspire audiences.
            </p>
          </div>
        </ScrollAnimation>
        
        {/* Mobile: Minimalist list layout */}
        <div className="md:hidden space-y-3">
          {services.map((service, index) => (
            <ScrollAnimation key={index} animation="fadeUp" delay={0.1 + index * 0.05}>
              <div
                className="flex items-center gap-4 p-4 border-b border-white/5 hover:border-accent-orange/30 transition-colors cursor-pointer"
                onClick={() => handleWhatsAppClick(service.name)}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${service.iconGradient} flex items-center justify-center text-white`}>
                  <div className="w-5 h-5">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white flex-1">
                  {service.name}
                </h3>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 20 20" 
                  fill="none"
                  className="text-text-gray"
                >
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Desktop: Full card layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <ScrollAnimation key={index} animation="fadeUp" delay={0.2 + index * 0.1}>
              <div
                className={`group relative backdrop-blur-md bg-gradient-to-br ${service.gradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 border ${service.borderColor} ${service.hoverBorder} transition-all duration-500 cursor-pointer overflow-hidden h-full`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleWhatsAppClick(service.name)}
              >
                {/* Animated background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`mb-4 sm:mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.iconGradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <div className="transform group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-white/80 transition-all duration-300">
                    {service.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm sm:text-base text-text-gray mb-6 sm:mb-8 flex-grow leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {service.description}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="flex items-center gap-2 text-accent-orange group-hover:text-white transition-colors duration-300 mt-auto">
                    <span className="text-sm sm:text-base font-semibold">Learn More</span>
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 20 20" 
                      fill="none" 
                      className="transform group-hover:translate-x-2 transition-transform duration-300"
                    >
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                     style={{
                       boxShadow: `0 0 40px ${service.iconGradient.includes('purple') ? 'rgba(168, 85, 247, 0.4)' : 
                                                      service.iconGradient.includes('blue') ? 'rgba(59, 130, 246, 0.4)' :
                                                      service.iconGradient.includes('red') ? 'rgba(239, 68, 68, 0.4)' :
                                                      service.iconGradient.includes('pink') ? 'rgba(236, 72, 153, 0.4)' :
                                                      'rgba(249, 115, 22, 0.4)'}`
                     }}>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo
