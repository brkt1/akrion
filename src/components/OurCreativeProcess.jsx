import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import brandIdentity1200 from '../assets/services/service-brand-identity-1200.webp'
import brandIdentity720 from '../assets/services/service-brand-identity-720.webp'
import creativeConsulting1200 from '../assets/services/service-creative-consulting-1200.webp'
import creativeConsulting720 from '../assets/services/service-creative-consulting-720.webp'
import videoMotion1200 from '../assets/services/service-video-motion-1200.webp'
import videoMotion720 from '../assets/services/service-video-motion-720.webp'
import webDevelopment1200 from '../assets/services/service-web-development-1200.webp'
import webDevelopment720 from '../assets/services/service-web-development-720.webp'
import documentaryFilm720 from '../assets/portfolio/documentary-film-720.webp'
import enenTubeSeries600 from '../assets/portfolio/enen-tube-series-600.webp'
import liyuMelketa720 from '../assets/portfolio/liyu-melketa-720.webp'

const SCENE_DURATION = 1800

const stages = ['Discover', 'Define', 'Create', 'Launch']

const scenes = [
  {
    stage: 0,
    label: 'Research & brainstorming',
    src: creativeConsulting1200,
    srcSet: `${creativeConsulting720} 720w, ${creativeConsulting1200} 1200w`,
  },
  {
    stage: 1,
    label: 'Moodboards · Color · Type',
    src: brandIdentity1200,
    srcSet: `${brandIdentity720} 720w, ${brandIdentity1200} 1200w`,
  },
  {
    stage: 2,
    label: 'Web & interface design',
    src: webDevelopment1200,
    srcSet: `${webDevelopment720} 720w, ${webDevelopment1200} 1200w`,
  },
  {
    stage: 2,
    label: 'Production & post',
    src: videoMotion1200,
    srcSet: `${videoMotion720} 720w, ${videoMotion1200} 1200w`,
  },
  {
    stage: 3,
    label: 'Finished brand & digital work',
    montage: [documentaryFilm720, enenTubeSeries600, liyuMelketa720],
  },
]

const ProcessPlaceholder = ({ activeScene, poster, reducedMotion }) => {
  if (reducedMotion) {
    return (
      <img
        src={poster}
        width="720"
        height="480"
        loading="lazy"
        decoding="async"
        alt=""
        className="creative-process-static-poster"
      />
    )
  }

  return (
    <div className="creative-process-scenes" aria-hidden="true">
      {scenes.map((scene, index) => (
        <div
          key={scene.label}
          className="creative-process-scene"
          data-active={index === activeScene}
        >
          {scene.montage ? (
            <div className="creative-process-montage">
              {scene.montage.map((src, montageIndex) => (
                <img
                  key={src}
                  src={src}
                  loading="lazy"
                  decoding="async"
                  alt=""
                  className={`creative-process-montage-image creative-process-montage-image--${montageIndex + 1}`}
                />
              ))}
            </div>
          ) : (
            <img
              src={scene.src}
              srcSet={scene.srcSet}
              sizes="(min-width: 1024px) 45vw, calc(100vw - 2rem)"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
              alt=""
              className="creative-process-scene-image"
            />
          )}
        </div>
      ))}
    </div>
  )
}

const OurCreativeProcess = ({
  className = '',
  poster = creativeConsulting720,
  videoSrc = null,
  videoType = 'video/webm',
}) => {
  const panelRef = useRef(null)
  const videoRef = useRef(null)
  const isInView = useInView(panelRef, { amount: 0.2 })
  const reducedMotion = Boolean(useReducedMotion())
  const [activeScene, setActiveScene] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)
  const [pageVisible, setPageVisible] = useState(
    typeof document === 'undefined' ? true : !document.hidden,
  )

  useEffect(() => {
    if (isInView) setHasEntered(true)
  }, [isInView])

  useEffect(() => {
    const handleVisibilityChange = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    if (videoSrc || reducedMotion || !isInView || !pageVisible) return undefined

    const interval = window.setInterval(() => {
      setActiveScene((current) => (current + 1) % scenes.length)
    }, SCENE_DURATION)

    return () => window.clearInterval(interval)
  }, [isInView, pageVisible, reducedMotion, videoSrc])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion) return undefined

    video.muted = true
    if (isInView && pageVisible) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }

    return undefined
  }, [isInView, pageVisible, reducedMotion, hasEntered])

  const handleVideoTimeUpdate = (event) => {
    const { currentTime, duration } = event.currentTarget
    if (!Number.isFinite(duration) || duration <= 0) return
    const stage = Math.min(stages.length - 1, Math.floor((currentTime / duration) * stages.length))
    setActiveScene(stage)
  }

  const activeStage = videoSrc
    ? Math.min(stages.length - 1, activeScene)
    : scenes[activeScene].stage
  const progress = reducedMotion ? 100 : (activeStage / (stages.length - 1)) * 100

  return (
    <motion.article
      ref={panelRef}
      aria-labelledby="creative-process-title"
      aria-describedby="creative-process-visual-description"
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      animate={reducedMotion || hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      className={`creative-process-panel ${className}`}
      data-reduced-motion={reducedMotion}
      data-stage={activeStage}
      style={{ '--creative-process-progress': `${progress}%` }}
    >
      <div className="creative-process-media">
        {videoSrc && !reducedMotion && hasEntered ? (
          <video
            ref={videoRef}
            className="creative-process-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onTimeUpdate={handleVideoTimeUpdate}
            aria-hidden="true"
          >
            <source src={videoSrc} type={videoType} />
          </video>
        ) : (
          <ProcessPlaceholder activeScene={activeScene} poster={poster} reducedMotion={reducedMotion} />
        )}

        <div className="creative-process-media-pattern eth-pattern" />
        <div className="creative-process-media-overlay" />

        {!reducedMotion && (
          <span className="creative-process-scene-label" aria-hidden="true">
            {videoSrc ? stages[activeStage] : scenes[activeScene].label}
          </span>
        )}

        <div className="creative-process-heading">
          <p>OUR PROCESS</p>
          <h3 id="creative-process-title">From Idea to Impact.</h3>
        </div>
      </div>

      <div className="creative-process-body">
        <ol className="creative-process-timeline" aria-label="Discover → Define → Create → Launch">
          <li className="creative-process-track" aria-hidden="true">
            <span className="creative-process-track-progress" />
          </li>
          {stages.map((stage, index) => (
            <li
              key={stage}
              className="creative-process-stage"
              data-active={reducedMotion || index === activeStage}
              data-complete={reducedMotion || index < activeStage}
              aria-current={!reducedMotion && index === activeStage ? 'step' : undefined}
            >
              <span className="creative-process-point" aria-hidden="true" />
              <span>{stage}</span>
            </li>
          ))}
        </ol>

        <p id="creative-process-visual-description" className="sr-only">
          A visual sequence showing Akrion&apos;s process from research and moodboards through
          interface design, production, and finished brand work.
        </p>
      </div>
    </motion.article>
  )
}

export default OurCreativeProcess
