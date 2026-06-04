import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ScrollAnimation from '../components/ScrollAnimation'

// Brand constants — warm cream + muted gold + deep green
const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CREAM = '#F5EDD8'
const CARD_BG = 'rgba(19,32,25,0.85)'
const CARD_BORDER = 'rgba(201,161,112,0.10)'
const INPUT_STYLE = {
  background: 'rgba(245,237,216,0.04)',
  border: '1px solid rgba(201,161,112,0.15)',
  color: '#F5EDD8',
}

const CONTACT = {
  email: 'Akriondigitals@gmail.com',
  phone: '+251 97 660 1172',
  whatsapp: '251976601172',
  location: 'Addis Ababa, Ethiopia',
  instagram: 'https://instagram.com/akriondigitals',
  tiktok: 'https://tiktok.com/@akriondigitals',
  telegram: 'https://t.me/akriondigitals',
}

// Multiple ways to reach — icons + labels
const contactMethods = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    label: 'WhatsApp',
    sublabel: 'Fastest response',
    value: CONTACT.phone,
    href: `https://wa.me/${CONTACT.whatsapp}?text=Hi!%20I'd%20like%20to%20discuss%20a%20project.`,
    badge: '🟢 Usually replies in < 1hr',
    external: true,
    highlight: true,
    badgeColor: 'rgba(120,180,140,0.15)',
    badgeText: '#7AB48C',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    sublabel: 'For formal inquiries',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    external: false,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
    label: 'Telegram',
    sublabel: 'Quick messages',
    value: '@akriondigitals',
    href: CONTACT.telegram,
    external: true,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    label: 'Instagram',
    sublabel: 'See our latest work',
    value: '@akriondigitals',
    href: CONTACT.instagram,
    external: true,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Location',
    sublabel: 'Visit us in Addis',
    value: CONTACT.location,
    href: null,
  },
]

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = encodeURIComponent(
      `Hello Akrion Digitals! 👋\n\nI'm interested in starting a project.\n\nName: ${formData.name}\nEmail: ${formData.email}\nService interested in: ${formData.service || 'Not specified'}\n\nMessage:\n${formData.message}`
    )
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setFormData({ name: '', email: '', service: '', message: '' })
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden" style={{ background: '#0D1F13' }}>
        {/* Background */}
        <div className="fixed inset-0 dot-grid opacity-30 z-0 pointer-events-none" />
        <div className="fixed top-0 right-0 w-[700px] h-[700px] rounded-full blur-[200px] z-0 pointer-events-none" style={{ background: 'rgba(245,237,216,0.03)' }} />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[160px] z-0 pointer-events-none" style={{ background: 'rgba(201,161,112,0.04)' }} />

        <div className="relative z-10 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-12 sm:gap-16">

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
                <p className="text-lg leading-relaxed mt-4 max-w-2xl font-light" style={{ color: 'rgba(245,237,216,0.45)' }}>
                  Ready to build something that customers actually remember?{' '}
                  <span style={{ color: GOLD }}>Choose how you want to reach us.</span>
                </p>
              </ScrollAnimation>
            </div>

            {/* Free strategy call — top-of-page CTA */}
            <ScrollAnimation animation="fadeUp" delay={0.2}>
              <div
                className="relative p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,161,112,0.08), rgba(19,32,25,0.9))',
                  borderColor: 'rgba(201,161,112,0.2)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                <div className="absolute top-0 left-10 right-10 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,112,0.5), transparent)' }} />
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: GOLD }}>🎯 Book a Free Strategy Call</p>
                  <h3 className="font-display font-bold text-xl sm:text-2xl" style={{ color: CREAM }}>
                    30 minutes · 100% free · Zero pressure
                  </h3>
                  <p className="text-sm font-light mt-1" style={{ color: 'rgba(245,237,216,0.45)' }}>
                    We'll analyze your brand, understand your goals, and give you a real plan — no strings attached.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=Hi!%20I%27d%20like%20to%20book%20a%20free%20strategy%20call%20to%20discuss%20my%20brand.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-shrink-0 px-8 py-4 text-base group inline-flex"
                >
                  Book Free Call
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </ScrollAnimation>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6">

              {/* Left – multiple contact channels */}
              <ScrollAnimation animation="fadeLeft" delay={0.2}>
                <div className="flex flex-col gap-4 h-full">
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase" style={{ color: 'rgba(201,161,112,0.5)' }}>
                    Other ways to reach us
                  </p>

                  {contactMethods.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-default"
                      style={{
                        background: item.highlight ? 'rgba(201,161,112,0.06)' : CARD_BG,
                        borderColor: item.highlight ? 'rgba(201,161,112,0.22)' : CARD_BORDER,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,161,112,0.28)'; e.currentTarget.style.background = 'rgba(19,32,25,0.95)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = item.highlight ? 'rgba(201,161,112,0.22)' : CARD_BORDER; e.currentTarget.style.background = item.highlight ? 'rgba(201,161,112,0.06)' : CARD_BG }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,161,112,0.10)', color: GOLD, border: `1px solid rgba(201,161,112,0.15)` }}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold tracking-[0.10em] uppercase" style={{ color: 'rgba(201,161,112,0.55)' }}>{item.label}</p>
                          {item.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: item.badgeColor, color: item.badgeText }}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-light mb-1" style={{ color: 'rgba(245,237,216,0.3)' }}>{item.sublabel}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className="text-sm font-light transition-colors duration-200 break-all"
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
                  <div className="rounded-2xl overflow-hidden border flex-1 min-h-[180px] mt-1" style={{ borderColor: CARD_BORDER }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.6091243727!2d38.6966474!3d9.0083434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                      width="100%"
                      height="200"
                      style={{ border: 0, filter: 'grayscale(40%) brightness(0.65) sepia(25%)' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Akrion Digitals - Addis Ababa, Ethiopia"
                    />
                  </div>
                </div>
              </ScrollAnimation>

              {/* Right – project form */}
              <ScrollAnimation animation="fadeRight" delay={0.3}>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 p-7 sm:p-9 rounded-2xl border h-full"
                  style={{ background: CARD_BG, borderColor: CARD_BORDER, backdropFilter: 'blur(24px)' }}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,112,0.3), transparent)' }} />

                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(201,161,112,0.45)' }}>Tell us about your project</p>
                    <h2 className="text-xl sm:text-2xl font-bold" style={{ color: CREAM }}>Let&apos;s Build Your Brand</h2>
                    <p className="text-xs font-light mt-1" style={{ color: 'rgba(245,237,216,0.35)' }}>
                      Fill this out and we'll reply on WhatsApp within the hour.
                    </p>
                  </div>

                  {/* Name & Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'name', type: 'text', placeholder: 'Your Name', label: 'Name', required: true },
                      { name: 'email', type: 'email', placeholder: 'Your Email', label: 'Email', required: true },
                    ].map(field => (
                      <div key={field.name}>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: 'rgba(201,161,112,0.40)' }}>{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required={field.required}
                          className="w-full px-4 py-3.5 rounded-xl text-sm transition-all outline-none"
                          style={INPUT_STYLE}
                          onFocus={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = 'rgba(201,161,112,0.08)' }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'; e.currentTarget.style.background = 'rgba(245,237,216,0.04)' }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Service dropdown */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: 'rgba(201,161,112,0.40)' }}>What do you need?</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl text-sm transition-all outline-none"
                      style={INPUT_STYLE}
                      onFocus={e => { e.currentTarget.style.borderColor = GOLD }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)' }}
                    >
                      <option value="" style={{ background: '#0D1F13' }}>Select a service…</option>
                      <option value="Brand Identity" style={{ background: '#0D1F13' }}>Brand Identity</option>
                      <option value="Web Development" style={{ background: '#0D1F13' }}>Web Development</option>
                      <option value="Social Media Management" style={{ background: '#0D1F13' }}>Social Media Management</option>
                      <option value="Video Production" style={{ background: '#0D1F13' }}>Video Production</option>
                      <option value="Full Brand Package" style={{ background: '#0D1F13' }}>Full Brand Package</option>
                      <option value="Creative Consulting" style={{ background: '#0D1F13' }}>Creative Consulting</option>
                      <option value="Not sure — need advice" style={{ background: '#0D1F13' }}>Not sure — need advice</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: 'rgba(201,161,112,0.40)' }}>Your Message</label>
                    <textarea
                      name="message"
                      placeholder="Tell us about your brand, your goals, and what you're looking for…"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      required
                      className="w-full px-4 py-3.5 rounded-xl text-sm transition-all outline-none resize-none"
                      style={INPUT_STYLE}
                      onFocus={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = 'rgba(201,161,112,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'; e.currentTarget.style.background = 'rgba(245,237,216,0.04)' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary py-4 w-full group text-base"
                    style={sent ? { background: 'linear-gradient(135deg, #7AB48C, #2D6B3F)' } : {}}
                  >
                    {sent ? '✓ Message Sent! Check WhatsApp' : 'Send via WhatsApp →'}
                  </button>

                  <p className="text-xs text-center font-light" style={{ color: 'rgba(245,237,216,0.25)' }}>
                    Clicking will open WhatsApp with your details pre-filled. Fast, familiar, secure.
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
