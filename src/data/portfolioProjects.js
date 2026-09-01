import benediktaFoundation1200 from '../assets/portfolio/benedikta-foundation-1200.webp'
import benediktaFoundation720 from '../assets/portfolio/benedikta-foundation-720.webp'
import birhumindsConsultancy1200 from '../assets/portfolio/birhuminds-consultancy-1200.webp'
import birhumindsConsultancy720 from '../assets/portfolio/birhuminds-consultancy-720.webp'
import documentaryFilm1400 from '../assets/portfolio/documentary-film-1400.webp'
import documentaryFilm720 from '../assets/portfolio/documentary-film-720.webp'
import enenTubeSeries900 from '../assets/portfolio/enen-tube-series-900.webp'
import enenTubeSeries600 from '../assets/portfolio/enen-tube-series-600.webp'
import liyuMelketa1400 from '../assets/portfolio/liyu-melketa-1400.webp'
import liyuMelketa720 from '../assets/portfolio/liyu-melketa-720.webp'
import weddingEvent1000 from '../assets/portfolio/wedding-event-1000.webp'
import weddingEvent600 from '../assets/portfolio/wedding-event-600.webp'
import yenegeEventsLogo720 from '../assets/portfolio/yenege-events-logo-720.webp'
import yenegeEventsLogo480 from '../assets/portfolio/yenege-events-logo-480.webp'

const birhumindsSourceImage =
  'https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/1777402598274_0jt6rr.jpg'

const createMedia = ({
  src,
  srcSmall,
  smallWidth,
  width,
  height,
  alt,
  fit = 'cover',
  position = 'center',
}) => ({ src, srcSmall, smallWidth, width, height, alt, fit, position })

const createGalleryItem = (slug, media, caption) => ({
  id: `${slug}-project-visual`,
  ...media,
  caption,
  layout: media.width && media.height && media.height > media.width ? 'portrait' : 'wide',
})

/**
 * Canonical portfolio content.
 *
 * Facts are limited to information already present in Akrion's live portfolio
 * records. Add future projects here when richer, verified case-study copy and
 * assets are available; database-only projects still receive a safe, minimal
 * detail page through normalizePortfolioRecord below.
 */
