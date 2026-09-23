package com.interviewprep.backend.service;

import org.springframework.stereotype.Component;

import java.util.logging.Logger;

/**
 * Stand-in for a real SMS gateway (Twilio, Fast2SMS, MSG91, etc.) - prints
 * the OTP to the backend console instead of sending a real text. Good
 * enough to demo the whole flow without paying for/setting up an SMS
 * account. When you're ready for real texts: implement OtpSender against
 * your provider's API, annotate it @Primary (or remove @Component here),
 * and nothing else in the OTP flow needs to change.
 */
@Component
public class ConsoleOtpSender implements OtpSender {

    private static final Logger log = Logger.getLogger(ConsoleOtpSender.class.getName());

    @Override
    public void send(String phone, String code) {
        log.info("=== OTP for " + phone + ": " + code + " (valid 5 minutes) ===");
    }
}
