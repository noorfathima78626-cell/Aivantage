'''AI-first interview question generation.
Uses OpenAI Responses API when OPENAI_API_KEY is configured, with a safe local
fallback so the application can still start during development.
'''
import json
import os
import urllib.request
import urllib.error
from typing import Any

from qa.question_bank import generate_questions as fallback_generate

OPENAI_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1/responses")
OPENAI_KEY = os.getenv("OPENAI_API_KEY", "").strip()
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-6-luna")


def _extract_text(payload: dict[str, Any]) -> str:
    if isinstance(payload.get("output_text"), str):
        return payload["output_text"]
    chunks = []
    for item in payload.get("output", []) or []:
        for content in item.get("content", []) or []:
            if content.get("type") in ("output_text", "text") and content.get("text"):
                chunks.append(content["text"])
    return "\n".join(chunks)


def _clean_json_text(text: str) -> str:
    text = (text or "").strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text
        if text.endswith("```"):
            text = text[:-3]
    start = text.find("[")
    end = text.rfind("]")
    if start >= 0 and end > start:
        return text[start:end + 1]
    return text


def _local_fallback(subject, difficulty, mode, round_number, count):
    base = fallback_generate(subject, difficulty)
    if mode.lower().startswith("aptitude"):
        result=[]
        for i, q in enumerate(base[:count]):
            result.append({
                "text": q["text"], "type": "mcq", "options": [
                    "The first statement is correct", "The second statement is correct",
                    "Both statements are correct", "Neither statement is correct"
                ], "answerIndex": 0, "keywords": q.get("keywords", []),
            })
        return result
    return [{"text": q["text"], "type":"verbal", "keywords":q.get("keywords",[])} for q in base[:count]]


def generate_ai_questions(subject: str, difficulty: str, mode: str, round_number: int,
                          previous_questions: list[str] | None = None,
                          resume_skills: list[str] | None = None, count: int = 8) -> list[dict]:
    previous_questions = previous_questions or []
    resume_skills = resume_skills or []
    mode_label = "Aptitude" if mode.lower().startswith("aptitude") else "One-on-One"

    if not OPENAI_KEY:
        return _local_fallback(subject, difficulty, mode_label, round_number, count)

    if mode_label == "Aptitude":
        schema = '''Each item must be JSON with: text, type, options, answerIndex, language, starterCode, solution, tests, keywords.\nFor MCQ: type="mcq", options exactly 4 strings, answerIndex 0-3.\nFor coding: type="code", language one of Python/Java/JavaScript/SQL, options=[], answerIndex=null, starterCode, solution, tests as an array of {input,output}.\nMake about 70% MCQ and 30% coding.''' 
    else:
        schema = '''Each item must be JSON with: text, type, options, answerIndex, language, starterCode, solution, tests, keywords.\nFor One-on-One all items must have type="verbal", options=[], answerIndex=null. Questions must be suitable for spoken answers, not typing code.'''

    prompt = f'''Generate {count} fresh interview practice questions.
Subject: {subject}
Difficulty: {difficulty}
Interview mode: {mode_label}
Round: {round_number}
Candidate resume skills: {', '.join(resume_skills[:30]) or 'not provided'}
Questions already used in earlier rounds: {json.dumps(previous_questions[-40:])}

Rules:
- Do not repeat or lightly paraphrase any previous question.
- Stay strictly within the selected subject.
- Match the requested difficulty.
- Round {round_number} must test different concepts from earlier rounds where possible.
- Return ONLY a JSON array, no markdown.
- Keep questions clear and interview-ready.
{schema}
'''

    body = {
        "model": OPENAI_MODEL,
        "input": [{"role": "user", "content": prompt}],
        "max_output_tokens": 5000,
    }
    req = urllib.request.Request(
        OPENAI_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            payload = json.loads(response.read().decode("utf-8"))
        parsed = json.loads(_clean_json_text(_extract_text(payload)))
        if not isinstance(parsed, list):
            raise ValueError("AI did not return a JSON array")
        cleaned=[]
        for q in parsed:
            if not isinstance(q, dict) or not str(q.get("text", "")).strip():
                continue
            q.setdefault("type", "verbal" if mode_label == "One-on-One" else "mcq")
            q.setdefault("options", [])
            q.setdefault("answerIndex", None)
            q.setdefault("keywords", [])
            q.setdefault("language", "")
            q.setdefault("starterCode", "")
            q.setdefault("solution", "")
            q.setdefault("tests", [])
            cleaned.append(q)
        if len(cleaned) >= max(3, count // 2):
            return cleaned[:count]
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
        print(f"AI question generation failed, using fallback: {exc}")
    return _local_fallback(subject, difficulty, mode_label, round_number, count)


def evaluate_code_with_ai(question: str, language: str, code: str, expected_solution: str,
                          tests: list[dict] | None = None) -> dict:
    if not OPENAI_KEY:
        return {"correct": bool(code.strip()), "score": 50 if code.strip() else 0,
                "feedback": "Code was submitted. Configure OPENAI_API_KEY for detailed automatic code review.",
                "wrongLine": None, "suggestion": "Run the solution against edge cases and improve complexity.", "expected": expected_solution or ""}
    prompt = f'''Evaluate this interview coding answer.
Question: {question}
Language: {language}
Candidate code:\n{code}
Expected solution/reference:\n{expected_solution}
Tests:\n{json.dumps(tests or [])}
Return ONLY JSON with keys: correct (boolean), score (0-100), wrongLine (integer or null), feedback, suggestion, expected, actualProblem.
Judge correctness, edge cases, and reasonable complexity. Do not require identical code to the reference.'''
    body={"model":OPENAI_MODEL,"input":[{"role":"user","content":prompt}],"max_output_tokens":1800}
    req=urllib.request.Request(OPENAI_URL,data=json.dumps(body).encode(),headers={"Authorization":f"Bearer {OPENAI_KEY}","Content-Type":"application/json"},method="POST")
    try:
        with urllib.request.urlopen(req,timeout=45) as response:
            payload=json.loads(response.read().decode())
        result=json.loads(_clean_json_text(_extract_text(payload)))
        return result
    except Exception as exc:
        return {"correct": bool(code.strip()), "score": 50 if code.strip() else 0,
                "feedback": f"Automatic AI review was unavailable: {exc}", "wrongLine": None,
                "suggestion":"Check the code against the stated requirements and edge cases.", "expected":expected_solution or ""}
