import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { historyApi } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function History() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState({
    sessions: [],
    nextRounds: []
  })

  useEffect(() => {
    historyApi
      .list(token)
      .then(setData)
      .catch(() => {})
  }, [token])

  return (
    <div className="page-shell">
      <Navbar />

      <main className="dashboard-shell">

        <div className="dashboard-hero">
          <div>
            <span className="eyebrow">
              PROGRESS
            </span>

            <h1>
              Your interview history
            </h1>

            <p
              style={{
                color: 'var(--ink-soft)'
              }}
            >
              Only completed rounds count toward your progress.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            display: 'grid',
            gap: 12
          }}
        >
          {data.sessions.map(s => (
            <div
              className="card"
              key={s.sessionId}
              style={{
                padding: 18,
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 10
              }}
            >
              <div>
                <b>
                  {s.subject}
                </b>

                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-soft)'
                  }}
                >
                  {s.interviewType} • Round {s.round} • {s.difficulty}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-soft)'
                  }}
                >
                  {s.status === 'COMPLETED'
                    ? 'Completed'
                    : 'In progress'}
                </div>
              </div>

              <div
                style={{
                  textAlign: 'right'
                }}
              >
                <strong>
                  {s.status === 'COMPLETED'
                    ? `${Math.round(s.score || 0)}%`
                    : '—'}
                </strong>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn-secondary"
          style={{
            width: '100%',
            marginTop: 20
          }}
          onClick={() => navigate('/dashboard')}
        >
          Back to dashboard
        </button>

      </main>
    </div>
  )
} 