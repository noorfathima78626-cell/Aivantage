package com.interviewprep.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.backend.client.AiEngineClient;
import com.interviewprep.backend.dto.SessionDtos.*;
import com.interviewprep.backend.model.*;
import com.interviewprep.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final InterviewSessionRepository sessionRepository;
    private final QuestionRepository questionRepository;
    private final SessionQuestionRepository sessionQuestionRepository;
    private final SessionMetricRepository sessionMetricRepository;
    private final SessionReportRepository sessionReportRepository;
    private final ResumeRepository resumeRepository;
    private final AiEngineClient aiEngineClient;
    private final InterviewRoundProgressService roundProgressService;
    private final ObjectMapper objectMapper;

    public SessionService(InterviewSessionRepository sessionRepository,
                           QuestionRepository questionRepository,
                           SessionQuestionRepository sessionQuestionRepository,
                           SessionMetricRepository sessionMetricRepository,
                           SessionReportRepository sessionReportRepository,
                           ResumeRepository resumeRepository,
                           AiEngineClient aiEngineClient,
                           InterviewRoundProgressService roundProgressService,
                           ObjectMapper objectMapper) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
        this.sessionQuestionRepository = sessionQuestionRepository;
        this.sessionMetricRepository = sessionMetricRepository;
        this.sessionReportRepository = sessionReportRepository;
        this.resumeRepository = resumeRepository;
        this.aiEngineClient = aiEngineClient;
        this.roundProgressService = roundProgressService;
        this.objectMapper = objectMapper;
    }

    public CreateSessionResponse createSession(Long userId, CreateSessionRequest req) {
        if (req == null) throw new IllegalArgumentException("Session request is required");
        int round = req.round() == null ? 1 : req.round();
        String interviewType = req.interviewType() == null || req.interviewType().isBlank()
                ? "One-on-One" : req.interviewType();
        String difficulty = roundToDifficulty(round);

        roundProgressService.ensureRoundCanStart(userId, req.subject(), interviewType, round);

        InterviewSession session = new InterviewSession();
        session.setUserId(userId);
        session.setSubject(req.subject());
        session.setDifficulty(difficulty);
        session.setRoundNumber(round);
        session.setInterviewType(interviewType);
        session = sessionRepository.save(session);

        String mode = "Aptitude".equalsIgnoreCase(interviewType) ? "aptitude" : "interview";
        List<String> alreadyAsked = sessionQuestionRepository
                .findAskedQuestionTextsByUserAndSubject(userId, req.subject());

        List<Question> questions = generateOrFallbackQuestions(userId, req.subject(), difficulty,
                round, mode, alreadyAsked);

        List<QuestionView> views = new ArrayList<>();
        int order = 1;
        for (Question q : questions) {
            SessionQuestion sq = new SessionQuestion();
            sq.setSessionId(session.getId());
            sq.setQuestionId(q.getId());
            sq.setQuestionOrder(order);
            sq.setAskedAt(LocalDateTime.now());
            sessionQuestionRepository.save(sq);

            views.add(new QuestionView(q.getId(), q.getQuestionText(), order,
                    q.getType(), parseOptions(q.getOptionsJson()), q.getStarterCode(), q.getLanguage()));
            order++;
        }

        return new CreateSessionResponse(session.getId(), views);
    }

    @SuppressWarnings("unchecked")
    private List<String> parseOptions(String optionsJson) {
        if (optionsJson == null || optionsJson.isBlank()) return null;
        try {
            return objectMapper.readValue(optionsJson, List.class);
        } catch (Exception e) {
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseTests(String testsJson) {
        if (testsJson == null || testsJson.isBlank()) return List.of();
        try {
            return objectMapper.readValue(testsJson, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }

    private String toJsonOrNull(Object value) {
        if (value == null) return null;
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            return null;
        }
    }

    private List<Question> generateOrFallbackQuestions(Long userId, String subject, String difficulty,
                                                         int round, String mode, List<String> exclude) {
        try {
            List<String> skills = resumeRepository.findByUserIdOrderByUploadedAtDesc(userId).stream()
                    .findFirst()
                    .map(r -> r.getParsedSkills() == null ? List.<String>of() :
                            Arrays.asList(r.getParsedSkills().split(",")))
                    .orElse(List.of());

            // Cap the exclude list sent over the wire - after many sessions this
            // could otherwise grow unbounded.
            List<String> excludeCapped = exclude.size() > 50
                    ? exclude.subList(exclude.size() - 50, exclude.size()) : exclude;

            var generated = aiEngineClient.generateQuestions(subject, difficulty, skills, round, mode, excludeCapped);
            List<Question> saved = new ArrayList<>();
            for (var g : generated) {
                Question q = new Question();
                q.setSubject(subject);
                q.setDifficulty(difficulty);
                q.setQuestionText((String) g.get("text"));
                @SuppressWarnings("unchecked")
                List<String> keywords = (List<String>) g.get("keywords");
                q.setIdealAnswerKeywords(keywords == null ? "" : String.join(",", keywords));

                String qType = (String) g.get("type");
                if ("mcq".equals(qType)) {
                    q.setType("mcq");
                    q.setOptionsJson(toJsonOrNull(g.get("options")));
                    Object answerIndex = g.get("answerIndex");
                    if (answerIndex instanceof Number n) q.setAnswerIndex(n.intValue());
                } else if ("code".equals(qType)) {
                    q.setType("code");
                    q.setStarterCode((String) g.get("starterCode"));
                    q.setLanguage((String) g.get("language"));
                    q.setFunctionName((String) g.get("functionName"));
                    q.setTestsJson(toJsonOrNull(g.get("tests")));
                }

                saved.add(questionRepository.save(q));
            }
            if (!saved.isEmpty()) return saved;
        } catch (Exception e) {
            // AI engine unreachable or errored - fall through to static bank.
            // Log this in a real setup; not fatal to the session.
        }

        List<Question> fallback = questionRepository.findBySubjectAndDifficulty(subject, difficulty);
        if (fallback.isEmpty() && "ADVANCED".equals(difficulty)) {
            // Existing installations may not have ADVANCED rows yet. Use the
            // HARD bank as a safe offline fallback for Round 3.
            fallback = questionRepository.findBySubjectAndDifficulty(subject, "HARD");
        }
        if (fallback.isEmpty()) {
            throw new IllegalStateException(
                    "No questions available for " + subject + "/" + difficulty +
                    " and AI engine is unreachable. Seed the questions table for this combo.");
        }
        Collections.shuffle(fallback);
        return fallback.stream().limit(5).collect(Collectors.toList());
    }

    public void recordAnswer(Long userId, Long sessionId, AnswerRequest req) {
        requireOwnedSession(userId, sessionId);
        SessionQuestion sq = sessionQuestionRepository.findBySessionIdOrderByQuestionOrderAsc(sessionId).stream()
                .filter(x -> x.getQuestionId().equals(req.questionId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Question not part of this session"));

        Question question = questionRepository.findById(req.questionId())
                .orElseThrow(() -> new IllegalArgumentException("Unknown question"));

        double score;
        String feedback;

        if ("mcq".equals(question.getType())) {
            Integer correctIndex = question.getAnswerIndex();
            Integer submittedIndex = null;
            try {
                submittedIndex = req.answerText() == null ? null : Integer.valueOf(req.answerText().trim());
            } catch (NumberFormatException ignored) {
                // leave null - treated as wrong/unanswered below
            }
            boolean correct = correctIndex != null && correctIndex.equals(submittedIndex);
            score = correct ? 100.0 : 0.0;
            List<String> options = parseOptions(question.getOptionsJson());
            String correctText = (options != null && correctIndex != null && correctIndex < options.size())
                    ? options.get(correctIndex) : null;
            feedback = correct ? "Correct." :
                    (correctText != null ? "Incorrect. The correct answer was: " + correctText : "Incorrect.");
        } else if ("code".equals(question.getType())) {
            try {
                List<Map<String, Object>> tests = parseTests(question.getTestsJson());
                var result = aiEngineClient.evaluateCode(question.getLanguage(), req.answerText(),
                        question.getFunctionName(), tests);
                Object scoreObj = result.get("score");
                score = scoreObj instanceof Number n ? n.doubleValue() : 0.0;
                feedback = (String) result.getOrDefault("feedback", "Code evaluated.");
            } catch (Exception e) {
                score = 0.0;
                feedback = "Could not auto-grade this code (AI engine unavailable) - review manually if this looks off.";
            }
        } else {
            try {
                List<String> keywords = question.getIdealAnswerKeywords() == null ? List.of() :
                        Arrays.asList(question.getIdealAnswerKeywords().split(","));
                var result = aiEngineClient.evaluateAnswer(question.getQuestionText(), req.answerText(), keywords);
                score = ((Number) result.get("score")).doubleValue();
                feedback = (String) result.getOrDefault("feedback", "Answer evaluated.");
                Object suggestion = result.get("suggestion");
                if (suggestion != null && !String.valueOf(suggestion).isBlank()) {
                    feedback = feedback + " Suggestion: " + suggestion;
                }
            } catch (Exception e) {
                // Fallback heuristic: crude keyword overlap so the flow still works offline/AI-down.
                List<String> keywords = question.getIdealAnswerKeywords() == null ? List.of() :
                        Arrays.asList(question.getIdealAnswerKeywords().split(","));
                String answerLower = req.answerText() == null ? "" : req.answerText().toLowerCase();
                long hits = keywords.stream().filter(k -> answerLower.contains(k.trim().toLowerCase())).count();
                score = keywords.isEmpty() ? 50.0 : Math.min(100.0, (hits * 100.0) / keywords.size());
                feedback = "Auto-scored offline (AI engine unavailable) - review manually if this looks off.";
            }
        }

        sq.setUserAnswerText(req.answerText());
        sq.setAnswerScore(score);
        sq.setAnswerFeedback(feedback);
        sq.setAnsweredAt(LocalDateTime.now());
        sessionQuestionRepository.save(sq);
    }

    public SessionReportResponse completeSession(Long userId, Long sessionId) {
        InterviewSession session = requireOwnedSession(userId, sessionId);

        List<SessionQuestion> answers = sessionQuestionRepository.findBySessionIdOrderByQuestionOrderAsc(sessionId);
        double overallScore = answers.stream()
                .filter(a -> a.getAnswerScore() != null)
                .mapToDouble(SessionQuestion::getAnswerScore)
                .average().orElse(0.0);

        session.setStatus("COMPLETED");
        session.setEndedAt(LocalDateTime.now());
        session.setOverallScore(overallScore);
        sessionRepository.save(session);

        List<SessionMetric> metrics = sessionMetricRepository.findBySessionIdOrderByCapturedAtAsc(sessionId);

        double avgEyeContact = avg(metrics, SessionMetric::getEyeContactScore);
        double avgHandMovement = avg(metrics, SessionMetric::getHandMovementScore);
        double avgNervousness = avg(metrics, SessionMetric::getNervousnessScore);
        double avgPace = avg(metrics, SessionMetric::getSpeakingPaceWpm);
        int whisperCount = (int) metrics.stream().filter(m -> Boolean.TRUE.equals(m.getWhisperDetected())).count();
        String dominantExpression = mostCommonExpression(metrics);
        String paceFlag = classifyPace(avgPace);

        String strengths = buildStrengths(answers, avgEyeContact, avgHandMovement, avgNervousness, paceFlag);
        String areasToImprove = buildAreasToImprove(answers, avgEyeContact, avgHandMovement, avgNervousness, paceFlag, whisperCount);
        String summary = String.format(
                "Overall score: %.0f/100. Eye contact %.0f/100, hand movement %.0f/100 (lower is calmer), " +
                "nervousness %.0f/100, average pace %.0f wpm (%s).",
                overallScore, avgEyeContact, avgHandMovement, avgNervousness, avgPace, paceFlag);

        SessionReport report = sessionReportRepository.findBySessionId(sessionId).orElseGet(SessionReport::new);
        report.setSessionId(sessionId);
        report.setAvgEyeContact(avgEyeContact);
        report.setAvgHandMovement(avgHandMovement);
        report.setAvgNervousness(avgNervousness);
        report.setAvgSpeakingPaceWpm(avgPace);
        report.setPaceFlag(paceFlag);
        report.setWhisperFlagCount(whisperCount);
        report.setDominantExpression(dominantExpression);
        report.setSummary(summary);
        report.setStrengths(strengths);
        report.setAreasToImprove(areasToImprove);
        sessionReportRepository.save(report);
        roundProgressService.markCompleted(userId, session.getSubject(), session.getInterviewType(), session.getRoundNumber());

        return toReportResponse(session, report, answers);
    }

    public SessionReportResponse getReport(Long userId, Long sessionId) {
        InterviewSession session = requireOwnedSession(userId, sessionId);
        SessionReport report = sessionReportRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalStateException("Session not completed yet"));
        List<SessionQuestion> answers = sessionQuestionRepository.findBySessionIdOrderByQuestionOrderAsc(sessionId);
        return toReportResponse(session, report, answers);
    }

    private SessionReportResponse toReportResponse(InterviewSession session, SessionReport report,
                                                     List<SessionQuestion> answers) {
        List<AnswerReview> reviews = answers.stream().map(a -> {
            Question q = questionRepository.findById(a.getQuestionId()).orElse(null);
            return new AnswerReview(a.getQuestionId(), q == null ? "" : q.getQuestionText(),
                    a.getUserAnswerText(), a.getAnswerScore(), a.getAnswerFeedback());
        }).collect(Collectors.toList());

        return new SessionReportResponse(
                session.getId(), session.getOverallScore(),
                report.getAvgEyeContact(), report.getAvgHandMovement(), report.getAvgNervousness(),
                report.getAvgSpeakingPaceWpm(), report.getPaceFlag(), report.getWhisperFlagCount(),
                report.getDominantExpression(), report.getSummary(), report.getStrengths(),
                report.getAreasToImprove(), reviews
        );
    }

    private InterviewSession requireOwnedSession(Long userId, Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        if (!Objects.equals(session.getUserId(), userId)) {
            throw new IllegalArgumentException("You do not have access to this session");
        }
        return session;
    }

    private String roundToDifficulty(int round) {
        return switch (round) {
            case 1 -> "MEDIUM";
            case 2 -> "HARD";
            case 3 -> "ADVANCED";
            default -> throw new IllegalArgumentException("Round must be 1, 2, or 3");
        };
    }

    private double avg(List<SessionMetric> metrics, java.util.function.Function<SessionMetric, Double> f) {
        return metrics.stream().map(f).filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    private String mostCommonExpression(List<SessionMetric> metrics) {
        return metrics.stream()
                .map(SessionMetric::getDominantExpression)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(e -> e, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("neutral");
    }

    // Typical natural speaking pace for interviews is ~110-150 wpm.
    private String classifyPace(double avgWpm) {
        if (avgWpm <= 0) return "UNKNOWN";
        if (avgWpm < 110) return "TOO_SLOW";
        if (avgWpm > 160) return "TOO_FAST";
        return "GOOD";
    }

    private String buildStrengths(List<SessionQuestion> answers, double eyeContact, double handMovement,
                                   double nervousness, String paceFlag) {
        List<String> points = new ArrayList<>();
        long strongAnswers = answers.stream().filter(a -> a.getAnswerScore() != null && a.getAnswerScore() >= 70).count();
        if (strongAnswers > 0) points.add(strongAnswers + " of " + answers.size() + " answers covered the key points well.");
        if (eyeContact >= 70) points.add("Good eye contact with the camera throughout.");
        if (handMovement <= 30) points.add("Calm body language - minimal distracting hand movement.");
        if ("GOOD".equals(paceFlag)) points.add("Speaking pace was easy to follow.");
        if (points.isEmpty()) points.add("You completed the full session - use the notes below to sharpen specific areas.");
        return String.join(" ", points);
    }

    private String buildAreasToImprove(List<SessionQuestion> answers, double eyeContact, double handMovement,
                                        double nervousness, String paceFlag, int whisperCount) {
        List<String> points = new ArrayList<>();

        answers.stream()
                .filter(a -> a.getAnswerScore() != null && a.getAnswerScore() < 60)
                .forEach(a -> points.add("Question #" + a.getQuestionOrder() + ": " +
                        (a.getAnswerFeedback() == null ? "answer missed several key points - revisit this topic." : a.getAnswerFeedback())));

        if (eyeContact < 50) points.add("Eye contact was low - practice looking at the camera lens, not the screen preview.");
        if (handMovement > 60) points.add("Frequent hand movement detected - try keeping hands relaxed and out of frame when not gesturing intentionally.");
        if (nervousness > 60) points.add("Nervousness signals were elevated - try a slower breathing pace before answering and pause before responding instead of rushing in.");
        if ("TOO_FAST".equals(paceFlag)) points.add("You spoke faster than the ideal interview pace - slow down and add brief pauses between points.");
        if ("TOO_SLOW".equals(paceFlag)) points.add("Your pace was slower than ideal - this can read as hesitation; practice answering with a bit more energy.");
        if (whisperCount > 0) points.add("The session flagged " + whisperCount + " moment(s) that looked like a second voice/off-screen prompting - in a real interview this reads as a major red flag, so practice answering fully unaided.");

        if (points.isEmpty()) points.add("Solid session overall - no major flags. Keep practicing to build consistency.");
        return String.join(" ", points);
    }
}
