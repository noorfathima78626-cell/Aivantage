package com.interviewprep.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String subject;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "ideal_answer_keywords", columnDefinition = "TEXT")
    private String idealAnswerKeywords;

    // --- Aptitude-only fields below. All nullable: One-on-One questions
    // never set these, and existing rows in the table are unaffected. ---

    @Column(name = "question_type", length = 20)
    private String type; // null/"text" for One-on-One, "mcq" or "code" for Aptitude

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson; // JSON array of option strings, mcq only

    @Column(name = "answer_index")
    private Integer answerIndex; // correct option index, mcq only

    @Column(name = "starter_code", columnDefinition = "TEXT")
    private String starterCode; // code only

    @Column(name = "language", length = 30)
    private String language; // code only

    @Column(name = "function_name", length = 100)
    private String functionName; // code only

    @Column(name = "tests_json", columnDefinition = "TEXT")
    private String testsJson; // JSON array of {input, expected} test cases, code only
}
