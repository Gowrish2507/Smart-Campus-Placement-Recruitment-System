package com.campus.placement.controller;

import com.campus.placement.dto.JobCreateRequest;
import com.campus.placement.dto.JobDTO;
import com.campus.placement.model.Recruiter;
import com.campus.placement.model.Role;
import com.campus.placement.model.User;
import com.campus.placement.repository.RecruiterRepository;
import com.campus.placement.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired private JobService jobService;
    @Autowired private RecruiterRepository recruiterRepository;

    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department) {
        return ResponseEntity.ok(jobService.getAllJobs(currentUser, search, department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(jobService.getJobById(id, currentUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getRecruiterJobs(@AuthenticationPrincipal User currentUser) {
        Recruiter recruiter = recruiterRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));
        return ResponseEntity.ok(jobService.getRecruiterJobs(recruiter));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> createJob(@AuthenticationPrincipal User currentUser, @RequestBody JobCreateRequest request) {
        try {
            Recruiter recruiter = recruiterRepository.findByUser(currentUser)
                    .orElseThrow(() -> new RuntimeException("Recruiter profile required to post a job"));
            JobDTO job = jobService.createJob(recruiter, request);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> updateJobStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(jobService.updateJobStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }
}
