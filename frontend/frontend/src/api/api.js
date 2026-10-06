// Matches /API_CONTRACT.md at the repo root.
export const MOCK_MODE = false

const CURRENT_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
const BASE_URL = `http://${CURRENT_HOST}:8080/api`
const AI_ENGINE_URL = `http://${CURRENT_HOST}:8000`

async function request(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json()
}

async function aiRequest(path, body) {
  const res = await fetch(`${AI_ENGINE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `AI engine request failed: ${res.status}`)
  }
  return res.json()
}

export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  sendOtp: (payload) => request('/auth/otp/send', { method: 'POST', body: payload }),
  verifyOtp: (payload) => request('/auth/otp/verify', { method: 'POST', body: payload }),
}

export const sessionApi = {
  create: (token, payload) => request('/sessions', { method: 'POST', token, body: payload }),
  submitAnswer: (token, sessionId, payload) =>
    request(`/sessions/${sessionId}/answer`, { method: 'POST', token, body: payload }),
  complete: (token, sessionId) =>
    request(`/sessions/${sessionId}/complete`, { method: 'POST', token }),
  getReport: (token, sessionId) =>
    request(`/sessions/${sessionId}/report`, { method: 'GET', token }),
}

export const resumeApi = {
  upload: async (token, file) => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    if (!res.ok) throw new Error('Resume upload failed')
    return res.json()
  },
}

// Called directly from the browser, not through the Java backend - see
// API_CONTRACT.md section 2 for why.
export const signalsApi = {
  analyzeFrame: (sessionId, imageBase64) =>
    aiRequest('/signals/analyze-frame', { sessionId, imageBase64 }),
  analyzeAudio: (sessionId, audioBase64, transcriptChunk, chunkDurationSec) =>
    aiRequest('/signals/analyze-audio', { sessionId, audioBase64, transcriptChunk, chunkDurationSec }),
}

export const historyApi = {
  list: (token) => request('/history', { method: 'GET', token }),
}

export const aiApi = {
  generateQuestions: (payload) => aiRequest('/qa/generate-questions', payload),
}
