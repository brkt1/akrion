import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Portfolio = () => {
  const projects = [
    {
      title: 'Cassopia Tour',
      description: 'Adventure meets storytelling through digital design.'
    },
    {
      title: 'Yenege Games',
      description: 'Playful creativity for Ethiopia\'s gaming frontier.'
    },
    {
      title: 'Corno D\'Africa',
      description: 'A visual identity for authentic African dining.'
    },
    {
      title: 'Akrion Run Campaign',
      description: 'Building community spirit through visual storytelling.'
    },
    {
      title: 'Teff & Bula Brand Identity',
      description: 'Organic identity for natural products inspired by Ethiopian roots.'
    }
  ]

  return (
    <>
      <Header />
      <div className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <section className="max-w-[1400px] mx-auto">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-8 sm:mb-10 md:mb-12">
            PORTFOLIO
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col justify-end hover:scale-[1.02] transition-transform duration-300 border border-[rgba(255,255,255,0.05)] hover:border-accent-orange/50">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">{project.title}</h3>
                  <p className="text-sm sm:text-base text-text-gray">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Portfolio

