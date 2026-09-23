"""
Keyword-overlap scoring (MVP). Enough to give directional feedback without
needing an LLM call. Upgrade path: embed both the answer and an ideal
answer with a sentence-transformer and score by cosine similarity, or call
an LLM to grade - keep the same {score, feedback} return shape either way.
"""


def evaluate_answer(question_text: str, answer_text: str, ideal_keywords: list[str]) -> dict:
    answer_lower = (answer_text or "").lower()
    ideal_keywords = [k.strip().lower() for k in (ideal_keywords or []) if k.strip()]

    if not ideal_keywords:
        return {"score": 50.0, "feedback": "No scoring keywords configured for this question - reviewed manually."}

    hit = [k for k in ideal_keywords if k in answer_lower]
    missed = [k for k in ideal_keywords if k not in answer_lower]
    score = round((len(hit) / len(ideal_keywords)) * 100, 1)

    if not answer_text or not answer_text.strip():
        feedback = "No answer was captured - make sure to speak clearly into the mic."
    elif score >= 80:
        feedback = "Strong answer - covered the key points clearly."
    elif score >= 50:
        feedback = f"Good start, but missed: {', '.join(missed)}."
    else:
        feedback = f"This answer missed most of the key points, including: {', '.join(missed)}. Revisit this topic."

    return {"score": score, "feedback": feedback}
