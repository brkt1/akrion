import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import teamImage1200 from '../assets/akrion-team-placeholder-1200.webp'
import teamImage768 from '../assets/akrion-team-placeholder-768.webp'

// Replace these two imports with optimized versions of the real Akrion team photo when ready.
const teamImage = {
  src: teamImage1200,
  srcSet: `${teamImage768} 768w, ${teamImage1200} 1200w`,
  alt: 'Ethiopian creative professionals collaborating on design and filming concepts in a studio',
}

const WhoWeAreImage = () => {
  const frameRef = useRef(null)
  const isInView = useInView(frameRef, { once: true, amount: 0.25 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={frameRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative py-1"
    >
      <div className="eth-corner pointer-events-none absolute -left-3 -top-3 h-20 w-20 opacity-40" />
      <div className="eth-corner pointer-events-none absolute -bottom-3 right-4 h-20 w-20 rotate-180 opacity-30" />

      <figure className="who-we-are-image-frame group relative aspect-[3/2] w-full overflow-hidden rounded-[1.35rem] border bg-bg-card sm:rounded-[1.6rem]">
        <img
          src={teamImage.src}
          srcSet={teamImage.srcSet}
          sizes="(min-width: 1400px) 660px, (min-width: 1024px) 45vw, calc(100vw - 2rem)"
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
          alt={teamImage.alt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none"
        />

        <div className="who-we-are-image-overlay pointer-events-none absolute -inset-5" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07160d]/90 via-[#0d1f13]/10 to-[#0d1f13]/20" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/70 to-transparent" />

        <figcaption className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-5 pb-4 pt-14 sm:px-6 sm:pb-5">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-gold shadow-[0_0_12px_rgba(201,161,112,0.5)]" />
          <span className="text-xs font-semibold tracking-[0.08em] text-accent-gold-light sm:text-sm">
            Creativity rooted in culture.
          </span>
        </figcaption>
      </figure>
    </motion.div>
  )
}

export default WhoWeAreImage
