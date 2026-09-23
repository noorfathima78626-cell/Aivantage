# API Contract

This is the interface both members code against so you can build in parallel
without waiting on each other. Once you agree on this, mock it and go.

## Ports (local dev)
- React: 5173
- Java backend: 8080
- Python AI engine: 8000
- MySQL: 3306

## 1. React → Java (Member A owns both sides)

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | /api/auth/otp/send | {phone} | {success, message} |
| POST | /api/auth/otp/verify | {phone, code} | {success, message} |
| POST | /api/auth/register | {name, dob, email, phone, password} | {token, user} |
| POST | /api/auth/login | {email, password} | {token, user} |
| POST | /api/resume/upload | multipart file | {resumeId, parsedSkills[]} |
| POST | /api/sessions | {subject, difficulty} | {sessionId, questions:[{id,text,order}]} |
| POST | /api/sessions/{id}/answer | {questionId, answerText} | {ack:true} |
| POST | /api/sessions/{id}/complete | {} | {sessionId, status} |
| GET | /api/sessions/{id}/report | - | full session_reports row + session_metrics summary |

All routes except /api/auth/** and /api/owner/auth/** require header
`Authorization: Bearer <jwt>`.

Registration requires a verified phone first: call `/otp/send`, then
`/otp/verify` with the code, *then* `/register` — the backend checks for a
recent successful verification for that phone and rejects registration
otherwise. `dob` is an ISO date string (`YYYY-MM-DD`).

### Owner / admin (separate account type from regular users)

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | /api/owner/auth/register | {name, email, password} | {token, owner} |
| POST | /api/owner/auth/login | {email, password} | {token, owner} |
| GET | /api/admin/users | - | {users:[{id,name,email,createdAt,resumeCount,sessionCount}], totalCount} |

Owner tokens carry `role: OWNER` in the JWT; regular user tokens carry
`role: USER`. `/api/admin/**` is rejected (403) for any token that isn't
role=OWNER - see `SecurityConfig.java`.

## 2. React → Python AI engine directly (Member B owns both sides)

Called straight from the browser during a live session — going through Java
would add a hop for no benefit, since these are stateless per-sample calls.

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | /signals/analyze-frame | {sessionId, imageBase64} | {eyeContactScore, handMovementScore, nervousnessScore, dominantExpression} |
| POST | /signals/analyze-audio | {sessionId, audioBase64, transcriptChunk, chunkDurationSec} | {speakingPaceWpm, paceFlag, whisperDetected} |
| POST | /qa/generate-questions | {subject, difficulty, resumeSkills[]} | {questions:[{text, keywords[]}]} |
| POST | /qa/evaluate-answer | {questionText, answerText, idealKeywords[]} | {score, feedback} |
| GET | /qa/session-summary/{sessionId} | - | aggregated metrics + narrative feedback |

The frame/audio endpoints write straight into `session_metrics` (Python owns
that table). Java's `/report` endpoint reads that table read-only to build
the final report — no HTTP call needed between the two backends for that.

## 3. Java → Python (only for question generation / answer scoring)

Java calls these when creating a session or when persisting an answer, so
questions and scores are still in one place (`session_questions` / `questions`)
even though the intelligence lives in Python.

- POST http://localhost:8000/qa/generate-questions
- POST http://localhost:8000/qa/evaluate-answer

If the AI engine is down, Java should fall back to a static question bank
seeded in `questions` (this fallback matters for demo day — don't depend on
both services being perfectly up simultaneously in front of evaluators).

## Frame/audio sampling rate

Don't stream every frame — capture a snapshot every ~1.5s and an audio chunk
every ~5s. That's enough signal for eye contact / hand movement / pace /
whisper detection, and keeps both the browser and the Python service cheap
to build in the time you have.