export const portfolioProjects = [
  {
    id: 'documentary-film-production',
    slug: 'documentary-film-production',
    sourceId: 36,
    sourceTitle: 'Documentary Film Production',
    sourceCategory: 'Video Production / Documentary',
    sourceImage:
      'https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/1777418739694_voxqus.png',
    sourceDescription:
      'Produced a variety of documentary projects focused on storytelling, culture, social impact, and real-life experiences. Our work included concept development, filming, interviews, editing, and post-production to create meaningful visual stories that inform, inspire, and connect with audiences. Each documentary was crafted with a strong narrative and professional production quality.',
    title: 'Documentary Film Production',
    cardTitle: 'Documentary Film Production',
    category: 'Documentary Film',
    cardCategory: 'Documentary Film',
    summary:
      'Documentary projects shaped through concept development, filming, interviews, editing, and post-production.',
    tags: ['Documentary', 'Storytelling', 'Interviews', 'Post-production'],
    featured: true,
    presentation: 'video',
    hero: createMedia({
      src: documentaryFilm1400,
      srcSmall: documentaryFilm720,
      smallWidth: 720,
      width: 1400,
      height: 788,
      alt: 'A woman speaking on camera among garments and mannequins during a documentary interview',
    }),
    overview: {
      services: ['Concept development', 'Filming and interviews', 'Editing and post-production'],
    },
    approach: {
      understand: 'Develop documentary concepts around storytelling, culture, social impact, and real-life experiences.',
      create: 'Film interviews and real-life material for meaningful visual stories.',
      deliver: 'Complete editing and post-production with a strong narrative and professional production quality.',
    },
    result: {
      statement:
        'Meaningful visual stories built with a strong narrative and professional production quality.',
    },
    galleryCaption: 'A documentary interview captured during production.',
  },
  {
    id: 'wedding-special-event-media',
    slug: 'wedding-special-event-media',
    sourceId: 35,
    sourceTitle: 'Wedding & Special Event Media Production',
    sourceCategory: 'Photography / Videography',
    sourceImage:
      'https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/1777410004792_xp74pb.jpg',
    sourceDescription:
      'Professional media production services delivered for weddings, shemgelena ceremonies, graduations, and other memorable occasions. Our work focused on capturing emotional moments through high-quality photography and cinematic videography, creating timeless content that families and clients can cherish for years. From planning to final edits, every project was handled with creativity and professionalism.',
    title: 'Wedding & Special Event Media Production',
    cardTitle: 'Wedding & Special Event Media',
    category: 'Photography & Videography',
    cardCategory: 'Event Photography',
    summary:
      'High-quality photography and cinematic videography for weddings, shemgelena ceremonies, graduations, and other memorable occasions.',
    tags: ['Photography', 'Videography', 'Event Coverage', 'Final Editing'],
    presentation: 'photography',
    hero: createMedia({
      src: weddingEvent1000,
      srcSmall: weddingEvent600,
      smallWidth: 600,
      width: 1000,
      height: 1250,
      alt: 'Silhouette portrait of a graduate adjusting her cap against a circular studio light',
      fit: 'contain',
    }),
    overview: {
      services: ['Production planning', 'Photography', 'Cinematic videography', 'Final editing'],
    },
    approach: {
      understand: 'Plan media production for each memorable occasion.',
      create: 'Capture emotional details through high-quality photography and cinematic videography.',
      deliver: 'Complete the final edits with creativity and professionalism.',
    },
    result: {
      statement:
        'Timeless photo and video content that families and clients can cherish for years.',
    },
    galleryCaption: 'A graduation portrait created as part of Akrion’s special-event media work.',
  },
  {
    id: 'enen-tube-short-series',
    slug: 'enen-tube-short-series',
    sourceId: 33,
    sourceTitle: 'Enen Tube Short Series Drama Production',
    sourceCategory: 'Video Production',
    sourceImage:
      'https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/1777408250683_ilr9c.jpg',
    sourceDescription:
      'Creative short series drama production developed in collaboration with Enen Tube, focused on engaging storytelling and high-quality visual content for digital audiences. The project included filming, creative direction, scene production, editing, and content delivery designed to entertain viewers and strengthen the channel’s media presence.',
    title: 'Enen Tube Short Series Drama Production',
    cardTitle: 'Enen Tube Short Series',
    category: 'Video Production',
    cardCategory: 'Video Production',
    summary:
      'A short-series drama created with Enen Tube through creative direction, scene production, filming, editing, and content delivery.',
    tags: ['Creative Direction', 'Scene Production', 'Filming', 'Editing'],
    presentation: 'video',
    hero: createMedia({
      src: enenTubeSeries900,
      srcSmall: enenTubeSeries600,
      smallWidth: 600,
      width: 900,
      height: 1200,
      alt: 'Enen Tube short-series poster featuring the lead actor and supporting cast',
      fit: 'contain',
    }),
    overview: {
      services: ['Creative direction', 'Scene production', 'Filming', 'Editing and delivery'],
    },
    approach: {
      understand: 'Develop engaging short-series storytelling for digital audiences.',
      create: 'Lead creative direction, scene production, and filming across the drama production.',
      deliver: 'Complete editing and content delivery for Enen Tube’s digital audience.',
    },
    result: {
      statement:
        'A completed short drama series designed to entertain viewers and strengthen the channel’s media presence.',
    },
    galleryCaption: 'The lead and supporting cast presented for the Enen Tube short series.',
  },
  {
    id: 'yenege-events-website',
    slug: 'yenege-events-website',
    sourceId: 29,
    sourceTitle: 'Yenege Events Website Development',
    sourceCategory: 'Web Design / Development',
    sourceImage:
      'https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/1777407037061_t56zma.png',
    sourceDescription:
      'Custom website designed and developed for Yenege Events to establish a strong digital presence and showcase event services professionally. The project focused on a modern user-friendly interface, mobile responsiveness, service presentation, inquiry features, and a visually engaging design that reflects elegance, celebration, and professionalism.',
    title: 'Yenege Events Website Development',
    cardTitle: 'Yenege Events Website',
    category: 'Web Design & Development',
    cardCategory: 'Web Development',
    summary:
      'A responsive event platform designed to strengthen Yenege Events’ digital presence and make its services easier to discover.',
    tags: ['UI/UX', 'Responsive Design', 'Web Development', 'Inquiry Features'],
    presentation: 'website',
    externalLink: 'https://www.yenege.com',
    hero: createMedia({
      src: yenegeEventsLogo720,
      srcSmall: yenegeEventsLogo480,
      smallWidth: 480,
      width: 720,
      height: 992,
      alt: 'Yenege gold-and-green identity displayed in a digital brand presentation',
      fit: 'contain',
    }),
    overview: {
      client: 'Yenege Events',
      services: ['UI/UX design', 'Responsive development', 'Service presentation', 'Inquiry features'],
    },
    approach: {
      understand: 'Focus the website on service presentation, inquiries, and a stronger digital presence.',
      create: 'Design a modern, visually engaging interface that reflects elegance, celebration, and professionalism.',
      deliver: 'Develop a responsive website with clear service presentation and practical inquiry features.',
    },
    result: {
      statement:
        'A responsive event website that presents Yenege Events professionally and gives visitors a clearer route to discover services and make inquiries.',
    },
    galleryCaption: 'The Yenege Events identity used in the project’s digital presentation.',
  },
  {
    id: 'liyu-melketa-expo',
    slug: 'liyu-melketa-expo',
    sourceId: 27,
    sourceTitle: 'Liyu Melketa Expo Media Production',
    sourceCategory: 'Media Production / Event Coverage',
    sourceImage:
      'https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/1777406502383_q804gp.JPG',
    sourceDescription:
      'Professional media production delivered for Liyu Melketa Expo, a three-day entrepreneurship event that brought together founders, innovators, and business-minded individuals. Our role focused on capturing high-quality photos and cinematic video coverage of speakers, networking moments, stage presentations, and audience engagement. The final content was created to preserve the event experience and strengthen future promotional campaigns.',
    title: 'Liyu Melketa Expo Media Production',
    cardTitle: 'Liyu Melketa Expo',
    category: 'Event Coverage',
    cardCategory: 'Event Coverage',
    summary:
      'End-to-end photo and video coverage capturing the people, ideas, and energy behind a three-day entrepreneurship expo.',
    tags: ['Photography', 'Videography', 'Event Coverage', 'Content Creation'],
    presentation: 'photography',
    hero: createMedia({
      src: liyuMelketa1400,
      srcSmall: liyuMelketa720,
      smallWidth: 720,
      width: 1400,
      height: 875,
      alt: 'Certificate presentation with participants and organizers at the Liyu Melketa entrepreneurship expo',
    }),
    overview: {
      client: 'Liyu Melketa Expo',
      services: ['Photography', 'Cinematic videography', 'Event coverage', 'Promotional content'],
    },
    approach: {
      understand: 'Focus coverage on speakers, networking, stage presentations, and audience engagement.',
      create: 'Capture high-quality photography and cinematic video throughout the three-day expo.',
      deliver: 'Organize the final content to preserve the event and support future promotional campaigns.',
    },
    result: {
      statement:
        'A complete visual record of the expo experience, prepared to preserve the event and support future promotional use.',
    },
    galleryCaption: 'Participants and organizers during a certificate presentation at Liyu Melketa Expo.',
  },
  {
    id: 'birhuminds-consultancy-training',
    slug: 'birhuminds-consultancy-training',
    sourceId: 11,
    sourceTitle: 'Birhuminds Consultancy Training',
    sourceCategory: 'Marketing / Event Branding',
    sourceImage: birhumindsSourceImage,
    sourceDescription:
      'Professional promotional campaign created for Birhuminds Consultancy focused on entrepreneurship and business mindset development. The project was designed to attract aspiring entrepreneurs, young professionals, and business-minded individuals through impactful visuals, modern branding, and engaging marketing materials that reflected growth, leadership, and innovation.',
    title: 'Birhuminds Consultancy Training',
    cardTitle: 'Birhuminds Consultancy Training',
    category: 'Marketing & Event Branding',
    cardCategory: 'Event Branding',
    summary:
      'A promotional campaign and event-branding system created around entrepreneurship, leadership, and business-mindset development.',
    tags: ['Promotional Campaign', 'Event Branding', 'Marketing Materials'],
    presentation: 'branding',
    hero: createMedia({
      src: birhumindsConsultancy1200,
      srcSmall: birhumindsConsultancy720,
      smallWidth: 720,
      width: 1200,
      height: 1800,
      alt: 'Trainer speaking beside a workshop board in Birhuminds Consultancy campaign imagery',
      fit: 'contain',
    }),
    overview: {
      client: 'Birhuminds Consultancy',
      services: ['Promotional campaign', 'Event branding', 'Marketing materials'],
    },
    approach: {
      understand: 'Focus the campaign around entrepreneurship, business mindset, leadership, and growth.',
      create: 'Build impactful visuals and modern branding for the training program and its promotion.',
      deliver: 'Produce engaging marketing materials reflecting growth, leadership, and innovation.',
    },
    result: {
      statement:
        'A cohesive promotional campaign and set of marketing materials reflecting the program’s focus on growth, leadership, and innovation.',
    },
    galleryCaption: 'Birhuminds Consultancy training campaign imagery.',
  },
  {
    id: 'benedikta-foundation-brand-identity',
    slug: 'benedikta-foundation-brand-identity',
    sourceId: 9,
    sourceTitle: 'Benedikta Foundation Branding Identity',
    sourceCategory: 'Branding / NGO Design',
    sourceImage:
      'https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/1777382295620_2wjmap.png',
    sourceDescription:
      'Complete visual identity design created for Benedikta Foundation, combining compassion, trust, and community empowerment into a modern brand system. The project included logo creation, brand patterns, stationery design, merchandise mockups, ID card design, and marketing assets to establish a professional and memorable presence.',
    title: 'Benedikta Foundation Branding Identity',
    cardTitle: 'Benedikta Foundation Identity',
    category: 'Brand Identity',
    cardCategory: 'Brand Identity',
    summary:
      'A complete visual identity translating compassion, trust, and community empowerment into a modern brand system.',
    tags: ['Logo Design', 'Brand Patterns', 'Stationery', 'Brand Applications'],
    presentation: 'branding',
    hero: createMedia({
      src: benediktaFoundation1200,
      srcSmall: benediktaFoundation720,
      smallWidth: 720,
      width: 1200,
      height: 900,
      alt: 'Benedikta Foundation visual identity shown across branded applications',
      fit: 'contain',
    }),
    overview: {
      client: 'Benedikta Foundation',
      services: ['Logo creation', 'Brand patterns', 'Stationery', 'Brand applications'],
    },
    approach: {
      understand: 'Build the identity around compassion, trust, and community empowerment.',
      create: 'Develop the logo, brand patterns, stationery, ID card, merchandise mockups, and supporting assets.',
      deliver: 'Complete the brand system and marketing assets for a professional and memorable presence.',
    },
    result: {
      statement:
        'A complete identity system spanning the logo, patterns, stationery, merchandise concepts, ID card, and marketing assets.',
    },
    galleryCaption: 'Benedikta Foundation’s identity shown across selected brand applications.',
  },
].map((project) => ({
  ...project,
  description: project.summary,
  alt: project.hero.alt,
  image: project.hero.src,
  imageSmall: project.hero.srcSmall,
  imageSmallWidth: project.hero.smallWidth,
  width: project.hero.width,
  height: project.hero.height,
  gallery: [createGalleryItem(project.slug, project.hero, project.galleryCaption)],
  seo: {
    title: `${project.title} | Akrion Digitals`,
    description: project.summary,
    image: project.hero.src,
  },
}))

