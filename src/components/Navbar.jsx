import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const links = [
  { path: '/dashboard',     label: 'Dashboard',    icon: '🏠' },
  { path: '/employees',     label: 'Employees',    icon: '👥' },
  { path: '/departments',   label: 'Departments',  icon: '🏢' },
  { path: '/attendance',    label: 'Attendance',   icon: '🕐' },
  { path: '/leave',         label: 'Leave',        icon: '🏖' },
  { path: '/payroll',       label: 'Payroll',      icon: '💰' },
  { path: '/announcements', label: 'Notices',      icon: '📣' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const drawerRef = useRef(null)

  // Close drawer on outside click
  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogout = () => { logout(); navigate('/login') }

  const NavLink = ({ path, label, icon }) => (
    <button
      className={`nav-link ${pathname === path ? 'nav-link-active' : ''}`}
      onClick={() => navigate(path)}
    >
      <span className="nav-link-icon">{icon}</span>
      <span className="nav-link-label">{label}</span>
    </button>
  )

  return (
    <>
      <nav className="navbar glass-nav">
        {/* Left: Logo */}
        <div onClick={() => navigate('/dashboard')}>
          <Logo size={34} showText={true} />
        </div>

        {/* Center: Desktop links */}
        <div className="nav-desktop-links">
          {links.map(l => <NavLink key={l.path} {...l} />)}
        </div>

        {/* Right: User info + logout (desktop) */}
        <div className="nav-right">
          <div className="nav-user-info">
            <div className="nav-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <div className="nav-user-details">
              <span className="nav-username">{user?.username}</span>
              <span className="role-badge">{user?.role || 'User'}</span>
            </div>
          </div>
          <button className="btn btn-logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="logout-label">Logout</span>
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'hamburger-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && <div className="drawer-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Mobile Drawer */}
      <div ref={drawerRef} className={`mobile-drawer ${menuOpen ? 'drawer-open' : ''}`}>
        <div className="drawer-header">
          <Logo size={32} showText={true} />
          <button className="drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <div className="drawer-user">
          <div className="nav-avatar nav-avatar-lg">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{user?.username}</div>
            <span className="role-badge">{user?.role || 'User'}</span>
          </div>
        </div>

        <div className="drawer-links">
          {links.map(l => <NavLink key={l.path} {...l} />)}
        </div>

        <button className="btn btn-logout drawer-logout" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </>
  )
}
