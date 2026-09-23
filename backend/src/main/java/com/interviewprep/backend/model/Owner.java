package com.interviewprep.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * A separate account type from User. Owners log in through /api/owner/auth/*
 * and get a JWT with role=OWNER, which is the only thing that can call
 * /api/admin/** endpoints (see SecurityConfig + JwtAuthFilter).
 */
@Data
@Entity
@Table(name = "owners")
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;
}