export const slugifyProjectTitle = (value = '') =>
  value
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project'

export const getProjectBySlug = (slug) =>
  portfolioProjects.find((project) => project.slug === slug)

export const getProjectBySourceId = (id) =>
  portfolioProjects.find((project) => String(project.sourceId) === String(id))

export const getProjectPath = (project) => `/portfolio/${project.slug}/`

export const getNextProject = (slug, projects = portfolioProjects) => {
  if (!projects.length) return null
  const currentIndex = projects.findIndex((project) => project.slug === slug)
  return projects[(currentIndex + 1 + projects.length) % projects.length]
}

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean)
  return String(tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

const isCurrentSourceValue = (recordValue, sourceValue) =>
  String(recordValue || '').trim() === String(sourceValue || '').trim()

const getStructuredApproach = (record) => {
  const structured = record.approach && typeof record.approach === 'object' ? record.approach : {}
  const understand = structured.understand || record.approach_understand || record.understand
  const create = structured.create || record.approach_create || record.create_stage
  const deliver = structured.deliver || record.approach_deliver || record.deliver
  return understand && create && deliver ? { understand, create, deliver } : undefined
}

const getVerifiedTestimonial = (record) => {
  const quote = record.testimonial_quote
  const name = record.testimonial_name
  if (!quote || !name) return undefined
  return {
    quote,
    name,
    role: record.testimonial_role || undefined,
    organization: record.testimonial_organization || undefined,
  }
}

export const hydratePortfolioProject = (project, record) => {
  if (!project || !record) return project

  const titleMatches = isCurrentSourceValue(record.title, project.sourceTitle)
  const categoryMatches = isCurrentSourceValue(record.category, project.sourceCategory)
  const descriptionMatches = isCurrentSourceValue(record.description, project.sourceDescription)
  const contentMatches = titleMatches && categoryMatches && descriptionMatches
  const title = titleMatches
    ? project.title
    : record.title || project.title
  const category = categoryMatches
    ? project.category
    : record.category || project.category
  const summary = record.project_summary || record.card_description || (
    descriptionMatches ? project.summary : record.description || project.summary
  )
  const useOptimizedMedia = !record.image || isCurrentSourceValue(record.image, project.sourceImage)
  const authoredAlt = String(record.alt_text || record.image_alt || '').trim()
  const hero = useOptimizedMedia
    ? project.hero
    : createMedia({
        src: record.image,
        alt: authoredAlt,
        fit: project.hero.fit,
        position: project.hero.position,
      })
  const tags = parseTags(record.tags)
  const authoredServices = parseTags(record.services)
  const galleryCaption = contentMatches && useOptimizedMedia
    ? project.galleryCaption
    : record.image_caption || undefined
  const hydrated = {
    ...project,
    title,
    cardTitle: contentMatches ? project.cardTitle : title,
    category,
    cardCategory: contentMatches ? project.cardCategory : category,
    summary,
    description: summary,
    tags: tags.length ? tags : project.tags,
    slug: record.slug ? slugifyProjectTitle(record.slug) : project.slug,
    externalLink: record.external_url || record.link || project.externalLink,
    hero,
    alt: hero.alt,
    image: hero.src,
    imageSmall: hero.srcSmall,
    imageSmallWidth: hero.smallWidth,
    width: hero.width,
    height: hero.height,
    gallery: hero.alt ? [createGalleryItem(project.slug, hero, galleryCaption)] : [],
    sourceRecord: record,
    seo: {
      title: record.seo_title || `${title} | Akrion Digitals`,
      description: record.seo_description || summary,
      image: hero.src,
    },
  }

  if (!contentMatches) {
    hydrated.overview = {
      ...(record.client_name ? { client: record.client_name } : {}),
      ...(record.industry ? { industry: record.industry } : {}),
      ...(authoredServices.length ? { services: authoredServices } : {}),
      ...(record.project_year ? { year: record.project_year } : {}),
    }
    hydrated.challenge = record.problem || record.challenge || undefined
    hydrated.approach = getStructuredApproach(record)
    hydrated.result = record.result
      ? { statement: record.result, metrics: Array.isArray(record.metrics) ? record.metrics : [] }
      : undefined
    hydrated.testimonial = getVerifiedTestimonial(record)
  }

  return hydrated
}

export const normalizePortfolioRecord = (record) => {
  const knownProject = getProjectBySourceId(record?.id)
  if (knownProject) return hydratePortfolioProject(knownProject, record)

  const title = String(record?.title || 'Untitled Project').trim()
  const recordId = record?.id != null ? String(record.id) : ''
  const explicitSlug = String(record?.slug || '').trim()
  const slug = explicitSlug
    ? slugifyProjectTitle(explicitSlug)
    : recordId
      ? `project-${recordId}`
      : slugifyProjectTitle(title)
  const category = String(record?.category || '').trim()
  const summary = String(record?.project_summary || record?.card_description || record?.description || '').trim()
  const tags = parseTags(record?.tags)
  const authoredAlt = String(record?.alt_text || record?.image_alt || '').trim()
  const heroSource = record?.featured_image || record?.image
  const hero = heroSource
    ? createMedia({
        src: heroSource,
        alt: authoredAlt,
        fit: 'contain',
      })
    : null
  const services = parseTags(record?.services)
  const approach = getStructuredApproach(record || {})
  const gallery = hero?.alt
    ? [createGalleryItem(slug, hero, record?.image_caption || undefined)]
    : []

  return {
    id: slug,
    slug,
    sourceId: record?.id,
    sourceRecord: record,
    title,
    cardTitle: title,
    category,
    cardCategory: category,
    summary,
    description: summary,
    tags,
    externalLink: record?.external_url || record?.link || undefined,
    hero,
    image: hero?.src,
    alt: hero?.alt,
    overview: {
      ...(record?.client_name ? { client: record.client_name } : {}),
      ...(record?.industry ? { industry: record.industry } : {}),
      ...(services.length ? { services } : {}),
      ...(record?.project_year ? { year: record.project_year } : {}),
    },
    challenge: record?.problem || record?.challenge || undefined,
    approach,
    result: record?.result
      ? { statement: record.result, metrics: Array.isArray(record.metrics) ? record.metrics : [] }
      : undefined,
    testimonial: getVerifiedTestimonial(record || {}),
    gallery,
    seo: {
      title: record?.seo_title || `${title} | Akrion Digitals`,
      description: record?.seo_description || summary,
      image: hero?.src,
    },
  }
}

export const mergePortfolioRecords = (records = [], { includeBundledFallback = true } = {}) => {
  if (!includeBundledFallback) {
    return records.map((record) => {
      const knownProject = getProjectBySourceId(record.id)
      return knownProject ? hydratePortfolioProject(knownProject, record) : normalizePortfolioRecord(record)
    })
  }

  const recordMap = new Map(records.map((record) => [String(record.id), record]))
  const known = portfolioProjects.map((project) =>
    recordMap.has(String(project.sourceId))
      ? hydratePortfolioProject(project, recordMap.get(String(project.sourceId)))
      : project,
  )
  const additions = records
    .filter((record) => !getProjectBySourceId(record.id))
    .map(normalizePortfolioRecord)

  return [...known, ...additions]
}
