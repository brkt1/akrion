import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageMeta from '../components/PageMeta'
import ResponsiveArticleImage from '../components/blog/ResponsiveArticleImage'
import ScrollAnimation, { StaggerContainer, StaggerItem } from '../components/ScrollAnimation'
import {
  BLOG_FILTERS,
  blogArticles,
  blogHeroMedia,
  getArticlePath,
  mergeBlogRecords,
} from '../data/blogArticles'
import { blogAPI } from '../lib/api/blog'

const ArrowIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M3.5 10H15.5M11 5.5L15.5 10L11 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HeroCollageImage = ({ media, index }) => {
  const srcSet = media.srcSmall && media.smallWidth && media.width
    ? `${media.srcSmall} ${media.smallWidth}w, ${media.src} ${media.width}w`
    : undefined

  return (
    <figure className={`blog-hero-collage-tile blog-hero-collage-tile--${index + 1}`} aria-hidden="true">
      <img
        src={media.src}
        srcSet={srcSet}
        sizes="(min-width: 960px) 24vw, 42vw"
        width={media.width || undefined}
        height={media.height || undefined}
        alt=""
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
      />
      <span />
    </figure>
  )
}

const formatPublishedDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const ArticleMeta = ({ article, compact = false }) => {
  const details = [article.publisher, formatPublishedDate(article.publishedAt), article.readingTime].filter(Boolean)

  if (!details.length) return null

  return (
    <ul className={`blog-article-meta${compact ? ' blog-article-meta--compact' : ''}`} aria-label="Article details">
      {details.map((detail) => <li key={detail}>{detail}</li>)}
    </ul>
  )
}

const ArticleCard = ({ article, featured = false }) => (
  <article className={featured ? 'blog-featured-card group' : 'blog-editorial-card group'}>
    <Link
      to={getArticlePath(article)}
      className={featured ? 'blog-featured-link' : 'blog-editorial-link'}
      aria-label={`Read ${article.title}`}
    >
      <div className={featured ? 'blog-featured-media' : 'blog-editorial-media'}>
        <ResponsiveArticleImage
          media={article.hero}
          sizes={featured
            ? '(min-width: 900px) 55vw, 100vw'
            : '(min-width: 1100px) 42vw, (min-width: 720px) 50vw, 100vw'}
          loading={featured ? 'eager' : 'lazy'}
          fetchPriority={featured ? 'high' : undefined}
          className="blog-article-image"
        />
        <span className="blog-article-image-wash" aria-hidden="true" />
        {article.readingTime && <span className="blog-card-reading-time">{article.readingTime}</span>}
      </div>

      <div className={featured ? 'blog-featured-copy' : 'blog-editorial-copy'}>
        <div className="blog-category-row">
          <span>{article.category}</span>
          <i aria-hidden="true" />
          {featured && <strong>Featured story</strong>}
        </div>
        <h2>{article.title}</h2>
        <p>{article.excerpt}</p>
        <ArticleMeta article={article} compact={!featured} />
        <span className="blog-read-action">
          Read Article <span className="blog-read-arrow"><ArrowIcon /></span>
        </span>
      </div>
    </Link>

  </article>
)

