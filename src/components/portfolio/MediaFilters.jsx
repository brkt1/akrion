import { MEDIA_CATEGORIES } from '../../data/portfolioMedia'
import './portfolioMedia.css'

const MediaFilters = ({ value = 'all', onChange, counts = {}, total = 0, label = 'Filter by content type' }) => (
  <div className="portfolio-media-filters" role="group" aria-label={label}>
    {[{ id: 'all', label: 'All' }, ...MEDIA_CATEGORIES].map((category) => (
      <button key={category.id} type="button" aria-pressed={value === category.id} onClick={() => onChange(category.id)} disabled={category.id !== 'all' && !counts[category.id] && value !== category.id}>
        {category.label}<span aria-hidden="true">{category.id === 'all' ? total : counts[category.id] || 0}</span>
      </button>
    ))}
  </div>
)
export default MediaFilters
