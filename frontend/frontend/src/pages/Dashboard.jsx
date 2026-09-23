import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { resumeApi, sessionApi, MOCK_MODE } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const SUBJECTS = [
  'DSA', 'DBMS', 'Operating Systems', 'OOP', 'System Design',
  'Computer Networks', 'Java', 'Python', 'Web Development', 'SQL',
  'Machine Learning', 'HR / Behavioral',
]
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD']
const INTERVIEW_TYPES = ['Aptitude', 'One-on-One']

export default function Dashboard() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [resumeFile, setResumeFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle') // idle | uploading | done
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [difficultyChosen, setDifficultyChosen] = useState(false)
  const [interviewType, setInterviewType] = useState(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')
  const [deviceWarning, setDeviceWarning] = useState('')

  // Lightweight replacement for the old separate camera-check page: just a
  // heads-up banner, not a page or a gate that blocks starting.
  useEffect(() => {
    let cancelled = false
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then((testStream) => {
        testStream.getTracks().forEach((t) => t.stop()) // only checking, not using it yet
        if (!cancelled) setDeviceWarning('')
      })
      .catch(() => {
        if (!cancelled) setDeviceWarning('Camera and/or microphone not detected. Turn them on before starting - the session needs both for behavior analysis.')
      })
    return () => { cancelled = true }
  }, [])

  function chooseDifficulty(d) {
    setDifficulty(d)
    setDifficultyChosen(true)
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setResumeFile(file)
    setUploadStatus('uploading')
    try {
      if (MOCK_MODE) {
        await new Promise((r) => setTimeout(r, 700))
      } else {
        await resumeApi.upload(token, file)
      }
      setUploadStatus('done')
    } catch {
      setUploadStatus('idle')
    }
  }

  // Camera/speaker PreCheck page was removed from the flow - session is
  // created directly here now, and the camera inside the session page
  // itself still starts normally (still needed for eye contact/hand
  // movement analysis - only the separate check-first screen is gone).
  async function handleStart() {
    setStarting(true)
    setError('')
    try {
      let sessionId
      let questions
      if (MOCK_MODE) {
        await new Promise((r) => setTimeout(r, 500))
        sessionId = 'demo-session-1'
      } else {
        const res = await sessionApi.create(token, { subject, difficulty, interviewType })
        sessionId = res.sessionId
        questions = res.questions
      }
      navigate(interviewType === 'Aptitude' ? `/aptitude/${sessionId}` : `/session/${sessionId}`, { state: { subject, difficulty, interviewType, questions } })
    } catch (err) {
      console.error('Failed to start session:', err)
      setError(err.message || 'Could not start the session - is the backend running?')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="dashboard-shell">
        <div className="dashboard-hero"><div><span className="eyebrow">AI-POWERED INTERVIEW PRACTICE</span><h1>Build confidence before the real interview.</h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>
          Upload your resume, pick a subject and difficulty, and we'll tailor the questions.
        </p></div><span className="hero-badge">● Analysis enabled</span></div>

        <div className="setup-card card" style={{ marginTop: 24 }}>
          {deviceWarning && (
            <div style={{
              background: 'rgba(230,162,60,0.12)', border: '1px solid rgba(230,162,60,0.35)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#8a5a12',
            }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span>{deviceWarning}</span>
            </div>
          )}
          <label>Resume</label>
          <div className="upload-zone" style={{
            border: '1.5px dashed var(--border)', borderRadius: 10, padding: 24,
            textAlign: 'center', marginBottom: 24,
          }}>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} id="resume-input" style={{ display: 'none' }} />
            <label htmlFor="resume-input" style={{ cursor: 'pointer', textTransform: 'none', fontWeight: 500 }}>
              {resumeFile ? resumeFile.name : 'Click to upload your resume (PDF or DOCX)'}
            </label>
            {uploadStatus === 'uploading' && <p className="mono" style={{ fontSize: 12, marginTop: 8 }}>Uploading…</p>}
            {uploadStatus === 'done' && <p className="mono" style={{ fontSize: 12, marginTop: 8, color: 'var(--accent)' }}>✓ Uploaded</p>}
          </div>

          <div className="field">
            <label>Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Difficulty</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => chooseDifficulty(d)}
                  className={difficultyChosen && difficulty === d ? 'btn-primary' : 'btn-secondary'}
                  style={{ flex: 1 }}
                >
                  {d[0] + d.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {difficultyChosen && (
            <div className="field">
              <label>Interview type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {INTERVIEW_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setInterviewType(t)}
                    className={interviewType === t ? 'btn-primary' : 'btn-secondary'}
                    style={{ flex: 1 }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="error-text" style={{ marginTop: 8 }}>{error}</p>}

          <button
            className="btn-primary" style={{ width: '100%', marginTop: 8 }}
            onClick={handleStart} disabled={!difficultyChosen || !interviewType || starting}
          >
            {starting ? 'Starting session…' : 'Start session →'}
          </button>
        </div>
      </main>
    </div>
  )
}
