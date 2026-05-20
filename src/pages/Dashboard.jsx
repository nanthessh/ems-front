import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { employeeService } from '../api/employeeService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalEmployees: 0, totalDepartments: 0, totalSalary: 0, newEmployeesThisMonth: 0 })
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    employeeService.getStats().then(setStats).catch(() => {})
  }, [])

  const cards = [
    { icon: '👥', label: 'Total Employees',     value: stats.totalEmployees,        color: 'blue' },
    { icon: '🏢', label: 'Departments',          value: stats.totalDepartments,       color: 'purple' },
    { icon: '💰', label: 'Total Salary',         value: `$${Number(stats.totalSalary).toLocaleString()}`, color: 'green' },
    { icon: '🆕', label: 'New This Month',       value: stats.newEmployeesThisMonth,  color: 'pink' },
  ]

  return (
    <div className="layout">
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <Navbar />

      <main className="main-content">
        <div className="dashboard-hero glass-card">
          <div className="hero-text">
            <h1 className="hero-title">Welcome back, <span className="gradient-text">{user?.username}</span> 👋</h1>
            <p className="hero-sub">Here's what's happening in your organization today.</p>
          </div>
          <div className="hero-badge">{user?.role} Dashboard</div>
        </div>

        <div className="stats-grid">
          {cards.map(({ icon, label, value, color }) => (
            <div key={label} className={`stat-card glass-card ${color}-glow`}>
              <div className={`stat-icon-wrap ${color}-icon`}>{icon}</div>
              <div className="stat-info">
                <div className="stat-number">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-actions glass-card">
          <h3 className="section-title">⚡ Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn btn-action blue-btn" onClick={() => navigate('/employees')}>
              👥 Manage Employees →
            </button>
            <button className="btn btn-action green-btn" onClick={() => navigate('/departments')}>
              🏢 Manage Departments →
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
