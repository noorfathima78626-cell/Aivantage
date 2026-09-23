import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi, MOCK_MODE } from '../api/api.js'
import { mockLogin } from '../api/mockAuthStore.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotMsg, setShowForgotMsg] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Enter your email and password.')
      return
    }

    setLoading(true)
    try {
      if (MOCK_MODE) {
        await new Promise((r) => setTimeout(r, 400))
        const res = mockLogin({ email: form.email, password: form.password })
        login(res.token, res.user)
      } else {
        const res = await authApi.login(form)
        login(res.token, res.user)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <div className="brand" style={{ marginBottom: 24 }}>
          <span className="brand-dot" />
          Aivantage
        </div>
        <h2>Welcome back</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0, marginBottom: 24 }}>
          Log in to start a mock interview session.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="jane@example.com" />
          </div>
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label style={{ marginBottom: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => setShowForgotMsg((v) => !v)}
                style={{
                  background: 'none', border: 'none', padding: 0, marginBottom: 6,
                  color: 'var(--accent)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  textTransform: 'none',
                }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', padding: 6, cursor: 'pointer',
                  fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {showForgotMsg && (
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>
                Password resets aren't wired up yet for this build — contact your team to reset it manually in the database for now.
              </p>
            )}
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ink-soft)' }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
