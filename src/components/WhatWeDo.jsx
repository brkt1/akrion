import React from 'react'
import ScrollAnimation, { StaggerContainer, StaggerItem } from './ScrollAnimation'

const WhatWeDo = () => {
  const services = [
    'Brand Identity',
    'Web & App Development',
    'Video & Motion Design',
    'Social Media Strategy',
    'Creative Consulting'
  ]

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[rgb(255, 255, 255)]">
      <div className="max-w-[1200px] mx-auto">
        <ScrollAnimation animation="fadeUp" delay={0.2}>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-8 sm:mb-10 md:mb-12 text-gray-900">
            WHAT WE DO
          </h2>
        </ScrollAnimation>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" staggerDelay={0.1}>
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <div className="p-5 sm:p-6 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200 hover:border-accent-orange/50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                <p className="text-base sm:text-lg text-gray-900">{service}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

export default WhatWeDo

