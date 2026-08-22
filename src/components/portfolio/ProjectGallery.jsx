import { useEffect, useId, useRef, useState } from 'react'

const ResponsiveImage = ({ media, className = '', loading = 'lazy', sizes = '100vw', fetchPriority }) => {
  const srcSet = media.srcSmall && media.smallWidth && media.width
    ? `${media.srcSmall} ${media.smallWidth}w, ${media.src} ${media.width}w`
    : undefined

  return (
    <img
      src={media.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={media.width || undefined}
      height={media.height || undefined}
      alt={media.alt}
      loading={loading}
      fetchpriority={fetchPriority}
      decoding="async"
      className={className}
      style={{
        '--portfolio-case-image-fit': media.fit || 'cover',
        '--portfolio-case-image-position': media.position || 'center',
      }}
    />
  )
}

const CloseIcon = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const ChevronIcon = ({ direction }) => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d={direction === 'previous' ? 'M15 5L8 12L15 19' : 'M9 5L16 12L9 19'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ProjectGallery = ({ items = [], projectTitle }) => {
  const [activeIndex, setActiveIndex] = useState(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const titleId = useId()
  const activeItem = activeIndex == null ? null : items[activeIndex]
  const isOpen = activeIndex != null

  const restoreTriggerFocus = () => {
    const trigger = triggerRef.current
    triggerRef.current = null
    window.requestAnimationFrame(() => trigger?.focus())
  }

  const closeLightbox = () => {
    const dialog = dialogRef.current
    if (dialog?.open) dialog.close()
    setActiveIndex(null)
    restoreTriggerFocus()
  }

  const openLightbox = (index, trigger) => {
    triggerRef.current = trigger
    setActiveIndex(index)
  }

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length)
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % items.length)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return undefined

    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeLightbox()
        return
      }
      if (items.length < 2) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPrevious()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        showNext()
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, items.length])

  useEffect(
    () => () => {
      document.body.style.overflow = ''
    },
    [],
  )

  if (!items.length) return null

  return (
    <>
      <div className="portfolio-case-gallery" role="group" aria-label={`${projectTitle} project gallery`}>
        {items.map((item, index) => (
          <figure
            key={item.id || item.src}
            className="portfolio-case-gallery-item"
            data-layout={item.layout || 'standard'}
            style={{
              '--portfolio-media-ratio': item.width && item.height
                ? `${item.width} / ${item.height}`
                : '16 / 10',
            }}
          >
            <button
              type="button"
              className="portfolio-case-gallery-trigger group"
              aria-label={`Open ${item.alt} full screen`}
              onClick={(event) => openLightbox(index, event.currentTarget)}
            >
              <ResponsiveImage
                media={item}
                sizes="(min-width: 900px) 78vw, 100vw"
                className="portfolio-case-gallery-image"
              />
              <span className="portfolio-case-gallery-expand" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M8 3H3V8M16 3H21V8M21 16V21H16M8 21H3V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="portfolio-case-lightbox"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault()
          closeLightbox()
        }}
        onClose={() => {
          setActiveIndex(null)
          document.body.style.overflow = ''
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeLightbox()
        }}
      >
        <h2 id={titleId} className="sr-only">
          {projectTitle} project image viewer
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          className="portfolio-case-lightbox-control portfolio-case-lightbox-close"
          aria-label="Close full-screen image"
          onClick={closeLightbox}
        >
          <CloseIcon />
        </button>

        {items.length > 1 && (
          <>
            <button
              type="button"
              className="portfolio-case-lightbox-control portfolio-case-lightbox-previous"
              aria-label="Show previous project image"
              onClick={showPrevious}
            >
              <ChevronIcon direction="previous" />
            </button>
            <button
              type="button"
              className="portfolio-case-lightbox-control portfolio-case-lightbox-next"
              aria-label="Show next project image"
              onClick={showNext}
            >
              <ChevronIcon direction="next" />
            </button>
          </>
        )}

        {activeItem && (
          <figure className="portfolio-case-lightbox-figure">
            <img
              src={activeItem.src}
              width={activeItem.width || undefined}
              height={activeItem.height || undefined}
              alt={activeItem.alt}
              decoding="async"
            />
            {activeItem.caption && <figcaption>{activeItem.caption}</figcaption>}
          </figure>
        )}

        <p className="portfolio-case-lightbox-count" aria-live="polite">
          {activeIndex == null ? '' : `${activeIndex + 1} of ${items.length}`}
        </p>
      </dialog>
    </>
  )
}

export { ResponsiveImage }
export default ProjectGallery
