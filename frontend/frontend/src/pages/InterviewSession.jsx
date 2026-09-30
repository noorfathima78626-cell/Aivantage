import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import WebcamFeed from '../components/WebcamFeed.jsx'
import AvatarPanel from '../components/AvatarPanel.jsx'
import MetricChip from '../components/MetricChip.jsx'
import { sessionApi, signalsApi, MOCK_MODE } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const FALLBACK_QUESTIONS = [
  { id: 'fallback-1', text: 'Tell me about a project you are proud of and your specific role in it.' },
  { id: 'fallback-2', text: 'What is one technical challenge you faced, and how did you solve it?' },
  { id: 'fallback-3', text: 'What would you like to improve in your technical skills?' },
]

export default function InterviewSession() {
  const { sessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = useAuth()

  const selectedSubject = location.state?.subject || 'General'
  const selectedRound = Number(location.state?.round || 1)
  const sessionQuestions = Array.isArray(location.state?.questions) && location.state.questions.length
    ? location.state.questions.map((q, index) => ({
        id: q.id ?? q.questionId ?? index + 1,
        text: q.text ?? q.questionText ?? q.question ?? '',
        order: q.order ?? index + 1,
      })).filter((q) => q.text)
    : FALLBACK_QUESTIONS

  const [questions] = useState(sessionQuestions)
  const [qIndex, setQIndex] = useState(0)
  const [avatarText, setAvatarText] = useState(null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [answers, setAnswers] = useState([])
  const [seconds, setSeconds] = useState(0)
  const [metrics, setMetrics] = useState({ eyeContact: 0, handMovement: 0, paceWpm: 0 })
  const [stream, setStream] = useState(null)
  const [analysisStatus, setAnalysisStatus] = useState('Connecting AI analysis…')
  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')
  const listeningStartedAtRef = useRef(null)
  const question = questions[qIndex]

  useEffect(() => {
    if (question?.text) setAvatarText(question.text)
  }, [qIndex, question?.text])

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  // Send actual webcam frames to the Python AI engine instead of showing random metrics.
  useEffect(() => {
    if (!stream || !sessionId || !question) return undefined

    let cancelled = false
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    video.autoplay = true
    video.muted = true
    video.playsInline = true
    video.srcObject = stream

    const analyze = async () => {
      if (cancelled || video.readyState < 2) return
      const width = video.videoWidth || 640
      const height = video.videoHeight || 480
      if (!width || !height) return

      canvas.width = Math.min(width, 640)
      canvas.height = Math.round((canvas.width / width) * height)
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      try {
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.7)
        const result = await signalsApi.analyzeFrame(Number(sessionId), imageBase64)
        if (cancelled) return
        setMetrics((current) => ({
          ...current,
          eyeContact: Number(result.eyeContactScore ?? 0),
          handMovement: Number(result.handMovementScore ?? 0),
        }))
        setAnalysisStatus('AI analysis active')
      } catch (error) {
        if (!cancelled) {
          console.error('Frame analysis failed:', error)
          setAnalysisStatus('AI analysis reconnecting…')
        }
      }
    }

    const startTimer = window.setTimeout(analyze, 800)
    const interval = window.setInterval(analyze, 1500)

    return () => {
      cancelled = true
      window.clearTimeout(startTimer)
      window.clearInterval(interval)
      video.pause()
      video.srcObject = null
    }
  }, [stream, sessionId, question?.id])

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome.')
      return
    }

    recognitionRef.current?.stop()
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let text = ''
      for (let i = 0; i < event.results.length; i += 1) text += event.results[i][0].transcript
      transcriptRef.current = text
      setTranscript(text)
    }

    recognition.onend = () => {
      setListening(false)
      updatePace()
    }
    recognition.onerror = () => setListening(false)

    listeningStartedAtRef.current = Date.now()
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  function updatePace() {
    const startedAt = listeningStartedAtRef.current
    if (!startedAt) return
    const durationMinutes = Math.max((Date.now() - startedAt) / 60000, 0.05)
    const words = transcriptRef.current.trim().split(/\s+/).filter(Boolean).length
    if (words > 0) {
      setMetrics((current) => ({ ...current, paceWpm: Math.round(words / durationMinutes) }))
    }
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setListening(false)
    updatePace()
  }

  async function saveAndMove(answerText) {
    const updatedAnswers = [...answers, { questionId: question.id, answerText }]
    setAnswers(updatedAnswers)

    if (!MOCK_MODE && typeof question.id === 'number') {
      await sessionApi.submitAnswer(token, sessionId, { questionId: question.id, answerText })
    }

    stopListening()
    transcriptRef.current = ''
    setTranscript('')

    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1)
      return
    }

    if (!MOCK_MODE) await sessionApi.complete(token, sessionId)
    navigate(`/results/${sessionId}`, { state: { answers: updatedAnswers, metrics } })
  }

  async function handleNext() {
    if (!transcript.trim()) return
    await saveAndMove(transcript.trim())
  }

  async function handleSkip() {
    const confirmSkip = window.confirm('Skip this question and move to the next one?')
    if (!confirmSkip) return
    await saveAndMove('[Question skipped]')
  }

  function handleAvatarDone() {
    if (!listening) startListening()
  }

  return (
    <div className="page-shell interview-page bright-interview-page">
      <Navbar />

      <main className="interview-shell premium-interview-shell">
        <header className="interview-command-bar professional-card">
          <div className="command-brand">
            <div className="command-logo"><span>AI</span></div>
            <div>
              <span className="eyebrow">INTERVIEWAI STUDIO</span>
              <h1>Live Practice Room</h1>
            </div>
          </div>

          <div className="interview-center-status">
            <div className="live-session"><span className="live-dot" /> LIVE SESSION</div>
            <div className="session-timer">◷ {formatTime(seconds)}</div>
          </div>

          <div className="question-counter premium-counter">
            <span>{selectedSubject} • Round {selectedRound}</span>
            <strong>{qIndex + 1}<small> / {questions.length}</small></strong>
          </div>
        </header>

        <section className="interview-grid premium-grid">
          <div className="interview-panel-wrap animated-interviewer-wrap">
            <AvatarPanel text={avatarText} onDone={handleAvatarDone} authToken={token} />
          </div>

          <div className="camera-panel professional-card">
            <div className="camera-panel-title">
              <div>
                <span className="eyebrow">YOUR LIVE CAMERA</span>
                <h2>Candidate View</h2>
              </div>
              <div className="camera-status-group">
                <span className="camera-quality">HD</span>
                <span className="camera-rec"><i /> RECORDING</span>
              </div>
            </div>

            <WebcamFeed showLiveBadge={false} onStream={setStream}>
              <div className="metric-stack">
                <MetricChip label="EYE CONTACT" value={`${Math.round(metrics.eyeContact)}%`} />
                <MetricChip label="HAND MOVEMENT" value={`${Math.round(metrics.handMovement)}%`} />
                <MetricChip label="PACE" value={metrics.paceWpm ? `${Math.round(metrics.paceWpm)} wpm` : '—'} />
              </div>
            </WebcamFeed>

            <div className="camera-footer-hint">
              <span>●</span> {analysisStatus}
            </div>
          </div>
        </section>

        <section className="question-card professional-card premium-question-card">
          <div className="question-card-head">
            <div className="mini-interviewer">✦</div>
            <div>
              <span className="eyebrow">AI INTERVIEWER • ALEX MORGAN</span>
              <h2>Current question</h2>
            </div>
            <div className="question-tag">{selectedSubject}</div>
          </div>

          <div className="quote-mark">“</div>
          <p className="question-text">{question?.text}</p>
          <div className="audio-wave" aria-hidden="true">
            {Array.from({ length: 32 }).map((_, index) => <span key={index} />)}
          </div>

          <div className={listening ? 'answer-box listening' : 'answer-box'}>
            <div className="answer-status">
              <span className={listening ? 'answer-pulse active' : 'answer-pulse'} />
              {listening ? 'Listening to your answer…' : 'Your spoken answer will appear here'}
            </div>
            <div className="transcript-text">
              {transcript || 'Take a moment to think. Speak naturally, just like a real interview.'}
            </div>
          </div>

          <div className="answer-actions premium-actions">
            {!listening ? (
              <button className="btn-primary btn-large answer-main-button" onClick={startListening}>
                <span className="button-icon">🎙</span>
                <span><b>Start Answering</b><small>Click to begin speaking</small></span>
              </button>
            ) : (
              <button className="btn-secondary btn-large answer-main-button" onClick={stopListening}>
                <span className="button-icon">■</span>
                <span><b>Stop Recording</b><small>Finish your spoken response</small></span>
              </button>
            )}

            <button className="btn-skip" onClick={handleSkip}>
              <span>⏭</span>
              <span><b>Skip Question</b><small>Move to the next one</small></span>
            </button>

            <button className="btn-primary btn-large next-button premium-next" onClick={handleNext} disabled={!transcript.trim()}>
              <span><b>{qIndex + 1 < questions.length ? 'Next Question' : 'Finish Interview'}</b><small>Save & continue</small></span>
              <strong>→</strong>
            </button>
          </div>
        </section>

        <section className="bottom-interview-grid">
          <div className="performance-area professional-card">
            <div className="section-mini-header">
              <div><span className="eyebrow">LIVE PERFORMANCE</span><h3>Interview signals</h3></div>
              <span className="signal-live"><i /> {analysisStatus === 'AI analysis active' ? 'LIVE' : 'CONNECTING'}</span>
            </div>
            <div className="performance-strip premium-performance-strip">
              <PerformanceCard icon="◉" label="Eye contact" value={`${Math.round(metrics.eyeContact)}%`} score={metrics.eyeContact} note={metrics.eyeContact >= 70 ? 'Good focus' : 'Look at camera'} />
              <PerformanceCard icon="✋" label="Hand movement" value={`${Math.round(metrics.handMovement)}%`} score={metrics.handMovement} note="Natural gestures" />
              <PerformanceCard icon="◔" label="Speaking pace" value={metrics.paceWpm ? `${Math.round(metrics.paceWpm)} WPM` : '—'} score={Math.min(100, metrics.paceWpm / 1.8)} note={metrics.paceWpm ? 'Based on your answer' : 'Start speaking'} />
            </div>
          </div>

          <aside className="interview-tips professional-card">
            <div className="tips-icon">☼</div>
            <div>
              <span className="eyebrow">INTERVIEW TIP</span>
              <p>Take your time. A clear, structured answer is better than a rushed answer.</p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

function PerformanceCard({ icon, label, value, score, note }) {
  return (
    <div className="performance-card premium-performance-card">
      <div className="metric-icon">{icon}</div>
      <div className="performance-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
        <div className="performance-track"><div style={{ width: `${Math.max(3, score)}%` }} /></div>
      </div>
    </div>
  )
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}
