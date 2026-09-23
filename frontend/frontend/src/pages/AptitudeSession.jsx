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

function mergeFloat32(buffers) {
  const total = buffers.reduce((sum, b) => sum + b.length, 0)
  const result = new Float32Array(total)
  let offset = 0
  for (const b of buffers) { result.set(b, offset); offset += b.length }
  return result
}

function encodeWAV(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)
  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, samples.length * 2, true)
  let offset = 44
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return buffer
}

function arrayBufferToBase64(buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

export default function AptitudeSession() {
  const { sessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const subject = location.state?.subject || 'General'
  const difficulty = location.state?.difficulty || 'MEDIUM'
  const [questions] = useState(() => getAptitudeQuestions(subject))
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
    const mcqQuestions = questions.filter((q) => q.type !== 'code')
    const codeQuestions = questions.filter((q) => q.type === 'code')
    const correct = mcqQuestions.reduce((sum, q) => sum + (finalAnswers[q.id] === q.answerIndex ? 1 : 0), 0)
    const attempted = Object.keys(finalAnswers).filter((id) => finalAnswers[id] !== undefined && finalAnswers[id] !== '').length
    const codeSubmitted = codeQuestions.filter((q) => finalAnswers[q.id]?.trim()).length
    const score = mcqQuestions.length ? Math.round((correct / mcqQuestions.length) * 100) : 0
    navigate(`/results/${sessionId}`, {
      state: {
        aptitudeReport: {
          score, correct, attempted, total: questions.length,
          mcqTotal: mcqQuestions.length, codeTotal: codeQuestions.length, codeSubmitted,
          subject, difficulty, integrityEvents: eventsRef.current, finishReason: reason,
          codeAnswers: codeQuestions.map((q) => ({ question: q.text, code: finalAnswers[q.id] || '' })),
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
        // 'mobilenet_v2' (not the 'lite' variant) trades a slightly larger
        // download for meaningfully better detection accuracy - worth it
        // since this only runs once every 3s, not per video frame.
        modelRef.current = await cocoSsd.load({ base: 'mobilenet_v2' })
        console.info('[proctor] phone-detection model loaded successfully')
      } catch (error) {
        console.warn('[proctor] phone detector could not load - phone detection is silently disabled:', error)
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
          console.debug('[proctor] detected objects this cycle:', predictions.map((p) => `${p.class} (${Math.round(p.score * 100)}%)`))
          // 0.55 was too strict for a compressed webcam snapshot at typical
          // distance/angle - real phones were scoring below that and never
          // triggering. 0.35 catches more true positives; it's a soft
          // signal for review, not a verdict, so a slightly higher false
          // positive rate is an acceptable trade-off here.
          const phone = predictions.some((item) => item.class === 'cell phone' && item.score > 0.35)
          setProctor((p) => ({ ...p, phone }))
          if (phone) addEvent('phone', 'A phone-like object was detected in the camera view.')
        }
      } catch (error) {
        console.warn('[proctor] phone detection cycle failed:', error)
      }
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
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const audioContext = new AudioCtx()
    const source = audioContext.createMediaStreamSource(stream)
    const processor = audioContext.createScriptProcessor(4096, 1, 1)
    const silentGain = audioContext.createGain()
    silentGain.gain.value = 0 // must reach destination to fire onaudioprocess, but muted so no echo

    let buffers = []
    processor.onaudioprocess = (event) => buffers.push(new Float32Array(event.inputBuffer.getChannelData(0)))
    source.connect(processor)
    processor.connect(silentGain)
    silentGain.connect(audioContext.destination)

    const interval = window.setInterval(async () => {
      if (buffers.length === 0) return
      const merged = mergeFloat32(buffers)
      buffers = []
      const wavBuffer = encodeWAV(merged, audioContext.sampleRate)
      const audioBase64 = arrayBufferToBase64(wavBuffer)
      const chunkDurationSec = merged.length / audioContext.sampleRate
      try {
        const result = await signalsApi.analyzeAudio(Number(sessionId), audioBase64, '', chunkDurationSec)
        if (result.whisperDetected) {
          setProctor((p) => ({ ...p, whisper: true }))
          addEvent('audio', 'Unusual whisper-like background audio was detected.')
        }
      } catch {}
    }, 4000)

    return () => {
      window.clearInterval(interval)
      processor.disconnect()
      source.disconnect()
      audioContext.close()
    }
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
            <div className="exam-topline"><span>QUESTION {current + 1}</span><small>{difficulty} • {question.type === 'code' ? 'CODING' : 'MCQ'}</small></div>
            <h2 className="aptitude-question">{question.text}</h2>
            {question.type === 'code' ? (
              <textarea
                className="code-answer-box"
                spellCheck={false}
                rows={14}
                value={answers[question.id] ?? question.starterCode ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [question.id]: e.target.value }))}
              />
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
          </aside>
        </div>

        <div className="aptitude-hidden-camera"><WebcamFeed showLiveBadge={false} onStream={setStream} /></div>
      </main>
    </div>
  )
}
