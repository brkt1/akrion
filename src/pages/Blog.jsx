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
import { authAPI } from '../lib/api/auth'
import { blogAPI } from '../lib/api/blog'
import { uploadAPI } from '../lib/api/upload'

const EMPTY_FORM = {
  title: '',
  content: '',
  author: 'Akrion Digitals',
  date: '',
  image: '',
  category: '',
}
const INPUT_STYLE = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(201,161,112,0.05)',
  border: '1px solid rgba(201,161,112,0.18)',
  borderRadius: '12px',
  color: '#F0EAD6',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
}

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

const ArticleCard = ({ article, featured = false, isAdmin, onEdit, onDelete }) => (
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

    {isAdmin && article.sourceRecord && (
      <div className="blog-admin-card-actions">
        <button type="button" onClick={() => onEdit(article.sourceRecord)}>Edit</button>
        <button type="button" onClick={() => onDelete(article.sourceRecord.id)}>Delete</button>
      </div>
    )}
  </article>
)

const Blog = () => {
  const [records, setRecords] = useState([])
  const [hasLoadedRecords, setHasLoadedRecords] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await blogAPI.getAll()
        setRecords(data)
        setHasLoadedRecords(true)
      } catch (loadError) {
        console.error('Unable to load live blog records; using the local editorial edition.', loadError)
        setError('The latest posts could not be checked. Showing the saved editorial edition.')
      } finally {
        setLoading(false)
      }
    }

    const checkAdmin = async () => {
      const adminMode = localStorage.getItem('blogAdminMode') === 'true'
      if (!adminMode) {
        setIsAdmin(false)
        return
      }
      const isActuallyAdmin = await authAPI.isAdmin()
      setIsAdmin(isActuallyAdmin)
      if (!isActuallyAdmin) localStorage.removeItem('blogAdminMode')
    }

    loadPosts()
    checkAdmin()
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
    () => (hasLoadedRecords ? mergeBlogRecords(records) : blogArticles),
    [hasLoadedRecords, records],
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

  const loadPosts = async () => {
    const data = await blogAPI.getAll()
    setRecords(data)
    setHasLoadedRecords(true)
  }

  const resetForm = () => {
    setFormData(EMPTY_FORM)
    setEditingPost(null)
    setShowForm(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setError(null)
      if (editingPost) await blogAPI.update(editingPost.id, formData)
      else await blogAPI.create(formData)
      await loadPosts()
      resetForm()
    } catch (saveError) {
      console.error(saveError)
      setError('Failed to save the article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setFormData({
      title: post.title || '',
      content: post.content || '',
      author: post.author === 'Akrion Team' ? 'Akrion Digitals' : post.author || 'Akrion Digitals',
      date: post.date || '',
      image: post.image || '',
      category: post.category || '',
    })
    setShowForm(true)
    window.requestAnimationFrame(() => document.getElementById('blog-admin-form')?.scrollIntoView({ block: 'start' }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return
    try {
      setLoading(true)
      setError(null)
      await blogAPI.delete(id)
      await loadPosts()
    } catch (deleteError) {
      console.error(deleteError)
      setError('Failed to delete the article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.')
      return
    }

    try {
      setUploading(true)
      setError(null)
      const imageUrl = await uploadAPI.uploadImage(file, 'blog')
      setFormData((current) => ({ ...current, image: imageUrl }))
    } catch (uploadError) {
      console.error(uploadError)
      setError('Failed to upload the image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

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
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => (showForm ? resetForm() : setShowForm(true))}
                  className="btn-primary blog-admin-new"
                >
                  {showForm ? 'Cancel' : '+ New Article'}
                </button>
              )}
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

            {showForm && (
              <div id="blog-admin-form" className="blog-admin-form">
                <h2>{editingPost ? 'Edit Article' : 'Create New Article'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="blog-admin-fields">
                    {[
                      { name: 'title', label: 'Title', placeholder: 'Article title', required: true, type: 'text' },
                      { name: 'author', label: 'Publisher', placeholder: 'Akrion Digitals', required: true, type: 'text' },
                      { name: 'date', label: 'Verified publication date', placeholder: '', required: true, type: 'date' },
                      { name: 'category', label: 'Category', placeholder: 'e.g. Branding', required: true, type: 'text' },
                    ].map((field) => (
                      <div key={field.name}>
                        <label htmlFor={`blog-${field.name}`}>{field.label}</label>
                        <input
                          id={`blog-${field.name}`}
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={(event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))}
                          style={INPUT_STYLE}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label htmlFor="blog-image">Article image</label>
                    <input id="blog-image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="blog-admin-file" style={INPUT_STYLE} />
                    {uploading ? (
                      <p className="blog-admin-status">Uploading…</p>
                    ) : (
                      <input
                        aria-label="Article image URL"
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={(event) => setFormData((current) => ({ ...current, image: event.target.value }))}
                        style={{ ...INPUT_STYLE, marginTop: '8px' }}
                        placeholder="Or paste an image URL"
                      />
                    )}
                  </div>
                  <div>
                    <label htmlFor="blog-content">Content</label>
                    <textarea id="blog-content" name="content" value={formData.content} onChange={(event) => setFormData((current) => ({ ...current, content: event.target.value }))} rows="6" style={INPUT_STYLE} required />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading || uploading}>
                    {loading ? 'Saving…' : editingPost ? 'Update Article' : 'Create Article'}
                  </button>
                </form>
              </div>
            )}

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
                    <ArticleCard article={featuredArticle} featured isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
                  </ScrollAnimation>
                )}

                {supportingArticles.length > 0 && (
                  <StaggerContainer className="blog-editorial-grid" staggerDelay={0.1} respectReducedMotion>
                    {supportingArticles.map((article) => (
                      <StaggerItem key={article.slug}>
                        <ArticleCard article={article} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                )}
              </>
            )}

            {loading && !showForm && <p className="blog-loading-note" aria-live="polite">Checking for the latest articles…</p>}
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
