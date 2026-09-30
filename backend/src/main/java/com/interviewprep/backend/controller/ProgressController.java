package com.interviewprep.backend.controller;

import com.interviewprep.backend.dto.ProgressDtos.RoundProgressResponse;
import com.interviewprep.backend.service.InterviewRoundProgressService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
public class ProgressController {

    private final InterviewRoundProgressService progressService;

    public ProgressController(InterviewRoundProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/progress")
    public RoundProgressResponse progress(
            @AuthenticationPrincipal Long userId,
            @RequestParam String subject,
            @RequestParam String interviewType) {
        return progressService.getProgress(userId, subject, interviewType);
    }
}
