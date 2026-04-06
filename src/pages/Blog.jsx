import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ScrollAnimation, { StaggerContainer, StaggerItem } from '../components/ScrollAnimation'
import { authAPI } from '../lib/api/auth'
import { blogAPI } from '../lib/api/blog'
import { uploadAPI } from '../lib/api/upload'

const GOLD = '#C9A170'
const GOLD_LIGHT = '#E2C49A'
const CARD_BG = 'rgba(19,32,25,0.9)'
const CARD_BORDER = 'rgba(201,161,112,0.1)'
const INPUT_STYLE = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(201,161,112,0.05)',
  border: '1px solid rgba(201,161,112,0.15)',
  borderRadius: '12px', color: '#F0EAD6', fontSize: '14px',
  outline: 'none', transition: 'border-color 0.2s, background 0.2s',
}

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '', content: '', author: '',
    date: new Date().toISOString().split('T')[0],
    image: '', category: ''
  })

  useEffect(() => {
    loadPosts()
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const adminMode = localStorage.getItem('blogAdminMode') === 'true'
    if (adminMode) {
      const isActuallyAdmin = await authAPI.isAdmin()
      setIsAdmin(isActuallyAdmin)
      if (!isActuallyAdmin) localStorage.removeItem('blogAdminMode')
    } else {
      setIsAdmin(false)
    }
  }

  const loadPosts = async () => {
    try { setLoading(true); setError(null); const data = await blogAPI.getAll(); setPosts(data) }
    catch (err) { console.error(err); setError('Failed to load blog posts.') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true); setError(null)
      if (editingPost) { await blogAPI.update(editingPost.id, formData) }
      else { await blogAPI.create(formData) }
      await loadPosts()
      setFormData({ title: '', content: '', author: '', date: new Date().toISOString().split('T')[0], image: '', category: '' })
      setShowForm(false); setIsEditing(false); setEditingPost(null)
    } catch (err) { console.error(err); setError('Failed to save post.') }
    finally { setLoading(false) }
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setFormData({ title: post.title, content: post.content, author: post.author, date: post.date, image: post.image || '', category: post.category || '' })
    setShowForm(true); setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      try { setLoading(true); await blogAPI.delete(id); await loadPosts() }
      catch (err) { setError('Failed to delete post.') }
      finally { setLoading(false) }
    }
  }


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be < 5MB'); return }
    try {
      setUploading(true); setError(null)
      const imageUrl = await uploadAPI.uploadImage(file, 'blog')
      setFormData({ ...formData, image: imageUrl })
    } catch (err) { setError('Failed to upload image.') }
    finally { setUploading(false) }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen relative overflow-hidden" style={{ background: '#0D1F13' }}>
        <div className="fixed inset-0 dot-grid opacity-30 z-0 pointer-events-none" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[160px] z-0 pointer-events-none" style={{ background: 'rgba(201,161,112,0.04)' }} />

        <div className="relative z-10 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-10 sm:gap-14">

            {/* Header */}
            <div>
              <ScrollAnimation animation="fadeUp" delay={0.1}>
                <div className="section-label mb-4"><span className="section-dot" />Insights &amp; Stories</div>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.2} duration={0.8}>
                <h1 className="section-heading text-[clamp(3rem,8vw,5.5rem)]">BLOG</h1>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={0.35}>
                <p className="text-lg leading-relaxed mt-4 max-w-2xl font-light" style={{ color: 'rgba(201,161,112,0.5)' }}>
                  Creative insights, digital storytelling, and design trends from the Akrion team.
                </p>
              </ScrollAnimation>
                {isAdmin && (
                  <button
                    onClick={() => { setShowForm(!showForm); if (showForm) { setIsEditing(false); setEditingPost(null); setFormData({ title:'',content:'',author:'',date:new Date().toISOString().split('T')[0],image:'',category:'' }) }}}
                    className="btn-primary text-sm px-5 py-2.5"
                  >{showForm ? 'Cancel' : '+ New Post'}</button>
                )}
            </div>

            {/* Admin form */}
            {showForm && (
              <div className="p-6 sm:p-8 rounded-2xl border" style={{ background: CARD_BG, borderColor: 'rgba(201,161,112,0.2)', backdropFilter: 'blur(20px)' }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#F0EAD6' }}>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'title', label: 'Title', placeholder: 'Post title', required: true, type: 'text' },
                      { name: 'author', label: 'Author', placeholder: 'Author name', required: true, type: 'text' },
                      { name: 'date', label: 'Date', placeholder: '', required: true, type: 'date' },
                      { name: 'category', label: 'Category', placeholder: 'e.g. Design', type: 'text' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>{f.label}</label>
                        <input type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange} style={INPUT_STYLE} placeholder={f.placeholder} required={f.required}
                          onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="w-full text-sm cursor-pointer" style={{ ...INPUT_STYLE, padding: '10px 16px' }} />
                    {uploading && <p className="text-xs mt-1" style={{ color: GOLD }}>Uploading…</p>}
                    {!uploading && (
                      <input type="url" name="image" value={formData.image} onChange={handleChange} style={{ ...INPUT_STYLE, marginTop: '8px' }} placeholder="Or paste image URL"
                        onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(201,161,112,0.45)' }}>Content</label>
                    <textarea name="content" value={formData.content} onChange={handleChange} rows="5" style={INPUT_STYLE} placeholder="Post content…" required
                      onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.15)'} />
                  </div>
                  <button type="submit" className="btn-primary self-start px-7 py-3">{isEditing ? 'Update Post' : 'Create Post'}</button>
                </form>
              </div>
            )}

            {error && <div className="p-4 rounded-xl text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

            {/* Posts grid */}
            {loading && posts.length === 0 ? (
              <div className="text-center py-16 text-sm" style={{ color: 'rgba(201,161,112,0.4)' }}>Loading blog posts…</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-sm" style={{ color: 'rgba(201,161,112,0.4)' }}>No blog posts yet. {isAdmin && 'Create your first post!'}</div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" staggerDelay={0.08}>
                {posts.map((post) => (
                  <StaggerItem key={post.id}>
                    <article
                      className="group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-400 hover:-translate-y-1"
                      style={{ background: CARD_BG, borderColor: CARD_BORDER, backdropFilter: 'blur(16px)' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,161,112,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = CARD_BORDER}
                    >
                      {/* Image */}
                      {post.image && (
                        <div className="aspect-video overflow-hidden">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {post.category && (
                          <span className="tag-pill mb-3 inline-block">{post.category}</span>
                        )}
                        <h3 className="text-base sm:text-lg font-bold mb-2 leading-snug transition-colors duration-200" style={{ color: '#F0EAD6' }}
                          onMouseEnter={e => e.currentTarget.style.color = GOLD_LIGHT}
                          onMouseLeave={e => e.currentTarget.style.color = '#F0EAD6'}
                        >
                          {post.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 line-clamp-3 font-light" style={{ color: 'rgba(201,161,112,0.5)' }}>
                          {post.content}
                        </p>
                        <div className="flex justify-between items-center text-xs pt-4" style={{ borderTop: `1px solid ${CARD_BORDER}`, color: 'rgba(201,161,112,0.35)' }}>
                          <span>{post.author}</span>
                          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-3 mt-4 pt-4" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(post) }} className="text-xs transition-colors" style={{ color: GOLD }}>Edit</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id) }} className="text-xs text-red-400">Delete</button>
                          </div>
                        )}
                      </div>
                    </article>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Blog
