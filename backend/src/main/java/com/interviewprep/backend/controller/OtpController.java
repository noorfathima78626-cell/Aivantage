package com.interviewprep.backend.controller;

import com.interviewprep.backend.dto.AuthDtos.*;
import com.interviewprep.backend.service.OtpService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/otp")
public class OtpController {

    private static final String OTP_PURPOSE = "REGISTRATION";

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/send")
    public OtpActionResponse send(@RequestBody SendOtpRequest request) {
        otpService.sendOtp(request.phone(), OTP_PURPOSE);
        return new OtpActionResponse(true, "OTP sent");
    }

    @PostMapping("/verify")
    public OtpActionResponse verify(@RequestBody VerifyOtpRequest request) {
        boolean ok = otpService.verifyOtp(request.phone(), OTP_PURPOSE, request.code());
        return ok
                ? new OtpActionResponse(true, "Phone verified")
                : new OtpActionResponse(false, "Invalid or expired code");
    }
}
