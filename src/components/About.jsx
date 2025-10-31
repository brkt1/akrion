import React from 'react'
import Footer from './Footer'
import Header from './Header'

const About = () => {
  return (
    <>
      <Header />
      <div className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <section className="max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em]">
              ABOUT
            </h1>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-text-gray max-w-3xl">
              Akrion Digitals was built on the belief that creativity is more than design — it's transformation. Our mission is to design meaningful experiences that connect people, purpose, and performance.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default About

