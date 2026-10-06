-- AI Interview Prep Platform — MySQL schema
-- Owned by: Member A writes users/resumes/sessions/questions/reports (via Java)
--           Member B writes session_metrics (via Python, high-frequency signal writes)
-- Both members read across tables freely; write ownership above avoids collisions.

CREATE DATABASE IF NOT EXISTS interview_platform;
USE interview_platform;

-- ========== OWNED BY MEMBER A (Java backend) ==========

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    profile_type VARCHAR(40) DEFAULT 'Student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Short-lived codes for phone verification during registration. A code is
-- "spent" (consumed=TRUE) once used - registration checks for a consumed,
-- recent code for that phone before allowing the account to be created.
CREATE TABLE otp_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    purpose VARCHAR(20) NOT NULL DEFAULT 'REGISTRATION',
    expires_at TIMESTAMP NOT NULL,
    consumed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_codes_phone ON otp_codes(phone);

-- Separate account type from `users` - the project owner/admin logs in
-- here, not through the regular user auth, and gets a JWT with role=OWNER.
CREATE TABLE owners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255),
    parsed_skills TEXT,            -- comma separated, filled by AI engine parse step
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(80) NOT NULL,          -- e.g. 'DBMS', 'DSA', 'HR', 'OOP'
    difficulty VARCHAR(20) NOT NULL,       -- 'EASY', 'MEDIUM', 'HARD'
    question_text TEXT NOT NULL,
    ideal_answer_keywords TEXT,            -- comma separated keywords used for scoring
    question_type VARCHAR(20) DEFAULT 'verbal',
    options_json TEXT NULL,
    answer_index INT NULL,
    language VARCHAR(30) NULL,
    starter_code TEXT NULL,
    solution_code TEXT NULL,
    tests_json TEXT NULL
);

CREATE TABLE interview_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject VARCHAR(80) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    interview_type VARCHAR(30) NOT NULL DEFAULT 'One-on-One',
    round_number INT NOT NULL DEFAULT 1,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',   -- IN_PROGRESS, COMPLETED, ABANDONED
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    overall_score DECIMAL(5,2) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE session_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    question_order INT NOT NULL,
    user_answer_text TEXT,
    answer_score DECIMAL(5,2),
    answer_feedback TEXT,               -- "what you missed / how to improve" for this answer
    asked_at TIMESTAMP NULL,
    answered_at TIMESTAMP NULL,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE session_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL UNIQUE,
    avg_eye_contact DECIMAL(5,2),
    avg_hand_movement DECIMAL(5,2),
    avg_nervousness DECIMAL(5,2),
    avg_speaking_pace_wpm DECIMAL(6,2),
    pace_flag VARCHAR(20),              -- 'TOO_FAST', 'TOO_SLOW', 'GOOD'
    whisper_flag_count INT DEFAULT 0,
    dominant_expression VARCHAR(40),
    summary TEXT,                       -- overall narrative feedback
    strengths TEXT,
    areas_to_improve TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- ========== OWNED BY MEMBER B (Python AI/signal engine) ==========

-- One row per periodic sample (~every 1-2s) while a session is live.
CREATE TABLE session_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eye_contact_score DECIMAL(5,2),     -- 0-100, higher = more looking at camera
    hand_movement_score DECIMAL(5,2),   -- 0-100, higher = more fidgeting/movement
    nervousness_score DECIMAL(5,2),     -- 0-100 composite score
    dominant_expression VARCHAR(40),    -- 'neutral','happy','confused','nervous', etc.
    speaking_pace_wpm DECIMAL(6,2),     -- words per minute at this sample window
    whisper_detected BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_session_metrics_session ON session_metrics(session_id);
CREATE INDEX idx_session_questions_session ON session_questions(session_id);
