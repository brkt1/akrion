import { useEffect, useId, useRef } from 'react'
import { getMediaCategoryLabel, getYouTubeVideoId, MEDIA_RATIOS } from '../../data/portfolioMedia'
import './portfolioMedia.css'

const MediaViewer = ({ items = [], activeIndex = null, onChange, onClose, projectTitle }) => {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const previousFocus = useRef(null)
  const titleId = useId()
  const isOpen = activeIndex != null && Boolean(items[activeIndex])
  const active = isOpen ? items[activeIndex] : null
  const youtubeId = active?.playback?.provider === 'youtube' ? getYouTubeVideoId(active.url) : ''
  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return undefined
    previousFocus.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      const trigger = previousFocus.current
      window.requestAnimationFrame(() => { if (trigger?.isConnected) trigger.focus({ preventScroll: true }) })
    }
  }, [isOpen])
  const move = (offset) => onChange((activeIndex + offset + items.length) % items.length)
  return (
    <dialog ref={dialogRef} className="portfolio-media-viewer" data-media-type={active?.type} style={{ '--media-ratio': MEDIA_RATIOS[active?.orientation] || '16 / 9' }} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }} onKeyDown={(event) => {
      if (['INPUT', 'TEXTAREA', 'VIDEO', 'IFRAME'].includes(event.target.tagName)) return
      if (items.length > 1 && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1) }
    }}>
      <div className="portfolio-media-viewer-header">
        <div><p>{projectTitle}</p><h2 id={titleId}>{active?.title || 'Project media'}</h2></div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close media viewer">✕</button>
      </div>
      {active && <div className="portfolio-media-viewer-stage" key={active.id}>
        {active.type === 'image' ? <img src={active.src} alt={active.alt} decoding="async" /> : active.playback?.provider === 'youtube' ? (
          <div className="portfolio-media-embed"><iframe src={active.playback.src} title={active.title} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        ) : <video src={active.playback?.src} poster={active.thumbnail || undefined} controls autoPlay playsInline preload="metadata" aria-label={active.title} />}
      </div>}
      <div className="portfolio-media-viewer-footer">
        <div>
          <span>{active && getMediaCategoryLabel(active.category)}</span>
          {active?.caption && <p>{active.caption}</p>}
          {youtubeId && <p className="portfolio-media-quality">
            Use the player’s Settings → Quality when available. <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer">Open on YouTube<span className="sr-only"> (opens in a new tab)</span></a>
          </p>}
        </div>
        <div className="portfolio-media-viewer-controls">
          {items.length > 1 && <button type="button" aria-label="Show previous media" onClick={() => move(-1)}>←</button>}
          <span aria-live="polite">{isOpen ? `${activeIndex + 1} / ${items.length}` : ''}</span>
          {items.length > 1 && <button type="button" aria-label="Show next media" onClick={() => move(1)}>→</button>}
        </div>
      </div>
    </dialog>
  )
}
export default MediaViewer
