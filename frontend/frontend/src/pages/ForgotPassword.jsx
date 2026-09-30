import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi, MOCK_MODE } from '../api/api.js'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function requestReset(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!email.trim()) {
      setError('Enter the email address used for your account.')
      return
    }

    setLoading(true)
    try {
      if (MOCK_MODE) await new Promise((r) => setTimeout(r, 400))
      else await authApi.forgotPassword({ email: email.trim() })
      setMessage('If an account exists for this email, a password-reset OTP has been sent to its registered phone number. For the current demo setup, the OTP is printed in the backend terminal.')
      setStep(2)
    } catch (err) {
      setError(err.message || 'Could not start the password reset.')
    } finally {
      setLoading(false)
    }
  }

  async function resetPassword(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit OTP.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      if (MOCK_MODE) await new Promise((r) => setTimeout(r, 400))
      else await authApi.resetPassword({ email: email.trim(), otp, newPassword: password })
      setMessage('Password reset successfully. You can now log in with the new password.')
      setStep(3)
    } catch (err) {
      setError(err.message || 'Could not reset the password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <div className="brand" style={{ marginBottom: 24 }}><span className="brand-dot" />Aivantage</div>

        {step === 1 && (
          <>
            <h2>Forgot password?</h2>
            <p style={{ color: 'var(--ink-soft)', marginTop: 0, marginBottom: 24 }}>
              Enter your registered email to start a secure password reset.
            </p>
            <form onSubmit={requestReset}>
              <div className="field">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" autoFocus />
              </div>
              {error && <p className="error-text">{error}</p>}
              {message && <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.5 }}>{message}</p>}
              <button className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending…' : 'Send reset OTP'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Reset your password</h2>
            <p style={{ color: 'var(--ink-soft)', marginTop: 0, marginBottom: 20 }}>
              Enter the OTP and choose a new password for <strong>{email}</strong>.
            </p>
            {message && <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.5 }}>{message}</p>}
            <form onSubmit={resetPassword}>
              <div className="field">
                <label>6-digit OTP</label>
                <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="123456" autoFocus />
              </div>
              <div className="field">
                <label>New password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 6, cursor: 'pointer', color: 'var(--ink-soft)' }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="field">
                <label>Confirm new password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
              {error && <p className="error-text">{error}</p>}
              <button className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Password changed</h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>{message}</p>
            <button className="btn-primary" style={{ width: '100%', marginTop: 10 }} onClick={() => navigate('/login')}>
              Back to login
            </button>
          </>
        )}

        {step !== 3 && (
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ink-soft)' }}>
            Remembered your password? <Link to="/login">Back to login</Link>
          </p>
        )}
      </div>
    </div>
  )
}
