import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { historyApi, MOCK_MODE } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function History() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        if (MOCK_MODE) {
          if (!cancelled) setSessions([])
          return
        }
        const data = await historyApi.list(token)
        if (!cancelled) setSessions(data.sessions || [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load interview history.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [token])

  return (
    <div className="page-shell">
      <Navbar />
      <main className="dashboard-shell">
        <div className="dashboard-hero">
          <div>
            <span className="eyebrow">YOUR PRACTICE HISTORY</span>
            <h1>Track your progress over time.</h1>
            <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>
              Reopen completed reports and compare your scores across subjects and rounds.
            </p>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>

        {error && <div className="card" style={{ marginTop: 18, color: '#ff8f8f' }}>{error}</div>}
        {loading ? (
          <div className="card" style={{ marginTop: 18 }}>Loading your sessions…</div>
        ) : sessions.length === 0 ? (
          <div className="card" style={{ marginTop: 18 }}>
            <h3>No completed sessions yet.</h3>
            <p style={{ color: 'var(--ink-soft)' }}>Finish your first Round 1 session and the result will appear here.</p>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>Start Round 1</button>
          </div>
        ) : (
          <div className="history-list" style={{ marginTop: 18, display: 'grid', gap: 12 }}>
            {sessions.map((session) => (
              <article className="card" key={session.sessionId} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
                <div>
                  <span className="eyebrow">{session.interviewType || 'One-on-One'} • ROUND {session.round || 1}</span>
                  <h3 style={{ margin: '6px 0' }}>{session.subject}</h3>
                  <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13 }}>
                    {session.startedAt ? new Date(session.startedAt).toLocaleString() : 'Date unavailable'}
                    {' • '}{session.status || 'UNKNOWN'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: 28 }}>{Math.round(session.score ?? 0)}</strong><span style={{ color: 'var(--ink-soft)' }}>/100</span>
                  <div style={{ marginTop: 8 }}>
                    <button className="btn-secondary" onClick={() => navigate(`/results/${session.sessionId}`)}>View report</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
