import { useState } from 'react'
import { getMediaCategoryLabel, getPlayableVideo, MAX_PROJECT_MEDIA, MEDIA_CATEGORIES, normalizeMediaItem, safeMediaUrl } from '../../data/portfolioMedia'
import { uploadAPI } from '../../lib/api/upload'
import MediaViewer from '../portfolio/MediaViewer'
import { AdminField } from './AdminUi'

const PortfolioMediaEditor = ({ items, onChange, errors = {}, disabled = false, onBusy }) => {
  const [uploadError, setUploadError] = useState(null)
  const [preview, setPreview] = useState(null)
  const update = (id, field, value) => onChange(items.map((item) => item.id === id ? { ...item, [field]: value, ...(field === 'category' && value === 'reels' ? { orientation: 'portrait' } : {}) } : item))
  const add = (type) => onChange([...items, { id: crypto.randomUUID(), type, category: type === 'image' ? 'photos' : '', title: '', url: '', thumbnail: '', alt: '', caption: '', orientation: 'landscape' }])
  const move = (index, offset) => {
    const next = [...items]
    ;[next[index], next[index + offset]] = [next[index + offset], next[index]]
    onChange(next)
  }
  const upload = async (event, item) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadError(null)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setUploadError({ id: item.id, message: 'Use a JPEG, PNG, or WebP image up to 5 MB.' })
      event.target.value = ''; return
    }
    onBusy(true)
    try {
      const url = await uploadAPI.uploadImage(file, 'portfolio')
      onChange(items.map((current) => current.id === item.id ? { ...current, [item.type === 'image' ? 'url' : 'thumbnail']: url, title: current.title || file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ') } : current))
    } catch { setUploadError({ id: item.id, message: 'Upload failed. Check your connection and try again.' }) }
    finally { onBusy(false); event.target.value = '' }
  }
  return <section className="admin-portfolio-media" aria-label="Collection videos and photos">
    <div className="admin-portfolio-media-intro"><h4>Videos &amp; photos in this collection</h4><p>Add multiple items and tag each one. These content types drive the public filters. Video playback stays on your website.</p><p>For YouTube, use an Unlisted or Public video with embedding allowed. Private videos cannot be watched by ordinary visitors.</p></div>
    {errors.mediaItems && <p className="admin-field-error" role="alert">{errors.mediaItems}</p>}
    {!items.length && <p className="admin-portfolio-media-empty">No media items yet. The cover image above still appears on your portfolio card.</p>}
    <ol className="admin-portfolio-media-list">
      {items.map((item, index) => {
        const prefix = `mediaItems.${index}`
        const fieldId = (name) => `project-${prefix}.${name}`
        const thumbnail = item.type === 'image' ? safeMediaUrl(item.url) : safeMediaUrl(item.thumbnail) || getPlayableVideo(item.url)?.thumbnail
        const playable = normalizeMediaItem(item, index)
        return <li key={item.id} className="admin-portfolio-media-item">
          <div className="admin-portfolio-media-heading"><strong>{index + 1}. {item.title || (item.type === 'image' ? 'New photo' : 'New video')}</strong><span>{getMediaCategoryLabel(item.category)}</span></div>
          <fieldset disabled={disabled}>
            <div className="admin-form-grid admin-form-grid--two">
              <AdminField label="Media title" htmlFor={fieldId('title')} required error={errors[`${prefix}.title`]}><input id={fieldId('title')} value={item.title} maxLength={200} onChange={(event) => update(item.id, 'title', event.target.value)} /></AdminField>
              <AdminField label="Content type" htmlFor={fieldId('category')} required error={errors[`${prefix}.category`]}><select id={fieldId('category')} value={item.category} onChange={(event) => update(item.id, 'category', event.target.value)}><option value="">Choose a type</option>{MEDIA_CATEGORIES.filter((category) => item.type === 'image' ? category.id === 'photos' : category.id !== 'photos').map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></AdminField>
            </div>
            <AdminField label={item.type === 'video' ? 'YouTube or video URL' : 'Photo URL'} htmlFor={fieldId('url')} required error={errors[`${prefix}.url`]} help={item.type === 'video' ? 'Paste a YouTube watch, share, Shorts, or live link; secure MP4/WebM URLs also work.' : 'Upload a photo below or paste its secure image URL.'}><input id={fieldId('url')} type="url" value={item.url} maxLength={2048} onChange={(event) => update(item.id, 'url', event.target.value)} placeholder={item.type === 'video' ? 'https://www.youtube.com/watch?v=…' : 'https://…'} /></AdminField>
            {item.type === 'video' && <AdminField label="Custom thumbnail URL" htmlFor={fieldId('thumbnail')} optional error={errors[`${prefix}.thumbnail`]} help="Leave blank to use the YouTube thumbnail, or upload your own below."><input id={fieldId('thumbnail')} type="url" value={item.thumbnail} onChange={(event) => update(item.id, 'thumbnail', event.target.value)} /></AdminField>}
            <div className="admin-portfolio-media-preview-row">
              {thumbnail && <img src={thumbnail} alt="Media thumbnail preview" loading="lazy" decoding="async" />}
              <AdminField label={item.type === 'image' ? 'Upload photo' : 'Upload custom thumbnail'} htmlFor={fieldId('upload')} help="JPEG, PNG, or WebP · maximum 5 MB." error={uploadError?.id === item.id ? uploadError.message : undefined}><input id={fieldId('upload')} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => upload(event, item)} /></AdminField>
            </div>
            <div className="admin-form-grid admin-form-grid--two">
              <AdminField label="Orientation" htmlFor={fieldId('orientation')} error={errors[`${prefix}.orientation`]}><select id={fieldId('orientation')} value={item.orientation} onChange={(event) => update(item.id, 'orientation', event.target.value)}><option value="landscape">Landscape · 16:9</option><option value="portrait">Portrait · 9:16</option><option value="square">Square · 1:1</option></select></AdminField>
              <AdminField label="Alternative text" htmlFor={fieldId('alt')} optional error={errors[`${prefix}.alt`]} help="Describe what the photo shows. The title is used when this is blank."><input id={fieldId('alt')} value={item.alt} maxLength={500} onChange={(event) => update(item.id, 'alt', event.target.value)} /></AdminField>
            </div>
            <AdminField label="Caption" htmlFor={fieldId('caption')} optional error={errors[`${prefix}.caption`]}><textarea id={fieldId('caption')} rows="2" value={item.caption} maxLength={1000} onChange={(event) => update(item.id, 'caption', event.target.value)} /></AdminField>
            <div className="admin-portfolio-media-actions">
              <button type="button" className="admin-button admin-button--secondary" disabled={!playable} onClick={() => setPreview(playable)}>Preview</button>
              <button type="button" aria-label={`Move item ${index + 1} up`} disabled={!index} onClick={() => move(index, -1)}>↑</button>
              <button type="button" aria-label={`Move item ${index + 1} down`} disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</button>
              <button type="button" className="admin-portfolio-media-remove" onClick={() => onChange(items.filter((current) => current.id !== item.id))}>Remove item</button>
            </div>
          </fieldset>
        </li>
      })}
    </ol>
    <div className="admin-portfolio-media-add"><button type="button" className="admin-button admin-button--secondary" onClick={() => add('video')} disabled={disabled || items.length >= MAX_PROJECT_MEDIA}>+ Add video</button><button type="button" className="admin-button admin-button--secondary" onClick={() => add('image')} disabled={disabled || items.length >= MAX_PROJECT_MEDIA}>+ Add photo</button><small>{items.length} / {MAX_PROJECT_MEDIA} items · Changes take effect when you save the collection. Removing an item does not delete its uploaded file.</small></div>
    <MediaViewer items={preview ? [preview] : []} activeIndex={preview ? 0 : null} onChange={() => {}} onClose={() => setPreview(null)} projectTitle="Media preview" />
  </section>
}
export default PortfolioMediaEditor
