package com.interviewprep.backend.controller;
import com.interviewprep.backend.dto.HistoryDtos.*;
import com.interviewprep.backend.model.InterviewSession;
import com.interviewprep.backend.repository.InterviewSessionRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
@RestController @RequestMapping("/api/history")
public class HistoryController {
 private final InterviewSessionRepository repo;
 public HistoryController(InterviewSessionRepository repo){this.repo=repo;}
 @GetMapping public HistoryResponse get(@AuthenticationPrincipal Long userId){
  List<InterviewSession> all=repo.findByUserIdOrderByStartedAtDesc(userId);
  List<HistoryItem> items=all.stream().map(s->new HistoryItem(s.getId(),s.getSubject(),s.getInterviewType(),s.getRoundNumber(),s.getDifficulty(),s.getStatus(),s.getOverallScore(),s.getStartedAt(),s.getEndedAt())).toList();
  Map<String,InterviewSession> latest=new LinkedHashMap<>();
  for(InterviewSession s:all){String key=s.getSubject()+"|"+s.getInterviewType(); if(!latest.containsKey(key)) latest.put(key,s);}
  List<NextRound> next=latest.values().stream().filter(s->"COMPLETED".equalsIgnoreCase(s.getStatus())&&s.getRoundNumber()<3).map(s->new NextRound(s.getSubject(),s.getInterviewType(),s.getRoundNumber()+1,s.getDifficulty(),s.getOverallScore())).toList();
  return new HistoryResponse(items,next);
 }
}
