package com.interviewprep.backend.service;

import com.interviewprep.backend.model.OtpCode;
import com.interviewprep.backend.repository.OtpCodeRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private static final int EXPIRY_MINUTES = 5;
    // How long after verifying does register() still accept it as "recently verified".
    private static final int REGISTRATION_WINDOW_MINUTES = 15;

    private final OtpCodeRepository otpCodeRepository;
    private final OtpSender otpSender;
    private final SecureRandom random = new SecureRandom();

    public OtpService(OtpCodeRepository otpCodeRepository, OtpSender otpSender) {
        this.otpCodeRepository = otpCodeRepository;
        this.otpSender = otpSender;
    }

    public void sendOtp(String phone, String purpose) {
        String code = String.format("%06d", random.nextInt(1_000_000));

        OtpCode otp = new OtpCode();
        otp.setPhone(phone);
        otp.setCode(code);
        otp.setPurpose(purpose);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES));
        otpCodeRepository.save(otp);

        otpSender.send(phone, code);
    }

    public boolean verifyOtp(String phone, String purpose, String code) {
        OtpCode otp = otpCodeRepository
                .findFirstByPhoneAndPurposeAndConsumedFalseOrderByCreatedAtDesc(phone, purpose)
                .orElse(null);

        if (otp == null) return false;
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) return false;
        if (!otp.getCode().equals(code)) return false;

        otp.setConsumed(true);
        otpCodeRepository.save(otp);
        return true;
    }

    /** Used by AuthService.register() to confirm this phone completed OTP verification recently. */
    public boolean hasRecentVerification(String phone, String purpose) {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(REGISTRATION_WINDOW_MINUTES);
        return !otpCodeRepository
                .findByPhoneAndPurposeAndConsumedTrueAndCreatedAtAfter(phone, purpose, cutoff)
                .isEmpty();
    }
}
