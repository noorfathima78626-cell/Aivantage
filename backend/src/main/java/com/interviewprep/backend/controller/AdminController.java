package com.interviewprep.backend.controller;

import com.interviewprep.backend.dto.AdminDtos.UserListResponse;
import com.interviewprep.backend.service.AdminService;
import org.springframework.web.bind.annotation.*;

// Every route here is already restricted to ROLE_OWNER in SecurityConfig -
// no need to re-check the role in each method.
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public UserListResponse listUsers() {
        return adminService.getAllUsers();
    }
}