const Blog = () => {
  const [records, setRecords] = useState([])
  const [hasLoadedRecords, setHasLoadedRecords] = useState(false)
  const [publishedWorkflow, setPublishedWorkflow] = useState('legacy')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await blogAPI.getPublishedResult()
        setRecords(result.data)
        setPublishedWorkflow(result.workflow)
        setHasLoadedRecords(true)
      } catch (loadError) {
        console.error('Unable to load live blog records; using the local editorial edition.', loadError)
        setError('The latest posts could not be checked. Showing the saved editorial edition.')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  useEffect(() => {
    const featuredImage = blogArticles.find((article) => article.featured)?.hero
    if (!featuredImage?.src) return undefined

    const selector = 'link[rel="preload"][data-blog-featured-image]'
    let preload = document.head.querySelector(selector)
    const created = !preload

    if (!preload) {
      preload = document.createElement('link')
      preload.rel = 'preload'
      preload.as = 'image'
      preload.setAttribute('data-blog-featured-image', '')
      document.head.appendChild(preload)
    }

    preload.href = featuredImage.src
    if (featuredImage.srcSmall && featuredImage.smallWidth && featuredImage.width) {
      preload.setAttribute(
        'imagesrcset',
        `${featuredImage.srcSmall} ${featuredImage.smallWidth}w, ${featuredImage.src} ${featuredImage.width}w`,
      )
      preload.setAttribute('imagesizes', '(min-width: 900px) 55vw, 100vw')
    }

    return () => {
      if (created) preload.remove()
    }
  }, [])

  const displayedArticles = useMemo(
    () => (hasLoadedRecords
      ? mergeBlogRecords(records, { includeBundledFallback: publishedWorkflow !== 'advanced' })
      : blogArticles),
    [hasLoadedRecords, publishedWorkflow, records],
  )
  const filteredArticles = useMemo(
    () => activeFilter === 'All'
      ? displayedArticles
      : displayedArticles.filter((article) => article.category === activeFilter),
    [activeFilter, displayedArticles],
  )
  const featuredArticle = filteredArticles.find((article) => article.featured)
    || (activeFilter === 'All' ? filteredArticles[0] : null)
  const supportingArticles = featuredArticle
    ? filteredArticles.filter((article) => article.slug !== featuredArticle.slug)
    : filteredArticles

  return (
    <>
      <PageMeta
        title="Blog | Akrion Digitals"
        description="Ideas, practical guidance, and creative perspectives for building stronger brands."
        image={blogArticles[0]?.hero?.src}
        imageAlt={blogArticles[0]?.hero?.alt}
        path="/blog"
      />
      <Header />
      <main className="blog-page">
        <section className="blog-hero" aria-labelledby="blog-page-title">
          <div className="blog-pattern blog-pattern--hero eth-pattern-subtle" aria-hidden="true" />
          <div className="blog-hero-glow" aria-hidden="true" />
          <div className="blog-shell blog-hero-grid">
            <div className="blog-hero-copy">
              <ScrollAnimation animation="fadeUp" delay={0.08} respectReducedMotion>
                <p className="blog-eyebrow"><span />Insights &amp; Stories</p>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.16} duration={0.75} respectReducedMotion>
                <h1 id="blog-page-title">BLOG</h1>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.25} respectReducedMotion>
                <p className="blog-hero-intro">Ideas, practical guidance, and creative perspectives for building stronger brands.</p>
              </ScrollAnimation>
            </div>

            <ScrollAnimation className="blog-hero-visual" animation="fadeLeft" delay={0.18} respectReducedMotion>
              <div className="blog-hero-collage" role="img" aria-label="Akrion creative work across branding, content, web design, marketing, and production">
                {blogHeroMedia.map((media, index) => <HeroCollageImage key={media.src} media={media} index={index} />)}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        <section className="blog-edition" aria-labelledby="blog-edition-title">
          <div className="blog-pattern eth-pattern-subtle" aria-hidden="true" />
          <div className="blog-shell">
            <h2 id="blog-edition-title" className="sr-only">Akrion Digitals articles</h2>

            {error && <p className="blog-load-notice" role="status">{error}</p>}

            <ScrollAnimation animation="fadeUp" respectReducedMotion>
              <div className="blog-filter-wrap">
                <p>Explore by topic</p>
                <div className="blog-filter-scroll">
                  <div className="blog-filters" role="group" aria-label="Filter articles by category">
                    {BLOG_FILTERS.map((filter) => (
                      <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="sr-only" aria-live="polite">{filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} shown for {activeFilter}.</p>
              </div>
            </ScrollAnimation>

            {filteredArticles.length === 0 ? (
              <div className="blog-empty-state" role="status">
                <span aria-hidden="true" />
                <h3>No articles in this category yet.</h3>
                <p>Choose another topic to continue exploring the journal.</p>
              </div>
            ) : (
              <>
                {featuredArticle && (
                  <ScrollAnimation className="blog-featured-wrap" animation="fadeUp" delay={0.08} amount={0.08} respectReducedMotion>
                    <ArticleCard article={featuredArticle} featured />
                  </ScrollAnimation>
                )}

                {supportingArticles.length > 0 && (
                  <StaggerContainer className="blog-editorial-grid" staggerDelay={0.1} respectReducedMotion>
                    {supportingArticles.map((article) => (
                      <StaggerItem key={article.slug}>
                        <ArticleCard article={article} />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                )}
              </>
            )}

            {loading && <p className="blog-loading-note" aria-live="polite">Checking for the latest articles…</p>}
          </div>
        </section>

        <section className="blog-final-cta" aria-labelledby="blog-cta-title">
          <div className="blog-final-cta-pattern eth-pattern-subtle" aria-hidden="true" />
          <div className="blog-shell blog-final-cta-inner">
            <div>
              <p>Have an idea you want to bring to life?</p>
              <h2 id="blog-cta-title">Let’s turn it into something meaningful.</h2>
            </div>
            <Link to="/contact" className="blog-cta-button">Start a Conversation <ArrowIcon /></Link>
          </div>
        </section>
      </main>
      <Footer hideCtaBanner />
    </>
  )
}

export default Blog
