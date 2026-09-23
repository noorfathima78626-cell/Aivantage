package com.interviewprep.backend.dto;

import java.util.List;

public class SessionDtos {

    public record CreateSessionRequest(String subject, String difficulty) {}

    public record QuestionView(Long id, String text, Integer order) {}

    public record CreateSessionResponse(Long sessionId, List<QuestionView> questions) {}

    public record AnswerRequest(Long questionId, String answerText) {}

    public record SessionReportResponse(
            Long sessionId,
            Double overallScore,
            Double avgEyeContact,
            Double avgHandMovement,
            Double avgNervousness,
            Double avgSpeakingPaceWpm,
            String paceFlag,
            Integer whisperFlagCount,
            String dominantExpression,
            String summary,
            String strengths,
            String areasToImprove,
            List<AnswerReview> answers
    ) {}

    public record AnswerReview(Long questionId, String questionText, String userAnswer,
                                Double score, String feedback) {}
}
