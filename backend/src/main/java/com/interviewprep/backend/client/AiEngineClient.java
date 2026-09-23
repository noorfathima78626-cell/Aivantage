package com.interviewprep.backend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Talks to Member B's Python AI engine for question generation and answer
 * scoring. If the engine is unreachable, callers should fall back to the
 * static `questions` table rather than fail the whole session - important
 * for demo day.
 */
@Component
public class AiEngineClient {

    private final RestTemplate restTemplate;

    @Value("${app.ai-engine.base-url}")
    private String baseUrl;

    public AiEngineClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> generateQuestions(String subject, String difficulty, List<String> skills) {
        Map<String, Object> body = Map.of(
                "subject", subject,
                "difficulty", difficulty,
                "resumeSkills", skills
        );
        Map<String, Object> response = restTemplate.postForObject(
                baseUrl + "/qa/generate-questions", body, Map.class);
        return (List<Map<String, Object>>) response.get("questions");
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> evaluateAnswer(String questionText, String answerText, List<String> idealKeywords) {
        Map<String, Object> body = Map.of(
                "questionText", questionText,
                "answerText", answerText,
                "idealKeywords", idealKeywords
        );
        return restTemplate.postForObject(baseUrl + "/qa/evaluate-answer", body, Map.class);
    }
}
