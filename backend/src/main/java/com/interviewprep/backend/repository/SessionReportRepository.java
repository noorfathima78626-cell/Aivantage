package com.interviewprep.backend.repository;

import com.interviewprep.backend.model.SessionReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SessionReportRepository extends JpaRepository<SessionReport, Long> {
    Optional<SessionReport> findBySessionId(Long sessionId);
}
