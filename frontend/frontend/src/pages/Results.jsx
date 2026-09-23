import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { sessionApi, MOCK_MODE } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

// TODO(Member A): replace with the real GET /api/sessions/{id}/report
// response - shape already matches SessionReportResponse in SessionDtos.java.
function buildMockReport(state) {
  const metrics = state?.metrics || { eyeContact: 78, handMovement: 22, paceWpm: 132 }
  const paceFlag = metrics.paceWpm > 160 ? 'TOO_FAST' : metrics.paceWpm < 110 ? 'TOO_SLOW' : 'GOOD'
  return {
    overallScore: 74,
    avgEyeContact: metrics.eyeContact,
    avgHandMovement: metrics.handMovement,
    avgSpeakingPaceWpm: metrics.paceWpm,
    paceFlag,
    whisperFlagCount: 0,
    strengths: 'You covered the key points on 2 of 3 answers well. Eye contact stayed strong throughout.',
    areasToImprove: 'Question #2 missed a couple of key terms - revisit stack vs. queue trade-offs. ' +
      (paceFlag === 'TOO_FAST' ? 'You spoke faster than the ideal interview pace - slow down and pause between points.' : 'Pace was in a good range - keep it up.'),
  }
}

export default function Results() {
  const { sessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [report, setReport] = useState(null)
  const aptitudeReport = location.state?.aptitudeReport
  const skippedCount = location.state?.skippedCount ?? 0
  const totalQuestions = location.state?.answers?.length ?? null

  useEffect(() => {
    async function load() {
      if (aptitudeReport) {
        setReport({ overallScore: aptitudeReport.score, aptitude: true, ...aptitudeReport })
        return
      }
      if (MOCK_MODE) {
        setReport(buildMockReport(location.state))
      } else {
        const res = await sessionApi.getReport(token, sessionId)
        setReport(res)
      }
    }
    load()
  }, [sessionId, aptitudeReport]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!report) return <div className="page-shell"><Navbar /></div>

  return (
    <div className="page-shell">
      <Navbar />
      <main className="results-shell">
        <div className="dashboard-hero"><div><span className="eyebrow">POST-INTERVIEW ANALYSIS</span><h1>Performance report</h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>A clear snapshot of your interview performance and next steps.</p></div><span className="hero-badge">● Session complete</span></div>

        <div className="results-hero card" style={{ marginTop: 20, textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>OVERALL SCORE</span>
          <div className="score-ring"><strong>
            {Math.round(report.overallScore)}
          </strong></div>
        </div>

        {skippedCount > 0 && (
          <div className="card" style={{ marginTop: 16, textAlign: 'center', padding: 14 }}>
            <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
              You skipped <strong style={{ color: 'var(--live)' }}>{skippedCount}</strong>
              {totalQuestions ? ` of ${totalQuestions}` : ''} question{skippedCount === 1 ? '' : 's'}.
            </span>
          </div>
        )}

        {report.aptitude ? (
          <>
            <div className="result-grid" style={{ marginTop: 16 }}>
              <StatBox label="Correct answers" value={`${report.correct} / ${report.mcqTotal ?? report.total}`} />
              <StatBox label="Attempted" value={`${report.attempted} / ${report.total}`} />
              <StatBox label="Assessment mode" value={report.subject || 'Aptitude'} sub={report.difficulty} />
            </div>
            <div className="feedback-card card" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 15, color: 'var(--accent)' }}>Assessment summary</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                You completed a timed assessment{report.codeTotal ? ` with ${report.mcqTotal} MCQ question${report.mcqTotal === 1 ? '' : 's'} and ${report.codeTotal} coding question${report.codeTotal === 1 ? '' : 's'}` : ' with MCQ questions'}.
                Review incorrect or unattempted questions and practice under the same time limit to build speed and confidence.
                {report.codeTotal ? ' Coding answers are not auto-graded - review them yourself or have your teacher review the submissions below.' : ''}
              </p>
            </div>

            {report.codeAnswers?.length > 0 && (
              <div className="feedback-card card" style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 15, color: 'var(--accent)' }}>Coding question submissions</h3>
                {report.codeAnswers.map((c, i) => (
                  <div key={i} style={{ marginTop: i === 0 ? 0 : 18 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px' }}>{c.question}</p>
                    <pre style={{
                      background: '#161c2b', color: '#e5eaf5', padding: '14px 16px', borderRadius: 10,
                      fontSize: 13, fontFamily: "'IBM Plex Mono', Menlo, Consolas, monospace",
                      overflowX: 'auto', margin: 0,
                    }}>{c.code || '(no code submitted)'}</pre>
                  </div>
                ))}
              </div>
            )}

            <div className="feedback-card card" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 15, color: 'var(--live)' }}>Practice integrity signals</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {report.integrityEvents?.length ? `${report.integrityEvents.length} unusual signal(s) were logged during this practice session. These are indicators for review, not proof of cheating.` : 'No unusual integrity signals were logged.'}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="result-grid" style={{ marginTop: 16 }}>
              <StatBox label="Eye contact" value={`${Math.round(report.avgEyeContact)}%`} />
              <StatBox label="Hand movement" value={`${Math.round(report.avgHandMovement)}%`} />
              <StatBox label="Pace" value={`${Math.round(report.avgSpeakingPaceWpm)} wpm`} sub={report.paceFlag.replace('_', ' ')} />
            </div>

            <div className="feedback-card card" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 15, color: 'var(--accent)' }}>Strengths</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{report.strengths}</p>
            </div>

            <div className="feedback-card card" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 15, color: 'var(--live)' }}>Where to improve</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{report.areasToImprove}</p>
            </div>
          </>
        )}

        <button className="btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={() => navigate('/dashboard')}>
          Start another session
        </button>
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
