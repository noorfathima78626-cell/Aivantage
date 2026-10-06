package com.interviewprep.backend.dto;

import java.time.LocalDate;

public class AuthDtos {

    public record RegisterRequest(
            String name,
            LocalDate dob,
            String email,
            String phone,
            String password,
            String profileType
    ) {}

    public record LoginRequest(
            String email,
            String password
    ) {}

    public record UserSummary(
            Long id,
            String name,
            String email
    ) {}

    public record AuthResponse(
            String token,
            UserSummary user
    ) {}

    public record SendOtpRequest(
            String phone
    ) {}

    public record VerifyOtpRequest(
            String phone,
            String code
    ) {}

    public record OtpActionResponse(
            boolean success,
            String message
    ) {}

    // Forgot-password request
    public record ForgotPasswordRequest(
            String phone
    ) {}

    // Reset-password request
    public record ResetPasswordRequest(
            String phone,
            String code,
            String newPassword
    ) {}
}