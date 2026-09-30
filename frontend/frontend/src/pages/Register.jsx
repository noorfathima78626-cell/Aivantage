import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/api.js'
import { mockRegister } from '../api/mockAuthStore.js'
import { useAuth } from '../context/AuthContext.jsx'
const MOCK_MODE = true;

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    name: '', dob: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // --- OTP state ---
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [mockOtp, setMockOtp] = useState('') // MOCK_MODE only - shown on screen since there's no real SMS gateway yet

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      // changing the phone number invalidates any previous verification
      if (field === 'phone') { setOtpSent(false); setOtpVerified(false); setOtpCode(''); setOtpError('') }
    }
  }

  async function handleSendOtp() {
    if (!form.phone || form.phone.replace(/\D/g, '').length < 10) {
      setOtpError('Enter a valid phone number first.')
      return
    }
    setOtpError('')
    setOtpSending(true)
    try {
      if (MOCK_MODE) {
        await new Promise((r) => setTimeout(r, 500))
        const code = String(Math.floor(100000 + Math.random() * 900000))
        setMockOtp(code) // stand-in for the SMS the user would receive
      } else {
        await authApi.sendOtp({ phone: form.phone })
      }
      setOtpSent(true)
    } catch (err) {
      setOtpError(err.message || 'Could not send OTP. Try again.')
    } finally {
      setOtpSending(false)
    }
  }

  async function handleVerifyOtp() {
    if (!otpCode) return
    setOtpError('')
    setOtpVerifying(true)
    try {
      if (MOCK_MODE) {
        await new Promise((r) => setTimeout(r, 400))
        if (otpCode !== mockOtp) throw new Error('Incorrect code.')
      } else {
        const res = await authApi.verifyOtp({ phone: form.phone, code: otpCode })
        if (!res.success) throw new Error(res.message || 'Incorrect code.')
      }
      setOtpVerified(true)
    } catch (err) {
      setOtpError(err.message || 'Verification failed.')
    } finally {
      setOtpVerifying(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.dob || !form.email || !form.phone || !form.password) {
      setError('All fields are required.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password)) {
      setError('Password must include both uppercase and lowercase letters.')
      return
    }
    if (!/\d/.test(form.password)) {
      setError('Password must include at least one number.')
      return
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]/;']/.test(form.password)) {
      setError('Password must include at least one special character (e.g. ! @ # $ %).')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!otpVerified) {
      setError('Verify your phone number before continuing.')
      return
    }
    if (!agreeTerms) {
      setError('You need to agree to the Terms to create an account.')
      return
    }

    setLoading(true)
    try {
      if (MOCK_MODE) {
        await new Promise((r) => setTimeout(r, 500))
        const res = mockRegister({
          name: form.name, dob: form.dob, email: form.email,
          phone: form.phone, password: form.password,
        })
        login(res.token, res.user)
      } else {
        const res = await authApi.register({
          name: form.name, dob: form.dob, email: form.email,
          phone: form.phone, password: form.password,
        })
        login(res.token, res.user)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed.')
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
        <h2>Create your account</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0, marginBottom: 24 }}>
          Practice interviews that actually watch how you answer.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input value={form.name} onChange={update('name')} placeholder="Jane Doe" />
          </div>

          <div className="field">
            <label>Date of birth</label>
            <input type="date" value={form.dob} onChange={update('dob')} max={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="jane@example.com" />
          </div>

          <div className="field">
            <label>Phone number</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="tel" value={form.phone} onChange={update('phone')}
                placeholder="+1 555 123 4567" disabled={otpVerified}
              />
              <button
                type="button" className="btn-secondary" onClick={handleSendOtp}
                disabled={otpSending || otpVerified} style={{ whiteSpace: 'nowrap' }}
              >
                {otpVerified ? '✓ Verified' : otpSending ? 'Sending…' : otpSent ? 'Resend' : 'Send OTP'}
              </button>
            </div>

            {MOCK_MODE && mockOtp && !otpVerified && (
              <p className="mono" style={{ fontSize: 12, marginTop: 6, color: 'var(--accent)' }}>
                Dev mode — your OTP is {mockOtp} (no real SMS gateway wired up yet)
              </p>
            )}

            {otpSent && !otpVerified && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <input
                  value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="6-digit code" maxLength={6}
                />
                <button
                  type="button" className="btn-primary" onClick={handleVerifyOtp}
                  disabled={otpVerifying || !otpCode} style={{ whiteSpace: 'nowrap' }}
                >
                  {otpVerifying ? 'Verifying…' : 'Verify'}
                </button>
              </div>
            )}
            {otpError && <p className="error-text">{otpError}</p>}
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={update('password')} placeholder="8+ chars, upper/lowercase, a number & symbol" />
          </div>

          <div className="field">
            <label>Confirm password</label>
            <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Re-enter your password" />
          </div>

          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox" id="agree-terms" checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ width: 'auto' }}
            />
            <label htmlFor="agree-terms" style={{ textTransform: 'none', fontWeight: 400, fontSize: 14, marginBottom: 0 }}>
              I agree to the Terms and Privacy Policy
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ink-soft)' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}
