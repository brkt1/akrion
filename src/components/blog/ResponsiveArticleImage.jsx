const ResponsiveArticleImage = ({
  media,
  className = '',
  loading = 'lazy',
  sizes = '100vw',
  fetchPriority,
  decorative = false,
}) => {
  if (!media?.src) return null

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
      alt={decorative ? '' : media.alt || ''}
      aria-hidden={decorative ? 'true' : undefined}
      loading={loading}
      fetchpriority={fetchPriority}
      decoding="async"
      className={className}
      style={{ objectPosition: media.position || 'center' }}
    />
  )
}

export default ResponsiveArticleImage

