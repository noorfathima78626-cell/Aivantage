USE interview_platform;

-- Registration profile used to distinguish students, fresh graduates, working
-- professionals and career returners without changing authentication rules.
ALTER TABLE users
    ADD COLUMN profile_type VARCHAR(40) NOT NULL DEFAULT 'Student' AFTER phone_verified;

-- If the column already exists, skip the ALTER above and keep the existing data.
