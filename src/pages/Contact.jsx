import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isMobile, setIsMobile] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const bgImageUrl = 'https://images.unsplash.com/photo-1697311622332-184b7bb19a46?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29ueSUyMGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000'

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <Header />
      <div 
        className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen relative"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Frosted glass content */}
        <section className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
            <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-4 sm:mb-6 text-white drop-shadow-lg">
                CONTACT
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-3xl drop-shadow-md">
                Ready to create something extraordinary? We're here to collaborate, brainstorm, and bring your vision to life.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
              <div className="backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 drop-shadow-md">Email</h3>
                  <a href="mailto:info@akriondigitals.com" className="text-sm sm:text-base text-accent-orange hover:underline drop-shadow-sm break-all">
                    info@akriondigitals.com
                  </a>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 drop-shadow-md">Location</h3>
                  <p className="text-sm sm:text-base text-white/80 drop-shadow-sm">Addis Ababa, Ethiopia</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 backdrop-blur-md bg-black/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-accent-orange transition-colors resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-accent-orange text-white border-none px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 hover:bg-[#FF6B2E] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,127,62,0.3)] group backdrop-blur-sm w-full sm:w-auto"
                >
                  <span>Send Message</span>
                  <svg width="18" height="18" className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Contact

