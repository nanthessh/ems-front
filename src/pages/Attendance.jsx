import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import { attendanceService } from '../api/attendanceService'
import { employeeService } from '../api/employeeService'
import { useAuth } from '../context/AuthContext'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const statusColor = { Present: 'badge-green', Late: 'badge-yellow', Absent: 'badge-red', 'Half-Day': 'badge-orange' }

export default function Attendance() {
  const { user, isAdmin } = useAuth()
  const now = new Date()
  const [records, setRecords]     = useState([])
  const [employees, setEmployees] = useState([])
  const [summary, setSummary]     = useState(null)
  const [month, setMonth]         = useState(now.getMonth() + 1)
  const [year, setYear]           = useState(now.getFullYear())
  const [empId, setEmpId]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [msg, setMsg]             = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (isAdmin) {
        const data = empId
          ? await attendanceService.getByEmployee(empId, month, year)
          : await attendanceService.getAll(month, year)
        setRecords(data)
        if (empId) {
          const s = await attendanceService.getSummary(empId, month, year)
          setSummary(s)
        } else setSummary(null)
      } else {
        // User sees own attendance — needs employeeId from profile
        // For now load today
        const data = await attendanceService.getToday()
        setRecords(data)
      }
    } finally { setLoading(false) }
  }, [isAdmin, empId, month, year])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (isAdmin) employeeService.getAll().then(setEmployees)
  }, [isAdmin])

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const handleCheckIn = async (id) => {
    await attendanceService.checkIn({ employeeId: Number(id) })
    flash('✅ Checked in!'); load()
  }
  const handleCheckOut = async (id) => {
    await attendanceService.checkOut(Number(id))
    flash('✅ Checked out!'); load()
  }

  return (
    <div className="layout">
      <div className="bg-blobs"><div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/></div>
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1>🕐 Attendance</h1>
        </div>

        {msg && <div className="alert success">{msg}</div>}

        {/* Summary Cards */}
        {summary && (
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Days', value: summary.totalDays, color: 'blue' },
              { label: 'Present',    value: summary.presentDays, color: 'green' },
              { label: 'Late',       value: summary.lateDays, color: 'purple' },
              { label: 'Absent',     value: summary.absentDays, color: 'pink' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`stat-card glass-card ${color}-glow`}>
                <div className={`stat-icon-wrap ${color}-icon`}>{value}</div>
                <div className="stat-info"><div className="stat-label">{label}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="filter-select" value={month} onChange={e => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <select className="filter-select" value={year} onChange={e => setYear(Number(e.target.value))}>
            {[2023,2024,2025].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {isAdmin && (
            <select className="filter-select" value={empId} onChange={e => setEmpId(e.target.value)}>
              <option value="">All Employees</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          )}
          {isAdmin && empId && (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
              <button className="btn btn-action blue-btn" onClick={() => handleCheckIn(empId)}>Check In</button>
              <button className="btn btn-action green-btn" onClick={() => handleCheckOut(empId)}>Check Out</button>
            </div>
          )}
        </div>

        <div className="table-wrapper">
          {loading ? <div className="empty">Loading...</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  {isAdmin && <th>Employee</th>}
                  {isAdmin && <th>Department</th>}
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0
                  ? <tr><td colSpan={isAdmin ? 8 : 5} className="empty">No records found.</td></tr>
                  : records.map((r, i) => (
                    <tr key={r.id}>
                      <td data-label="#">{i + 1}</td>
                      {isAdmin && <td data-label="Employee">{r.employeeName}</td>}
                      {isAdmin && <td data-label="Department"><span className="badge">{r.departmentName}</span></td>}
                      <td data-label="Date">{new Date(r.date).toLocaleDateString()}</td>
                      <td data-label="Check In">{r.checkIn || '—'}</td>
                      <td data-label="Check Out">{r.checkOut || '—'}</td>
                      <td data-label="Status"><span className={`badge ${statusColor[r.status] || ''}`}>{r.status}</span></td>
                      <td data-label="Notes">{r.notes || '—'}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
