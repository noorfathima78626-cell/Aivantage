# Replace only the corresponding parts of your existing main.py.
# 1. Change the import:
from signals.whisper_detection import detect_whisper, detect_additional_voice

# 2. Extend AnalyzeAudioRequest:
class AnalyzeAudioRequest(BaseModel):
    sessionId: int
    audioBase64: str
    transcriptChunk: str = ""
    chunkDurationSec: float = 0.0
    mimeType: str = "audio/wav"

# 3. Replace /signals/analyze-audio with:
@app.post("/signals/analyze-audio")
def analyze_audio(req: AnalyzeAudioRequest):
    wpm = compute_pace_wpm(req.transcriptChunk, req.chunkDurationSec)
    pace_flag = classify_pace(wpm)

    whisper_flag = False
    additional_voice_flag = False
    try:
        audio_bytes = _decode_base64_audio(req.audioBase64)
        whisper_flag = detect_whisper(audio_bytes)
        additional_voice_flag = detect_additional_voice(audio_bytes)
    except Exception:
        logger.exception("Failed to decode/analyze audio chunk")

    try:
        db.insert_session_metric(
            session_id=req.sessionId,
            speaking_pace_wpm=wpm,
            whisper_detected=whisper_flag,
        )
    except Exception:
        logger.exception("Failed to write session_metrics row (audio)")

    return {
        "speakingPaceWpm": wpm,
        "paceFlag": pace_flag,
        "whisperDetected": whisper_flag,
        "additionalVoiceDetected": additional_voice_flag,
    }
