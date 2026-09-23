package com.interviewprep.backend.controller;

import com.interviewprep.backend.dto.SessionDtos.*;
import com.interviewprep.backend.service.SessionService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public CreateSessionResponse create(@AuthenticationPrincipal Long userId,
                                         @RequestBody CreateSessionRequest request) {
        return sessionService.createSession(userId, request);
    }

    @PostMapping("/{id}/answer")
    public Map<String, Boolean> answer(@PathVariable("id") Long sessionId,
                                        @RequestBody AnswerRequest request) {
        sessionService.recordAnswer(sessionId, request);
        return Map.of("ack", true);
    }

    @PostMapping("/{id}/complete")
    public SessionReportResponse complete(@PathVariable("id") Long sessionId) {
        return sessionService.completeSession(sessionId);
    }

    @GetMapping("/{id}/report")
    public SessionReportResponse report(@PathVariable("id") Long sessionId) {
        return sessionService.getReport(sessionId);
    }
}
