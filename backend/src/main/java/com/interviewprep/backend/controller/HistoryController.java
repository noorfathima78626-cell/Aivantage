package com.interviewprep.backend.controller;

import com.interviewprep.backend.dto.HistoryDtos.HistoryResponse;
import com.interviewprep.backend.dto.HistoryDtos.HistoryItem;
import com.interviewprep.backend.model.InterviewSession;
import com.interviewprep.backend.repository.InterviewSessionRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {
    private final InterviewSessionRepository sessionRepository;

    public HistoryController(InterviewSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @GetMapping
    public HistoryResponse history(@AuthenticationPrincipal Long userId) {
        List<HistoryItem> items = sessionRepository.findByUserIdOrderByStartedAtDesc(userId)
                .stream()
                .map(this::toItem)
                .toList();
        return new HistoryResponse(items);
    }

    private HistoryItem toItem(InterviewSession s) {
        return new HistoryItem(
                s.getId(), s.getSubject(), s.getRoundNumber(), s.getInterviewType(),
                s.getStatus(), s.getOverallScore(), s.getStartedAt(), s.getEndedAt()
        );
    }
}
