import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../api/api.js'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const ownerName = sessionStorage.getItem('owner_name')

  useEffect(() => {
    const token = sessionStorage.getItem('owner_token')
    if (!token) {
      navigate('/owner-login', { replace: true })
      return
    }
    adminApi.getUsers(token)
      .then((res) => setUsers(res.users))
      .catch((err) => setError(err.message || 'Could not load users - is the backend running?'))
  }, [navigate])

  function logout() {
    sessionStorage.removeItem('owner_token')
    sessionStorage.removeItem('owner_name')
    navigate('/owner-login')
  }

  return (
    <div className="page-shell">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 32px', borderBottom: '1px solid var(--border)', background: 'var(--surface)',
      }}>
        <div className="brand"><span className="brand-dot" />Aivantage — Admin</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {ownerName && <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{ownerName}</span>}
          <button className="btn-secondary" onClick={logout}>Log out</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px', width: '100%' }}>
        <h1>Registered users</h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0, marginBottom: 24 }}>
          Every account registered on the platform, and how much they've used it.
        </p>

        {error && <p className="error-text">{error}</p>}

        {!error && !users && <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>}

        {users && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Registered</Th>
                  <Th align="center">Resumes</Th>
                  <Th align="center">Sessions</Th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: 'var(--ink-soft)' }}>
                    No users registered yet.
                  </td></tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <Td>{u.name}</Td>
                    <Td>{u.email}</Td>
                    <Td>{new Date(u.createdAt).toLocaleDateString()}</Td>
                    <Td align="center" className="mono">{u.resumeCount}</Td>
                    <Td align="center" className="mono">{u.sessionCount}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {users && (
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--ink-soft)' }}>
            {users.length} total user{users.length === 1 ? '' : 's'}.
          </p>
        )}
      </div>
    </div>
  )
}

function Th({ children, align = 'left' }) {
  return <th style={{ padding: '12px 16px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-soft)', textAlign: align }}>{children}</th>
}
function Td({ children, align = 'left', className }) {
  return <td className={className} style={{ padding: '12px 16px', textAlign: align }}>{children}</td>
}
