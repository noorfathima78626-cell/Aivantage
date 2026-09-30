USE interview_platform;

-- Run this once against an existing database. It keeps the old difficulty
-- column for compatibility, while the application now exposes Round 1/2/3.
ALTER TABLE interview_sessions
    ADD COLUMN round_number INT NOT NULL DEFAULT 1 AFTER difficulty,
    ADD COLUMN interview_type VARCHAR(30) NOT NULL DEFAULT 'One-on-One' AFTER round_number;

CREATE TABLE IF NOT EXISTS interview_round_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject VARCHAR(80) NOT NULL,
    interview_type VARCHAR(30) NOT NULL,
    round_number INT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    CONSTRAINT uk_round_progress_user_subject_type_round
        UNIQUE (user_id, subject, interview_type, round_number),
    CONSTRAINT fk_round_progress_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_round_progress_user_subject_type
    ON interview_round_progress(user_id, subject, interview_type);

-- otp_codes already supports a purpose column. PASSWORD_RESET is therefore
-- stored alongside REGISTRATION without requiring a second OTP table.
