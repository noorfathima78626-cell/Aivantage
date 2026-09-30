import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import WebcamFeed from '../components/WebcamFeed.jsx'
import { sessionApi, MOCK_MODE } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function PreCheck() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useAuth()
  const { subject = 'DSA', round = 1, interviewType = 'One-on-One' } = location.state || {}
  const [starting, setStarting] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [speakerTested, setSpeakerTested] = useState(false)
  const [speakerConfirmed, setSpeakerConfirmed] = useState(false)
  const [error, setError] = useState('')

  function playTestSound() {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(
      'This is a sound check. If you can hear this clearly, check the box below.'
    )
    synth.cancel()
    synth.speak(utterance)
    setSpeakerTested(true)
  }

  const allReady = cameraReady && speakerConfirmed

  async function handleStart() {
    if (!allReady) return
    setStarting(true)
    setError('')
    try {
      let sessionId
      let questions
      if (MOCK_MODE) {
        await new Promise((r) => setTimeout(r, 500))
        sessionId = 'demo-session-1'
      } else {
        const res = await sessionApi.create(token, { subject, round, interviewType })
        sessionId = res.sessionId
        questions = res.questions
      }
      navigate(interviewType === 'Aptitude' ? `/aptitude/${sessionId}` : `/session/${sessionId}`, {
        state: { subject, round, interviewType, questions },
      })
    } catch (err) {
      console.error('Failed to start session:', err)
      setError(err.message || 'Could not start session. Complete the previous round first if it is locked.')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="precheck-shell">
        <div className="dashboard-hero">
          <div>
            <span className="eyebrow">BEFORE WE BEGIN</span>
            <h1>Camera &amp; microphone check</h1>
            <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>
              Make sure you're well lit and framed in the center. We'll use this feed to track eye contact, hand movement, and expression during the session.
            </p>
          </div>
          <span className="hero-badge">● Round {round}</span>
        </div>

        <WebcamFeed onReady={setCameraReady} />

        <div className="precheck-side card" style={{ marginTop: 20, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Camera</span>
            <StatusPill ok={cameraReady} okLabel="Detected" waitLabel="Waiting…" />
          </div>
          {!cameraReady && (
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 14px' }}>
              Turn on your camera above and allow browser permission if prompted.
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, marginTop: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Speaker</span>
            <StatusPill ok={speakerConfirmed} okLabel="Confirmed" waitLabel="Not tested" />
          </div>
          <button type="button" className="btn-secondary" onClick={playTestSound} style={{ marginBottom: 10 }}>
            🔊 Play test sound
          </button>
          {speakerTested && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', fontWeight: 400, fontSize: 14 }}>
              <input type="checkbox" checked={speakerConfirmed} onChange={(e) => setSpeakerConfirmed(e.target.checked)} style={{ width: 'auto' }} />
              I heard the test sound clearly
            </label>
          )}
        </div>

        <div className="card" style={{ marginTop: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}><span style={{ color: 'var(--ink-soft)' }}>Subject</span><span className="mono">{subject}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}><span style={{ color: 'var(--ink-soft)' }}>Interview round</span><span className="mono">Round {round}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ color: 'var(--ink-soft)' }}>Interview type</span><span className="mono">{interviewType}</span></div>
        </div>

        {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}
        <button className="btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={handleStart} disabled={starting || !allReady}>
          {starting ? 'Starting session…' : !allReady ? 'Turn on camera & confirm speaker to continue' : `I'm ready — start Round ${round}`}
        </button>
      </main>
    </div>
  )
}

function StatusPill({ ok, okLabel, waitLabel }) {
  return <span className="mono" style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: ok ? 'rgba(46,158,91,0.12)' : 'rgba(139,147,163,0.12)', color: ok ? '#1F7A44' : 'var(--ink-soft)' }}>{ok ? okLabel : waitLabel}</span>
}
