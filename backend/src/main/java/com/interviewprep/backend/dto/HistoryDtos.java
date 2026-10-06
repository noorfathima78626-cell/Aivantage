package com.interviewprep.backend.dto;
import java.time.LocalDateTime;
import java.util.List;
public class HistoryDtos {
 public record HistoryItem(Long sessionId,String subject,String interviewType,int round,String difficulty,String status,Double score,LocalDateTime startedAt,LocalDateTime endedAt){}
 public record HistoryResponse(List<HistoryItem> sessions,List<NextRound> nextRounds){}
 public record NextRound(String subject,String interviewType,int nextRound,String lastDifficulty,Double lastScore){}
}
