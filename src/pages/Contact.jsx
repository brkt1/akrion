import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageMeta from '../components/PageMeta'
import ScrollAnimation from '../components/ScrollAnimation'

const CONTACT = {
  email: 'akriondigitals@gmail.com',
  phone: '+251 97 660 1172',
  whatsapp: '251976601172',
  location: 'Addis Ababa, Ethiopia',
  telegramHandle: '@akriondigitals',
  telegramUrl: 'https://t.me/akriondigitals',
}

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  service: '',
  details: '',
}

const SERVICE_OPTIONS = [
  'Brand Identity',
  'Web & Applications',
  'Video, Motion & Photography',
  'Social Media & Advertising',
  'Creative Consulting',
  'Not Sure Yet',
]

const FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone / WhatsApp',
  service: 'Service',
  details: 'Project details',
}

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20.2l1.5-4.5a8.5 8.5 0 1 1 16-4.2Z" />
    <path d="M8.4 9.1c.5 2.8 2 4.3 4.8 4.9" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m21 4-3.1 15.1c-.2 1-1 1.2-1.8.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8L17 6.4c.4-.3-.1-.5-.6-.2L5.7 12.9 1.1 11.5c-1-.3-1-1 .2-1.5L19.4 3c.8-.3 1.7.2 1.6 1Z" />
  </svg>
)

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <rect x="6.5" y="6.5" width="9" height="9" rx="1.5" />
    <path d="M4 12.5H3.5A1.5 1.5 0 0 1 2 11V3.5A1.5 1.5 0 0 1 3.5 2H11a1.5 1.5 0 0 1 1.5 1.5V4" />
  </svg>
)

const validateForm = (values) => {
  const errors = {}
  const phoneDigits = values.phone.replace(/\D/g, '')

  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!values.phone.trim()) errors.phone = 'Please enter your phone or WhatsApp number.'
  else if (phoneDigits.length < 7 || phoneDigits.length > 15) errors.phone = 'Please enter a valid phone number.'
  if (!values.service) errors.service = 'Please choose a service.'
  if (!values.details.trim()) errors.details = 'Please tell us a little about your project.'

  return errors
}

const buildWhatsAppMessage = (values) => [
  'Hello Akrion Digitals,',
  '',
  "I'd like to discuss a project.",
  '',
  `Name: ${values.name.trim()}`,
  ...(values.email.trim() ? [`Email: ${values.email.trim()}`] : []),
  `Phone / WhatsApp: ${values.phone.trim()}`,
  `Service: ${values.service}`,
  '',
  'Project details:',
  values.details.trim(),
].join('\n')

