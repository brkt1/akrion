import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { productionPhotos } from '../data/productionPhotos'
import { agencyServiceVisuals } from '../data/agencyVisuals'
import documentaryFilm720 from '../assets/portfolio/documentary-film-720.webp'
import enenTubeSeries600 from '../assets/portfolio/enen-tube-series-600.webp'
import liyuMelketa720 from '../assets/portfolio/liyu-melketa-720.webp'
import useConstrainedConnection from '../lib/useConstrainedConnection'

const SCENE_DURATION = 1800

const stages = ['Discover', 'Define', 'Create', 'Launch']

const scenes = [
  {
    stage: 0,
    label: 'Planning & preparation',
    ...productionPhotos.productionKit,
  },
  {
    stage: 1,
    label: 'Brand identity & applications',
    src: agencyServiceVisuals.brand.large,
    srcSet: `${agencyServiceVisuals.brand.small} 720w, ${agencyServiceVisuals.brand.large} 1200w`,
  },
  {
    stage: 2,
    label: 'Web & digital identity',
    src: agencyServiceVisuals.web.large,
    srcSet: `${agencyServiceVisuals.web.small} 480w, ${agencyServiceVisuals.web.large} 720w`,
  },
  {
    stage: 2,
    label: 'Production & post',
    ...productionPhotos.interviewMonitors,
  },
  {
    stage: 3,
    label: 'Finished brand & digital work',
    montage: [documentaryFilm720, enenTubeSeries600, liyuMelketa720],
  },
]

const ProcessPlaceholder = ({ activeScene, poster, reducedMotion, isInView }) => {
  const [mountedScenes, setMountedScenes] = useState(() => new Set([0]))
  useEffect(() => {
    if (reducedMotion || !isInView) return
    setMountedScenes(current => new Set([...current, activeScene, (activeScene + 1) % scenes.length]))
  }, [activeScene, isInView, reducedMotion])
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
      {scenes.map((scene, index) => mountedScenes.has(index) && (
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
                  fetchpriority={index === activeScene ? 'auto' : 'low'}
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
              width={scene.width || 1200}
              height={scene.height || 900}
              loading="lazy"
              fetchpriority={index === activeScene ? 'auto' : 'low'}
              decoding="async"
              alt=""
              className="creative-process-scene-image"
              style={{ objectPosition: scene.position || 'center' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

const OurCreativeProcess = ({
  className = '',
  poster = productionPhotos.productionKit.srcTiny,
  videoSrc = null,
  videoType = 'video/webm',
}) => {
  const panelRef = useRef(null)
  const videoRef = useRef(null)
  const isInView = useInView(panelRef, { amount: 0.2 })
  const reducedMotion = Boolean(useReducedMotion())
  const constrained = useConstrainedConnection()
  const staticVisual = reducedMotion || constrained
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
    if (videoSrc || staticVisual || !isInView || !pageVisible) return undefined

    const interval = window.setInterval(() => {
      setActiveScene((current) => (current + 1) % scenes.length)
    }, SCENE_DURATION)

    return () => window.clearInterval(interval)
  }, [isInView, pageVisible, staticVisual, videoSrc])

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
        {videoSrc && !staticVisual && hasEntered ? (
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
          <ProcessPlaceholder activeScene={activeScene} poster={poster} reducedMotion={staticVisual} isInView={isInView && pageVisible} />
        )}

        <div className="creative-process-media-pattern eth-pattern" />
        <div className="creative-process-media-overlay" />

        {!staticVisual && (
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
          A visual sequence of real Akrion production photography and project work,
          from preparation through brand identity, digital work, production, and delivery.
        </p>
      </div>
    </motion.article>
  )
}

export default OurCreativeProcess
