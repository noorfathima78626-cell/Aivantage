package com.interviewprep.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "interview_sessions")
public class InterviewSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(nullable = false, length = 80) private String subject;
    @Column(nullable = false, length = 20) private String difficulty;
    @Column(name = "interview_type", nullable = false, length = 30) private String interviewType = "One-on-One";
    @Column(name = "round_number", nullable = false) private Integer roundNumber = 1;
    @Column(length = 20) private String status = "IN_PROGRESS";
    @Column(name = "started_at", insertable = false, updatable = false) private LocalDateTime startedAt;
    @Column(name = "ended_at") private LocalDateTime endedAt;
    @Column(name = "overall_score", columnDefinition = "DECIMAL(5,2)") private Double overallScore;
}
