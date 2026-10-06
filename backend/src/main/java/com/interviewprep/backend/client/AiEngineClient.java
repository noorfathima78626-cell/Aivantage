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
    public List<Map<String, Object>> generateQuestions(String subject, String difficulty, List<String> skills,
                                                         int round, String mode, List<String> exclude) {
        Map<String, Object> body = new java.util.HashMap<>();
        body.put("subject", subject);
        body.put("difficulty", difficulty);
        body.put("resumeSkills", skills);
        body.put("round", round);
        body.put("mode", mode);
        body.put("exclude", exclude);
        Map<String, Object> response = restTemplate.postForObject(
                baseUrl + "/qa/generate-questions", body, Map.class);
        return (List<Map<String, Object>>) response.get("questions");
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> evaluateCode(String language, String code, String functionName, List<Map<String, Object>> tests) {
        Map<String, Object> body = new java.util.HashMap<>();
        body.put("language", language == null ? "python" : language);
        body.put("code", code);
        body.put("functionName", functionName);
        body.put("tests", tests == null ? List.of() : tests);
        return restTemplate.postForObject(baseUrl + "/qa/evaluate-code", body, Map.class);
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
