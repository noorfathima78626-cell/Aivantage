"""
Owns writes to `session_metrics` (see /database/schema.sql and
/API_CONTRACT.md - Java only ever reads this table).
"""
import os
import mysql.connector

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", "3306")),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", "NOOR1332@786"),
    "database": os.environ.get("DB_NAME", "interview_platform"),
}


def get_connection():
    return mysql.connector.connect(**DB_CONFIG)


def insert_session_metric(session_id: int, eye_contact_score: float = None,
                           hand_movement_score: float = None, nervousness_score: float = None,
                           dominant_expression: str = None, speaking_pace_wpm: float = None,
                           whisper_detected: bool = False):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO session_metrics
                (session_id, eye_contact_score, hand_movement_score, nervousness_score,
                 dominant_expression, speaking_pace_wpm, whisper_detected)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (session_id, eye_contact_score, hand_movement_score, nervousness_score,
             dominant_expression, speaking_pace_wpm, whisper_detected),
        )
        conn.commit()
    finally:
        conn.close()
