-- Only needed if your Spring Boot ddl-auto is NOT "update" (e.g. "validate" or "none").
-- If it IS "update", Hibernate will add these columns automatically on next backend
-- restart and you can ignore/skip this file.
--
-- All columns are nullable - existing One-on-One rows are unaffected.

ALTER TABLE questions
    ADD COLUMN question_type   VARCHAR(20)  NULL,
    ADD COLUMN options_json    TEXT         NULL,
    ADD COLUMN answer_index    INT          NULL,
    ADD COLUMN starter_code    TEXT         NULL,
    ADD COLUMN language        VARCHAR(30)  NULL,
    ADD COLUMN function_name   VARCHAR(100) NULL,
    ADD COLUMN tests_json      TEXT         NULL;
