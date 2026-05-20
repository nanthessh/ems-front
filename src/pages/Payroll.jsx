import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import { payrollService } from '../api/payrollService'
import { employeeService } from '../api/employeeService'
import { useAuth } from '../context/AuthContext'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const emptyForm = { employeeId: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), houseAllowance: 0, transportAllow: 0, overtimePay: 0, taxDeduction: 0, otherDeductions: 0 }

export default function Payroll() {
  const { isAdmin } = useAuth()
  const [records, setRecords]     = useState([])
  const [employees, setEmployees] = useState([])
  const [slip, setSlip]           = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [showForm, setShowForm]   = useState(false)
  const [filterMonth, setFMonth]  = useState(new Date().getMonth() + 1)
  const [filterYear, setFYear]    = useState(new Date().getFullYear())
  const [msg, setMsg]             = useState({ text: '', type: '' })
  const [loading, setLoading]     = useState(false)

  const flash = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await payrollService.getAll(filterMonth, filterYear)
      setRecords(data)
    } finally { setLoading(false) }
  }, [filterMonth, filterYear])

  useEffect(() => { if (isAdmin) load() }, [load, isAdmin])
  useEffect(() => { if (isAdmin) employeeService.getAll().then(setEmployees) }, [isAdmin])

  const handleGenerate = async (e) => {
    e.preventDefault()
    try {
      await payrollService.generate({ ...form, employeeId: Number(form.employeeId), month: Number(form.month), year: Number(form.year) })
      flash('Payroll generated!'); setShowForm(false); setForm(emptyForm); load()
    } catch { flash('Failed to generate payroll.', 'error') }
  }

  const handleMarkPaid = async (id) => {
    await payrollService.updateStatus({ id, status: 'Paid' })
    flash('Marked as Paid.'); load()
  }

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  return (
    <div className="layout">
      <div className="bg-blobs"><div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/></div>
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1>💰 Payroll</h1>
          {isAdmin && <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Generate Payroll'}</button>}
        </div>

        {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

        {/* Pay Slip Modal */}
        {slip && (
          <div className="modal-overlay" onClick={() => setSlip(null)}>
            <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📄 Pay Slip — {MONTHS[slip.month - 1]} {slip.year}</h3>
                <button className="close-btn" onClick={() => setSlip(null)}>✕</button>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>{slip.employeeName} · {slip.departmentName}</p>
                <div className="payslip-grid">
                  <div className="payslip-section">
                    <div className="payslip-title">Earnings</div>
                    <div className="payslip-row"><span>Basic Salary</span><span>${Number(slip.basicSalary).toLocaleString()}</span></div>
                    <div className="payslip-row"><span>House Allowance</span><span>${Number(slip.houseAllowance).toLocaleString()}</span></div>
                    <div className="payslip-row"><span>Transport</span><span>${Number(slip.transportAllow).toLocaleString()}</span></div>
                    <div className="payslip-row"><span>Overtime</span><span>${Number(slip.overtimePay).toLocaleString()}</span></div>
                  </div>
                  <div className="payslip-section">
                    <div className="payslip-title">Deductions</div>
                    <div className="payslip-row deduction"><span>Tax</span><span>-${Number(slip.taxDeduction).toLocaleString()}</span></div>
                    <div className="payslip-row deduction"><span>Other</span><span>-${Number(slip.otherDeductions).toLocaleString()}</span></div>
                  </div>
                </div>
                <div className="payslip-net">
                  <span>Net Salary</span>
                  <span className="gradient-text">${Number(slip.netSalary).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Form */}
        {isAdmin && showForm && (
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 className="section-title">Generate Payroll</h3>
            <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Employee</label>
                <select value={form.employeeId} onChange={set('employeeId')} required>
                  <option value="">Select</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Month</label>
                <select value={form.month} onChange={set('month')}>
                  {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Year</label>
                <select value={form.year} onChange={set('year')}>
                  {[2023,2024,2025].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {[['houseAllowance','House Allowance'],['transportAllow','Transport'],['overtimePay','Overtime'],['taxDeduction','Tax Deduction'],['otherDeductions','Other Deductions']].map(([f, l]) => (
                <div key={f} className="form-group">
                  <label>{l}</label>
                  <input type="number" min="0" value={form[f]} onChange={set(f)} />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-primary">Generate</button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        {isAdmin && (
          <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select className="filter-select" value={filterMonth} onChange={e => setFMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
            <select className="filter-select" value={filterYear} onChange={e => setFYear(Number(e.target.value))}>
              {[2023,2024,2025].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}

        {isAdmin && (
          <div className="table-wrapper">
            {loading ? <div className="empty">Loading...</div> : (
              <table className="table">
                <thead>
                  <tr><th>#</th><th>Employee</th><th>Department</th><th>Month</th><th>Basic</th><th>Net Salary</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {records.length === 0
                    ? <tr><td colSpan={8} className="empty">No payroll records.</td></tr>
                    : records.map((r, i) => (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td>{r.employeeName}</td>
                        <td><span className="badge">{r.departmentName}</span></td>
                        <td>{MONTHS[r.month - 1]} {r.year}</td>
                        <td>${Number(r.basicSalary).toLocaleString()}</td>
                        <td className="gradient-text" style={{ fontWeight: 700 }}>${Number(r.netSalary).toLocaleString()}</td>
                        <td><span className={`badge ${r.status === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>{r.status}</span></td>
                        <td>
                          <button className="btn btn-sm btn-edit" style={{ marginRight: '0.3rem' }} onClick={() => setSlip(r)}>Slip</button>
                          {r.status === 'Draft' && <button className="btn btn-sm btn-action green-btn" onClick={() => handleMarkPaid(r.id)}>Mark Paid</button>}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
