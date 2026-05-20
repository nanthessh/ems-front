import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { announcementService } from '../api/announcementService'
import { useAuth } from '../context/AuthContext'

const priorityColor = { Low: 'badge-green', Normal: 'badge-blue', High: 'badge-yellow', Urgent: 'badge-red' }
const priorityIcon  = { Low: '📢', Normal: '📣', High: '⚠️', Urgent: '🚨' }
const empty = { id: 0, title: '', content: '', priority: 'Normal', expiresOn: '' }

export default function Announcements() {
  const { isAdmin } = useAuth()
  const [items, setItems]       = useState([])
  const [form, setForm]         = useState(empty)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [msg, setMsg]           = useState({ text: '', type: '' })

  const flash = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000) }

  const load = () => announcementService.getAll().then(setItems)
  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (form.id) await announcementService.update(form)
      else await announcementService.create(form)
      flash(form.id ? 'Updated!' : 'Posted!'); setShowForm(false); setForm(empty); load()
    } catch { flash('Failed to save.', 'error') }
  }

  const handleDelete = async () => {
    await announcementService.remove(deleteId)
    setDeleteId(null); flash('Deleted.'); load()
  }

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  return (
    <div className="layout">
      <div className="bg-blobs"><div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/></div>
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1>📣 Announcements</h1>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => { setForm(empty); setShowForm(!showForm) }}>
              {showForm ? 'Cancel' : '+ New Announcement'}
            </button>
          )}
        </div>

        {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

        {/* Post Form */}
        {isAdmin && showForm && (
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="section-title">{form.id ? 'Edit' : 'New'} Announcement</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="Announcement title" value={form.title} onChange={set('title')} required />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  placeholder="Write your announcement..."
                  value={form.content}
                  onChange={set('content')}
                  required
                  style={{ width: '100%', minHeight: 100, padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: '0.875rem', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={form.priority} onChange={set('priority')}>
                    {['Low','Normal','High','Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Expires On (optional)</label>
                  <input type="date" value={form.expiresOn || ''} onChange={set('expiresOn')} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">{form.id ? 'Update' : 'Post'} Announcement</button>
            </form>
          </div>
        )}

        {/* Announcement Cards */}
        {items.length === 0
          ? <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No announcements yet.</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <div key={item.id} className="glass-card announcement-card">
                  <div className="announcement-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{priorityIcon[item.priority]}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                          Posted by {item.postedBy} · {new Date(item.postedOn).toLocaleDateString()}
                          {item.expiresOn && ` · Expires ${new Date(item.expiresOn).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${priorityColor[item.priority] || ''}`}>{item.priority}</span>
                      {isAdmin && (
                        <>
                          <button className="btn btn-sm btn-edit" onClick={() => { setForm({ ...item, expiresOn: item.expiresOn ? item.expiresOn.split('T')[0] : '' }); setShowForm(true) }}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(item.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.75rem', lineHeight: 1.6 }}>{item.content}</p>
                </div>
              ))}
            </div>
          )
        }

        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
              <h3>Delete Announcement?</h3>
              <p>This action cannot be undone.</p>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
