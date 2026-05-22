import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import { leaveService } from '../api/leaveService'
import { employeeService } from '../api/employeeService'
import { useAuth } from '../context/AuthContext'

const statusColor = { Pending: 'badge-yellow', Approved: 'badge-green', Rejected: 'badge-red' }
const empty = { employeeId: '', leaveTypeId: '', startDate: '', endDate: '', reason: '' }

export default function Leave() {
  const { isAdmin } = useAuth()
  const [requests, setRequests]   = useState([])
  const [types, setTypes]         = useState([])
  const [balance, setBalance]     = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm]           = useState(empty)
  const [showForm, setShowForm]   = useState(false)
  const [filterStatus, setFilter] = useState('')
  const [msg, setMsg]             = useState({ text: '', type: '' })
  const [loading, setLoading]     = useState(false)

  const flash = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [t, r] = await Promise.all([
        leaveService.getTypes(),
        isAdmin ? leaveService.getAll(filterStatus || null) : Promise.resolve([]),
      ])
      setTypes(t)
      setRequests(r)
    } finally { setLoading(false) }
  }, [isAdmin, filterStatus])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (isAdmin) employeeService.getAll().then(setEmployees)
  }, [isAdmin])

  const loadBalance = async (empId) => {
    if (!empId) return
    const b = await leaveService.getBalance(empId, new Date().getFullYear())
    setBalance(b)
  }

  const handleApply = async (e) => {
    e.preventDefault()
    try {
      await leaveService.apply({ ...form, employeeId: Number(form.employeeId), leaveTypeId: Number(form.leaveTypeId) })
      flash('Leave request submitted!')
      setShowForm(false); setForm(empty); load()
    } catch { flash('Failed to submit.', 'error') }
  }

  const handleStatus = async (id, status) => {
    const note = status === 'Rejected' ? prompt('Reason for rejection (optional):') : null
    await leaveService.updateStatus({ id, status, adminNote: note })
    flash(`Leave ${status.toLowerCase()} successfully.`); load()
  }

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  return (
    <div className="layout">
      <div className="bg-blobs"><div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/></div>
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1>🏖 Leave Management</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Apply Leave'}
          </button>
        </div>

        {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

        {/* Apply Leave Form */}
        {showForm && (
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="section-title">Apply for Leave</h3>
            <form onSubmit={handleApply} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {isAdmin && (
                <div className="form-group">
                  <label>Employee</label>
                  <select value={form.employeeId} onChange={(e) => { set('employeeId')(e); loadBalance(e.target.value) }} required>
                    <option value="">Select Employee</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Leave Type</label>
                <select value={form.leaveTypeId} onChange={set('leaveTypeId')} required>
                  <option value="">Select Type</option>
                  {types.map(t => <option key={t.id} value={t.id}>{t.name} ({t.maxDays} days)</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={form.startDate} onChange={set('startDate')} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={form.endDate} onChange={set('endDate')} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Reason</label>
                <input type="text" placeholder="Reason for leave" value={form.reason} onChange={set('reason')} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        )}

        {/* Leave Balance */}
        {balance.length > 0 && (
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 className="section-title">📊 Leave Balance</h3>
            <div className="stats-grid">
              {balance.map(b => (
                <div key={b.leaveTypeId} className="stat-card glass-card blue-glow">
                  <div className="stat-info">
                    <div className="stat-label">{b.leaveTypeName}</div>
                    <div className="stat-number" style={{ fontSize: '1.2rem' }}>{b.remainingDays} <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>/ {b.maxDays}</span></div>
                    <div className="stat-label">Remaining</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin: All Requests */}
        {isAdmin && (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {['', 'Pending', 'Approved', 'Rejected'].map(s => (
                <button key={s} className={`btn btn-ghost ${filterStatus === s ? 'nav-active' : ''}`} onClick={() => setFilter(s)}>
                  {s || 'All'}
                </button>
              ))}
            </div>
            <div className="table-wrapper">
              {loading ? <div className="empty">Loading...</div> : (
                <table className="table">
                  <thead>
                    <tr><th>#</th><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {requests.length === 0
                      ? <tr><td colSpan={9} className="empty">No leave requests.</td></tr>
                      : requests.map((r, i) => (
                        <tr key={r.id}>
                          <td data-label="#">{i + 1}</td>
                          <td data-label="Employee">{r.employeeName}</td>
                          <td data-label="Type"><span className="badge">{r.leaveTypeName}</span></td>
                          <td data-label="From">{new Date(r.startDate).toLocaleDateString()}</td>
                          <td data-label="To">{new Date(r.endDate).toLocaleDateString()}</td>
                          <td data-label="Days">{r.totalDays}</td>
                          <td data-label="Reason" style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</td>
                          <td data-label="Status"><span className={`badge ${statusColor[r.status] || ''}`}>{r.status}</span></td>
                          <td data-label="Actions">
                            {r.status === 'Pending' && (
                              <>
                                <button className="btn btn-sm btn-action green-btn" style={{ marginRight: '0.3rem' }} onClick={() => handleStatus(r.id, 'Approved')}>✓</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleStatus(r.id, 'Rejected')}>✗</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
