import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import { createServer } from 'vite'

const root = process.cwd()
const distDirectory = resolve(root, 'dist')
const indexPath = resolve(distDirectory, 'index.html')

const escapeAttribute = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const escapeText = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const normalizeOrigin = (value = '') => {
  const trimmed = String(value).trim()
  if (!trimmed) return ''

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return withProtocol.replace(/\/+$/, '')
}

const siteOrigin = normalizeOrigin(
  process.env.VITE_SITE_URL ||
    process.env.SITE_URL ||
    process.env.URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL,
)

const insertBeforeHeadClose = (html, tag) => html.replace(/<\/head>/i, `    ${tag}\n  </head>`)

const upsertMeta = (html, attribute, key, content) => {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}=["']${escapedKey}["'])[^>]*\\/?\\s*>`,
    'i',
  )
  const tag = `<meta ${attribute}="${escapeAttribute(key)}" content="${escapeAttribute(content)}" />`

  return pattern.test(html) ? html.replace(pattern, tag) : insertBeforeHeadClose(html, tag)
}

const upsertCanonical = (html, href) => {
  const pattern = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\/?\s*>/i
  const tag = `<link rel="canonical" href="${escapeAttribute(href)}" />`

  return pattern.test(html) ? html.replace(pattern, tag) : insertBeforeHeadClose(html, tag)
}

const resolveUrl = (value) => {
  if (!value || /^https?:\/\//i.test(value) || !siteOrigin) return value || ''
  return new URL(value, `${siteOrigin}/`).href
}

const resolveBuiltAsset = (value, builtAssets) => {
  if (!value?.startsWith('/src/assets/')) return value || ''

  const sourceName = basename(value)
  const extension = extname(sourceName)
  const stem = sourceName.slice(0, -extension.length)
  const builtName = builtAssets.find(
    (candidate) => candidate.startsWith(`${stem}-`) && candidate.endsWith(extension),
  )

  return builtName ? `/assets/${builtName}` : value
}

const renderProjectDocument = (baseHtml, project) => {
  const pathname = `/portfolio/${project.slug}/`
  const canonicalUrl = siteOrigin ? `${siteOrigin}${pathname}` : pathname
  const title = project.seo?.title || `${project.title} | Akrion Digitals`
  const description = project.seo?.description || project.summary || project.description || ''
  const image = resolveUrl(project.sourceImage || project.seo?.image || project.hero?.src)
  const imageAlt = project.hero?.alt || project.alt || `${project.title} project by Akrion Digitals`
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(title)}</title>`)

  html = upsertCanonical(html, canonicalUrl)
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'property', 'og:type', 'article')
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', canonicalUrl)
  html = upsertMeta(html, 'property', 'og:image', image)
  html = upsertMeta(html, 'property', 'og:image:alt', imageAlt)
  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image')
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertMeta(html, 'name', 'twitter:image', image)
  html = upsertMeta(html, 'name', 'twitter:image:alt', imageAlt)

  return html
}

const renderBlogDocument = (baseHtml, article, builtAssets) => {
  const pathname = `/blog/${article.slug}/`
  const canonicalUrl = siteOrigin ? `${siteOrigin}${pathname}` : pathname
  const title = article.seo?.title || `${article.title} | Akrion Digitals`
  const description = article.seo?.description || article.excerpt || article.content || ''
  const builtImage = resolveBuiltAsset(article.seo?.image || article.hero?.src, builtAssets)
  const image = resolveUrl(builtImage)
  const imageAlt = article.hero?.alt || `${article.title} article cover`
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    ...(image ? { image: [image] } : {}),
    author: {
      '@type': 'Organization',
      name: 'Akrion Digitals',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Akrion Digitals',
    },
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
  }
  const jsonLd = JSON.stringify(structuredData).replace(/</g, '\\u003c')
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(title)}</title>`)

  html = upsertCanonical(html, canonicalUrl)
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'property', 'og:type', 'article')
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', canonicalUrl)
  html = upsertMeta(html, 'property', 'og:image', image)
  html = upsertMeta(html, 'property', 'og:image:alt', imageAlt)
  html = upsertMeta(html, 'name', 'twitter:card', image ? 'summary_large_image' : 'summary')
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertMeta(html, 'name', 'twitter:image', image)
  html = upsertMeta(html, 'name', 'twitter:image:alt', imageAlt)
  html = insertBeforeHeadClose(
    html,
    `<script type="application/ld+json" data-page-meta>${jsonLd}</script>`,
  )

  return html
}

