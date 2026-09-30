"""Deterministic answer evaluation with useful matched/missed feedback."""

import re


def _normalise(text: str) -> str:
    return re.sub(r"[^a-z0-9+#. ]+", " ", (text or "").lower())


def evaluate_answer(question_text: str, answer_text: str, ideal_keywords: list[str]) -> dict:
    answer = _normalise(answer_text)
    keywords = [k.strip() for k in (ideal_keywords or []) if k and k.strip()]
    if not answer.strip():
        return {
            "score": 0.0,
            "feedback": "No answer was captured. Speak clearly and give a structured answer.",
            "matchedKeywords": [],
            "missedKeywords": keywords,
            "suggestion": "Use a simple structure: definition → explanation → example → conclusion.",
        }
    if not keywords:
        return {
            "score": 60.0,
            "feedback": "An answer was captured, but this question has no configured scoring keywords.",
            "matchedKeywords": [], "missedKeywords": [],
            "suggestion": "Add a concrete example and explain why your approach works.",
        }

    matched = [k for k in keywords if _normalise(k) in answer]
    missed = [k for k in keywords if _normalise(k) not in answer]
    coverage = len(matched) / len(keywords)
    length_bonus = 5 if len(answer.split()) >= 35 else 0
    score = round(min(100.0, coverage * 90 + length_bonus), 1)

    if score >= 80:
        feedback = "Strong answer. You covered most of the expected concepts clearly."
        suggestion = "Add a short real-world example to make the answer even stronger."
    elif score >= 50:
        feedback = "Good foundation, but some important interview points were missing: " + ", ".join(missed) + "."
        suggestion = "Revisit the missed concepts and explain how they affect a practical implementation."
    else:
        feedback = "The answer missed several expected concepts: " + ", ".join(missed) + "."
        suggestion = "Start with the core definition, then explain the main mechanism and give one example."

    return {
        "score": score,
        "feedback": feedback,
        "matchedKeywords": matched,
        "missedKeywords": missed,
        "suggestion": suggestion,
    }
