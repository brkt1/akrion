import Footer from './Footer'
import Header from './Header'
import ScrollAnimation from './ScrollAnimation'

const values = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Creativity First',
    description: 'We believe in pushing boundaries and exploring new creative territories every single day.',
    accent: '#8B5CF6',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Client-Centric',
    description: 'Your vision is our mission. We work closely alongside you to bring your ideas to life.',
    accent: '#06B6D4',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Quality Excellence',
    description: 'Every project is crafted with meticulous attention to detail and an uncompromising commitment to excellence.',
    accent: '#FF7F3E',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Innovation',
    description: 'We stay ahead of trends and leverage cutting-edge tools and technologies to keep you competitive.',
    accent: '#F59E0B',
  },
]

const team = [
  {
    name: 'Creative Team',
    role: 'Design & Strategy',
    description: 'Talented designers and strategists who bring fresh perspectives and cultural depth to every project.',
    accent: '#8B5CF6',
  },
  {
    name: 'Development Team',
    role: 'Technology & Innovation',
    description: 'Expert engineers who turn creative visions into fast, accessible, delightful digital products.',
    accent: '#06B6D4',
  },
  {
    name: 'Content Team',
    role: 'Storytelling & Branding',
    description: 'Master storytellers who craft compelling narratives that cut through the noise and resonate deeply.',
    accent: '#FF7F3E',
  },
]

const About = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-dark relative overflow-hidden">
        {/* Background decoration */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-accent-purple/[0.04] rounded-full blur-[200px] pointer-events-none z-0" />
        <div className="absolute inset-0 dot-grid opacity-30 z-0" />

        <div className="relative z-10 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-20 sm:gap-24">

            {/* Hero */}
            <section>
              <ScrollAnimation animation="fadeUp" delay={0.1}>
                <div className="section-label mb-4">
                  <span className="section-dot" />
                  Who We Are
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
                <h1 className="section-heading text-[clamp(3rem,8vw,5.5rem)] text-white mb-6">
                  ABOUT
                </h1>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.35}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <p className="text-lg sm:text-xl leading-[1.8] text-white/55 font-light">
                    Akrion Digitals was built on the belief that creativity is more than design —
                    it&apos;s <span className="text-white/85 font-normal">transformation</span>. Our mission
                    is to design meaningful experiences that connect people, purpose, and performance.
                  </p>
                  <p className="text-base sm:text-lg leading-[1.8] text-white/40 font-light">
                    Based in Addis Ababa, Ethiopia, we specialize in branding, web development, video production,
                    and social media strategy — creating digital experiences that make a real impact for
                    forward-thinking brands and businesses.
                  </p>
                </div>
              </ScrollAnimation>
            </section>

            {/* Values */}
            <section>
              <ScrollAnimation animation="fadeLeft" delay={0.1}>
                <div className="section-label mb-4">
                  <span className="section-dot" />
                  What We Stand For
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeLeft" delay={0.2} duration={0.8}>
                <h2 className="section-heading text-[clamp(1.8rem,4vw,3rem)] text-white mb-10">
                  Our Values
                </h2>
              </ScrollAnimation>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <ScrollAnimation key={index} animation="fadeUp" delay={0.1 + index * 0.08}>
                    <div className="group flex items-start gap-4 p-6 rounded-2xl border border-white/[0.07] hover:border-white/[0.14] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ background: `${value.accent}12`, color: value.accent, border: `1px solid ${value.accent}20` }}
                      >
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white mb-1.5">{value.title}</h3>
                        <p className="text-sm text-white/40 leading-relaxed font-light">{value.description}</p>
                      </div>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </section>

            {/* Team */}
            <section>
              <ScrollAnimation animation="fadeLeft" delay={0.1}>
                <div className="section-label mb-4">
                  <span className="section-dot" />
                  The People
                </div>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeLeft" delay={0.2} duration={0.8}>
                <h2 className="section-heading text-[clamp(1.8rem,4vw,3rem)] text-white mb-10">
                  Our Team
                </h2>
              </ScrollAnimation>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {team.map((member, index) => (
                  <ScrollAnimation key={index} animation="fadeUp" delay={0.1 + index * 0.1}>
                    <div className="group flex flex-col gap-4 p-6 rounded-2xl border border-white/[0.07] hover:border-white/[0.14] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 h-full">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
                        style={{ background: `${member.accent}12`, color: member.accent, border: `1px solid ${member.accent}20` }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white mb-1">{member.name}</h3>
                        <p className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: member.accent }}>
                          {member.role}
                        </p>
                        <p className="text-sm text-white/40 leading-relaxed font-light">{member.description}</p>
                      </div>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            </section>

            {/* Mission CTA */}
            <ScrollAnimation animation="fadeUp" delay={0.2}>
              <section className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-30" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-orange/40 to-transparent" />
                <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                  <div>
                    <p className="section-label mb-3">
                      <span className="section-dot" />
                      Our Mission
                    </p>
                    <p className="text-base sm:text-lg leading-[1.8] text-white/50 max-w-xl font-light">
                      To empower businesses with creative digital solutions that drive real growth,
                      engage audiences meaningfully, and create lasting impact across Africa and beyond.
                    </p>
                  </div>
                  <a href="/contact" className="btn-primary flex-shrink-0 px-8 py-4">
                    Work With Us
                  </a>
                </div>
              </section>
            </ScrollAnimation>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default About
