# AI / Signal Engine — setup

## Run it
```bash
cd ai-engine
python3.11 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Runs at http://localhost:8000. Check http://localhost:8000/docs for
interactive Swagger docs of every endpoint (FastAPI generates this free).

Set DB credentials via environment variables before running (defaults are
in `db.py`):
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=your_mysql_password
export DB_NAME=interview_platform
```

## What's implemented (MVP level - see comments in each file)

- `signals/eye_contact.py` — iris-vs-eye-corner offset heuristic
- `signals/hand_movement.py` — frame-to-frame hand displacement
- `signals/expression.py` — mouth/eyebrow ratio heuristic + nervousness composite
- `signals/pace.py` — words-per-minute from transcript + duration
- `signals/whisper_detection.py` — RMS-energy heuristic for a secondary voice
  during pauses (**assumes 16-bit PCM WAV audio** — see the note in that file
  about MediaRecorder's default WebM/Opus output needing conversion first)
- `qa/question_bank.py` — static question bank (swap for a real LLM call later)
- `qa/answer_evaluator.py` — keyword-overlap scoring

All of these are intentionally simple heuristics, not trained ML models —
that's the right trade-off for a 1.5-month project. Call it out as a known
limitation in your report rather than overclaiming accuracy.

## Stretch goals if you have time left

- Swap `answer_evaluator.py` for embedding-similarity scoring (sentence-transformers)
- Swap `question_bank.py` for a real LLM call
- Swap `expression.py` for a small pretrained FER (facial expression recognition) model
