package com.interviewprep.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AdminDtos {

    public record UserOverview(
            Long id, String name, String email, LocalDateTime createdAt,
            int resumeCount, int sessionCount
    ) {}

    public record UserListResponse(List<UserOverview> users, int totalCount) {}
}
