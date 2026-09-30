package com.interviewprep.backend.dto;

import java.util.List;

public class ProgressDtos {
    public record RoundProgressItem(int round, boolean unlocked, boolean completed) {}

    public record RoundProgressResponse(
            String subject,
            String interviewType,
            List<RoundProgressItem> rounds
    ) {}
}
