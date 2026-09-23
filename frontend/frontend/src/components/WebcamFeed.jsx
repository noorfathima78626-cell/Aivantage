import React, { useEffect, useRef, useState } from 'react'

const ERROR_MESSAGES = {
  NotAllowedError: 'Camera access was denied. Click the camera icon in your browser\'s address bar, allow access, and reload.',
  PermissionDeniedError: 'Camera access was denied. Click the camera icon in your browser\'s address bar, allow access, and reload.',
  NotFoundError: 'No camera was found.',
  NotReadableError: 'Your camera is already in use by another app (Zoom, Photo Booth, another browser tab, etc). Close it and reload this page.',
  TrackStartError: 'Your camera is already in use by another app (Zoom, Photo Booth, another browser tab, etc). Close it and reload this page.',
  OverconstrainedError: 'That camera is no longer available. Try selecting a different one.',
}

/**
 * Renders the live camera feed, with a device picker so a user with a
 * broken built-in camera can explicitly select an external webcam instead
 * of whatever the browser defaults to.
 */
export default function WebcamFeed({ showLiveBadge = true, onReady, onStream, children }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const audioCtxRef = useRef(null)
  const rafRef = useRef(null)
  const [status, setStatus] = useState('requesting') // requesting | ready | denied
  const [errorMessage, setErrorMessage] = useState('')
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [micLevel, setMicLevel] = useState(0)

  function startMicMeter(stream) {
    const audioTrack = stream.getAudioTracks()[0]
    if (!audioTrack) return
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioCtx()
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    audioCtxRef.current = ctx

    const data = new Uint8Array(analyser.frequencyBinCount)
    function tick() {
      analyser.getByteFrequencyData(data)
      const avg = data.reduce((a, b) => a + b, 0) / data.length
      setMicLevel(avg)
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
  }

  async function startStream(deviceId) {
    setStatus('requesting')
    streamRef.current?.getTracks().forEach((t) => t.stop())
    audioCtxRef.current?.close()
    cancelAnimationFrame(rafRef.current)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: { ideal: 'user' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setStatus('ready')
      startMicMeter(stream)
      onStream?.(stream)

      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput')
      setDevices(videoInputs)

      const activeId = stream.getVideoTracks()[0]?.getSettings().deviceId
      setSelectedDeviceId(deviceId || activeId || videoInputs[0]?.deviceId || '')
    } catch (err) {
      console.error('Camera error:', err.name, err.message)
      setErrorMessage(ERROR_MESSAGES[err.name] || `Could not access the camera (${err.name || 'unknown error'}).`)
      setStatus('denied')
    }
  }

  useEffect(() => {
    startStream()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      audioCtxRef.current?.close()
      cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onReady?.(status === 'ready')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <div style={{
      position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden',
      background: '#12151B', aspectRatio: '4 / 3', width: '100%', border: '1px solid var(--border)',
    }}>
      {status === 'requesting' && (
        <div style={{
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
          color: '#9AA3B4', fontSize: 13, padding: 24, textAlign: 'center',
        }}>
          Requesting camera access — check for a permission popup from your browser…
        </div>
      )}

      {status === 'denied' && (
        <div style={{
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
          color: '#E7E9ED', fontSize: 14, padding: 24, textAlign: 'center', lineHeight: 1.5,
        }}>
          {errorMessage}
        </div>
      )}

      <video ref={videoRef} autoPlay playsInline muted style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: 'scaleX(-1)', // mirror, feels natural for self-view
        opacity: status === 'ready' ? 1 : 0,
      }} />

      {showLiveBadge && status === 'ready' && (
        <div style={{
          position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(18,21,27,0.82)', padding: '5px 10px', borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span className="live-dot" />
          <span className="mono" style={{ color: '#B7BFCC', fontSize: 10, letterSpacing: '0.08em' }}>LIVE</span>
        </div>
      )}

      {status === 'ready' && (
        <div style={{
          position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(18,21,27,0.82)', padding: '5px 10px', borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span className="mono" style={{ color: '#B7BFCC', fontSize: 9, letterSpacing: '0.06em' }}>MIC</span>
          <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (micLevel / 90) * 100)}%`, height: '100%',
              background: micLevel > 8 ? '#2E9E5B' : 'rgba(255,255,255,0.25)',
              transition: 'width 0.1s ease, background 0.2s ease',
            }} />
          </div>
        </div>
      )}

      {devices.length > 1 && status === 'ready' && (
        <select
          value={selectedDeviceId}
          onChange={(e) => startStream(e.target.value)}
          style={{
            position: 'absolute', bottom: 10, left: 10, right: 10, width: 'auto',
            fontSize: 12, padding: '7px 10px', background: 'rgba(18,21,27,0.88)',
            color: '#E7E9ED', border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {devices.map((d, i) => (
            <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>
          ))}
        </select>
      )}

      {children}
    </div>
  )
}
