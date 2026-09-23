import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ownerApi } from '../api/api.js'

export default function OwnerLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      const res = await ownerApi.login(form)
      // Kept separate from the regular user session (sessionStorage) so
      // logging in as owner never overwrites/conflicts with a normal
      // candidate login in the same browser.
      sessionStorage.setItem('owner_token', res.token)
      sessionStorage.setItem('owner_name', res.owner.name)
      navigate('/admin')
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
        <h2>Owner login</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0, marginBottom: 24 }}>
          Separate from regular accounts - view registered users and activity.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="owner@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={update('password')} placeholder="••••••••" />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in…' : 'Log in as owner'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ink-soft)' }}>
          <Link to="/login">Back to regular login</Link>
        </p>
      </div>
    </div>
  )
}
