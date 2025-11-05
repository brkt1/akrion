import React from 'react'
import ScrollAnimation from './ScrollAnimation'

const WhatWeDo = () => {
  // Icon components
  const BrandIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
      <path d="M2 12h20"></path>
    </svg>
  )

  const CodeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  )

  const VideoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  )

  const SocialIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  )

  const ConsultingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  )

  const services = [
    {
      name: 'Brand Identity',
      icon: <BrandIcon />,
      iconColor: 'text-purple-600'
    },
    {
      name: 'Web & App Development',
      icon: <CodeIcon />,
      iconColor: 'text-blue-600'
    },
    {
      name: 'Video & Motion Design',
      icon: <VideoIcon />,
      iconColor: 'text-red-600'
    },
    {
      name: 'Social Media Strategy',
      icon: <SocialIcon />,
      iconColor: 'text-pink-600'
    },
    {
      name: 'Creative Consulting',
      icon: <ConsultingIcon />,
      iconColor: 'text-orange-600'
    }
  ]

  // WhatsApp number (remove + and spaces for wa.me link)
  const whatsappNumber = '251976601172'
  
  const handleWhatsAppClick = (serviceName) => {
    const message = encodeURIComponent(`Hello! I'm interested in learning more about your ${serviceName} services.`)
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-bg-dark">
      <div className="max-w-[1400px] mx-auto">
        <ScrollAnimation animation="fadeUp" delay={0.2}>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-8 sm:mb-10 md:mb-12 text-white">
            WHAT WE DO
          </h2>
        </ScrollAnimation>
        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 items-center justify-center">
          {services.map((service, index) => (
            <ScrollAnimation key={index} animation="fadeUp" delay={0.2 + index * 0.1}>
              <div className="group relative overflow-hidden bg-white border-2 border-gray-300 hover:border-accent-orange transition-all duration-300 hover:shadow-lg cursor-pointer w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]"
                   style={{
                     transform: 'skewX(-15deg)',
                     padding: '0'
                   }}>
                {/* Inner content - unskewed for readability */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 md:px-8 py-4 sm:py-5 min-h-[80px]"
                     style={{
                       transform: 'skewX(15deg)'
                     }}>
                  {/* Icon */}
                  <div className={`flex-shrink-0 ${service.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-black group-hover:text-accent-orange transition-colors duration-300 flex-1 min-w-0">
                    {service.name}
                  </h3>
                  
                  {/* Contact us link */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleWhatsAppClick(service.name)
                    }}
                    className="flex items-center gap-2 text-accent-orange opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 cursor-pointer"
                  >
                    <span className="text-sm font-medium whitespace-nowrap">Contact us</span>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
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

