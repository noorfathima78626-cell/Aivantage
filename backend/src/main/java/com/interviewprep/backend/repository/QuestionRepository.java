package com.interviewprep.backend.repository;

import com.interviewprep.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findBySubjectAndDifficulty(String subject, String difficulty);
}
