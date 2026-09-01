import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'
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

const Admin = lazy(() => import('./pages/Admin'))
const AdminPasswordSetup = lazy(() => import('./pages/AdminPasswordSetup'))

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
  const location = useLocation()
  const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/')

  return (
    <div className={isAdmin ? 'min-h-screen' : 'min-h-screen bg-bg-dark'}>
      {!isAdmin && <ScrollProgress />}
      <Routes>
        <Route path="/admin/setup-password" element={(
          <Suspense fallback={<main className="admin-auth-page"><div className="admin-auth-loading" role="status"><span /><p>Opening secure account setup…</p></div></main>}>
            <AdminPasswordSetup />
          </Suspense>
        )} />
        <Route path="/admin/*" element={(
          <Suspense fallback={<main className="admin-auth-page"><div className="admin-auth-loading" role="status"><span /><p>Opening Content Studio…</p></div></main>}>
            <Admin />
          </Suspense>
        )} />
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