const Contact = () => {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [launchState, setLaunchState] = useState('idle')
  const [fallbackMessage, setFallbackMessage] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const formRef = useRef(null)
  const launchLockRef = useRef(false)
  const launchTimerRef = useRef(null)
  const copyTimerRef = useRef(null)

  useEffect(() => () => {
    window.clearTimeout(launchTimerRef.current)
    window.clearTimeout(copyTimerRef.current)
  }, [])

  const announceCopy = (key) => {
    setCopyStatus(key)
    window.clearTimeout(copyTimerRef.current)
    copyTimerRef.current = window.setTimeout(() => setCopyStatus(''), 2200)
  }

  const copyText = async (value, key) => {
    let copied = false

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        copied = true
      }
    } catch {
      copied = false
    }

    if (!copied) {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        copied = document.execCommand('copy')
      } catch {
        copied = false
      }
      textarea.remove()
    }

    announceCopy(copied ? key : 'copy-error')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
    if (launchState !== 'idle') setLaunchState('idle')
  }

  const handleBlur = (event) => {
    const { name } = event.target
    const fieldError = validateForm(formData)[name]
    setErrors((current) => ({ ...current, [name]: fieldError || '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (launchLockRef.current) return

    const nextErrors = validateForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      setLaunchState('invalid')
      const firstInvalidName = Object.keys(FIELD_LABELS).find((name) => nextErrors[name])
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector(`[name="${firstInvalidName}"]`)?.focus()
      })
      return
    }

    launchLockRef.current = true
    setLaunchState('opening')
    const message = buildWhatsAppMessage(formData)
    const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
    let whatsappWindow = null

    try {
      whatsappWindow = window.open('', '_blank')
      if (whatsappWindow) {
        whatsappWindow.opener = null
        whatsappWindow.location.href = whatsappUrl
        setLaunchState('opened')
        setFallbackMessage('')
      } else {
        setFallbackMessage(message)
        setLaunchState('fallback')
      }
    } catch {
      if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close()
      setFallbackMessage(message)
      setLaunchState('fallback')
    }

    window.clearTimeout(launchTimerRef.current)
    launchTimerRef.current = window.setTimeout(() => {
      launchLockRef.current = false
    }, 1200)
  }

  const fieldErrorId = (name) => `contact-${name}-error`

  return (
    <>
      <PageMeta
        title="Contact Akrion Digitals | Start a Creative Project"
        description="Tell Akrion Digitals what you are building and continue the conversation on WhatsApp. Brand, web, motion, social media, and creative consulting in Addis Ababa."
        path="/contact"
      />
      <Header />

      <main className="contact-page">
        <section className="contact-page-hero" aria-labelledby="contact-page-title">
          <div className="contact-page-hero-pattern eth-pattern-subtle" aria-hidden="true" />
          <div className="contact-page-hero-glow" aria-hidden="true" />
          <div className="contact-page-shell contact-page-hero-inner">
            <ScrollAnimation animation="fadeUp" delay={0.08} respectReducedMotion>
              <div className="contact-page-eyebrow">
                <span />
                Get In Touch
              </div>
              <h1 id="contact-page-title">CONTACT</h1>
              <div className="contact-page-gold-detail" aria-hidden="true">
                <span />
              </div>
              <p>
                Have a project in mind? Tell us what you’re building, and we’ll help you find the right direction.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        <section className="contact-inquiry-section" aria-label="Project inquiry and direct contact details">
          <div className="contact-inquiry-pattern eth-pattern-subtle" aria-hidden="true" />
          <div className="contact-page-shell contact-layout">
            <ScrollAnimation className="contact-form-wrap" animation="fadeRight" delay={0.1} respectReducedMotion>
              <form
                ref={formRef}
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
                aria-labelledby="contact-form-title"
              >
                <div className="contact-form-accent" aria-hidden="true" />
                <header className="contact-form-header">
                  <p className="contact-form-eyebrow">Tell us about your project</p>
                  <h2 id="contact-form-title">Let&apos;s create something meaningful.</h2>
                  <p>Share a few details and we’ll continue the conversation on WhatsApp.</p>
                </header>

                <div className="contact-form-grid">
                  <div className="contact-field">
                    <label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your name"
                      required
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? fieldErrorId('name') : undefined}
                    />
                    <p className="contact-field-error" id={fieldErrorId('name')} role={errors.name ? 'alert' : undefined}>{errors.name || '\u00a0'}</p>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-email">Email <span className="contact-optional">Optional</span></label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? fieldErrorId('email') : undefined}
                    />
                    <p className="contact-field-error" id={fieldErrorId('email')} role={errors.email ? 'alert' : undefined}>{errors.email || '\u00a0'}</p>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-phone">Phone / WhatsApp <span aria-hidden="true">*</span></label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="+251 ..."
                      required
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? fieldErrorId('phone') : undefined}
                    />
                    <p className="contact-field-error" id={fieldErrorId('phone')} role={errors.phone ? 'alert' : undefined}>{errors.phone || '\u00a0'}</p>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-service">Service <span aria-hidden="true">*</span></label>
                    <div className="contact-select-wrap">
                      <select
                        id="contact-service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        aria-invalid={Boolean(errors.service)}
                        aria-describedby={errors.service ? fieldErrorId('service') : undefined}
                      >
                        <option value="" disabled>Select a service</option>
                        {SERVICE_OPTIONS.map((service) => <option value={service} key={service}>{service}</option>)}
                      </select>
                      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
                    </div>
                    <p className="contact-field-error" id={fieldErrorId('service')} role={errors.service ? 'alert' : undefined}>{errors.service || '\u00a0'}</p>
                  </div>
                </div>

                <div className="contact-field contact-field-details">
                  <label htmlFor="contact-details">Project details <span aria-hidden="true">*</span></label>
                  <textarea
                    id="contact-details"
                    name="details"
                    rows="5"
                    maxLength="1200"
                    value={formData.details}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="What are you building, and what would success look like?"
                    required
                    aria-invalid={Boolean(errors.details)}
                    aria-describedby={`${errors.details ? `${fieldErrorId('details')} ` : ''}contact-details-limit`}
                  />
                  <div className="contact-details-meta">
                    <p className="contact-field-error" id={fieldErrorId('details')} role={errors.details ? 'alert' : undefined}>{errors.details || '\u00a0'}</p>
                    <span id="contact-details-limit">{formData.details.length}/1200</span>
                  </div>
                </div>

                <button className="contact-submit-button" type="submit" disabled={launchState === 'opening'} aria-busy={launchState === 'opening'}>
                  <span>{launchState === 'opening' ? 'Opening WhatsApp…' : 'Continue on WhatsApp'}</span>
                  <ArrowIcon />
                </button>

                <p className="contact-form-note">
                  This opens WhatsApp with your project details prefilled. Review the message there before you send it.
                </p>

                <div className="contact-form-status" aria-live="polite">
                  {launchState === 'invalid' && <p>Please review the highlighted fields. Your information has been kept.</p>}
                  {launchState === 'opened' && <p>WhatsApp opened with your details. Review and send the message there when you’re ready.</p>}
                </div>

                {launchState === 'fallback' && (
                  <div className="contact-fallback" role="status">
                    <p><strong>WhatsApp couldn’t open automatically.</strong> Copy your message and number below, then open WhatsApp manually.</p>
                    <div className="contact-fallback-actions">
                      <button type="button" onClick={() => copyText(fallbackMessage, 'message')}>Copy message</button>
                      <button type="button" onClick={() => copyText(CONTACT.phone, 'number')}>Copy number</button>
                      <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
                    </div>
                  </div>
                )}
              </form>
            </ScrollAnimation>

            <ScrollAnimation className="contact-direct-wrap" animation="fadeLeft" delay={0.04} respectReducedMotion>
              <aside className="contact-direct" aria-labelledby="contact-direct-title">
                <p className="contact-direct-eyebrow">Direct contact</p>
                <h2 id="contact-direct-title">Prefer to reach out directly?</h2>
                <p className="contact-direct-intro">Choose the channel that works best for you. We’ll get back to you as soon as possible.</p>

                <div className="contact-direct-list">
                  <div className="contact-direct-row">
                    <div className="contact-direct-icon"><MessageIcon /></div>
                    <div className="contact-direct-copy">
                      <span>WhatsApp</span>
                      <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">{CONTACT.phone}</a>
                    </div>
                    <button type="button" className="contact-copy-button" onClick={() => copyText(CONTACT.phone, 'phone')} aria-label="Copy WhatsApp number">
                      <CopyIcon />
                      <span>{copyStatus === 'phone' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="contact-direct-row">
                    <div className="contact-direct-icon"><MailIcon /></div>
                    <div className="contact-direct-copy">
                      <span>Email</span>
                      <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                    </div>
                    <button type="button" className="contact-copy-button" onClick={() => copyText(CONTACT.email, 'email')} aria-label="Copy email address">
                      <CopyIcon />
                      <span>{copyStatus === 'email' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="contact-direct-row">
                    <div className="contact-direct-icon"><TelegramIcon /></div>
                    <div className="contact-direct-copy">
                      <span>Telegram</span>
                      <a href={CONTACT.telegramUrl} target="_blank" rel="noopener noreferrer">{CONTACT.telegramHandle}</a>
                    </div>
                    <a className="contact-row-link" href={CONTACT.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Akrion Digitals on Telegram">
                      <ArrowIcon />
                    </a>
                  </div>
                </div>

                <div className="contact-location">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                  <span>Based in {CONTACT.location}.</span>
                </div>
                <p className="contact-copy-announcement" aria-live="polite">
                  {copyStatus === 'phone' && 'WhatsApp number copied.'}
                  {copyStatus === 'email' && 'Email address copied.'}
                  {copyStatus === 'message' && 'Project message copied.'}
                  {copyStatus === 'number' && 'WhatsApp number copied.'}
                  {copyStatus === 'copy-error' && 'Copy was unavailable. Please select the text manually.'}
                </p>
              </aside>
            </ScrollAnimation>
          </div>
        </section>
      </main>

      <Footer hideCtaBanner />
    </>
  )
}

export default Contact
