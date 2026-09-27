package com.campus.placement.controller;

import com.campus.placement.dto.InterviewDTO;
import com.campus.placement.dto.InterviewScheduleRequest;
import com.campus.placement.model.InterviewStatus;
import com.campus.placement.model.Recruiter;
import com.campus.placement.model.Student;
import com.campus.placement.model.User;
import com.campus.placement.repository.RecruiterRepository;
import com.campus.placement.repository.StudentRepository;
import com.campus.placement.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired private InterviewService interviewService;
    @Autowired private StudentRepository studentRepository;
    @Autowired private RecruiterRepository recruiterRepository;

    @PostMapping("/schedule")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> scheduleInterview(@RequestBody InterviewScheduleRequest request) {
        try {
            InterviewDTO interview = interviewService.scheduleInterview(request);
            return ResponseEntity.ok(interview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getStudentInterviews(@AuthenticationPrincipal User currentUser) {
        try {
            Student student = studentRepository.findByUser(currentUser)
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            List<InterviewDTO> list = interviewService.getStudentInterviews(student.getId());
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getRecruiterInterviews(@AuthenticationPrincipal User currentUser) {
        try {
            Recruiter recruiter = recruiterRepository.findByUser(currentUser)
                    .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));
            List<InterviewDTO> list = interviewService.getRecruiterInterviews(recruiter.getId());
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/result")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> updateInterviewResult(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            String statusStr = (String) body.get("status");
            InterviewStatus status = InterviewStatus.valueOf(statusStr);
            String feedback = (String) body.get("feedback");
            Integer score = body.get("score") != null ? Integer.parseInt(body.get("score").toString()) : null;

            InterviewDTO interview = interviewService.updateInterviewResult(id, status, feedback, score);
            return ResponseEntity.ok(interview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }
}
