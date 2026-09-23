package com.interviewprep.backend.service;

import com.interviewprep.backend.dto.AdminDtos.*;
import com.interviewprep.backend.model.User;
import com.interviewprep.backend.repository.InterviewSessionRepository;
import com.interviewprep.backend.repository.ResumeRepository;
import com.interviewprep.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final InterviewSessionRepository sessionRepository;

    public AdminService(UserRepository userRepository, ResumeRepository resumeRepository,
                         InterviewSessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.sessionRepository = sessionRepository;
    }

    public UserListResponse getAllUsers() {
        List<User> users = userRepository.findAll();

        List<UserOverview> overviews = users.stream().map(u -> new UserOverview(
                u.getId(), u.getName(), u.getEmail(), u.getCreatedAt(),
                resumeRepository.findByUserIdOrderByUploadedAtDesc(u.getId()).size(),
                sessionRepository.findByUserIdOrderByStartedAtDesc(u.getId()).size()
        )).collect(Collectors.toList());

        return new UserListResponse(overviews, overviews.size());
    }
}
