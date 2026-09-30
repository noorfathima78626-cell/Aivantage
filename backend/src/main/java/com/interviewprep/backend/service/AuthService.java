package com.interviewprep.backend.service;

import com.interviewprep.backend.config.JwtUtil;
import com.interviewprep.backend.dto.AuthDtos.*;
import com.interviewprep.backend.model.User;
import com.interviewprep.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final String REGISTRATION_OTP_PURPOSE = "REGISTRATION";
    private static final String PASSWORD_RESET_OTP_PURPOSE = "PASSWORD_RESET";
    private static final Pattern SPECIAL_CHAR = Pattern.compile("[!@#$%^&*(),.?\":{}|<>_\\-+=~`\\[\\]/;']");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, OtpService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) throw new IllegalArgumentException("Email already registered");
        if (userRepository.existsByPhone(req.phone())) throw new IllegalArgumentException("Phone number already registered");
        if (!otpService.hasRecentVerification(req.phone(), REGISTRATION_OTP_PURPOSE)) {
            throw new IllegalArgumentException("Phone number is not verified - request and verify an OTP first");
        }
        validatePasswordStrength(req.password());

        User user = new User();
        user.setName(req.name());
        user.setDob(req.dob());
        user.setEmail(req.email());
        user.setPhone(req.phone());
        user.setPhoneVerified(true);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), "USER");
        return new AuthResponse(token, new UserSummary(user.getId(), user.getName(), user.getEmail()));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), "USER");
        return new AuthResponse(token, new UserSummary(user.getId(), user.getName(), user.getEmail()));
    }

    public void requestPasswordReset(ForgotPasswordRequest req) {
        if (req == null || req.email() == null || req.email().isBlank()) return;
        userRepository.findByEmail(req.email().trim()).ifPresent(user ->
                otpService.sendOtp(user.getPhone(), PASSWORD_RESET_OTP_PURPOSE));
    }

    public void resetPassword(ResetPasswordRequest req) {
        if (req == null || req.email() == null || req.email().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        User user = userRepository.findByEmail(req.email().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset request"));

        if (req.otp() == null || !otpService.verifyOtp(user.getPhone(), PASSWORD_RESET_OTP_PURPOSE, req.otp())) {
            throw new IllegalArgumentException("Invalid or expired reset OTP");
        }

        validatePasswordStrength(req.newPassword());
        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
    }

    // Mirrors the frontend's registration/reset rules.
    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
        if (password.equals(password.toLowerCase()) || password.equals(password.toUpperCase())) {
            throw new IllegalArgumentException("Password must include both uppercase and lowercase letters");
        }
        if (!password.chars().anyMatch(Character::isDigit)) {
            throw new IllegalArgumentException("Password must include at least one number");
        }
        if (!SPECIAL_CHAR.matcher(password).find()) {
            throw new IllegalArgumentException("Password must include at least one special character");
        }
    }
}
