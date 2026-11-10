import { useEffect, useState } from 'react'
import { getMediaCategoryLabel, getMediaCounts } from '../../data/portfolioMedia'
import { getProductionPhotoForUrl } from '../../data/productionPhotos'
import MediaFilters from './MediaFilters'
import MediaViewer from './MediaViewer'
import ResponsiveImage from './ResponsiveImage'

const MediaThumbnail = ({ item }) => {
  const [failed, setFailed] = useState(false)
  const src = item.type === 'video' ? item.thumbnail : item.thumbnail || item.src
  useEffect(() => { setFailed(false) }, [src])
  if (item.type === 'image' && src) {
    const photo = getProductionPhotoForUrl(item.src)
    return <ResponsiveImage media={{
      src, alt: item.alt, width: item.width || photo?.width, height: item.height || photo?.height,
      fallbackSrc: photo?.fallbackSrc || (src !== item.src ? item.src : undefined),
    }} className="portfolio-case-gallery-image" />
  }
  return src && !failed ? <img src={src} alt="" onError={() => setFailed(true)} className="portfolio-case-gallery-image" loading="lazy" decoding="async" /> : <span className="portfolio-media-thumbnail-fallback" aria-hidden="true">{item.title.charAt(0)}</span>
}

const ProjectGallery = ({ items = [], projectTitle, initialFilter = 'all' }) => {
  const [filter, setFilter] = useState(initialFilter)
  const [activeIndex, setActiveIndex] = useState(null)
  const visibleItems = items.filter((item) => filter === 'all' || item.category === filter)
  const selectFilter = (next) => { setActiveIndex(null); setFilter(next) }
  if (!items.length) return null
  return <>
    <MediaFilters value={filter} onChange={selectFilter} counts={getMediaCounts(items)} total={items.length} label={`Filter ${projectTitle} media`} />
    <p className="portfolio-media-results" role="status">{visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}{filter !== 'all' ? ` · ${getMediaCategoryLabel(filter)}` : ''}</p>
    {!visibleItems.length && <div className="portfolio-media-empty"><p>No matching media in this collection.</p><button type="button" onClick={() => selectFilter('all')}>Show all media</button></div>}
    <div className="portfolio-case-gallery" role="group" aria-label={`${projectTitle} project gallery`}>
      {visibleItems.map((item, index) => <figure key={item.id} className="portfolio-case-gallery-item" data-media-type={item.type} data-layout={item.orientation === 'portrait' ? 'portrait' : item.layout || 'standard'}>
        <button type="button" className="portfolio-case-gallery-trigger portfolio-collection-media-trigger group" aria-label={`${item.type === 'video' ? 'Watch' : 'View'} ${item.title}`} onClick={() => setActiveIndex(index)}>
          <MediaThumbnail item={item} />
          <span className="portfolio-collection-media-play" aria-hidden="true">{item.type === 'video' ? '▶' : '↗'}</span>
          <span className="portfolio-collection-media-label">{getMediaCategoryLabel(item.category)}</span>
        </button>
        <figcaption><strong>{item.title}</strong>{item.caption && <span>{item.caption}</span>}</figcaption>
      </figure>)}
    </div>
    <MediaViewer items={visibleItems} activeIndex={activeIndex} onChange={setActiveIndex} onClose={() => setActiveIndex(null)} projectTitle={projectTitle} />
  </>
}
export { ResponsiveImage }
export default ProjectGallery
