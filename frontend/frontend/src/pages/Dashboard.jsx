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

const INTERVIEW_TYPES = ['Aptitude', 'One-on-One']

const ROUND_INFO = [
  {
    round: 1,
    title: 'Round 1',
    subtitle: 'Foundation & core interview',
    description: 'Core concepts and practical reasoning. Not a beginner-only round.',
  },
  {
    round: 2,
    title: 'Round 2',
    subtitle: 'Professional & harder',
    description: 'Deeper questions that test how you apply concepts in real situations.',
  },
  {
    round: 3,
    title: 'Round 3',
    subtitle: 'Advanced & deep',
    description: 'Advanced reasoning, trade-offs, design and deeper technical thinking.',
  },
]

const DEFAULT_PROGRESS = [
  { round: 1, unlocked: true, completed: false },
  { round: 2, unlocked: false, completed: false },
  { round: 3, unlocked: false, completed: false },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [resumeFile, setResumeFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [interviewType, setInterviewType] = useState('One-on-One')
  const [round, setRound] = useState(null)
  const [progress, setProgress] = useState(DEFAULT_PROGRESS)
  const [progressLoading, setProgressLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProgress() {
      if (MOCK_MODE || !token) {
        setProgress(DEFAULT_PROGRESS)
        return
      }
      setProgressLoading(true)
      setError('')
      try {
        const result = await sessionApi.getProgress(token, subject, interviewType)
        if (!cancelled) setProgress(result.rounds || DEFAULT_PROGRESS)
      } catch (err) {
        if (!cancelled) {
          setProgress(DEFAULT_PROGRESS)
          setError(err.message || 'Could not load round progress.')
        }
      } finally {
        if (!cancelled) setProgressLoading(false)
      }
    }

    setRound(null)
    loadProgress()
    return () => { cancelled = true }
  }, [subject, interviewType, token])

  function chooseRound(item) {
    if (!item.unlocked) return
    setRound(item.round)
    setError('')
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setResumeFile(file)
    setUploadStatus('uploading')
    try {
      if (MOCK_MODE) await new Promise((r) => setTimeout(r, 700))
      else await resumeApi.upload(token, file)
      setUploadStatus('done')
    } catch {
      setUploadStatus('idle')
      setError('Resume upload failed. You can continue without a resume.')
    }
  }

  function handleStart() {
    if (!round) {
      setError('Select an unlocked round first.')
      return
    }
    navigate('/precheck', { state: { subject, round, interviewType } })
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="dashboard-shell">
        <div className="dashboard-hero">
          <div>
            <span className="eyebrow">AI-POWERED INTERVIEW PRACTICE</span>
            <h1>Build confidence before the real interview.</h1>
            <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>
              Choose a subject, interview mode and progressive round. Complete each round to unlock the next one.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><button className="btn-secondary" onClick={() => navigate('/history')}>Practice history</button><span className="hero-badge">● Progressive rounds enabled</span></div>
        </div>

        <div className="setup-card card" style={{ marginTop: 24 }}>
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
            <label>Interview type</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {INTERVIEW_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInterviewType(type)}
                  className={interviewType === type ? 'btn-primary' : 'btn-secondary'}
                  style={{ flex: 1 }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Interview round</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {ROUND_INFO.map((info) => {
                const state = progress.find((item) => item.round === info.round) || {
                  round: info.round,
                  unlocked: info.round === 1,
                  completed: false,
                }
                const locked = !state.unlocked
                const selected = round === info.round
                return (
                  <button
                    key={info.round}
                    type="button"
                    onClick={() => chooseRound(state)}
                    disabled={locked || progressLoading}
                    className={selected ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      minHeight: 118,
                      textAlign: 'left',
                      opacity: locked ? 0.55 : 1,
                      cursor: locked ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <strong style={{ display: 'block', marginBottom: 6 }}>
                      {locked ? '🔒 ' : state.completed ? '✓ ' : ''}{info.title}
                    </strong>
                    <span style={{ display: 'block', fontSize: 12, fontWeight: 700 }}>{info.subtitle}</span>
                    <small style={{ display: 'block', marginTop: 7, lineHeight: 1.35 }}>
                      {state.completed ? 'Completed — you can practice this round again.' : info.description}
                    </small>
                  </button>
                )
              })}
            </div>
          </div>

          {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: 8 }}
            onClick={handleStart}
            disabled={!round || progressLoading}
          >
            {progressLoading ? 'Loading round progress…' : 'Continue to camera check →'}
          </button>
        </div>
      </main>
    </div>
  )
}
