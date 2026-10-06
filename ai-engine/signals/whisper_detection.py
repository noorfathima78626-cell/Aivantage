"""Soft detection of possible secondary/whisper-like speech in a WAV chunk.

This is an integrity *signal*, not speaker identification and not proof of
cheating. The previous implementation received WebM/Opus from the browser and
therefore often could not decode anything. The frontend now converts chunks to
16-bit PCM WAV before sending them here.
"""
import io
import wave
import numpy as np

WINDOW_MS = 200
SPEECH_RMS_PERCENTILE = 70
NOISE_FLOOR_PERCENTILE = 15
SECONDARY_VOICE_MARGIN = 3.0
FLAG_WINDOW_FRACTION = 0.20


def _read_wav_pcm16(wav_bytes: bytes):
    with wave.open(io.BytesIO(wav_bytes), "rb") as wf:
        sample_rate = wf.getframerate()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)
        samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
        if wf.getnchannels() > 1:
            samples = samples.reshape(-1, wf.getnchannels()).mean(axis=1)
    return samples, sample_rate


def _zcr(window):
    signs = np.signbit(window)
    return float(np.mean(signs[1:] != signs[:-1])) if len(window) > 1 else 0.0


def detect_whisper(wav_bytes: bytes) -> bool:
    try:
        samples, sample_rate = _read_wav_pcm16(wav_bytes)
    except (wave.Error, EOFError, ValueError):
        return False

    window_size = int(sample_rate * (WINDOW_MS / 1000))
    if window_size <= 0 or len(samples) < window_size * 6:
        return False

    n_windows = len(samples) // window_size
    rms = []
    zcr = []
    for i in range(n_windows):
        window = samples[i * window_size:(i + 1) * window_size]
        rms.append(float(np.sqrt(np.mean(window ** 2) + 1e-9)))
        zcr.append(_zcr(window))
    rms = np.asarray(rms)
    zcr = np.asarray(zcr)

    noise_floor = float(np.percentile(rms, NOISE_FLOOR_PERCENTILE))
    speech_threshold = float(np.percentile(rms, SPEECH_RMS_PERCENTILE))
    if noise_floor <= 0 or speech_threshold <= 0:
        return False

    # Candidate quiet windows are substantially below the speaker's main
    # energy. A second/quiet voice tends to create energy above the normal
    # noise floor while still having speech-like zero-crossing activity.
    quiet = rms < speech_threshold * 0.45
    suspicious = (
        quiet
        & (rms > noise_floor * SECONDARY_VOICE_MARGIN)
        & (zcr > 0.015)
        & (zcr < 0.35)
    )

    quiet_count = int(np.sum(quiet))
    if quiet_count == 0:
        return False

    occupied_fraction = float(np.sum(suspicious)) / quiet_count
    return bool(occupied_fraction >= FLAG_WINDOW_FRACTION)
