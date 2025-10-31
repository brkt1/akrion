import React from 'react'
import ScrollAnimation from './ScrollAnimation'

const WhyChooseUs = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
      <ScrollAnimation animation="fadeUp" delay={0.2}>
        <div className="flex flex-col gap-6 sm:gap-8">
          <ScrollAnimation animation="fadeLeft" delay={0.3}>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">
              WHY CHOOSE US
            </h2>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeRight" delay={0.5}>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-text-gray max-w-3xl">
              We create designs that connect emotionally, perform technically, and evolve with your audience.
            </p>
          </ScrollAnimation>
        </div>
      </ScrollAnimation>
    </section>
  )
}

export default WhyChooseUs

