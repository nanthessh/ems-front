import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', role: 'User' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register', {
        username: form.username,
        password: form.password,
        role: form.role,
      })
      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Registration failed.')
      } else {
        setError('Cannot connect to server. Make sure the backend is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-logo">EMS</div>
          <h1>Employee Management System</h1>
          <p>Manage your workforce efficiently and effectively.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Fill in the details to get started</p>
          </div>

          {error && <div className="alert error">⚠ {error}</div>}
          {success && <div className="alert success">✓ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <div className="input-icon-wrap">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={set('username')}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Role</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔑</span>
                <select value={form.role} onChange={set('role')}>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={set('password')}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary full-width" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
