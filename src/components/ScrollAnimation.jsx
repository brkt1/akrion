import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import React, { useRef } from 'react'

const ScrollAnimation = ({ 
  children, 
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  amount = 0.3
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount })

  // Animation variants
  const animations = {
    fadeUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0 }
    },
    fadeDown: {
      hidden: { opacity: 0, y: -60 },
      visible: { opacity: 1, y: 0 }
    },
    fadeLeft: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0 }
    },
    fadeRight: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    blur: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)' }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -10, scale: 0.9 },
      visible: { opacity: 1, rotate: 0, scale: 1 }
    },
    slide: {
      hidden: { opacity: 0, x: 100 },
      visible: { opacity: 1, x: 0 }
    }
  }

  const selectedAnimation = animations[animation] || animations.fadeUp

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedAnimation}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Smooth easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax component for depth effect
export const ParallaxSection = ({ children, className = '', speed = 0.5 }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// Scroll progress indicator
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[9999] origin-left"
      style={{ scaleX }}
    >
      <div className="h-full w-full bg-gradient-to-r from-accent-orange via-purple-500 to-cyan-500 shadow-lg shadow-accent-orange/50" />
    </motion.div>
  )
}

// Stagger container for animating children
export const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger item for use inside StaggerContainer
export const StaggerItem = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScrollAnimation

