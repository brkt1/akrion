import serviceBrandIdentity1200 from '../assets/services/service-brand-identity-1200.webp'
import serviceBrandIdentity720 from '../assets/services/service-brand-identity-720.webp'
import serviceCreativeConsulting1200 from '../assets/services/service-creative-consulting-1200.webp'
import serviceCreativeConsulting720 from '../assets/services/service-creative-consulting-720.webp'
import serviceSocialMedia1200 from '../assets/services/service-social-media-1200.webp'
import serviceSocialMedia720 from '../assets/services/service-social-media-720.webp'
import serviceVideoMotion1200 from '../assets/services/service-video-motion-1200.webp'
import serviceVideoMotion720 from '../assets/services/service-video-motion-720.webp'
import serviceWebDevelopment1200 from '../assets/services/service-web-development-1200.webp'
import serviceWebDevelopment720 from '../assets/services/service-web-development-720.webp'

export const BLOG_FILTERS = [
  'All',
  'Branding',
  'Marketing',
  'Web & Technology',
  'Video & Content',
]

const PUBLISHER = 'Akrion Digitals'

const splitEditorialContent = (value = '') => {
  const content = String(value).trim()
  const match = content.match(/^(.+?[.!?])\s+([\s\S]+)$/)

  return match
    ? { introduction: match[1], body: match[2] }
    : { introduction: undefined, body: content }
}

const createMedia = ({
  src,
  srcSmall,
  alt,
  width = 1200,
  height = 800,
  smallWidth = 720,
  position = 'center',
}) => ({ src, srcSmall, alt, width, height, smallWidth, position })

/**
 * Editorial placeholders used by the Blog hero and as safe fallbacks for
 * article covers. Replace the imported files here when real Akrion editorial
 * photography is available; consumers do not need to change their layout.
 */
export const blogHeroMedia = [
  {
    id: 'brand-identity',
    label: 'Brand identity and packaging',
    ...createMedia({
      src: serviceBrandIdentity1200,
      srcSmall: serviceBrandIdentity720,
      alt: 'A coordinated brand identity system arranged across printed applications',
      position: 'center 46%',
    }),
  },
  {
    id: 'web-technology',
    label: 'Website and application design',
    ...createMedia({
      src: serviceWebDevelopment1200,
      srcSmall: serviceWebDevelopment720,
      alt: 'Responsive website interface shown across desktop and mobile screens',
      position: 'center 50%',
    }),
  },
  {
    id: 'video-content',
    label: 'Video production',
    ...createMedia({
      src: serviceVideoMotion1200,
      srcSmall: serviceVideoMotion720,
      alt: 'Video production workspace with a camera and editing display',
      position: 'center 47%',
    }),
  },
  {
    id: 'creative-direction',
    label: 'Motion design',
    ...createMedia({
      src: serviceCreativeConsulting1200,
      srcSmall: serviceCreativeConsulting720,
      alt: 'Creative workspace with hands arranging visual references and design materials',
      position: 'center 45%',
    }),
  },
  {
    id: 'social-campaigns',
    label: 'Social-media campaigns',
    ...createMedia({
      src: serviceSocialMedia1200,
      srcSmall: serviceSocialMedia720,
      alt: 'Social-media campaign layouts presented on a phone and editorial cards',
      position: 'center 48%',
    }),
  },
]

const sourceArticles = [
  {
    sourceId: 3,
    sourceTitle: 'Why Every Business Needs Professional Content in 2026',
    sourceContent:
      'In today’s fast moving digital world, first impressions happen online. Businesses with professional photos, cinematic videos, and strong branding attract more trust and more customers. Low-quality content can push people away before they even contact you. Investing in premium content is no longer optional it is essential for growth.',
    sourceAuthor: 'Akrion Team',
    sourceDate: '2026-04-07',
    sourceCategory: 'Marketing',
    sourceImage:
      'https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/blog/1777420282697_x4zme.jpg',
    slug: 'professional-content-for-business',
    category: 'Marketing',
    featured: true,
    hero: createMedia({
      src: serviceSocialMedia1200,
      srcSmall: serviceSocialMedia720,
      alt: 'Social-media campaign layouts presented on a phone and editorial cards',
      position: 'center 48%',
    }),
  },
  {
    sourceId: 1,
    sourceTitle: 'How Video Marketing Increases Sales',
    sourceContent:
      'Video content captures attention faster than text or images. It builds emotion, trust, and excitement around your brand. Whether it is a product showcase, customer testimonial, or cinematic promo, video helps convert viewers into buyers',
    sourceAuthor: 'Akrion Team',
    sourceDate: '2024-01-15',
    sourceCategory: 'Design',
    sourceImage:
      'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800',
    slug: 'how-video-marketing-increases-sales',
    category: 'Video & Content',
    featured: false,
    hero: createMedia({
      src: serviceVideoMotion1200,
      srcSmall: serviceVideoMotion720,
      alt: 'Video production workspace with a camera and editing display',
      position: 'center 47%',
    }),
  },
  {
    sourceId: 2,
    sourceTitle: 'Building Brands That Matter',
    sourceContent:
      "A brand is more than a logo. It's a promise, a story, and an experience. Learn how we craft brands that resonate with audiences and drive results.",
    sourceAuthor: 'Akrion Team',
    sourceDate: '2024-01-10',
    sourceCategory: 'Branding',
    sourceImage:
      'https://images.unsplash.com/photo-1561070791-2526d2fc2a68?w=800',
    slug: 'building-brands-that-matter',
    category: 'Branding',
    featured: false,
    hero: createMedia({
      src: serviceBrandIdentity1200,
      srcSmall: serviceBrandIdentity720,
      alt: 'A coordinated brand identity system arranged across printed applications',
      position: 'center 46%',
    }),
  },
]

/**
 * Canonical article registry. The existing publication dates are deliberately
 * not exposed because the repository does not verify them. `readingTime` is
 * likewise omitted rather than estimated.
 */
export const blogArticles = sourceArticles.map((article) => {
  const editorialText = splitEditorialContent(article.sourceContent)

  return {
    id: article.slug,
    slug: article.slug,
    sourceId: article.sourceId,
    sourceTitle: article.sourceTitle,
    sourceContent: article.sourceContent,
    sourceAuthor: article.sourceAuthor,
    sourceDate: article.sourceDate,
    sourceCategory: article.sourceCategory,
    sourceImage: article.sourceImage,
    title: article.sourceTitle,
    content: article.sourceContent,
    excerpt: article.sourceContent,
    introduction: editorialText.introduction,
    body: editorialText.body,
    category: article.category,
    publisher: PUBLISHER,
    featured: article.featured,
    hero: article.hero,
    seo: {
      title: `${article.sourceTitle} | Akrion Digitals`,
      description: article.sourceContent,
      image: article.hero.src,
    },
  }
})

export const slugifyArticleTitle = (value = '') =>
  value
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'article'

export const getArticleBySlug = (slug, articles = blogArticles) =>
  articles.find((article) => article.slug === slug)

export const getArticleBySourceId = (id) =>
  blogArticles.find((article) => String(article.sourceId) === String(id))

export const getArticlePath = (article) => {
  const slug = typeof article === 'string' ? article : article?.slug
  return `/blog/${slug || ''}/`
}

const cleanValue = (value) => String(value || '').trim()

const isCurrentSourceValue = (recordValue, sourceValue) =>
  cleanValue(recordValue) === cleanValue(sourceValue)

const normalizeCategory = (value = '') => {
  const category = cleanValue(value)
  const normalized = category.toLowerCase()

  if (normalized.includes('brand')) return 'Branding'
  if (normalized.includes('market') || normalized.includes('social')) return 'Marketing'
  if (normalized.includes('web') || normalized.includes('tech') || normalized.includes('app')) {
    return 'Web & Technology'
  }
  if (
    normalized.includes('video') ||
    normalized.includes('content') ||
    normalized.includes('motion') ||
    normalized === 'design'
  ) {
    return 'Video & Content'
  }

  return category
}

const getVerifiedPublishedAt = (record = {}) => {
  const managedPublicationDate = cleanValue(record.publication_date)
  if (managedPublicationDate) return managedPublicationDate

  const isVerified =
    record.date_verified === true ||
    record.dateVerified === true ||
    record.published_at_verified === true

  if (!isVerified) return undefined
  return cleanValue(record.published_at || record.publishedAt || record.date) || undefined
}

const getExplicitReadingTime = (record = {}) => {
  const value = record.reading_time ?? record.readingTime ?? record.read_time
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return `${value} min read`
  return cleanValue(value) || undefined
}

const createRemoteMedia = (record, title) => {
  const src = cleanValue(record.image)
  if (!src) return blogHeroMedia[3]

  return {
    src,
    alt: cleanValue(record.image_alt || record.alt_text) || title,
    position: cleanValue(record.image_position) || 'center',
  }
}

export const hydrateBlogArticle = (article, record) => {
  if (!article || !record) return article

  const contentMatches =
    isCurrentSourceValue(record.title, article.sourceTitle) &&
    isCurrentSourceValue(record.content, article.sourceContent) &&
    isCurrentSourceValue(record.category, article.sourceCategory)
  const imageMatches =
    !cleanValue(record.image) || isCurrentSourceValue(record.image, article.sourceImage)
  const title = cleanValue(record.title) || article.title
  const content = cleanValue(record.content) || article.content
  const explicitSlug = cleanValue(record.slug)
  const excerpt = cleanValue(record.excerpt) || content
  const category = contentMatches
    ? article.category
    : normalizeCategory(record.category) || article.category
  const hero = imageMatches ? article.hero : createRemoteMedia(record, title)
  const editorialText = contentMatches
    ? { introduction: article.introduction, body: article.body }
    : splitEditorialContent(content)
  const publishedAt = getVerifiedPublishedAt(record) || (
    cleanValue(record.date) && !isCurrentSourceValue(record.date, article.sourceDate)
      ? cleanValue(record.date)
      : undefined
  )
  const readingTime = getExplicitReadingTime(record)
  const publisher = cleanValue(record.publisher || record.author)
  const featured = typeof record.featured === 'boolean'
    ? record.featured
    : contentMatches
      ? article.featured
      : false
  const seoTitle = cleanValue(record.seo_title) || `${title} | Akrion Digitals`
  const seoDescription = cleanValue(record.seo_description) || excerpt

  return {
    ...article,
    slug: explicitSlug ? slugifyArticleTitle(explicitSlug) : article.slug,
    title,
    content,
    excerpt,
    introduction: editorialText.introduction,
    body: editorialText.body,
    category,
    publisher: publisher && publisher !== 'Akrion Team' ? publisher : PUBLISHER,
    publishedAt,
    readingTime,
    featured,
    relatedArticleIds: Array.isArray(record.related_article_ids) ? record.related_article_ids : [],
    hero,
    sourceRecord: record,
    seo: {
      title: seoTitle,
      description: seoDescription,
      image: hero.src,
    },
  }
}

export const normalizeBlogRecord = (record) => {
  const knownArticle = getArticleBySourceId(record?.id)
  if (knownArticle) return hydrateBlogArticle(knownArticle, record)

  const title = cleanValue(record?.title)
  const content = cleanValue(record?.content)
  if (!title || !content) return null

  const recordId = record?.id != null ? String(record.id) : ''
  const explicitSlug = cleanValue(record?.slug)
  const slug = explicitSlug
    ? slugifyArticleTitle(explicitSlug)
    : recordId
      ? `article-${recordId}`
      : slugifyArticleTitle(title)
  const hero = createRemoteMedia(record || {}, title)
  const editorialText = splitEditorialContent(content)
  // New records are authored through the admin form, where this field is
  // explicitly labelled as the verified publication date. Known seed records
  // are handled above and remain hidden until their placeholder date changes.
  const publishedAt = getVerifiedPublishedAt(record) || cleanValue(record?.date) || undefined
  const readingTime = getExplicitReadingTime(record)
  const excerpt = cleanValue(record?.excerpt) || content
  const publisher = cleanValue(record?.publisher || record?.author)
  const seoTitle = cleanValue(record?.seo_title) || `${title} | Akrion Digitals`
  const seoDescription = cleanValue(record?.seo_description) || excerpt

  return {
    id: slug,
    slug,
    sourceId: record?.id,
    title,
    content,
    excerpt,
    introduction: editorialText.introduction,
    body: editorialText.body,
    category: normalizeCategory(record?.category),
    publisher: publisher && publisher !== 'Akrion Team' ? publisher : PUBLISHER,
    publishedAt,
    readingTime,
    featured: record?.featured === true,
    relatedArticleIds: Array.isArray(record?.related_article_ids) ? record.related_article_ids : [],
    hero,
    sourceRecord: record,
    seo: {
      title: seoTitle,
      description: seoDescription,
      image: hero.src,
    },
  }
}

export const mergeBlogRecords = (records = [], { includeBundledFallback = true } = {}) => {
  if (!includeBundledFallback) {
    return records
      .map((record) => {
        const knownArticle = getArticleBySourceId(record.id)
        return knownArticle ? hydrateBlogArticle(knownArticle, record) : normalizeBlogRecord(record)
      })
      .filter(Boolean)
  }

  const recordMap = new Map(records.map((record) => [String(record.id), record]))
  const known = blogArticles.map((article) =>
    recordMap.has(String(article.sourceId))
      ? hydrateBlogArticle(article, recordMap.get(String(article.sourceId)))
      : article,
  )
  const additions = records
    .filter((record) => !getArticleBySourceId(record.id))
    .map(normalizeBlogRecord)
    .filter(Boolean)

  return [...known, ...additions]
}

export const getRelatedArticles = (article, articles = blogArticles, limit = 2) => {
  if (!article) return []

  const explicitlyRelated = (article.relatedArticleIds || [])
    .map((id) => articles.find((candidate) => String(candidate.sourceId) === String(id)))
    .filter((candidate) => candidate && candidate.slug !== article.slug)
  const explicitSlugs = new Set(explicitlyRelated.map((candidate) => candidate.slug))
  const automaticallyRelated = articles
    .filter((candidate) => candidate.slug !== article.slug)
    .filter((candidate) => !explicitSlugs.has(candidate.slug))
    .sort((left, right) => {
      const leftMatches = left.category === article.category ? 1 : 0
      const rightMatches = right.category === article.category ? 1 : 0
      return rightMatches - leftMatches
    })

  return [...explicitlyRelated, ...automaticallyRelated].slice(0, limit)
}
