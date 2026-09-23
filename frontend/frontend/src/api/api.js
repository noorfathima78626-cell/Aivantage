// Aptitude detection update: WAV MIME type is sent explicitly to the AI engine.
// Keep the rest of the existing api.js unchanged.
export const signalsApi = {
  analyzeFrame: (sessionId, imageBase64) =>
    aiRequest('/signals/analyze-frame', { sessionId, imageBase64 }),
  analyzeAudio: (sessionId, audioBase64, transcriptChunk, chunkDurationSec) =>
    aiRequest('/signals/analyze-audio', {
      sessionId,
      audioBase64,
      transcriptChunk,
      chunkDurationSec,
      mimeType: 'audio/wav',
    }),
}
