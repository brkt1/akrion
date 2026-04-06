import ScrollAnimation, { StaggerContainer, StaggerItem } from './ScrollAnimation'
import TiletDivider from './TiletDivider'

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'

const projects = [
  {
    name: 'Cassopia Tour',
    category: 'Web Development',
    description: 'Full-stack travel booking platform with live availability and payment integration.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: GOLD,
  },
  {
    name: 'Yenege Games',
    category: 'Game Development',
    description: 'Immersive Ethiopian-themed mobile game with over 10K downloads on launch week.',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: '#2D6B3F',
    featured: true,
  },
  {
    name: "Corno D'Africa",
    category: 'Video Editing',
    description: 'Documentary-style brand film showcasing Horn of Africa culture and hospitality.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: '#9E7A4A',
  },
  {
    name: 'Akrion Run Campaign',
    category: 'Campaign',
    description: 'City-wide marathon campaign that drove 3K+ registrations and 1M+ social impressions.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: '#E2C49A',
  },
  {
    name: 'Teff & Bula',
    category: 'Brand Identity',
    description: 'Premium brand identity for an Ethiopian F&B startup entering international markets.',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    accent: GOLD,
  },
]

const OurWork = () => {
  return (
    <section className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-10 relative overflow-hidden"
      style={{ background: '#0A1A0F' }}>

      {/* Ethiopian pattern background — very subtle */}
      <div className="absolute inset-0 eth-pattern-subtle opacity-60 pointer-events-none z-0" />

      {/* Glow */}
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-[200px] pointer-events-none z-0"
        style={{ background: 'rgba(201,161,112,0.04)' }} />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="flex flex-col gap-4">
            <ScrollAnimation animation="fadeLeft" delay={0.1}>
              <div className="section-label"><span className="section-dot" />Portfolio</div>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeLeft" delay={0.2} duration={0.8}>
              <h2 className="section-heading text-[clamp(2.2rem,5vw,4rem)]">OUR WORK</h2>
            </ScrollAnimation>
          </div>
          <ScrollAnimation animation="fadeRight" delay={0.3}>
            <a href="/portfolio" className="btn-ghost text-sm px-5 py-2.5 group">
              View All Projects
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </ScrollAnimation>
        </div>

        {/* Tilet Divider */}
        <TiletDivider className="mb-12 sm:mb-16 -mt-4 opacity-70" />

        {/* Project grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" staggerDelay={0.1}>
          {projects.map((project, index) => (
            <StaggerItem key={index} className={project.featured ? 'sm:col-span-2 lg:col-span-1' : ''}>
              <div
                className="group cursor-pointer relative rounded-2xl overflow-hidden transition-all duration-400"
                style={{
                  border: '1px solid rgba(201,161,112,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.borderColor = 'rgba(201,161,112,0.22)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(201,161,112,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(201,161,112,0.08)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${project.featured ? 'aspect-[16/9] sm:aspect-[2/1] lg:aspect-[4/5]' : 'aspect-[4/5]'}`}>
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark gradient */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(10,26,15,0.96) 0%, rgba(10,26,15,0.4) 55%, rgba(10,26,15,0.1) 100%)' }} />

                  {/* Hover accent glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to top, ${project.accent}28, transparent 60%)` }} />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                      style={{
                        background: `${project.accent}15`,
                        color: project.accent,
                        border: `1px solid ${project.accent}28`,
                      }}>
                      {project.category}
                    </span>
                  </div>

                  {/* Arrow on hover */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300 backdrop-blur-sm"
                    style={{ background: 'rgba(201,161,112,0.14)', border: '1px solid rgba(201,161,112,0.22)' }}>
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                      <path d="M5 15L15 5M15 5H7M15 5V13" stroke={GOLD_LIGHT} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    {/* ETH pattern strip at project title */}
                    <div className="absolute top-0 left-5 right-5 h-px eth-divider" />
                    <h3 className="text-base sm:text-xl font-bold leading-tight mb-1 pt-3" style={{ color: '#F0EAD6' }}>
                      {project.name}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 font-light"
                      style={{ color: 'rgba(201,161,112,0.55)' }}>
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

export default OurWork
