"""Optional generative question provider with a safe local fallback.

The app can generate fresh questions with a local Ollama model or an
OpenAI-compatible API when configured. If neither is available, the existing
curated question bank is used so the assessment still works offline.
"""
import json
import os
import random
import urllib.request
import urllib.error

from .question_bank import generate_questions as bank_generate_questions
from .aptitude_question_bank import generate_aptitude_questions


def _extract_json(text: str):
    text = (text or "").strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text
        if text.endswith("```"):
            text = text[:-3]
    start = text.find("[")
    end = text.rfind("]")
    if start >= 0 and end > start:
        return json.loads(text[start:end + 1])
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end > start:
        return json.loads(text[start:end + 1])
    raise ValueError("Model did not return JSON")


def _clean_questions(items, mode="aptitude"):
    cleaned = []
    for index, item in enumerate(items or []):
        if not isinstance(item, dict) or not str(item.get("text", "")).strip():
            continue
        qtype = str(item.get("type", "mcq")).lower()
        if qtype == "code":
            tests = item.get("tests") or []
            cleaned.append({
                "id": f"ai-code-{index + 1}",
                "type": "code",
                "text": str(item["text"]).strip(),
                "language": str(item.get("language", "python")).lower(),
                "starterCode": str(item.get("starterCode", "")),
                "functionName": item.get("functionName"),
                "tests": tests if isinstance(tests, list) else [],
            })
        else:
            options = item.get("options")
            answer_index = item.get("answerIndex")
            if not isinstance(options, list) or len(options) < 2:
                continue
            try:
                answer_index = int(answer_index)
            except (TypeError, ValueError):
                continue
            if not 0 <= answer_index < len(options):
                continue
            cleaned.append({
                "id": f"ai-mcq-{index + 1}",
                "type": "mcq",
                "text": str(item["text"]).strip(),
                "options": [str(x) for x in options],
                "answerIndex": answer_index,
            })
    if mode == "aptitude":
        random.shuffle(cleaned)
    return cleaned


def _prompt(subject, difficulty, round_number, count, mode, exclude):
    exclude_text = "\n".join(f"- {x}" for x in exclude[:20]) or "(none)"
    if mode == "aptitude":
        return f"""You are an expert technical assessment question writer.
Generate {count} NEW aptitude questions for the subject: {subject}.
Difficulty: {difficulty}. Round: {round_number}.
Do not repeat any excluded questions below.
Mix MCQ and coding questions: normally 3-5 MCQs and 1-2 coding questions.
For MCQs provide exactly one correct answer using zero-based answerIndex.
For coding questions provide a starterCode, language, functionName and at least 2 small deterministic tests with input and expected.
Keep questions suitable for a browser coding assessment and make them objectively gradable.
Return ONLY valid JSON array. No markdown.
Excluded questions:
{exclude_text}

JSON shape:
[{{"type":"mcq","text":"...","options":["..."],"answerIndex":0}},
 {{"type":"code","text":"...","language":"python","starterCode":"def solve(x):\\n    pass","functionName":"solve","tests":[{{"input":1,"expected":1}},{{"input":2,"expected":2}}]}}]"""
    return f"""You are an expert interview question writer. Generate {count} fresh questions for {subject}, difficulty {difficulty}, round {round_number}. Avoid the excluded questions. Return ONLY a JSON array. Each item must contain text and keywords. Make later rounds deeper than earlier rounds.
Excluded questions:\n{exclude_text}"""


def _call_ollama(prompt):
    url = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434/api/generate")
    model = os.getenv("OLLAMA_MODEL", "llama3.2")
    payload = json.dumps({"model": model, "prompt": prompt, "stream": False}).encode()
    request = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(request, timeout=45) as response:
        data = json.loads(response.read().decode())
    return data.get("response", "")


def _call_openai_compatible(prompt):
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        return ""
    base = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    model = os.getenv("OPENAI_MODEL", "gpt-5-mini")
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": "Return only valid JSON. Do not use markdown."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.9,
    }).encode()
    request = urllib.request.Request(
        base.rstrip("/") + "/chat/completions",
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        data = json.loads(response.read().decode())
    return data["choices"][0]["message"]["content"]


def generate_ai_questions(subject, difficulty, round_number=1, count=6, mode="aptitude", exclude=None):
    exclude = exclude or []
    prompt = _prompt(subject, difficulty, round_number, count, mode, exclude)

    for provider in (_call_ollama, _call_openai_compatible):
        try:
            raw = provider(prompt)
            if not raw:
                continue
            result = _clean_questions(_extract_json(raw), mode)
            if result:
                return result, "ai"
        except Exception:
            continue

    # Safe offline fallback: use the curated bank, but rotate/shuffle it so
    # repeated rounds do not keep returning the same ordering. Also respects
    # the exclude list now, so offline mode avoids repeats too - previously
    # this parameter was accepted but silently ignored here.
    if mode == "aptitude":
        fallback = generate_aptitude_questions(subject, exclude=exclude, count=count)
    else:
        fallback = [q for q in bank_generate_questions(subject, difficulty, None) if q["text"] not in exclude]
        random.shuffle(fallback)
    return fallback[:count], "bank-fallback"
