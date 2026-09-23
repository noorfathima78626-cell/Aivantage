import React, { useEffect, useRef, useState } from 'react'

const INTERVIEWER = {
  name: 'Alex Morgan',
  role: 'Senior Technical Interviewer',
  image: '/assets/ai-interviewer-male.png',
  video: 'https://videos.pexels.com/video-files/5941016/5941016-uhd_3840_2160_25fps.mp4',
  fallbackVideo: '/assets/ai-interviewer-loop.mp4',
}

function pickMaleVoice(voices) {
  const preferred = ['daniel', 'alex', 'david', 'mark', 'james', 'george', 'aaron', 'fred', 'male']
  return voices.find((v) => preferred.some((name) => v.name.toLowerCase().includes(name))) || null
}

export default function AvatarPanel({ text, onDone }) {
  const [speaking, setSpeaking] = useState(false)
  const [videoSrc, setVideoSrc] = useState(INTERVIEWER.video)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)
  const onDoneRef = useRef(onDone)
  const runRef = useRef(0)

  useEffect(() => { onDoneRef.current = onDone }, [onDone])

  // Keep the interviewer visible at all times, but initially paused.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    setVideoReady(false)
    video.pause()
    const ready = () => setVideoReady(true)
    video.addEventListener('canplay', ready)
    video.load()
    return () => video.removeEventListener('canplay', ready)
  }, [videoSrc])

  useEffect(() => {
    if (!text || !window.speechSynthesis) return undefined
    const synth = window.speechSynthesis
    const run = ++runRef.current
    let cancelled = false
    let speakTimer
    let keepAlive

    const stop = () => {
      cancelled = true
      clearTimeout(speakTimer)
      clearInterval(keepAlive)
      if (synth.speaking || synth.pending) synth.cancel()
      videoRef.current?.pause()
      setSpeaking(false)
    }

    const speakQuestion = () => {
      if (cancelled || run !== runRef.current) return
      const video = videoRef.current
      if (!video) return

      // Start the real footage first. It provides the natural movement.
      video.play().catch(() => {})
      setSpeaking(true)

      // Give the video a short head start, then start the voice.
      speakTimer = setTimeout(() => {
        if (cancelled || run !== runRef.current) return
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 0.93
        utterance.volume = 1
        const voice = pickMaleVoice(synth.getVoices())
        if (voice) utterance.voice = voice

        utterance.onstart = () => { if (!cancelled) setSpeaking(true) }
        utterance.onend = () => {
          if (cancelled || run !== runRef.current) return
          // Exact interview transition: question finished -> freeze Alex -> listen.
          video.pause()
          setSpeaking(false)
          onDoneRef.current?.()
        }
        utterance.onerror = (e) => {
          if (cancelled || run !== runRef.current) return
          if (!['interrupted', 'canceled'].includes(e.error)) console.warn('Speech error:', e.error)
          video.pause()
          setSpeaking(false)
        }
        synth.speak(utterance)
        keepAlive = setInterval(() => { if (!cancelled && synth.speaking) synth.resume() }, 8000)
      }, 750)
    }

    // If remote video is slow, do not wait indefinitely. It remains visible via poster/fallback,
    // and the speech sequence still starts.
    speakTimer = setTimeout(speakQuestion, videoReady ? 120 : 500)

    return stop
  }, [text, videoReady])

  return (
    <section className={`interviewer-stage professional-card ${speaking ? 'avatar-speaking' : 'interviewer-listening'}`}>
      <div className="video-call-noise" />
      <div className="stage-grid" />
      <div className="stage-glow stage-glow-one" />
      <div className="stage-glow stage-glow-two" />
      <div className="human-avatar" aria-label="Real human video interviewer">
        <div className="portrait-frame">
          <video
            ref={videoRef}
            className="realistic-interviewer interviewer-video"
            src={videoSrc}
            poster={INTERVIEWER.image}
            muted
            playsInline
            loop
            preload="auto"
            onError={() => {
              if (videoSrc !== INTERVIEWER.fallbackVideo) setVideoSrc(INTERVIEWER.fallbackVideo)
            }}
            aria-label={`${INTERVIEWER.name}, ${INTERVIEWER.role}`}
          />
          <div className="portrait-vignette" />
          <div className="video-scanline" />
          <div className="video-reflection" />
          <div className="blink-eye" />
          <div className="talking-mouth">
            <div className="mouth-teeth" />
            <div className="mouth-shadow" />
          </div>
        </div>
      </div>
      <div className="interviewer-topline">
        <span className="interviewer-chip"><span className="chip-spark">●</span> LIVE INTERVIEW</span>
        <span className={speaking ? 'speaking-indicator active' : 'speaking-indicator'}><i /> {speaking ? 'Alex is speaking' : 'Alex is listening'}</span>
      </div>
      <div className="human-presence-badge"><span className="presence-camera" /> REAL HUMAN VIDEO</div>
      <div className="interviewer-label">
        <div>
          <span className="eyebrow">INTERVIEWER</span>
          <h2>{INTERVIEWER.name} <span className="verified-mark">✓</span></h2>
          <p>{INTERVIEWER.role}</p>
          <small><span className="online-dot" /> Camera on • Looking at you</small>
        </div>
        <div className="voice-bars"><b /><b /><b /><b /><b /><b /><b /></div>
      </div>
    </section>
  )
}
