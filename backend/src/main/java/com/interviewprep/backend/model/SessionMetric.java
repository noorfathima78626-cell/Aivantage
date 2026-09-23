package com.interviewprep.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Written by the Python AI engine (~every 1-2s during a live session).
 * Java only ever reads this table, to build the final report - never writes it.
 */
@Data
@Entity
@Table(name = "session_metrics")
public class SessionMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Column(name = "captured_at", insertable = false, updatable = false)
    private LocalDateTime capturedAt;

    @Column(name = "eye_contact_score", columnDefinition = "DECIMAL(5,2)")
    private Double eyeContactScore;

    @Column(name = "hand_movement_score", columnDefinition = "DECIMAL(5,2)")
    private Double handMovementScore;

    @Column(name = "nervousness_score", columnDefinition = "DECIMAL(5,2)")
    private Double nervousnessScore;

    @Column(name = "dominant_expression", length = 40)
    private String dominantExpression;

    @Column(name = "speaking_pace_wpm", columnDefinition = "DECIMAL(6,2)")
    private Double speakingPaceWpm;

    @Column(name = "whisper_detected")
    private Boolean whisperDetected;
}
