import { useState, useEffect } from 'react'

const empty = { id: 0, name: '', email: '', departmentId: '', salary: '', joinedDate: '' }

export default function EmployeeModal({ employee, departments, onSave, onClose }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (employee) {
      setForm({
        ...employee,
        joinedDate: employee.joinedDate ? employee.joinedDate.split('T')[0] : '',
      })
    } else {
      setForm({ ...empty, joinedDate: new Date().toISOString().split('T')[0] })
    }
  }, [employee])

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, departmentId: Number(form.departmentId), salary: Number(form.salary) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{form.id ? 'Edit Employee' : 'Add Employee'}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Full name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Email address" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={form.departmentId} onChange={set('departmentId')} required>
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Salary</label>
              <input type="number" placeholder="Salary amount" value={form.salary} onChange={set('salary')} required min="0" />
            </div>
            <div className="form-group">
              <label>Joined Date</label>
              <input type="date" value={form.joinedDate} onChange={set('joinedDate')} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {form.id ? 'Update' : 'Add'} Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
