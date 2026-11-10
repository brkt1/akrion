import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { productionPhotos } from '../data/productionPhotos'
import ResponsiveImage from './portfolio/ResponsiveImage'

const teamImage = productionPhotos.onLocation

const WhoWeAreImage = ({ imageUrl, imageAlt }) => {
  const frameRef = useRef(null)
  const isInView = useInView(frameRef, { once: true, amount: 0.25 })
  const shouldReduceMotion = useReducedMotion()
  const image = imageUrl
    ? { src: imageUrl, fallbackSrc: teamImage.srcTiny, alt: imageAlt || 'Akrion Digitals' }
    : { ...teamImage, alt: imageAlt || teamImage.alt }

  return (
    <motion.div
      ref={frameRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={shouldReduceMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative py-1"
    >
      <div className="eth-corner pointer-events-none absolute -left-3 -top-3 h-20 w-20 opacity-40" />
      <div className="eth-corner pointer-events-none absolute -bottom-3 right-4 h-20 w-20 rotate-180 opacity-30" />

      <figure className="who-we-are-image-frame group relative aspect-[3/2] w-full overflow-hidden rounded-[1.35rem] border bg-bg-card sm:rounded-[1.6rem]">
        <ResponsiveImage
          media={image}
          sizes="(min-width: 1400px) 660px, (min-width: 1024px) 45vw, calc(100vw - 2rem)"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none"
          style={{ objectPosition: imageUrl ? 'center' : teamImage.position }}
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
