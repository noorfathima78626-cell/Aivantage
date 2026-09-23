package com.interviewprep.backend.controller;

import com.interviewprep.backend.dto.OwnerDtos.*;
import com.interviewprep.backend.service.OwnerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner/auth")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @PostMapping("/register")
    public OwnerAuthResponse register(@RequestBody OwnerRegisterRequest request) {
        return ownerService.register(request);
    }

    @PostMapping("/login")
    public OwnerAuthResponse login(@RequestBody OwnerLoginRequest request) {
        return ownerService.login(request);
    }
}
