package com.interviewprep.backend.service;

public interface OtpSender {
    void send(String phone, String code);
}
