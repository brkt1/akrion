import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Blog = () => {
  return (
    <>
      <Header />
      <div className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <section className="max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em]">
              BLOG
            </h1>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-text-gray max-w-3xl">
              Creative insights, digital storytelling, and design trends from the Akrion team.
            </p>
            <div className="mt-8 sm:mt-10 md:mt-12 text-base sm:text-lg text-text-gray">
              <p>Coming soon...</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Blog

