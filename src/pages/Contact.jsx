import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ScrollAnimation from '../components/ScrollAnimation'

// Brand constants
const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const GOLD_DIM = 'rgba(201,161,112,0.5)'
const CARD_BG = 'rgba(19,32,25,0.8)'
const CARD_BORDER = 'rgba(201,161,112,0.1)'
const CARD_BORDER_HOVER = 'rgba(201,161,112,0.3)'
const INPUT_STYLE = {
  background: 'rgba(201,161,112,0.05)',
  border: '1px solid rgba(201,161,112,0.15)',
  color: '#F0EAD6',
}

const CONTACT = {
  email: 'Akriondigitals@gmail.com',
  phone: '+2519 7660 1172',
  whatsapp: '251976601172',
  location: 'Addis Ababa, Ethiopia',
}

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = encodeURIComponent(
      `Hello Akrion Digitals!\n\nI'm interested in starting a project.\n\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    )
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, '_blank')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const contactItems = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: 'Email',
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.58 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      label: 'Phone / WhatsApp',
      value: CONTACT.phone,
      href: `https://wa.me/${CONTACT.whatsapp}`,
      external: true,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      label: 'Location',
      value: CONTACT.location,
      href: null,
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden" style={{ background: '#0D1F13' }}>
        {/* Background */}
        <div className="fixed inset-0 dot-grid opacity-30 z-0 pointer-events-none" />
        <div className="fixed top-0 right-0 w-[700px] h-[700px] rounded-full blur-[200px] z-0 pointer-events-none" style={{ background: 'rgba(201,161,112,0.04)' }} />

        <div className="relative z-10 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-14 sm:gap-16">

            {/* Page header */}
            <div>
              <ScrollAnimation animation="fadeUp" delay={0.1}>
                <div className="section-label mb-4">
                  <span className="section-dot" />
                  Get In Touch
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
                <h1 className="section-heading text-[clamp(3rem,8vw,5.5rem)]">CONTACT</h1>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.35}>
                <p className="text-lg leading-relaxed mt-4 max-w-2xl font-light" style={{ color: GOLD_DIM }}>
                  Ready to create something extraordinary? We&apos;re here to collaborate, brainstorm, and bring your vision to life.
                </p>
              </ScrollAnimation>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left – contact info */}
              <ScrollAnimation animation="fadeLeft" delay={0.2}>
                <div className="flex flex-col gap-5 h-full">
                  {/* Contact cards */}
                  {contactItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-5 rounded-2xl border"
                      style={{ background: CARD_BG, borderColor: CARD_BORDER }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,161,112,0.1)', color: GOLD, border: `1px solid ${CARD_BORDER}` }}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: 'rgba(201,161,112,0.45)' }}>{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className="text-sm sm:text-base font-light transition-colors duration-200"
                            style={{ color: GOLD_LIGHT }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = GOLD_LIGHT}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-light" style={{ color: GOLD_LIGHT }}>{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Map */}
                  <div className="rounded-2xl overflow-hidden border flex-1 min-h-[200px]" style={{ borderColor: CARD_BORDER }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.6091243727!2d38.6966474!3d9.0083434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                      width="100%"
                      height="220"
                      style={{ border: 0, filter: 'grayscale(30%) brightness(0.7) sepia(20%)' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Akrion Digitals Office Location"
                    />
                  </div>
                </div>
              </ScrollAnimation>

              {/* Right – form */}
              <ScrollAnimation animation="fadeRight" delay={0.3}>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 p-7 sm:p-8 rounded-2xl border h-full"
                  style={{ background: CARD_BG, borderColor: CARD_BORDER, backdropFilter: 'blur(20px)' }}
                >
                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(201,161,112,0.45)' }}>Send us a message</p>
                    <h2 className="text-xl font-bold" style={{ color: '#F0EAD6' }}>Start a Conversation</h2>
                  </div>

                  {[
                    { name: 'name', type: 'text', placeholder: 'Your Name', required: true },
                    { name: 'email', type: 'email', placeholder: 'Your Email', required: true },
                  ].map(field => (
                    <input
                      key={field.name}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full px-4 py-3.5 rounded-xl text-sm transition-all outline-none"
                      style={{
                        ...INPUT_STYLE,
                        '--tw-ring-color': GOLD,
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = 'rgba(201,161,112,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'; e.currentTarget.style.background = 'rgba(201,161,112,0.05)' }}
                    />
                  ))}

                  <textarea
                    name="message"
                    placeholder="Tell us about your project…"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                    className="w-full px-4 py-3.5 rounded-xl text-sm transition-all outline-none resize-none flex-1"
                    style={INPUT_STYLE}
                    onFocus={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = 'rgba(201,161,112,0.08)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'; e.currentTarget.style.background = 'rgba(201,161,112,0.05)' }}
                  />

                  <button type="submit" className="btn-primary py-4 w-full group">
                    Send via WhatsApp
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <p className="text-xs text-center font-light" style={{ color: 'rgba(201,161,112,0.3)' }}>
                    Your message will open WhatsApp with your details pre-filled.
                  </p>
                </form>
              </ScrollAnimation>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Contact
