import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { resumeApi } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const SUBJECTS = [
  'DSA',
  'DBMS',
  'Operating Systems',
  'OOP',
  'System Design',
  'Computer Networks',
  'Java',
  'Python',
  'Web Development',
  'SQL',
  'Machine Learning',
  'HR / Behavioral'
]

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD']
const TYPES = ['Aptitude', 'One-on-One']

export default function Dashboard() {
  const navigate = useNavigate()
  const { token } = useAuth()

  const [subject, setSubject] = useState('DSA')
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [type, setType] = useState(null)
  const [difficultyChosen, setDifficultyChosen] = useState(false)

  const [resumeFile, setResumeFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle')

  async function upload(e) {
    const f = e.target.files[0]

    if (!f) return

    setResumeFile(f)
    setUploadStatus('uploading')

    try {
      await resumeApi.upload(token, f)
      setUploadStatus('done')
    } catch {
      setUploadStatus('idle')
    }
  }

  function start(round = 1, s = subject, t = type, d = difficulty) {
    navigate('/precheck', {
      state: {
        subject: s,
        difficulty: d,
        interviewType: t,
        round
      }
    })
  }

  return (
    <div className="page-shell">
      <Navbar />

      <main className="dashboard-shell">

        <div className="dashboard-hero">
          <div>
            <span className="eyebrow">
              AI-POWERED INTERVIEW PRACTICE
            </span>

            <h1>
              Build confidence before the real interview.
            </h1>

            <p
              style={{
                color: 'var(--ink-soft)',
                marginTop: 0
              }}
            >
              AI generates fresh questions for every subject, mode and round.
            </p>
          </div>

          <span className="hero-badge">
            ● AI question generation
          </span>
        </div>

        <div
          className="setup-card card"
          style={{ marginTop: 24 }}
        >

          <label>Resume</label>

          <div
            className="upload-zone"
            style={{
              border: '1.5px dashed var(--border)',
              borderRadius: 10,
              padding: 24,
              textAlign: 'center',
              marginBottom: 24
            }}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={upload}
              id="resume-input"
              style={{ display: 'none' }}
            />

            <label
              htmlFor="resume-input"
              style={{
                cursor: 'pointer',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              {resumeFile
                ? resumeFile.name
                : 'Click to upload your resume (PDF or DOCX)'}
            </label>

            {uploadStatus === 'uploading' && (
              <p
                className="mono"
                style={{ fontSize: 12 }}
              >
                Uploading…
              </p>
            )}

            {uploadStatus === 'done' && (
              <p
                className="mono"
                style={{
                  fontSize: 12,
                  color: 'var(--accent)'
                }}
              >
                ✓ Uploaded
              </p>
            )}
          </div>

          <div className="field">
            <label>Subject</label>

            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
            >
              {SUBJECTS.map(s => (
                <option key={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Difficulty</label>

            <div
              style={{
                display: 'flex',
                gap: 10
              }}
            >
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDifficulty(d)
                    setDifficultyChosen(true)
                  }}
                  className={
                    difficultyChosen && difficulty === d
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }
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

              <div
                style={{
                  display: 'flex',
                  gap: 10
                }}
              >
                {TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={
                      type === t
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }
                    style={{ flex: 1 }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="btn-primary"
            style={{
              width: '100%',
              marginTop: 8
            }}
            onClick={() => start()}
            disabled={uploadStatus !== 'done' || !difficultyChosen || !type}
          >
            {uploadStatus !== 'done' ? 'Upload your resume to continue' : 'Start Round 1 →'}
          </button>
        </div>

        <button
          className="btn-secondary"
          style={{
            width: '100%',
            marginTop: 12
          }}
          onClick={() => navigate('/history')}
        >
          View full history
        </button>

      </main>
    </div>
  )
} 