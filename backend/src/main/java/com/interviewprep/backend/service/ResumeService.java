package com.interviewprep.backend.service;

import com.interviewprep.backend.model.Resume;
import com.interviewprep.backend.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    public Resume storeResume(Long userId, MultipartFile file) throws IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        String safeName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path target = dir.resolve(safeName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setFilePath(target.toString());
        resume.setOriginalFilename(file.getOriginalFilename());
        // parsedSkills is left null here - Member B's /qa endpoints can be
        // called with the raw text later to extract skills, or this can be
        // a simple keyword-match stub to start with. Not a blocker for Member A.
        return resumeRepository.save(resume);
    }

    public List<Resume> getResumesForUser(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }
}
