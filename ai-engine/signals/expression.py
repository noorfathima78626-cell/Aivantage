"""
Expression + nervousness heuristic (MVP): ratios between a handful of face
landmarks (mouth corners/openness, eyebrow height) rather than a trained
classifier. Good enough to distinguish "relaxed/smiling" from "tense" for
a practice tool - swap in a small pretrained FER model later if you want
more accuracy (see README "Stretch goals").
"""

MOUTH_LEFT, MOUTH_RIGHT = 61, 291
MOUTH_TOP, MOUTH_BOTTOM = 13, 14
LEFT_BROW, LEFT_EYE_TOP = 105, 159
RIGHT_BROW, RIGHT_EYE_TOP = 334, 386


def _dist(a, b):
    return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5


def classify_expression(lm) -> str:
    try:
        mouth_width = _dist(lm[MOUTH_LEFT], lm[MOUTH_RIGHT])
        mouth_open = _dist(lm[MOUTH_TOP], lm[MOUTH_BOTTOM])
        brow_gap = (_dist(lm[LEFT_BROW], lm[LEFT_EYE_TOP]) + _dist(lm[RIGHT_BROW], lm[RIGHT_EYE_TOP])) / 2

        if mouth_open / (mouth_width or 1e-6) > 0.35:
            return "surprised"
        if mouth_width > 0.34:  # wider mouth relative to face -> smiling
            return "smiling"
        if brow_gap < 0.018:  # brows pulled down/close to eyes -> tense
            return "tense"
        return "neutral"
    except (IndexError, AttributeError):
        return "neutral"


def nervousness_score(expression: str, hand_movement_score: float, eye_contact_score: float) -> float:
    """Composite 0-100 score combining behavioral signals already computed."""
    base = 0.0
    if expression == "tense":
        base += 35
    base += min(hand_movement_score, 100) * 0.35
    base += max(0, 100 - eye_contact_score) * 0.30
    return round(min(base, 100), 1)
