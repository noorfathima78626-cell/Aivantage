package com.interviewprep.backend.dto;

public class OwnerDtos {

    public record OwnerRegisterRequest(String name, String email, String password) {}

    public record OwnerLoginRequest(String email, String password) {}

    public record OwnerSummary(Long id, String name, String email) {}

    public record OwnerAuthResponse(String token, OwnerSummary owner) {}
}
