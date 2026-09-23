package com.interviewprep.backend.repository;

import com.interviewprep.backend.model.SessionMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionMetricRepository extends JpaRepository<SessionMetric, Long> {
    List<SessionMetric> findBySessionIdOrderByCapturedAtAsc(Long sessionId);
}
