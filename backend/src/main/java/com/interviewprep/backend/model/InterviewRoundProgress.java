package com.interviewprep.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(
        name = "interview_round_progress",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_round_progress_user_subject_type_round",
                columnNames = {"user_id", "subject", "interview_type", "round_number"}
        )
)
public class InterviewRoundProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 80)
    private String subject;

    @Column(name = "interview_type", nullable = false, length = 30)
    private String interviewType;

    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
