"""
Speaking pace: words-per-minute from a transcript chunk and its duration.
No audio decoding needed - this is why it's split out from whisper
detection, which does need the raw audio.
"""


def compute_pace_wpm(transcript: str, duration_seconds: float) -> float:
    if not transcript or duration_seconds <= 0:
        return 0.0
    word_count = len(transcript.strip().split())
    minutes = duration_seconds / 60.0
    return round(word_count / minutes, 1) if minutes > 0 else 0.0


def classify_pace(wpm: float) -> str:
    # Same thresholds as the Java report builder - keep these in sync.
    if wpm <= 0:
        return "UNKNOWN"
    if wpm < 110:
        return "TOO_SLOW"
    if wpm > 160:
        return "TOO_FAST"
    return "GOOD"
