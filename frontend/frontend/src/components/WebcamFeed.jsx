import React, { useCallback, useEffect, useRef, useState } from 'react'

const ERROR_MESSAGES = {
  NotAllowedError: 'Camera or microphone access was denied. Allow both permissions in the browser address bar and reload.',
  PermissionDeniedError: 'Camera or microphone access was denied. Allow both permissions in the browser address bar and reload.',
  NotFoundError: 'No camera was found. Check that your webcam is plugged in and visible to the operating system.',
  NotReadableError: 'The camera is already in use by another app. Close Zoom, Photo Booth, FaceTime or another browser tab and try again.',
  TrackStartError: 'The camera could not be started. Close other apps using the webcam and try again.',
  OverconstrainedError: 'The selected camera does not support the requested settings.',
}

export default function WebcamFeed({ showLiveBadge = true, onReady, onStream, children }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const audioCtxRef = useRef(null)
  const rafRef = useRef(null)
  const onReadyRef = useRef(onReady)
  const onStreamRef = useRef(onStream)
  const mountedRef = useRef(true)
  const [status, setStatus] = useState('requesting')
  const [errorMessage, setErrorMessage] = useState('')
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [micLevel, setMicLevel] = useState(0)
  const [micAvailable, setMicAvailable] = useState(false)

  useEffect(() => { onReadyRef.current = onReady }, [onReady])
  useEffect(() => { onStreamRef.current = onStream }, [onStream])

  const stopCurrentStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setMicLevel(0)
    setMicAvailable(false)
  }, [])

  const updateDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = all.filter((d) => d.kind === 'videoinput')
      if (mountedRef.current) setDevices(videoInputs)
      return videoInputs
    } catch { return [] }
  }, [])

  const startMicMeter = useCallback((stream) => {
    const audioTrack = stream.getAudioTracks()[0]
    if (!audioTrack) return
    setMicAvailable(true)
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    try {
      const ctx = new AudioCtx()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      audioCtxRef.current = ctx
      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        if (!mountedRef.current) return
        analyser.getByteFrequencyData(data)
        setMicLevel(data.reduce((a, b) => a + b, 0) / data.length)
        rafRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch { setMicAvailable(true) }
  }, [])

  const startStream = useCallback(async (deviceId = '') => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('denied')
      setErrorMessage('This browser does not support camera access.')
      return
    }
    setStatus('requesting')
    setErrorMessage('')
    stopCurrentStream()
    let cameraStream = null
    try {
      const preferred = deviceId
        ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
        : { facingMode: { ideal: 'user' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: preferred, audio: false })
      } catch (firstError) {
        if (firstError.name === 'OverconstrainedError' || firstError.name === 'NotFoundError') {
          cameraStream = await navigator.mediaDevices.getUserMedia({ video: deviceId ? { deviceId: { exact: deviceId } } : true, audio: false })
        } else throw firstError
      }

      const combined = cameraStream
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        })
        micStream.getAudioTracks().forEach((track) => combined.addTrack(track))
      } catch (micError) {
        console.warn('Microphone unavailable:', micError)
        setErrorMessage('Camera is working, but microphone access is unavailable. Allow microphone permission to enable speaking analysis.')
      }

      if (!mountedRef.current) { combined.getTracks().forEach((track) => track.stop()); return }
      streamRef.current = combined
      if (videoRef.current) {
        videoRef.current.srcObject = combined
        await videoRef.current.play().catch(() => {})
      }
      setStatus('ready')
      startMicMeter(combined)
      onStreamRef.current?.(combined)
      const videoInputs = await updateDevices()
      const activeId = combined.getVideoTracks()[0]?.getSettings?.().deviceId
      setSelectedDeviceId(activeId || deviceId || videoInputs?.[0]?.deviceId || '')
      onReadyRef.current?.(true)
    } catch (err) {
      console.error('Camera error:', err)
      cameraStream?.getTracks().forEach((track) => track.stop())
      if (!mountedRef.current) return
      setStatus('denied')
      setErrorMessage(ERROR_MESSAGES[err.name] || `Could not access the camera (${err.name || 'unknown error'}).`)
      onReadyRef.current?.(false)
    }
  }, [startMicMeter, stopCurrentStream, updateDevices])

  useEffect(() => {
    mountedRef.current = true
    startStream()
    return () => { mountedRef.current = false; stopCurrentStream(); onReadyRef.current?.(false) }
  }, [startStream, stopCurrentStream])

  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', background: '#12151B', aspectRatio: '4 / 3', width: '100%', border: '1px solid var(--border)' }}>
      {status === 'requesting' && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#9AA3B4', fontSize: 13, padding: 24, textAlign: 'center', zIndex: 2 }}>Starting camera and microphone… choose Allow if the browser asks.</div>}
      {status === 'denied' && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#E7E9ED', fontSize: 14, padding: 24, textAlign: 'center', lineHeight: 1.5, zIndex: 2 }}><div><strong>{errorMessage}</strong><button type="button" className="btn-secondary" style={{ display: 'block', margin: '14px auto 0' }} onClick={() => startStream(selectedDeviceId)}>Retry camera</button></div></div>}
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', opacity: status === 'ready' ? 1 : 0 }} />
      {showLiveBadge && status === 'ready' && <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(18,21,27,.82)', padding: '5px 10px', borderRadius: 4 }}><span className="live-dot" /> <span className="mono" style={{ color: '#B7BFCC', fontSize: 10 }}>LIVE</span></div>}
      {status === 'ready' && <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(18,21,27,.82)', padding: '5px 10px', borderRadius: 4 }}><span className="mono" style={{ color: '#B7BFCC', fontSize: 9 }}>MIC {micAvailable ? 'ON' : 'OFF'}</span><div style={{ width: 40, height: 4, background: 'rgba(255,255,255,.15)', borderRadius: 2, overflow: 'hidden' }}><div style={{ width: `${Math.min(100, micLevel / 0.9)}%`, height: '100%', background: micLevel > 8 ? '#2E9E5B' : 'rgba(255,255,255,.25)' }} /></div></div>}
      {devices.length > 1 && status === 'ready' && <select value={selectedDeviceId} onChange={(e) => startStream(e.target.value)} style={{ position: 'absolute', bottom: 10, left: 10, right: 10, width: 'auto', fontSize: 12, padding: '7px 10px', background: 'rgba(18,21,27,.88)', color: '#E7E9ED', border: '1px solid rgba(255,255,255,.08)', zIndex: 3 }}>{devices.map((d, i) => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>)}</select>}
      {status === 'ready' && errorMessage && <div style={{ position: 'absolute', left: 10, right: 10, bottom: devices.length > 1 ? 52 : 10, padding: '7px 10px', background: 'rgba(40,20,20,.88)', color: '#ffd0d0', fontSize: 11, borderRadius: 5 }}>{errorMessage}</div>}
      {children}
    </div>
  )
}
