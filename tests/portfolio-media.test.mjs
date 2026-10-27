import test from 'node:test'
import assert from 'node:assert/strict'
import { getYouTubeVideoId, getPlayableVideo, safeMediaUrl, normalizeMediaItem, getProjectMedia, getEditableProjectMedia, validateMediaItems, serializeMediaItems, matchesMediaFilter, getMediaCounts } from '../src/data/portfolioMedia.js'

const video = { id: 'test-video', type: 'video', category: 'interview', title: 'Interview', url: 'https://youtu.be/M7lc1UVf-VE', thumbnail: '', alt: '', caption: 'Interview caption', orientation: 'landscape' }
const photo = { id: 'test-photo', type: 'image', category: 'photos', title: 'Production still', url: 'https://example.com/photo.webp', thumbnail: '', alt: 'Production set', caption: '', orientation: 'landscape' }

test('recognizes watch, share, Shorts, live, and privacy-enhanced YouTube links', () => {
  for (const url of ['https://youtu.be/M7lc1UVf-VE?si=abc', 'https://www.youtube.com/watch?v=M7lc1UVf-VE&t=12', 'https://m.youtube.com/shorts/M7lc1UVf-VE', 'https://youtube.com/live/M7lc1UVf-VE', 'https://www.youtube-nocookie.com/embed/M7lc1UVf-VE']) assert.equal(getYouTubeVideoId(url), 'M7lc1UVf-VE')
})
test('rejects spoofed hosts, credentials, malformed IDs, playlists, and executable URLs', () => {
  for (const url of ['https://youtube.com.evil.test/watch?v=M7lc1UVf-VE', 'https://evil.test/youtube.com/M7lc1UVf-VE', 'https://user:pass@youtube.com/watch?v=M7lc1UVf-VE', 'javascript:alert(1)', 'https://youtube.com/playlist?list=abc', 'https://youtube.com/watch?v=too-short']) assert.equal(getYouTubeVideoId(url), '')
})
test('only permits secure media and safe bundled paths', () => {
  for (const url of ['//evil.test/x.png', '/\\evil.test/x', 'data:image/svg+xml,a', 'https://user:pass@example.com/x.png', 'http://example.com/photo.jpg', 'https://example.com/\nimage.jpg']) assert.equal(safeMediaUrl(url), '')
  assert.equal(safeMediaUrl('/assets/photo.webp'), '/assets/photo.webp')
  assert.equal(safeMediaUrl(photo.url), photo.url)
})
test('generates a privacy-enhanced player and supports secure direct video files', () => {
  assert.match(getPlayableVideo(video.url).src, /^https:\/\/www.youtube-nocookie.com\/embed\/M7lc1UVf-VE\?/)
  assert.equal(getPlayableVideo('https://example.com/movie.mp4?token=abc').provider, 'file')
  assert.equal(getPlayableVideo('https://example.com/movie.webm').provider, 'file')
  assert.equal(getPlayableVideo('https://example.com/admin'), null)
})
test('preserves gallery metadata and legacy videos without inventing a video category', () => {
  const result = getProjectMedia({ video_url: video.url, gallery: [{ url: photo.url, alt: 'Original alternative text', caption: 'Original caption' }] }, [], 'Client work')
  assert.equal(result.length, 2)
  assert.equal(result[0].category, '')
  assert.equal(result[1].category, 'photos')
  assert.equal(result[1].caption, 'Original caption')
  assert.equal(result[1].alt, 'Original alternative text')
})
test('an authored collection overrides legacy media, including an intentionally empty list', () => {
  const record = { video_url: video.url, gallery: [{ url: photo.url }], media_items: [] }
  assert.deepEqual(getProjectMedia(record, [photo]), [])
  assert.deepEqual(getEditableProjectMedia(record), [])
  assert.equal(getProjectMedia({ ...record, media_items: [photo] })[0].id, photo.id)
})
test('keeps bundled responsive image metadata when no collection is saved', () => {
  const result = getProjectMedia({}, [{ src: '/assets/image.webp', srcSmall: '/assets/small.webp', width: 1200, smallWidth: 720, height: 800, alt: 'Original image' }])
  assert.equal(result[0].srcSmall, '/assets/small.webp')
  assert.equal(result[0].width, 1200)
})
test('preserves an existing cover in the editor and requires categorizing old video links', () => {
  const items = getEditableProjectMedia({ id: 1, title: 'Existing project', image: photo.url, video_url: video.url })
  assert.equal(items.length, 2)
  assert.equal(items[1].url, photo.url)
  assert.ok(validateMediaItems(items)['mediaItems.0.category'])
  assert.deepEqual(validateMediaItems(items.map((item) => ({ ...item, category: item.type === 'video' ? 'tv-promo' : 'photos' }))), {})
})
test('supports multiple content types in one collection and filters by media rather than project title', () => {
  const project = { title: 'Company work', mediaItems: [normalizeMediaItem(video), normalizeMediaItem(photo)] }
  assert.equal(matchesMediaFilter(project, 'interview'), true)
  assert.equal(matchesMediaFilter(project, 'photos'), true)
  assert.equal(matchesMediaFilter(project, 'reels'), false)
  assert.equal(matchesMediaFilter(project, 'all'), true)
  assert.equal(getMediaCounts(project.mediaItems).interview, 1)
})
test('validates type/category consistency, titles, unique IDs, URLs, orientation, and the item limit', () => {
  assert.ok(validateMediaItems([{ ...video, category: 'photos' }])['mediaItems.0.category'])
  assert.ok(validateMediaItems([{ ...photo, url: video.url }])['mediaItems.0.url'])
  assert.ok(validateMediaItems([{ ...video, title: '' }])['mediaItems.0.title'])
  assert.ok(validateMediaItems([video, video])['mediaItems.1.title'])
  assert.ok(validateMediaItems([{ ...video, orientation: 'bad' }])['mediaItems.0.orientation'])
  assert.ok(validateMediaItems(Array.from({ length: 101 }, () => video)).mediaItems)
})
test('serializes only supported fields without leaking derived playback metadata', () => {
  const [stored] = serializeMediaItems([{ ...video, playback: { unsafe: 'extra' }, unrelated: true }])
  assert.equal(stored.url, 'https://www.youtube.com/watch?v=M7lc1UVf-VE')
  assert.equal(stored.caption, video.caption)
  assert.equal(stored.playback, undefined)
  assert.equal(stored.unrelated, undefined)
  assert.deepEqual(serializeMediaItems([]), [])
})
test('ignores malformed public media safely and handles null legacy gallery entries', () => {
  assert.equal(normalizeMediaItem(null), null)
  assert.deepEqual(getProjectMedia({ media_items: [null, { type: 'video', url: 'javascript:a' }] }), [])
  assert.equal(getProjectMedia({ gallery: [null, photo.url] }).length, 1)
})
