import brandIdentity1200 from '../assets/services/service-brand-identity-1200.webp'
import brandIdentity720 from '../assets/services/service-brand-identity-720.webp'
import creativeConsulting1200 from '../assets/services/service-creative-consulting-1200.webp'
import creativeConsulting720 from '../assets/services/service-creative-consulting-720.webp'
import socialMedia1200 from '../assets/services/service-social-media-1200.webp'
import socialMedia720 from '../assets/services/service-social-media-720.webp'
import videoMotion1200 from '../assets/services/service-video-motion-1200.webp'
import videoMotion720 from '../assets/services/service-video-motion-720.webp'
import webDevelopment1200 from '../assets/services/service-web-development-1200.webp'
import webDevelopment720 from '../assets/services/service-web-development-720.webp'

export const serviceStories = [
  {
    id: 'brand-identity',
    number: '01',
    title: 'Brand Identity',
    description: 'Distinctive identities built to make your business clear, consistent, and memorable.',
    included: ['Strategy', 'Logo design', 'Visual identity', 'Guidelines', 'Packaging', 'Brand applications'],
    recordAliases: ['brand identity', 'branding'],
    recordIcon: 'Branding',
    image: {
      small: brandIdentity720,
      large: brandIdentity1200,
      width: 1200,
      height: 800,
      position: 'center 48%',
      alt: 'Brand identity and packaging presentation arranged in Akrion’s emerald and gold palette',
    },
  },
  {
    id: 'web-applications',
    number: '02',
    title: 'Web & Applications',
    description: 'Responsive digital experiences designed around your users and business goals.',
    included: ['Websites', 'Landing pages', 'Web applications', 'UI/UX', 'Ongoing support'],
    recordAliases: ['web & applications', 'web applications', 'website design', 'development'],
    recordIcon: 'Development',
    image: {
      small: webDevelopment720,
      large: webDevelopment1200,
      width: 1200,
      height: 800,
      position: '58% center',
      alt: 'Responsive website and application interfaces displayed across desktop and mobile devices',
    },
  },
  {
    id: 'video-motion-photography',
    number: '03',
    title: 'Video, Motion & Photography',
    description: 'Visual stories produced to capture attention, communicate clearly, and remain memorable.',
    included: ['Video production', 'Motion graphics', 'Photography', 'Documentaries', 'Event coverage'],
    recordAliases: ['video, motion & photography', 'videos', 'video'],
    recordIcon: 'Video',
    image: {
      small: videoMotion720,
      large: videoMotion1200,
      width: 1200,
      height: 800,
      position: '58% center',
      alt: 'Cinematic video-production and motion-design editing workspace',
    },
  },
  {
    id: 'social-media-advertising',
    number: '04',
    title: 'Social Media & Advertising',
    description: 'Content and campaigns designed to build visibility, engagement, and meaningful action.',
    included: ['Strategy', 'Content production', 'Account management', 'Organic campaigns', 'Paid advertising'],
    recordAliases: ['social media & advertising', 'social media'],
    recordIcon: 'Social Media',
    image: {
      small: socialMedia720,
      large: socialMedia1200,
      width: 1200,
      height: 800,
      position: '60% center',
      alt: 'Coordinated social-media campaign with post, carousel, and Reel compositions',
    },
  },
  {
    id: 'creative-consulting',
    number: '05',
    title: 'Creative Consulting',
    description: 'Practical creative direction for businesses that need clarity before execution.',
    included: ['Brand audits', 'Campaign planning', 'Creative strategy', 'Digital guidance'],
    recordAliases: ['creative consulting', 'consulting'],
    recordIcon: 'Consulting',
    image: {
      small: creativeConsulting720,
      large: creativeConsulting1200,
      width: 1200,
      height: 800,
      position: 'center 46%',
      alt: 'Creative strategy workspace with moodboards, sketches, colors, and material studies',
    },
  },
]

const clean = (value) => String(value || '').trim().toLowerCase()

export const findServiceRecord = (story, records = []) => records.find((record) => {
  if (record.slug && clean(record.slug) === story.id) return true
  if (record.icon && clean(record.icon) === clean(story.recordIcon)) return true
  return story.recordAliases.includes(clean(record.title))
})

const parseDeliverables = (value) => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean)
  if (typeof value !== 'string') return []
  return value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean)
}

export const mergeServiceStories = (records = []) => serviceStories.map((story) => {
  const record = findServiceRecord(story, records)
  if (!record || record.status === 'draft' || record.archived_at) return story

  const titleIsLegacyAlias = story.recordAliases.includes(clean(record.title))
  const deliverables = parseDeliverables(record.deliverables)
  const mainImage = record.main_image || ''

  return {
    ...story,
    title: titleIsLegacyAlias ? story.title : String(record.title || story.title).trim(),
    description: String(record.description || story.description).trim(),
    number: String(record.number || story.number).trim(),
    included: deliverables.length ? deliverables : story.included,
    image: mainImage
      ? { ...story.image, small: mainImage, large: mainImage, alt: record.image_alt || story.image.alt }
      : story.image,
    sourceRecord: record,
  }
})
