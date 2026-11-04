import { useEffect, useRef, useState } from 'react'

// A stalled image request does not necessarily fire onError. Recover once the
// image approaches the viewport, without starting timers for off-screen cards.
const RECOVERY_DELAY = 8000

const RecoverableImage = ({ media, className = '', loading = 'lazy', sizes = '100vw', fetchPriority }) => {
  const imageRef = useRef(null)
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const backups = [...new Set([media.fallbackSrc, media.srcSmall].filter((src) => src && src !== media.src))]
  const src = attempt === 0 ? media.src : backups[attempt - 1]
  const srcSet = attempt === 0 && media.srcSmall && media.smallWidth && media.width
    ? `${media.srcSmall} ${media.smallWidth}w, ${media.src} ${media.width}w`
    : undefined

  useEffect(() => {
    const image = imageRef.current
    if (!image || !src || loaded) return undefined
    let timer
    const startRecovery = () => {
      // Do not discard the last usable request just because a connection is
      // slow. Hard failures still receive the accessible unavailable state.
      if (timer || !backups[attempt]) return
      timer = window.setTimeout(() => {
        if (image.complete && image.naturalWidth > 0) setLoaded(true)
        else setAttempt((current) => current + 1)
      }, RECOVERY_DELAY)
    }
    // Cached images can finish before React attaches its load handler.
    if (image.complete && image.naturalWidth > 0) {
      setLoaded(true)
      return undefined
    }
    const observer = loading === 'lazy' && 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) { startRecovery(); observer.disconnect() }
        }, { rootMargin: '600px' })
      : null
    if (observer) observer.observe(image)
    else startRecovery()
    return () => { window.clearTimeout(timer); observer?.disconnect() }
  }, [src, attempt, loading, loaded])

  if (!src) return <span className={`${className} portfolio-image-unavailable`} role="img" aria-label={media.alt || 'Project image unavailable'}><span>Image unavailable</span></span>

  return <img
    ref={imageRef}
    src={src}
    srcSet={srcSet}
    sizes={srcSet ? sizes : undefined}
    width={media.width || undefined}
    height={media.height || undefined}
    alt={media.alt || ''}
    loading={attempt > 0 ? 'eager' : loading}
    fetchpriority={fetchPriority}
    decoding="async"
    className={className}
    data-image-state={loaded ? 'loaded' : 'loading'}
    onLoad={() => setLoaded(true)}
    onError={() => { setLoaded(false); setAttempt((current) => current + 1) }}
    style={{ '--portfolio-case-image-fit': media.fit || 'cover', '--portfolio-case-image-position': media.position || 'center' }}
  />
}

const ResponsiveImage = (props) => props.media?.src
  ? <RecoverableImage key={`${props.media.src}|${props.media.srcSmall || ''}|${props.media.fallbackSrc || ''}`} {...props} />
  : null

export default ResponsiveImage
