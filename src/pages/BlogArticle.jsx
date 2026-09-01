import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageMeta from '../components/PageMeta'
import ResponsiveArticleImage from '../components/blog/ResponsiveArticleImage'
import {
  blogArticles,
  getArticleBySlug,
  getArticlePath,
  getRelatedArticles,
  mergeBlogRecords,
} from '../data/blogArticles'
import { blogAPI } from '../lib/api/blog'

const ArrowIcon = ({ direction = 'right' }) => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}
  >
    <path
      d="M4 10H15M10.5 5.5L15 10L10.5 14.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const formatPublishedDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const toAbsoluteUrl = (value) => {
  if (!value || typeof window === 'undefined') return value
  try {
    return new URL(value, window.location.origin).href
  } catch {
    return value
  }
}

const Reveal = ({ children, className = '', reducedMotion, delay = 0 }) => (
  <motion.div
    className={className}
    initial={reducedMotion ? false : { opacity: 0, y: 20 }}
    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
    viewport={reducedMotion ? undefined : { once: true, amount: 0.16 }}
    transition={
      reducedMotion
        ? undefined
        : { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }
    }
  >
    {children}
  </motion.div>
)

const BlogArticle = () => {
  const { slug } = useParams()
  const reducedMotion = useReducedMotion()
  const canonicalArticle = useMemo(() => getArticleBySlug(slug), [slug])
  const [article, setArticle] = useState(canonicalArticle || null)
  const [articleCollection, setArticleCollection] = useState(blogArticles)
  const [loading, setLoading] = useState(!canonicalArticle)
  const [loadError, setLoadError] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const titleRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setArticle(canonicalArticle || null)
    setArticleCollection(blogArticles)
    setLoading(!canonicalArticle)
    setLoadError(false)

    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo({ top: 0, behavior: 'auto' })
    root.style.scrollBehavior = previousScrollBehavior

    const loadArticle = async () => {
      try {
        const result = await blogAPI.getPublishedResult()
        if (cancelled) return
        const merged = mergeBlogRecords(result.data, {
          includeBundledFallback: result.workflow !== 'advanced',
        })
        setArticleCollection(merged)

        if (canonicalArticle) {
          setArticle(
            merged.find((item) => item.slug === canonicalArticle.slug)
              || (result.workflow === 'advanced' ? null : canonicalArticle),
          )
          return
        }

        setArticle(merged.find((item) => item.slug === slug) || null)
      } catch (error) {
        if (!cancelled) {
          console.error('Unable to load blog article:', error)
          setArticle(canonicalArticle || null)
          setLoadError(!canonicalArticle)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadArticle()
    return () => {
      cancelled = true
    }
  }, [canonicalArticle, loadAttempt, slug])

  useEffect(() => {
    if (loading) return undefined
    const frame = window.requestAnimationFrame(() => {
      titleRef.current?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [article?.slug, loadError, loading])

  if (loading && !article) {
    return (
      <>
        <Header />
        <PageMeta title="Loading Article | Akrion Digitals" path={`/blog/${slug}/`} noIndex />
        <main
          className="grid min-h-[72svh] place-items-center bg-[#071A0F] px-4 pb-20 pt-32 text-[#F5EDD8]"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 text-sm text-[#E2C49A]">
            <span
              className={`h-4 w-4 rounded-full border border-[#C9A170]/30 border-t-[#C9A170] ${
                reducedMotion ? '' : 'animate-spin'
              }`}
              aria-hidden="true"
            />
            Loading article…
          </div>
        </main>
      </>
    )
  }

  if (!article && loadError) {
    return (
      <>
        <Header />
        <PageMeta
          title="Article Temporarily Unavailable | Akrion Digitals"
          description="This article could not be loaded right now."
          path={`/blog/${slug}/`}
          noIndex
        />
        <main className="relative grid min-h-[72svh] place-items-center overflow-hidden bg-[#071A0F] px-4 pb-20 pt-32 text-center text-[#F5EDD8]">
          <div className="eth-pattern-subtle absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9A170]">Blog</p>
            <h1
              ref={titleRef}
              tabIndex={-1}
              className="mt-4 text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] text-[#F5EDD8] outline-none"
            >
              Article temporarily unavailable.
            </h1>
            <p className="mx-auto mt-5 max-w-[52ch] leading-7 text-[#F5EDD8]/70">
              We could not load this article right now. Try again or return to the blog.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="btn-primary inline-flex min-h-12 items-center gap-2 px-6 py-3"
                onClick={() => setLoadAttempt((attempt) => attempt + 1)}
              >
                Try Again <ArrowIcon />
              </button>
              <Link
                to="/blog"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#E2C49A]/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#E2C49A] transition-colors hover:bg-[#C9A170]/10"
              >
                <ArrowIcon direction="left" /> Back to Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer hideCtaBanner />
      </>
    )
  }

  if (!article) {
    return (
      <>
        <Header />
        <PageMeta
          title="Article Not Found | Akrion Digitals"
          description="Return to the Akrion Digitals blog to explore available articles."
          path={`/blog/${slug}/`}
          noIndex
        />
        <main className="relative grid min-h-[72svh] place-items-center overflow-hidden bg-[#071A0F] px-4 pb-20 pt-32 text-center text-[#F5EDD8]">
          <div className="eth-pattern-subtle absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9A170]">Blog</p>
            <h1
              ref={titleRef}
              tabIndex={-1}
              className="mt-4 text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.95] text-[#F5EDD8] outline-none"
            >
              Article not found.
            </h1>
            <p className="mx-auto mt-5 max-w-[52ch] leading-7 text-[#F5EDD8]/70">
              This article is not available. Explore the current Akrion Digitals blog instead.
            </p>
            <Link to="/blog" className="btn-primary mt-8 inline-flex min-h-12 items-center gap-2 px-6 py-3">
              <ArrowIcon direction="left" /> Back to Blog
            </Link>
          </div>
        </main>
        <Footer hideCtaBanner />
      </>
    )
  }

  const relatedArticles = getRelatedArticles(article, articleCollection, 2)
  const formattedDate = formatPublishedDate(article.publishedAt)
  const contentParagraphs = String(article.body || article.content || '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
  const articlePath = getArticlePath(article)
  const articleUrl = toAbsoluteUrl(articlePath)
  const articleImage = toAbsoluteUrl(article.hero?.src)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    ...(articleImage ? { image: [articleImage] } : {}),
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

  return (
    <>
      <Header />
      <PageMeta
        title={article.seo?.title || `${article.title} | Akrion Digitals`}
        description={article.seo?.description || article.excerpt}
        image={article.seo?.image || article.hero?.src}
        imageAlt={article.hero?.alt || ''}
        path={articlePath}
        type="article"
        structuredData={structuredData}
      />

      <main className="blog-article-page overflow-hidden bg-[#071A0F]">
        <article aria-labelledby="blog-article-title">
          <header className="relative overflow-hidden bg-[#E7DCC7] px-4 pb-14 pt-32 sm:px-6 sm:pb-20 sm:pt-36 lg:px-10 lg:pb-24">
            <div className="eth-pattern-subtle absolute inset-0 opacity-55" aria-hidden="true" />
            <div
              className="absolute -right-36 top-16 h-96 w-96 rounded-full bg-[#C9A170]/20 blur-[110px]"
              aria-hidden="true"
            />
            <div className="relative z-10 mx-auto max-w-[1240px]">
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                  reducedMotion
                    ? undefined
                    : { duration: 0.58, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <Link
                  to="/blog"
                  className="blog-article-back inline-flex min-h-11 items-center gap-2 rounded-lg text-xs font-extrabold uppercase tracking-[0.15em] text-[#5E4025] transition-transform duration-300 hover:-translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D2A19]"
                >
                  <ArrowIcon direction="left" /> Back to Blog
                </Link>
              </motion.div>

              <div className="mt-10 grid items-end gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(28rem,1.14fr)] lg:gap-16">
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={
                    reducedMotion
                      ? undefined
                      : { duration: 0.68, delay: 0.05, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#76522F]">
                    {article.category && <span>{article.category}</span>}
                    {article.category && <span className="h-1 w-1 rounded-full bg-[#C9A170]" aria-hidden="true" />}
                    <span>{article.publisher}</span>
                    {(formattedDate || article.readingTime) && (
                      <span className="h-1 w-1 rounded-full bg-[#C9A170]" aria-hidden="true" />
                    )}
                    {formattedDate && <time dateTime={article.publishedAt}>{formattedDate}</time>}
                    {article.readingTime && <span>{article.readingTime}</span>}
                  </div>
                  <h1
                    id="blog-article-title"
                    ref={titleRef}
                    tabIndex={-1}
                    className="mt-5 max-w-[15ch] text-[clamp(2.8rem,6.8vw,6.2rem)] font-extrabold leading-[0.94] tracking-[-0.055em] text-[#0D2A19] outline-none"
                  >
                    {article.title}
                  </h1>
                  {article.introduction && (
                    <p className="mt-6 max-w-[46ch] text-[clamp(1.02rem,1.7vw,1.18rem)] leading-[1.7] text-[#31513E]">
                      {article.introduction}
                    </p>
                  )}
                  <span className="mt-8 block h-px w-20 bg-[#9E7A4A]" aria-hidden="true" />
                </motion.div>

                {article.hero && (
                  <motion.figure
                    className="relative min-h-0 overflow-hidden rounded-[1.5rem] border border-[#76522F]/35 bg-[#0A2014] shadow-[0_28px_70px_rgba(13,42,25,0.22)] sm:rounded-[2rem]"
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.985 }}
                    animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
                    transition={
                      reducedMotion
                        ? undefined
                        : { duration: 0.82, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <ResponsiveArticleImage
                      media={article.hero}
                      loading="eager"
                      fetchPriority="high"
                      sizes="(min-width: 1024px) 52vw, 100vw"
                      className="aspect-[3/2] h-full w-full object-cover"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071A0F]/30 via-transparent to-[#C9A170]/5"
                      aria-hidden="true"
                    />
                  </motion.figure>
                )}
              </div>
            </div>
          </header>

          <section className="relative bg-[#E7DCC7] px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
            <div className="dot-grid absolute inset-0 opacity-20" aria-hidden="true" />
            <Reveal
              reducedMotion={reducedMotion}
              className="relative z-10 mx-auto max-w-[760px]"
            >
              <div className="mb-10 flex items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-[#76522F]/25" />
                <span className="h-2 w-2 rotate-45 border border-[#9E7A4A]" />
                <span className="h-px flex-1 bg-[#76522F]/25" />
              </div>
              <div className="space-y-7">
                {contentParagraphs.map((paragraph, index) => (
                  <p
                    key={`${article.slug}-paragraph-${index}`}
                    className="text-[clamp(1.12rem,2.1vw,1.32rem)] leading-[1.78] text-[#183A27]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </section>
        </article>

        {relatedArticles.length > 0 && (
          <aside
            className="relative bg-[#071A0F] px-4 py-16 sm:px-6 sm:py-24 lg:px-10"
            aria-labelledby="related-articles-heading"
          >
            <div className="eth-pattern-subtle absolute inset-0 opacity-25" aria-hidden="true" />
            <div className="relative z-10 mx-auto max-w-[1200px]">
              <Reveal reducedMotion={reducedMotion}>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#C9A170]">
                  More from Akrion
                </p>
                <h2
                  id="related-articles-heading"
                  className="mt-3 text-[clamp(2.2rem,5vw,4.2rem)] leading-none text-[#F5EDD8]"
                >
                  Related Articles
                </h2>
              </Reveal>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {relatedArticles.map((relatedArticle, index) => (
                  <Reveal
                    key={relatedArticle.slug}
                    reducedMotion={reducedMotion}
                    delay={index * 0.07}
                  >
                    <Link
                      to={getArticlePath(relatedArticle)}
                      className="blog-article-related-card group grid min-h-full overflow-hidden rounded-[1.4rem] border border-[#C9A170]/20 bg-[#E7DCC7] text-[#0D2A19] shadow-[0_20px_45px_rgba(0,0,0,0.18)] transition-[transform,border-color,box-shadow] duration-[380ms] hover:-translate-y-1.5 hover:border-[#C9A170]/70 hover:shadow-[0_28px_62px_rgba(0,0,0,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2C49A] sm:grid-cols-[minmax(11rem,0.8fr)_minmax(0,1.2fr)]"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-[#0A2014] sm:aspect-auto sm:min-h-64">
                        <ResponsiveArticleImage
                          media={relatedArticle.hero}
                          sizes="(min-width: 768px) 24vw, 100vw"
                          className="blog-article-related-image h-full w-full object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.035]"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col p-6 sm:p-7">
                        <p className="text-[0.67rem] font-extrabold uppercase tracking-[0.16em] text-[#76522F]">
                          {relatedArticle.category}
                        </p>
                        <h3 className="mt-3 text-[clamp(1.35rem,2.7vw,2rem)] leading-[1.08] text-[#0D2A19]">
                          {relatedArticle.title}
                        </h3>
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#31513E]">
                          {relatedArticle.excerpt}
                        </p>
                        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-extrabold uppercase tracking-[0.13em] text-[#76522F]">
                          Read Article
                          <span className="blog-article-related-arrow transition-transform duration-300 group-hover:translate-x-1">
                            <ArrowIcon />
                          </span>
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </aside>
        )}

        <section className="relative bg-[#E7DCC7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
          <div className="eth-pattern-subtle absolute inset-0 opacity-45" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 border-t border-[#76522F]/25 pt-10 sm:flex-row sm:items-center">
            <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] leading-none text-[#0D2A19]">
              Have a project in mind?
            </h2>
            <Link
              to="/contact"
              className="blog-article-page-cta inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#0D2A19] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.08em] text-[#F5EDD8] shadow-[0_12px_28px_rgba(13,42,25,0.18)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-[#153D26] hover:shadow-[0_18px_36px_rgba(13,42,25,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D2A19]"
            >
              Start a Project <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>

      <Footer hideCtaBanner />
    </>
  )
}

export default BlogArticle
