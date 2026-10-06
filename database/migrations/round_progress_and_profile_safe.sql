-- Aivantage safe database migration
-- Run this whole file in MySQL Workbench.
-- It is safe to run after the earlier migrations because existing columns
-- are NOT added again.

CREATE DATABASE IF NOT EXISTS interview_platform;
USE interview_platform;

-- ------------------------------------------------------------
-- 1. Registration profile type
-- ------------------------------------------------------------
-- Your schema already contains this column in some versions of the project.
-- IF NOT EXISTS prevents the duplicate-column error.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS profile_type VARCHAR(40) NOT NULL DEFAULT 'Student';

-- ------------------------------------------------------------
-- 2. Interview round metadata
-- ------------------------------------------------------------
ALTER TABLE interview_sessions
    ADD COLUMN IF NOT EXISTS interview_type VARCHAR(30) NOT NULL DEFAULT 'One-on-One';

ALTER TABLE interview_sessions
    ADD COLUMN IF NOT EXISTS round_number INT NOT NULL DEFAULT 1;

-- ------------------------------------------------------------
-- 3. AI-generated question metadata
-- ------------------------------------------------------------
ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS question_type VARCHAR(20) NOT NULL DEFAULT 'verbal';

ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS options_json TEXT NULL;

ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS answer_index INT NULL;

ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS language VARCHAR(30) NULL;

ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS starter_code TEXT NULL;

ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS function_name VARCHAR(120) NULL;

ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS tests_json TEXT NULL;

-- ------------------------------------------------------------
-- 4. Round 1 / Round 2 / Round 3 progress
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_round_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject VARCHAR(80) NOT NULL,
    interview_type VARCHAR(30) NOT NULL,
    round_number INT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    UNIQUE KEY uq_round_progress (user_id, subject, interview_type, round_number),
    CONSTRAINT fk_round_progress_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 5. Useful indexes
-- ------------------------------------------------------------
-- These are intentionally omitted if already present, so rerunning this
-- migration cannot stop on a duplicate-index error.
