import React from 'react'
import { Route, Routes } from 'react-router-dom'
import About from './components/About'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import OurStory from './components/OurStory'
import OurWork from './components/OurWork'
import { ScrollProgress } from './components/ScrollAnimation'
import WhatWeDo from './components/WhatWeDo'
import WhoWeAre from './components/WhoWeAre'
import WhyChooseUs from './components/WhyChooseUs'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Portfolio from './pages/Portfolio'
import Services from './pages/Services'

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <WhoWeAre />
      <WhatWeDo />
      <OurWork />
      <WhyChooseUs />
      <OurStory />
      <Footer />
    </>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-bg-dark">
      <ScrollProgress />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App

