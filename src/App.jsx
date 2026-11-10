import { Component, lazy, Suspense, useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation, useNavigationType, useParams } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import MobileBottomNav from './components/MobileBottomNav'
import OurWork from './components/OurWork'
import { ScrollProgress } from './components/ScrollAnimation'
import Testimonials from './components/Testimonials'
import TiletDivider from './components/TiletDivider'
import WhatWeDo from './components/WhatWeDo'
import WhoWeAre from './components/WhoWeAre'
import WhyChooseUs from './components/WhyChooseUs'
import { PublishedContentProvider } from './lib/publishedContent'
import { publicRouteLoaders } from './lib/publicRoutes'

const About = lazy(publicRouteLoaders['/about'])
const Services = lazy(publicRouteLoaders['/services'])
const Portfolio = lazy(publicRouteLoaders['/portfolio'])
const ProjectCaseStudy = lazy(publicRouteLoaders['/portfolio/:slug'])
const Blog = lazy(publicRouteLoaders['/blog'])
const BlogArticle = lazy(publicRouteLoaders['/blog/:slug'])
const Contact = lazy(publicRouteLoaders['/contact'])

const Admin = lazy(() => import('./pages/Admin'))
const AdminPasswordSetup = lazy(() => import('./pages/AdminPasswordSetup'))

function Home() {
  return (
    <>
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

const RouteLoading = ({ label = 'Loading page…' }) => (
  <main className="route-loading" role="status">{label}</main>
)

class RouteBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="route-loading">
        <div role="alert">
          <p>This page couldn’t load. Please check your connection and try again.</p>
          <button type="button" className="btn-primary mt-4" onClick={() => window.location.reload()}>Reload page</button>
        </div>
      </main>
    )
  }
}

function App() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const lastPath = useRef(location.pathname)
  const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/')
  useLayoutEffect(() => {
    if (lastPath.current === location.pathname) return
    lastPath.current = location.pathname
    if (navigationType !== 'POP' && !location.hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.hash, navigationType])

  return (
    <PublishedContentProvider>
      <div className={isAdmin ? 'min-h-screen' : 'site-shell min-h-screen bg-bg-dark'}>
        {!isAdmin && <><ScrollProgress /><Header /></>}
        <RouteBoundary key={location.pathname}>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/admin/setup-password" element={(
                <Suspense fallback={<RouteLoading label="Opening secure account setup…" />}>
                  <AdminPasswordSetup />
                </Suspense>
              )} />
              <Route path="/admin/*" element={(
                <Suspense fallback={<RouteLoading label="Opening Content Studio…" />}>
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
          </Suspense>
        </RouteBoundary>
        {!isAdmin && <MobileBottomNav />}
      </div>
    </PublishedContentProvider>
  )
}

export default App
