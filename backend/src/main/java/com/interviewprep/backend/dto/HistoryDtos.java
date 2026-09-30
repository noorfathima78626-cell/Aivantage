package com.interviewprep.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class HistoryDtos {
    public record HistoryItem(
            Long sessionId,
            String subject,
            Integer round,
            String interviewType,
            String status,
            Double score,
            LocalDateTime startedAt,
            LocalDateTime endedAt
    ) {}

    public record HistoryResponse(List<HistoryItem> sessions) {}
}
