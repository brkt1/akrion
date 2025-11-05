import React, { useEffect, useState } from 'react'
import ScrollAnimation, { ParallaxSection, StaggerContainer, StaggerItem } from './ScrollAnimation'

const OurWork = () => {
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
  
  // Icon components
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

  const BrandIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
      <path d="M2 12h20"></path>
    </svg>
  )

  const GameIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12"></line>
      <line x1="8" y1="10" x2="8" y2="14"></line>
      <line x1="15" y1="13" x2="15.01" y2="13"></line>
      <line x1="18" y1="11" x2="18.01" y2="11"></line>
      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    </svg>
  )

  const CampaignIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  )

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Web Development':
      case 'App Development':
        return <CodeIcon />
      case 'Video Editing':
      case 'Motion Design':
        return <VideoIcon />
      case 'Brand Identity':
      case 'Design':
        return <BrandIcon />
      case 'Games':
      case 'Game Development':
        return <GameIcon />
      case 'Campaign':
      case 'Marketing':
        return <CampaignIcon />
      default:
        return <CodeIcon />
    }
  }

  const projects = [
    {
      name: 'Cassopia Tour',
      category: 'Web Development',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Yenege Games',
      category: 'Games',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Corno D\'Africa',
      category: 'Video Editing',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Akrion Run Campaign',
      category: 'Campaign',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Teff & Bula Brand Identity',
      category: 'Brand Identity',
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]

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
      <ParallaxSection speed={0.25} className="max-w-[1400px] mx-auto relative z-10">
        <ScrollAnimation animation="fadeDown" delay={0.2}>
          <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 sm:mb-10 md:mb-12 inline-block">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white drop-shadow-lg">
              OUR WORK
            </h2>
          </div>
        </ScrollAnimation>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" staggerDelay={0.15}>
          {projects.map((project, index) => (
            <StaggerItem key={index}>
              <div className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-white/10 hover:border-accent-orange/50 relative">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-accent-orange">
                      {getCategoryIcon(project.category)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-white">{project.category}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg">{project.name}</h3>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </ParallaxSection>
    </section>
  )
}

export default OurWork

