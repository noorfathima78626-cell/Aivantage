package com.interviewprep.backend.repository;

import com.interviewprep.backend.model.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    Optional<OtpCode> findFirstByPhoneAndPurposeAndConsumedFalseOrderByCreatedAtDesc(String phone, String purpose);

    List<OtpCode> findByPhoneAndPurposeAndConsumedTrueAndCreatedAtAfter(
            String phone, String purpose, LocalDateTime after);
}
