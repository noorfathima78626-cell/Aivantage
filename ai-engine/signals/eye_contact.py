"""
Eye contact heuristic (MVP): uses the iris landmarks from MediaPipe Face
Mesh (requires refine_landmarks=True, which exposes 10 extra iris points)
to estimate how centered the gaze is relative to each eye's corners.
Iris centered between the corners -> looking near the camera -> high score.
This is a heuristic, not a calibrated gaze-tracking model - good enough to
flag "clearly looking away" vs "roughly at the screen" for a practice tool.
"""

LEFT_EYE_CORNERS = (33, 133)     # outer, inner
RIGHT_EYE_CORNERS = (362, 263)   # inner, outer
LEFT_IRIS_CENTER = 468
RIGHT_IRIS_CENTER = 473


def _clamp(v, lo=0.0, hi=100.0):
    return max(lo, min(hi, v))


def score_eye_contact(face_landmarks) -> float:
    """
    face_landmarks: the `landmark` list from a single
    mediapipe FaceMesh result (results.multi_face_landmarks[0].landmark).
    Returns a 0-100 score, higher = more centered / camera-facing.
    """
    try:
        lm = face_landmarks

        def offset_ratio(outer_idx, inner_idx, iris_idx):
            outer = lm[outer_idx]
            inner = lm[inner_idx]
            iris = lm[iris_idx]
            eye_width = abs(inner.x - outer.x) or 1e-6
            eye_center_x = (inner.x + outer.x) / 2
            # how far the iris center sits from the eye's midpoint,
            # normalized by eye width (0 = perfectly centered)
            return abs(iris.x - eye_center_x) / eye_width

        left_offset = offset_ratio(*LEFT_EYE_CORNERS, LEFT_IRIS_CENTER)
        right_offset = offset_ratio(*RIGHT_EYE_CORNERS, RIGHT_IRIS_CENTER)
        avg_offset = (left_offset + right_offset) / 2

        # avg_offset near 0 -> looking center; > ~0.35 -> looking well off to a side
        score = 100 - (avg_offset / 0.35) * 100
        return round(_clamp(score), 1)
    except (IndexError, AttributeError):
        return 0.0
