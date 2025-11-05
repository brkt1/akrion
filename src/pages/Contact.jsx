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

  // WhatsApp number (remove + and spaces for wa.me link)
  const whatsappNumber = '251976601172'

  const handleSubmit = (e) => {
    e.preventDefault()
    // Create WhatsApp message with form data
    const message = encodeURIComponent(
      `Hello Akrion Digitals!\n\n` +
      `I'm interested in starting a project.\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Message: ${formData.message}`
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    
    // Reset form after opening WhatsApp
    setFormData({
      name: '',
      email: '',
      message: ''
    })
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
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 drop-shadow-md">Phone</h3>
                  <a href="tel:+251976601172" className="text-sm sm:text-base text-accent-orange hover:underline drop-shadow-sm">
                    +251 976 601 172
                  </a>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 drop-shadow-md">WhatsApp</h3>
                  <a 
                    href={`https://wa.me/${whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base text-accent-orange hover:underline drop-shadow-sm"
                  >
                    Chat with us on WhatsApp
                  </a>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 drop-shadow-md">Location</h3>
                  <p className="text-sm sm:text-base text-white/80 drop-shadow-sm mb-4">Addis Ababa, Ethiopia</p>
                  <div className="w-full h-64 sm:h-80 rounded-lg sm:rounded-xl overflow-hidden border border-white/20">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.6091243727!2d38.6966474!3d9.0083434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Akrion Digitals Office Location"
                      className="w-full h-full"
                    ></iframe>
                  </div>
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

