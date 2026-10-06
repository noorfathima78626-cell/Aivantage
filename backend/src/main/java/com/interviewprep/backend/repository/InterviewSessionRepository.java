package com.interviewprep.backend.repository;

import com.interviewprep.backend.model.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserIdOrderByStartedAtDesc(Long userId);
    List<InterviewSession> findByUserIdAndSubjectAndInterviewTypeOrderByRoundNumberDesc(Long userId, String subject, String interviewType);
    Optional<InterviewSession> findFirstByUserIdAndSubjectAndInterviewTypeAndRoundNumberAndStatus(Long userId, String subject, String interviewType, Integer roundNumber, String status);
}