const renderBlogIndexDocument = (baseHtml, articles, builtAssets) => {
  const featured = articles.find((article) => article.featured) || articles[0]
  const pathname = '/blog'
  const canonicalUrl = siteOrigin ? `${siteOrigin}${pathname}` : pathname
  const title = 'Blog | Akrion Digitals'
  const description = 'Ideas, practical guidance, and creative perspectives for building stronger brands.'
  const builtImage = resolveBuiltAsset(featured?.hero?.src, builtAssets)
  const builtSmallImage = resolveBuiltAsset(featured?.hero?.srcSmall, builtAssets)
  const image = resolveUrl(builtImage)
  const imageAlt = featured?.hero?.alt || ''
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(title)}</title>`)

  html = upsertCanonical(html, canonicalUrl)
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'property', 'og:type', 'website')
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', canonicalUrl)
  html = upsertMeta(html, 'property', 'og:image', image)
  html = upsertMeta(html, 'property', 'og:image:alt', imageAlt)
  html = upsertMeta(html, 'name', 'twitter:card', image ? 'summary_large_image' : 'summary')
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertMeta(html, 'name', 'twitter:image', image)
  html = upsertMeta(html, 'name', 'twitter:image:alt', imageAlt)

  if (builtImage) {
    const responsiveAttributes = builtSmallImage && featured?.hero?.smallWidth && featured?.hero?.width
      ? ` imagesrcset="${escapeAttribute(`${builtSmallImage} ${featured.hero.smallWidth}w, ${builtImage} ${featured.hero.width}w`)}" imagesizes="(min-width: 900px) 55vw, 100vw"`
      : ''
    html = insertBeforeHeadClose(
      html,
      `<link rel="preload" as="image" href="${escapeAttribute(builtImage)}"${responsiveAttributes} />`,
    )
  }

  return html
}

const loadSiteContent = async () => {
  const vite = await createServer({
    root,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
  })

  try {
    const [portfolioModule, blogModule] = await Promise.all([
      vite.ssrLoadModule('/src/data/portfolioProjects.js'),
      vite.ssrLoadModule('/src/data/blogArticles.js'),
    ])
    return {
      projects: portfolioModule.portfolioProjects,
      articles: blogModule.blogArticles,
    }
  } finally {
    await vite.close()
  }
}

const baseHtml = await readFile(indexPath, 'utf8')
const builtAssets = await readdir(resolve(distDirectory, 'assets'))
const { projects, articles } = await loadSiteContent()

for (const project of projects) {
  const projectDirectory = resolve(distDirectory, 'portfolio', project.slug)
  await mkdir(projectDirectory, { recursive: true })
  await writeFile(
    resolve(projectDirectory, 'index.html'),
    renderProjectDocument(baseHtml, project),
    'utf8',
  )
}

const blogDirectory = resolve(distDirectory, 'blog')
await mkdir(blogDirectory, { recursive: true })
await writeFile(
  resolve(blogDirectory, 'index.html'),
  renderBlogIndexDocument(baseHtml, articles, builtAssets),
  'utf8',
)

for (const article of articles) {
  const articleDirectory = resolve(distDirectory, 'blog', article.slug)
  await mkdir(articleDirectory, { recursive: true })
  await writeFile(
    resolve(articleDirectory, 'index.html'),
    renderBlogDocument(baseHtml, article, builtAssets),
    'utf8',
  )
}

console.log(
  `Generated ${projects.length} case-study and ${articles.length} blog entry pages${siteOrigin ? ` for ${siteOrigin}` : ''}.`,
)
