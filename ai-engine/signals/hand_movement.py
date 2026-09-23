"""
Hand movement heuristic (MVP): each /signals/analyze-frame call is one
still frame, so "movement" is measured by comparing this frame's hand
position to the last frame we saw for the same session. An in-memory
dict is fine for a single-process demo; move to Redis if you ever run
multiple AI-engine workers.
"""

_last_hand_position = {}  # session_id -> (x, y) centroid of last seen hand


def _clamp(v, lo=0.0, hi=100.0):
    return max(lo, min(hi, v))


def score_hand_movement(session_id: int, multi_hand_landmarks) -> float:
    """
    multi_hand_landmarks: results.multi_hand_landmarks from MediaPipe Hands
    (a list of hands, each with 21 landmarks), or None/[] if no hand visible.
    Returns a 0-100 score, higher = more movement/fidgeting since last frame.
    """
    if not multi_hand_landmarks:
        return 0.0

    # Use the first detected hand's centroid (wrist landmark, index 0)
    wrist = multi_hand_landmarks[0].landmark[0]
    current = (wrist.x, wrist.y)

    previous = _last_hand_position.get(session_id)
    _last_hand_position[session_id] = current

    if previous is None:
        return 0.0

    dx = current[0] - previous[0]
    dy = current[1] - previous[1]
    displacement = (dx ** 2 + dy ** 2) ** 0.5

    # Displacement is in normalized [0,1] frame coordinates. A displacement
    # of ~0.15 between consecutive samples (~1.5s apart) is a clearly
    # noticeable movement; scale to a 0-100 score.
    score = (displacement / 0.15) * 100
    return round(_clamp(score), 1)


def reset_session(session_id: int):
    _last_hand_position.pop(session_id, None)
