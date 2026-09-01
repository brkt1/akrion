import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { testimonialsAPI } from '../../lib/api/testimonials'
import AdminIcon from './AdminIcons'
import { AdminField, AdminLoading, AdminNotice, AdminPageHeader, AdminStatusBadge, useUnsavedWarning } from './AdminUi'

const emptyForm = { client_name: '', client_role: '', client_company: '', quotation: '', project_image: '', verified_result: '', rating: '', is_verified: false, status: 'draft', sort_order: 0 }

const AdminTestimonials = () => {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [initial, setInitial] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const dirty = JSON.stringify(form) !== JSON.stringify(initial)
  useUnsavedWarning(Boolean(editing) && dirty)

  const load = useCallback(async () => { setLoading(true); try { setItems(await testimonialsAPI.getAll()) } finally { setLoading(false) } }, [])
  useEffect(() => { load() }, [load])
  const open = (item = null) => {
    const next = item ? { ...emptyForm, ...item, rating: item.rating ?? '' } : { ...emptyForm, sort_order: items.length }
    setEditing(item?.id || 'new'); setForm(next); setInitial(next); setMessage(null)
  }
  const change = (event) => { const { name, value, type, checked } = event.target; setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value })) }
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage(null)
    const payload = { ...form, client_name: form.client_name.trim(), quotation: form.quotation.trim(), client_role: form.client_role.trim() || null, client_company: form.client_company.trim() || null, project_image: form.project_image.trim() || null, verified_result: form.verified_result.trim() || null, rating: form.rating === '' ? null : Number(form.rating), sort_order: Number(form.sort_order), published_at: form.status === 'published' ? new Date().toISOString() : null }
    try { if (editing === 'new') await testimonialsAPI.create(payload); else await testimonialsAPI.update(editing, payload); await load(); setEditing(null); setMessage({ tone:'success', text:'Testimonial saved.' }) }
    catch { setMessage({ tone:'error', text:'The testimonial could not be saved. Check the required fields and permissions.' }) }
    finally { setSaving(false) }
  }

  return <div className="admin-page">
    <AdminPageHeader eyebrow="Verified social proof" title="Testimonials" description="Add multiple client testimonials. Publish only authentic quotations and verified results." actions={<><Link to="/#testimonials" target="_blank" className="admin-button admin-button--secondary"><AdminIcon name="external"/>View section</Link><button className="admin-button" onClick={() => open()}><AdminIcon name="plus"/>Add testimonial</button></>} />
    <AdminNotice tone="info" title="Verification required"><p>Portrait images appear as the card’s visual background. Draft or unverified entries never appear publicly.</p></AdminNotice>
    {message && <AdminNotice tone={message.tone} title={message.tone === 'success' ? 'Saved' : 'Unable to save'}><p>{message.text}</p></AdminNotice>}
    {editing && <form className="admin-panel admin-editor-form" onSubmit={save}>
      <div className="admin-form-grid"><AdminField label="Client name" htmlFor="testimonial-name" required><input id="testimonial-name" name="client_name" value={form.client_name} onChange={change} required /></AdminField><AdminField label="Role" htmlFor="testimonial-role"><input id="testimonial-role" name="client_role" value={form.client_role || ''} onChange={change}/></AdminField><AdminField label="Company" htmlFor="testimonial-company"><input id="testimonial-company" name="client_company" value={form.client_company || ''} onChange={change}/></AdminField><AdminField label="Portrait / background image URL" htmlFor="testimonial-image" help="Upload the portrait to Media Library, then paste its public URL."><input id="testimonial-image" name="project_image" type="url" value={form.project_image || ''} onChange={change}/></AdminField><AdminField label="Quotation" htmlFor="testimonial-quote" required><textarea id="testimonial-quote" name="quotation" rows="5" value={form.quotation} onChange={change} required /></AdminField><AdminField label="Verified result" htmlFor="testimonial-result"><input id="testimonial-result" name="verified_result" value={form.verified_result || ''} onChange={change}/></AdminField><AdminField label="Rating" htmlFor="testimonial-rating" optional><input id="testimonial-rating" name="rating" type="number" min="1" max="5" step="0.5" value={form.rating} onChange={change}/></AdminField><AdminField label="Display order" htmlFor="testimonial-order"><input id="testimonial-order" name="sort_order" type="number" min="0" value={form.sort_order} onChange={change}/></AdminField><AdminField label="Status" htmlFor="testimonial-status"><select id="testimonial-status" name="status" value={form.status} onChange={change}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></AdminField><label className="admin-checkbox"><input name="is_verified" type="checkbox" checked={form.is_verified} onChange={change}/><span>Authentic quotation and client identity verified</span></label></div>
      <div className="admin-form-actions"><button type="button" className="admin-button admin-button--secondary" onClick={() => setEditing(null)}>Cancel</button><button className="admin-button" disabled={saving || !form.client_name.trim() || !form.quotation.trim()}>{saving ? 'Saving…' : 'Save testimonial'}</button></div>
    </form>}
    {loading ? <AdminLoading/> : <div className="admin-testimonial-list">{items.map((item) => <article className="admin-panel admin-testimonial-row" key={item.id}>{item.project_image ? <img src={item.project_image} alt=""/> : <span className="admin-testimonial-avatar">{item.client_name.split(/\s+/).map((part) => part[0]).join('').slice(0,2)}</span>}<div><h3>{item.client_name}</h3><p>{item.client_role}{item.client_role && item.client_company ? ', ' : ''}{item.client_company}</p><blockquote>“{item.quotation}”</blockquote></div><AdminStatusBadge status={item.status}/><button className="admin-button admin-button--secondary" onClick={() => open(item)}>Edit</button></article>)}</div>}
  </div>
}
export default AdminTestimonials
