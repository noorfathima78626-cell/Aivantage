"""Soft acoustic indicators for whispering and additional voice-like audio.

These are not speaker identification or reliable speaker diarization. They
should be treated as review signals, not proof of cheating.
"""
import io
import wave
import numpy as np

WINDOW_MS = 200
SPEECH_RMS_PERCENTILE = 70
NOISE_FLOOR_PERCENTILE = 15
SECONDARY_VOICE_MARGIN = 2.5
FLAG_WINDOW_FRACTION = 0.25
PITCH_MIN_HZ = 80.0
PITCH_MAX_HZ = 320.0
MIN_PITCH_WINDOWS = 4
PITCH_CLUSTER_SEMITONES = 4.0


def _read_wav_pcm16(wav_bytes: bytes):
    with wave.open(io.BytesIO(wav_bytes), "rb") as wf:
        sample_rate = wf.getframerate()
        raw = wf.readframes(wf.getnframes())
        samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
        if wf.getnchannels() > 1:
            samples = samples.reshape(-1, wf.getnchannels()).mean(axis=1)
    return samples, sample_rate


def _window_rms(samples, window_size):
    n_windows = len(samples) // window_size
    return np.array([
        np.sqrt(np.mean(samples[i * window_size:(i + 1) * window_size] ** 2) + 1e-9)
        for i in range(n_windows)
    ])


def _estimate_pitch_hz(window, sample_rate):
    window = window.astype(np.float32)
    window -= np.mean(window)
    if len(window) < 32 or np.sqrt(np.mean(window * window) + 1e-9) < 250:
        return 0.0
    window *= np.hanning(len(window))
    min_lag = max(1, int(sample_rate / PITCH_MAX_HZ))
    max_lag = min(len(window) - 1, int(sample_rate / PITCH_MIN_HZ))
    if max_lag <= min_lag:
        return 0.0
    corr = np.correlate(window, window, mode="full")[len(window) - 1:]
    segment = corr[min_lag:max_lag + 1]
    if len(segment) == 0:
        return 0.0
    lag = min_lag + int(np.argmax(segment))
    if corr[lag] / (corr[0] + 1e-9) < 0.30:
        return 0.0
    return float(sample_rate / lag)


def _has_distinct_pitch_cluster(pitches):
    pitches = np.asarray(pitches, dtype=np.float32)
    pitches = pitches[(pitches >= PITCH_MIN_HZ) & (pitches <= PITCH_MAX_HZ)]
    if len(pitches) < MIN_PITCH_WINDOWS:
        return False
    pitches.sort()
    gaps = np.where(12.0 * np.log2(pitches[1:] / pitches[:-1]) >= PITCH_CLUSTER_SEMITONES)[0]
    if len(gaps) == 0:
        return False
    split = int(gaps[0] + 1)
    return split >= 2 and len(pitches) - split >= 2


def detect_whisper(wav_bytes: bytes) -> bool:
    try:
        samples, sample_rate = _read_wav_pcm16(wav_bytes)
    except (wave.Error, EOFError):
        return False
    window_size = int(sample_rate * (WINDOW_MS / 1000))
    if window_size <= 0 or len(samples) < window_size * 4:
        return False
    rms = _window_rms(samples, window_size)
    noise_floor = np.percentile(rms, NOISE_FLOOR_PERCENTILE)
    speech_threshold = np.percentile(rms, SPEECH_RMS_PERCENTILE)
    quiet_windows = rms[rms < speech_threshold * 0.4]
    if len(quiet_windows) == 0 or noise_floor <= 0:
        return False
    occupied = np.sum(quiet_windows > noise_floor * SECONDARY_VOICE_MARGIN)
    return bool((occupied / len(quiet_windows)) > FLAG_WINDOW_FRACTION)


def detect_additional_voice(wav_bytes: bytes) -> bool:
    """Return True for audio consistent with an additional voice-like source.

    This does not identify an exact number of speakers and can produce false
    positives from background speech, noise, music, or unusual microphones.
    """
    try:
        samples, sample_rate = _read_wav_pcm16(wav_bytes)
    except (wave.Error, EOFError):
        return False
    window_size = int(sample_rate * (WINDOW_MS / 1000))
    if window_size <= 0 or len(samples) < window_size * 6:
        return False

    n_windows = len(samples) // window_size
    windows = [samples[i * window_size:(i + 1) * window_size] for i in range(n_windows)]
    rms = np.array([np.sqrt(np.mean(w * w) + 1e-9) for w in windows])
    speech_threshold = np.percentile(rms, SPEECH_RMS_PERCENTILE)
    noise_floor = np.percentile(rms, NOISE_FLOOR_PERCENTILE)

    quiet = rms < speech_threshold * 0.45
    quiet_occupied = (
        np.sum(rms[quiet] > max(noise_floor * SECONDARY_VOICE_MARGIN, 250))
        / max(1, np.sum(quiet))
    )

    active_threshold = max(noise_floor * 3.0, speech_threshold * 0.25)
    active_indices = np.where(rms > active_threshold)[0]
    pitches = []
    for index in active_indices:
        pitch = _estimate_pitch_hz(windows[index], sample_rate)
        if pitch > 0:
            pitches.append(pitch)

    pitch_evidence = _has_distinct_pitch_cluster(pitches)
    return bool(quiet_occupied > 0.20 or pitch_evidence)
