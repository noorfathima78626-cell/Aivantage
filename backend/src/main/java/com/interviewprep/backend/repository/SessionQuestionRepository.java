package com.interviewprep.backend.repository;

import com.interviewprep.backend.model.SessionQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SessionQuestionRepository extends JpaRepository<SessionQuestion, Long> {
    List<SessionQuestion> findBySessionIdOrderByQuestionOrderAsc(Long sessionId);

    @Query("SELECT q.questionText FROM SessionQuestion sq " +
           "JOIN InterviewSession s ON s.id = sq.sessionId " +
           "JOIN Question q ON q.id = sq.questionId " +
           "WHERE s.userId = :userId AND s.subject = :subject")
    List<String> findAskedQuestionTextsByUserAndSubject(@Param("userId") Long userId, @Param("subject") String subject);
}
