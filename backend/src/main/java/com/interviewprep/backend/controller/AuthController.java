package com.interviewprep.backend.controller;

import com.interviewprep.backend.dto.AuthDtos.*;
import com.interviewprep.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/password/forgot")
    public OtpActionResponse forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.requestPasswordReset(request);
        return new OtpActionResponse(true,
                "If an account exists for that email, a password-reset OTP has been sent to the registered phone.");
    }

    @PostMapping("/password/reset")
    public OtpActionResponse resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return new OtpActionResponse(true, "Password reset successfully");
    }
}
