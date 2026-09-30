import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { sessionApi, MOCK_MODE } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Results() {
  const { sessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = useAuth()
  const aptitude = location.state?.aptitudeReport || null
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(!aptitude)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    if (aptitude || MOCK_MODE) {
      setLoading(false)
      return undefined
    }
    sessionApi.getReport(token, sessionId)
      .then((data) => { if (!cancelled) setReport(data) })
      .catch((err) => { if (!cancelled) setError(err.message || 'Could not load the report.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token, sessionId, aptitude])

  const data = aptitude ? { aptitude: true, ...aptitude } : report

  return (
    <div className="page-shell">
      <Navbar />
      <main className="dashboard-shell" style={{ maxWidth: 1080 }}>
        <div className="dashboard-hero">
          <div>
            <span className="eyebrow">INTERVIEW PERFORMANCE REPORT</span>
            <h1>{data?.subject || 'Session'} — Round {data?.round || ''}</h1>
            <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>A clear breakdown of what went well and what to improve next.</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/history')}>Practice history</button>
        </div>

        {loading && <div className="card" style={{ marginTop: 18 }}>Building your report…</div>}
        {error && <div className="card" style={{ marginTop: 18, color: '#ff9b9b' }}>{error}</div>}

        {data && !loading && (
          <>
            <section className="result-grid" style={{ marginTop: 18 }}>
              <StatBox label="Overall score" value={`${Math.round(data.score ?? data.overallScore ?? 0)}/100`} />
              <StatBox label="Round" value={data.round || '—'} sub={data.interviewType || 'Interview'} />
              {data.aptitude
                ? <StatBox label="Correct" value={`${data.correct}/${data.total}`} sub={`${data.attempted} attempted`} />
                : <StatBox label="Answers reviewed" value={`${(data.answers || []).length}`} />}
            </section>

            {data.aptitude ? (
              <>
                <div className="feedback-card card" style={{ marginTop: 16 }}>
                  <h3>Automatic assessment</h3>
                  <p style={{ color: 'var(--ink-soft)' }}>MCQs were checked against their answer keys and coding questions were executed against fixed test cases.</p>
                </div>
                {data.codeQuestions?.length > 0 && (
                  <div className="feedback-card card" style={{ marginTop: 16 }}>
                    <h3>Coding evaluation</h3>
                    {data.codeQuestions.map((q) => {
                      const r = data.codeReports?.[q.id]
                      return (
                        <div key={q.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                          <strong>{q.text}</strong>
                          <p style={{ margin: '6px 0' }}>{r?.correct ? '✓ All test cases passed' : '✗ Some tests failed'}</p>
                          <small style={{ color: 'var(--ink-soft)' }}>{r?.message || 'Not checked'}{r?.wrongLine ? ` • Wrong line: ${r.wrongLine}` : ''}</small>
                          {r?.suggestion && <div style={{ marginTop: 5, color: 'var(--ink-soft)' }}>Suggestion: {r.suggestion}</div>}
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="feedback-card card" style={{ marginTop: 16 }}>
                  <h3>Practice integrity signals</h3>
                  <p style={{ color: 'var(--ink-soft)' }}>
                    {data.integrityEvents?.length ? `${data.integrityEvents.length} unusual signal(s) were logged. These are indicators for review, not proof of cheating.` : 'No unusual integrity signals were logged.'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <section className="result-grid" style={{ marginTop: 16 }}>
                  <StatBox label="Eye contact" value={`${Math.round(data.avgEyeContact ?? 0)}%`} />
                  <StatBox label="Hand movement" value={`${Math.round(data.avgHandMovement ?? 0)}%`} />
                  <StatBox label="Speaking pace" value={`${Math.round(data.avgSpeakingPaceWpm ?? 0)} WPM`} sub={(data.paceFlag || 'UNKNOWN').replace('_', ' ')} />
                  <StatBox label="Nervousness" value={`${Math.round(data.avgNervousness ?? 0)}%`} />
                </section>

                <div className="feedback-card card" style={{ marginTop: 16 }}>
                  <h3>Summary</h3><p style={{ color: 'var(--ink-soft)', lineHeight: 1.65 }}>{data.summary || 'Your report is ready.'}</p>
                </div>
                <div className="feedback-card card" style={{ marginTop: 16 }}>
                  <h3>Strengths</h3><p style={{ color: 'var(--ink-soft)', lineHeight: 1.65 }}>{data.strengths || 'No strength summary available.'}</p>
                </div>
                <div className="feedback-card card" style={{ marginTop: 16 }}>
                  <h3>What to improve</h3><p style={{ color: 'var(--ink-soft)', lineHeight: 1.65 }}>{data.areasToImprove || 'No major improvement notes available.'}</p>
                </div>

                <div className="feedback-card card" style={{ marginTop: 16 }}>
                  <h3>Question-by-question evaluation</h3>
                  {(data.answers || []).map((answer, index) => (
                    <article key={answer.questionId || index} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <strong>Q{index + 1}. {answer.questionText}</strong>
                        <b>{Math.round(answer.score ?? 0)}/100</b>
                      </div>
                      <p style={{ color: 'var(--ink-soft)', lineHeight: 1.55 }}><strong>Your answer:</strong> {answer.userAnswer || 'No answer captured.'}</p>
                      <p style={{ marginBottom: 0 }}><strong>AI feedback:</strong> {answer.feedback || 'No feedback available.'}</p>
                    </article>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>Practice another round</button>
              <button className="btn-secondary" onClick={() => navigate('/history')}>View history</button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function StatBox({ label, value, sub }) {
  return (
    <div className="card" style={{ padding: 16, textAlign: 'center' }}>
      <div className="mono" style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>{label}</div>
      {sub && <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}
