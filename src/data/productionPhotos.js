// Owner-supplied Akrion BTS photography. Originals remain untouched; these
// responsive WebP derivatives contain no EXIF/GPS metadata or generated content.
const photo = (id, title, alt, height = 1600, position = 'center') => ({
  id, title, alt, position,
  src: `/images/production/akrion-bts-${id}-1200.webp`,
  srcSmall: `/images/production/akrion-bts-${id}-720.webp`,
  small: `/images/production/akrion-bts-${id}-720.webp`,
  large: `/images/production/akrion-bts-${id}-1200.webp`,
  width: 1200, height, smallWidth: 720, largeWidth: 1200,
  srcSet: `/images/production/akrion-bts-${id}-720.webp 720w, /images/production/akrion-bts-${id}-1200.webp 1200w`,
})

export const productionPhotos = {
  onLocation: photo('on-location', 'On location', 'Camera operator holding a gimbal-mounted camera outdoors during an Akrion production', 2133, 'center 43%'),
  interviewSet: photo('interview-set', 'Interview setup', 'Camera and external monitor framing a seated interview subject on an Akrion production set', 1600, 'center 38%'),
  interviewMonitors: photo('interview-monitors', 'Behind the monitors', 'Camera displays showing an interview composition and exposure scopes during production', 1600, 'center 54%'),
  productionKit: photo('production-kit', 'Ready for production', 'Three cameras and gimbal rigs prepared together on a table', 1600, 'center 44%'),
  warmLighting: photo('warm-lighting', 'Light and framing', 'A camera rig and external monitor beside a warm amber production light', 1600, 'center 46%'),
  sceneSetup: photo('scene-setup', 'Setting the scene', 'A camera framing a group scene around a table during an Akrion production', 1600, 'center 43%'),
  sceneMonitor: photo('scene-monitor', 'A closer look at the frame', 'Close-up of a camera monitor framing a seated person during scene preparation', 1600, 'center 65%'),
  eventCoverage: photo('event-coverage', 'Coverage in progress', 'Camera recording a ceremony in an ornate interior', 1600, 'center 52%'),
  ceremonyCamera: photo('ceremony-camera', 'Through the viewfinder', 'A camera and its monitor recording a gathering with seated participants', 2133, 'center 53%'),
  interviewCloseup: photo('interview-closeup', 'Checking the composition', 'An external monitor showing a seated interview subject with camera exposure scopes', 2133, 'center 48%'),
  portraitSet: photo('portrait-set', 'On the interview set', 'A seated subject facing a camera under warm and blue production lighting', 2133, 'center 56%'),
}

export const productionGallery = [
  productionPhotos.onLocation, productionPhotos.interviewSet,
  productionPhotos.interviewMonitors, productionPhotos.productionKit,
  productionPhotos.warmLighting, productionPhotos.sceneSetup,
  productionPhotos.sceneMonitor, productionPhotos.eventCoverage,
  productionPhotos.ceremonyCamera, productionPhotos.interviewCloseup,
  productionPhotos.portraitSet,
]

export const productionCollection = {
  slug: 'behind-the-scenes-at-akrion',
  title: 'Behind the Scenes at Akrion',
  description: 'A look behind the lens: camera preparation, interview setups, filming on location, and event coverage from Akrion productions.',
}

// Preserve responsive dimensions/focal points when these same photos are
// selected from the CMS image library. Unknown/custom uploads are untouched.
export const getProductionPhotoForUrl = (value) => {
  try {
    const url = new URL(value, 'https://www.akriondigitals.com')
    if (url.username || url.password || ![
      'https://www.akriondigitals.com', 'https://akriondigitals.com',
      'https://akrion-digitals.vercel.app', 'https://gavhkkrnsuisqsjnnaow.supabase.co',
    ].includes(url.origin)) return null
    const allowedDirectory = /^\/(?:images\/production|storage\/v1\/object\/public\/images\/portfolio)\/[^/]+$/
    if (!allowedDirectory.test(url.pathname)) return null
    const match = productionGallery.find((photo) => url.pathname.endsWith(`/${photo.src.split('/').pop()}`))
    if (!match) return null
    const small = new URL(url.href)
    small.pathname = small.pathname.replace('-1200.webp', '-720.webp')
    // The same optimized photograph is hosted on both owned services. If one
    // image CDN stalls, the portfolio can recover from the other without
    // substituting unrelated work or altering the owner's chosen cover.
    const fallbackSrc = url.origin === 'https://gavhkkrnsuisqsjnnaow.supabase.co'
      ? match.srcSmall
      : `https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/${match.srcSmall.split('/').pop()}`
    return { ...match, src: value, srcSmall: String(value).startsWith('/') ? small.pathname : small.href, fallbackSrc }
  } catch { return null }
}
