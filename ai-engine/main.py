import base64
import logging
from typing import Optional

import cv2
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mediapipe as mp

from signals.eye_contact import score_eye_contact
from signals.hand_movement import score_hand_movement
from signals.expression import classify_expression, nervousness_score
from signals.pace import compute_pace_wpm, classify_pace
from signals.whisper_detection import detect_whisper
from qa.question_bank import generate_questions as bank_generate_questions
from qa.answer_evaluator import evaluate_answer as score_answer
from qa.code_evaluator import evaluate_code as run_code_evaluator
import db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-engine")

app = FastAPI(title="Interview Platform AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+):\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiated once - MediaPipe model init is expensive per call.
# NOTE: not thread-safe under heavy concurrent load; fine for a class demo
# with a single uvicorn worker. Move to per-request instances (or a small
# worker pool) if you need real concurrency later.
face_mesh = mp.solutions.face_mesh.FaceMesh(
    static_image_mode=True, max_num_faces=3, refine_landmarks=True,
    min_detection_confidence=0.5,
)
hands = mp.solutions.hands.Hands(
    static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5,
)


# ---------- request/response models ----------

class AnalyzeFrameRequest(BaseModel):
    sessionId: int
    imageBase64: str


class AnalyzeAudioRequest(BaseModel):
    sessionId: int
    audioBase64: str
    transcriptChunk: str = ""
    chunkDurationSec: float = 0.0


class GenerateQuestionsRequest(BaseModel):
    subject: str
    difficulty: str
    resumeSkills: Optional[list[str]] = None


class EvaluateAnswerRequest(BaseModel):
    questionText: str
    answerText: str
    idealKeywords: Optional[list[str]] = None


class EvaluateCodeRequest(BaseModel):
    language: str = "python"
    code: str
    functionName: str
    tests: list[dict] = []


# ---------- helpers ----------

def _decode_base64_image(image_base64: str) -> np.ndarray:
    if "," in image_base64[:50]:  # strip a data: URL prefix if present
        image_base64 = image_base64.split(",", 1)[1]
    raw = base64.b64decode(image_base64)
    arr = np.frombuffer(raw, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def _decode_base64_audio(audio_base64: str) -> bytes:
    if "," in audio_base64[:50]:
        audio_base64 = audio_base64.split(",", 1)[1]
    return base64.b64decode(audio_base64)


# ---------- signals ----------

@app.post("/signals/analyze-frame")
def analyze_frame(req: AnalyzeFrameRequest):
    image_bgr = _decode_base64_image(req.imageBase64)
    if image_bgr is None:
        return {"eyeContactScore": 0, "handMovementScore": 0, "nervousnessScore": 0, "dominantExpression": "unknown", "faceCount": 0}

    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    face_result = face_mesh.process(image_rgb)
    hand_result = hands.process(image_rgb)

    eye_contact = 0.0
    expression = "unknown"
    face_count = len(face_result.multi_face_landmarks or [])
    if face_result.multi_face_landmarks:
        landmarks = face_result.multi_face_landmarks[0].landmark
        eye_contact = score_eye_contact(landmarks)
        expression = classify_expression(landmarks)

    hand_movement = score_hand_movement(req.sessionId, hand_result.multi_hand_landmarks)
    nervousness = nervousness_score(expression, hand_movement, eye_contact)

    try:
        db.insert_session_metric(
            session_id=req.sessionId, eye_contact_score=eye_contact,
            hand_movement_score=hand_movement, nervousness_score=nervousness,
            dominant_expression=expression,
        )
    except Exception:
        logger.exception("Failed to write session_metrics row (frame)")

    return {
        "eyeContactScore": eye_contact,
        "handMovementScore": hand_movement,
        "nervousnessScore": nervousness,
        "dominantExpression": expression,
        "faceCount": face_count,
    }


@app.post("/signals/analyze-audio")
def analyze_audio(req: AnalyzeAudioRequest):
    wpm = compute_pace_wpm(req.transcriptChunk, req.chunkDurationSec)
    pace_flag = classify_pace(wpm)

    whisper_flag = False
    try:
        audio_bytes = _decode_base64_audio(req.audioBase64)
        whisper_flag = detect_whisper(audio_bytes)
    except Exception:
        logger.exception("Failed to decode/analyze audio chunk")

    try:
        db.insert_session_metric(
            session_id=req.sessionId, speaking_pace_wpm=wpm, whisper_detected=whisper_flag,
        )
    except Exception:
        logger.exception("Failed to write session_metrics row (audio)")

    return {"speakingPaceWpm": wpm, "paceFlag": pace_flag, "whisperDetected": whisper_flag}


# ---------- question generation & scoring ----------

@app.post("/qa/generate-questions")
def generate_questions(req: GenerateQuestionsRequest):
    questions = bank_generate_questions(req.subject, req.difficulty, req.resumeSkills)
    return {"questions": questions}


@app.post("/qa/evaluate-answer")
def evaluate_answer(req: EvaluateAnswerRequest):
    return score_answer(req.questionText, req.answerText, req.idealKeywords)


@app.post("/qa/evaluate-code")
def evaluate_code(req: EvaluateCodeRequest):
    return run_code_evaluator(req.language, req.code, req.functionName, req.tests)


@app.get("/health")
def health():
    return {"status": "ok"}
