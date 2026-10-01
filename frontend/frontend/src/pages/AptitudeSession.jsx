import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import WebcamFeed from '../components/WebcamFeed.jsx'
import { getAptitudeQuestions } from '../data/aptitudeQuestions.js'
import { signalsApi } from '../api/api.js'

const EXAM_SECONDS = 15 * 60

function formatTime(total) {
  const m = Math.floor(Math.max(0, total) / 60).toString().padStart(2, '0')
  const s = (Math.max(0, total) % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

export default function AptitudeSession() {
  const { sessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const subject = location.state?.subject || 'General'
  const difficulty = location.state?.difficulty || 'MEDIUM'
  const [questions] = useState(() => getAptitudeQuestions(subject, sessionId))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS)
  const [stream, setStream] = useState(null)
  const [events, setEvents] = useState([])
  const [proctor, setProctor] = useState({ faces: 1, phone: false, whisper: false, active: true })
  const modelRef = useRef(null)
  const finishedRef = useRef(false)
  const answersRef = useRef({})
  const eventsRef = useRef([])

  useEffect(() => { answersRef.current = answers }, [answers])
  useEffect(() => { eventsRef.current = events }, [events])

  const question = questions[current]

  function addEvent(type, message) {
    setEvents((prev) => {
      const next = [{ id: `${Date.now()}-${Math.random()}`, type, message, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 8)
      eventsRef.current = next
      return next
    })
  }

  function finishExam(reason = 'submitted') {
    if (finishedRef.current) return
    finishedRef.current = true
    const finalAnswers = answersRef.current
    const correct = questions.reduce((sum, q) => sum + (finalAnswers[q.id] === q.answerIndex ? 1 : 0), 0)
    const attempted = Object.keys(finalAnswers).length
    const score = Math.round((correct / questions.length) * 100)
    navigate(`/results/${sessionId}`, {
      state: {
        aptitudeReport: {
          score, correct, attempted, total: questions.length, subject, difficulty,
          integrityEvents: eventsRef.current, finishReason: reason,
        },
      },
    })
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          window.setTimeout(() => finishExam('time expired'), 0)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, []) // timer is intentionally created once for the whole assessment

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) addEvent('focus', 'Exam window was left or hidden.')
    }
    const onBlur = () => addEvent('focus', 'Browser focus changed during the assessment.')
    const onFullscreen = () => {
      if (!document.fullscreenElement) addEvent('focus', 'Fullscreen mode was exited during the assessment.')
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    document.addEventListener('fullscreenchange', onFullscreen)
    document.documentElement.requestFullscreen?.().catch(() => {})
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('fullscreenchange', onFullscreen)
    }
  }, [])

  useEffect(() => {
    if (!stream) return undefined
    let cancelled = false
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    video.srcObject = stream
    video.muted = true
    video.playsInline = true
    video.play().catch(() => {})

    async function loadModel() {
      try {
        const cocoSsd = await import('@tensorflow-models/coco-ssd')
        modelRef.current = await cocoSsd.load({ base: 'lite_mobilenet_v2' })
      } catch (error) {
        console.warn('Phone detector could not load:', error)
      }
    }
    loadModel()

    async function analyze() {
      if (cancelled || video.readyState < 2) return
      const w = video.videoWidth || 640
      const h = video.videoHeight || 480
      canvas.width = Math.min(w, 640)
      canvas.height = Math.round((canvas.width / w) * h)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.7)
      try {
        const result = await signalsApi.analyzeFrame(Number(sessionId), imageBase64)
        if (cancelled) return
        const faces = Number(result.faceCount ?? 1)
        setProctor((p) => ({ ...p, faces }))
        if (faces > 1) addEvent('person', 'More than one face was detected in the camera frame.')
      } catch {}
      try {
        if (modelRef.current) {
          const predictions = await modelRef.current.detect(canvas)
          const phone = predictions.some((item) => item.class === 'cell phone' && item.score > 0.55)
          setProctor((p) => ({ ...p, phone }))
          if (phone) addEvent('phone', 'A phone-like object was detected in the camera view.')
        }
      } catch {}
    }

    const id = window.setInterval(analyze, 3000)
    const start = window.setTimeout(analyze, 1200)
    return () => {
      cancelled = true
      window.clearInterval(id)
      window.clearTimeout(start)
      video.pause()
      video.srcObject = null
    }
  }, [stream, sessionId])

  useEffect(() => {
    if (!stream?.getAudioTracks?.().length) return undefined
    let recorder
    try {
      const audioStream = new MediaStream(stream.getAudioTracks())
      recorder = new MediaRecorder(audioStream)
      recorder.ondataavailable = async (event) => {
        if (!event.data.size) return
        try {
          const audioBase64 = await blobToBase64(event.data)
          const result = await signalsApi.analyzeAudio(Number(sessionId), audioBase64, '', 4)
          if (result.whisperDetected) {
            setProctor((p) => ({ ...p, whisper: true }))
            addEvent('audio', 'Unusual whisper-like background audio was detected.')
          }
        } catch {}
      }
      recorder.start(4000)
    } catch (error) {
      console.warn('Audio integrity monitor unavailable:', error)
    }
    return () => recorder?.state !== 'inactive' && recorder.stop()
  }, [stream, sessionId])

  return (
    <div className="page-shell aptitude-page">
      <Navbar />
      <main className="aptitude-shell">
        <header className="aptitude-command-bar professional-card">
          <div>
            <span className="eyebrow">TIMED PRACTICE ASSESSMENT</span>
            <h1>{subject} Aptitude Test</h1>
          </div>
          <div className={secondsLeft < 120 ? 'exam-timer danger' : 'exam-timer'}>⏱ {formatTime(secondsLeft)}</div>
          <div className="exam-progress"><span>Question {current + 1} / {questions.length}</span><div><i style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div></div>
        </header>

        <div className="aptitude-layout">
          <section className="exam-card professional-card">
            <div className="exam-topline">
              <span>QUESTION {current + 1}</span>
              <small>{difficulty} • {question.type === 'code' ? 'CODING' : 'MCQ'}</small>
            </div>
            <h2 className="aptitude-question">{question.text}</h2>

            {question.type === 'code' ? (
              <div className="coding-answer-wrap">
                <div className="coding-editor-label">{question.language || 'code'} · write your solution</div>
                <textarea
                  className="code-answer-box"
                  spellCheck={false}
                  value={answers[question.id] ?? question.starterCode ?? ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [question.id]: e.target.value }))}
                  rows={16}
                  placeholder="Write your code here..."
                />
              </div>
            ) : (
              <div className="mcq-options">
                {question.options.map((option, index) => (
                  <button key={option} className={answers[question.id] === index ? 'mcq-option selected' : 'mcq-option'} onClick={() => setAnswers((a) => ({ ...a, [question.id]: index }))}>
                    <b>{String.fromCharCode(65 + index)}</b><span>{option}</span><i>{answers[question.id] === index ? '✓' : ''}</i>
                  </button>
                ))}
              </div>
            )}
            <div className="exam-actions">
              <button className="btn-secondary" onClick={() => setCurrent((i) => Math.max(0, i - 1))} disabled={current === 0}>← Previous</button>
              {current + 1 < questions.length ? <button className="btn-primary" onClick={() => setCurrent((i) => i + 1)}>Save & Next →</button> : <button className="btn-primary" onClick={() => finishExam('submitted')}>Submit Assessment</button>}
            </div>
          </section>

          <aside className="exam-sidebar">
            <div className="question-palette professional-card">
              <span className="eyebrow">QUESTION PALETTE</span>
              <div className="palette-grid">{questions.map((q, index) => <button key={q.id} onClick={() => setCurrent(index)} className={`${current === index ? 'current' : ''} ${answers[q.id] !== undefined ? 'answered' : ''}`}>{index + 1}</button>)}</div>
              <div className="palette-key"><span><i className="answered-dot" /> Answered</span><span><i className="current-dot" /> Current</span></div>
            </div>
            <div className="integrity-card professional-card">
              <span className="eyebrow">BACKGROUND INTEGRITY CHECK</span>
              <h3>Practice monitor is active</h3>
              <p>Camera, microphone and exam-window signals are checked quietly in the background.</p>
              <div className="integrity-status"><span>Camera</span><b>{proctor.active ? 'Active' : '—'}</b></div>
              <div className="integrity-status"><span>Faces</span><b>{proctor.faces || 0}</b></div>
              <div className="integrity-status"><span>Phone scan</span><b>{proctor.phone ? 'Check' : 'Scanning'}</b></div>
              <div className="integrity-status"><span>Audio</span><b>{proctor.whisper ? 'Check' : 'Monitoring'}</b></div>
            </div>
          </aside>
        </div>

        <div className="aptitude-hidden-camera"><WebcamFeed showLiveBadge={false} onStream={setStream} /></div>
      </main>
    </div>
  )
}
