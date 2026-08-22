import { Route, Routes, useParams } from 'react-router-dom'
import About from './components/About'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import OurWork from './components/OurWork'
import { ScrollProgress } from './components/ScrollAnimation'
import Testimonials from './components/Testimonials'
import TiletDivider from './components/TiletDivider'
import WhatWeDo from './components/WhatWeDo'
import WhoWeAre from './components/WhoWeAre'
import WhyChooseUs from './components/WhyChooseUs'
import Blog from './pages/Blog'
import BlogArticle from './pages/BlogArticle'
import Contact from './pages/Contact'
import Portfolio from './pages/Portfolio'
import ProjectCaseStudy from './pages/ProjectCaseStudy'
import Services from './pages/Services'

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <WhoWeAre />
      <TiletDivider />
      <WhatWeDo />
      <TiletDivider />
      <OurWork />
      <TiletDivider variant="strip" className="opacity-40" />
      <Testimonials />
      <TiletDivider />
      <WhyChooseUs />
      <Footer />
    </>
  )
}

function ProjectCaseStudyRoute() {
  const { slug } = useParams()
  return <ProjectCaseStudy key={slug} />
}

function BlogArticleRoute() {
  const { slug } = useParams()
  return <BlogArticle key={slug} />
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
        <Route path="/portfolio/:slug" element={<ProjectCaseStudyRoute />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticleRoute />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App
