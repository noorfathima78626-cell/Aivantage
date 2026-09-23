package com.interviewprep.backend.repository;

import com.interviewprep.backend.model.SessionQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionQuestionRepository extends JpaRepository<SessionQuestion, Long> {
    List<SessionQuestion> findBySessionIdOrderByQuestionOrderAsc(Long sessionId);
}
