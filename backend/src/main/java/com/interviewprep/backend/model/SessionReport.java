package com.interviewprep.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "session_reports")
public class SessionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false, unique = true)
    private Long sessionId;

    @Column(name = "avg_eye_contact", columnDefinition = "DECIMAL(5,2)")
    private Double avgEyeContact;

    @Column(name = "avg_hand_movement", columnDefinition = "DECIMAL(5,2)")
    private Double avgHandMovement;

    @Column(name = "avg_nervousness", columnDefinition = "DECIMAL(5,2)")
    private Double avgNervousness;

    @Column(name = "avg_speaking_pace_wpm", columnDefinition = "DECIMAL(6,2)")
    private Double avgSpeakingPaceWpm;

    @Column(name = "pace_flag", length = 20)
    private String paceFlag;

    @Column(name = "whisper_flag_count")
    private Integer whisperFlagCount;

    @Column(name = "dominant_expression", length = 40)
    private String dominantExpression;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "areas_to_improve", columnDefinition = "TEXT")
    private String areasToImprove;

    @Column(name = "generated_at", insertable = false, updatable = false)
    private LocalDateTime generatedAt;
}
