package com.interviewprep.backend.controller;

import com.interviewprep.backend.model.Resume;
import com.interviewprep.backend.service.ResumeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public Map<String, Object> upload(@AuthenticationPrincipal Long userId,
                                       @RequestParam("file") MultipartFile file) throws IOException {
        Resume resume = resumeService.storeResume(userId, file);
        List<String> parsedSkills = resume.getParsedSkills() == null
                ? List.of()
                : Arrays.asList(resume.getParsedSkills().split(","));
        return Map.of("resumeId", resume.getId(), "parsedSkills", parsedSkills);
    }
}
