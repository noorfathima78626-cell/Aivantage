package com.interviewprep.backend.service;

import com.interviewprep.backend.config.JwtUtil;
import com.interviewprep.backend.dto.OwnerDtos.*;
import com.interviewprep.backend.model.Owner;
import com.interviewprep.backend.repository.OwnerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public OwnerService(OwnerRepository ownerRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.ownerRepository = ownerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public OwnerAuthResponse register(OwnerRegisterRequest req) {
        if (ownerRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Owner email already registered");
        }
        Owner owner = new Owner();
        owner.setName(req.name());
        owner.setEmail(req.email());
        owner.setPasswordHash(passwordEncoder.encode(req.password()));
        owner = ownerRepository.save(owner);

        String token = jwtUtil.generateToken(owner.getEmail(), owner.getId(), "OWNER");
        return new OwnerAuthResponse(token, new OwnerSummary(owner.getId(), owner.getName(), owner.getEmail()));
    }

    public OwnerAuthResponse login(OwnerLoginRequest req) {
        Owner owner = ownerRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), owner.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(owner.getEmail(), owner.getId(), "OWNER");
        return new OwnerAuthResponse(token, new OwnerSummary(owner.getId(), owner.getName(), owner.getEmail()));
    }
}
