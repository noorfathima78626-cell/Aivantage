package com.interviewprep.backend.service;

import com.interviewprep.backend.dto.ProgressDtos.RoundProgressItem;
import com.interviewprep.backend.dto.ProgressDtos.RoundProgressResponse;
import com.interviewprep.backend.model.InterviewRoundProgress;
import com.interviewprep.backend.repository.InterviewRoundProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class InterviewRoundProgressService {

    private static final int MAX_ROUND = 3;

    private final InterviewRoundProgressRepository repository;

    public InterviewRoundProgressService(InterviewRoundProgressRepository repository) {
        this.repository = repository;
    }

    public RoundProgressResponse getProgress(Long userId, String subject, String interviewType) {
        validate(subject, interviewType, 1);
        List<InterviewRoundProgress> existing = repository
                .findByUserIdAndSubjectAndInterviewTypeOrderByRoundNumberAsc(userId, subject, interviewType);

        List<RoundProgressItem> rounds = new ArrayList<>();
        for (int round = 1; round <= MAX_ROUND; round++) {
            // A Java lambda may only capture final/effectively-final local variables.
            // The loop variable changes on every iteration, so copy it first.
            final int currentRound = round;

            InterviewRoundProgress row = existing.stream()
                    .filter(p -> p.getRoundNumber() == currentRound)
                    .findFirst()
                    .orElse(null);
            boolean completed = row != null && Boolean.TRUE.equals(row.getCompleted());
            boolean unlocked = currentRound == 1 || isCompleted(existing, currentRound - 1);
            rounds.add(new RoundProgressItem(currentRound, unlocked, completed));
        }
        return new RoundProgressResponse(subject, interviewType, rounds);
    }

    @Transactional
    public void ensureRoundCanStart(Long userId, String subject, String interviewType, int round) {
        validate(subject, interviewType, round);
        if (round == 1) return;

        InterviewRoundProgress previous = repository
                .findByUserIdAndSubjectAndInterviewTypeAndRoundNumber(userId, subject, interviewType, round - 1)
                .orElse(null);

        if (previous == null || !Boolean.TRUE.equals(previous.getCompleted())) {
            throw new IllegalStateException(
                    "Round " + round + " is locked. Complete Round " + (round - 1) + " for " + subject + " first.");
        }
    }

    @Transactional
    public void markCompleted(Long userId, String subject, String interviewType, int round) {
        validate(subject, interviewType, round);
        InterviewRoundProgress progress = repository
                .findByUserIdAndSubjectAndInterviewTypeAndRoundNumber(userId, subject, interviewType, round)
                .orElseGet(InterviewRoundProgress::new);

        progress.setUserId(userId);
        progress.setSubject(subject);
        progress.setInterviewType(interviewType);
        progress.setRoundNumber(round);
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        repository.save(progress);
    }

    private boolean isCompleted(List<InterviewRoundProgress> rows, int round) {
        return rows.stream()
                .filter(p -> p.getRoundNumber() == round)
                .anyMatch(p -> Boolean.TRUE.equals(p.getCompleted()));
    }

    private void validate(String subject, String interviewType, int round) {
        if (subject == null || subject.isBlank()) throw new IllegalArgumentException("Subject is required");
        if (interviewType == null || interviewType.isBlank()) throw new IllegalArgumentException("Interview type is required");
        if (round < 1 || round > MAX_ROUND) throw new IllegalArgumentException("Round must be 1, 2, or 3");
    }
}
