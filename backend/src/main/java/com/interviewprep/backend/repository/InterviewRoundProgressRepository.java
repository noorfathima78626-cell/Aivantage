package com.interviewprep.backend.repository;

import com.interviewprep.backend.model.InterviewRoundProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRoundProgressRepository extends JpaRepository<InterviewRoundProgress, Long> {
    List<InterviewRoundProgress> findByUserIdAndSubjectAndInterviewTypeOrderByRoundNumberAsc(
            Long userId, String subject, String interviewType);

    Optional<InterviewRoundProgress> findByUserIdAndSubjectAndInterviewTypeAndRoundNumber(
            Long userId, String subject, String interviewType, Integer roundNumber);
}
