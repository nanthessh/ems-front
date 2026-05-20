import { useState, useEffect } from 'react'

const empty = { id: 0, name: '', description: '' }

export default function DepartmentModal({ department, onSave, onClose }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    setForm(department ? { ...department } : empty)
  }, [department])

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{form.id ? 'Edit Department' : 'Add Department'}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Department name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" placeholder="Short description (optional)" value={form.description || ''} onChange={set('description')} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {form.id ? 'Update' : 'Add'} Department
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
