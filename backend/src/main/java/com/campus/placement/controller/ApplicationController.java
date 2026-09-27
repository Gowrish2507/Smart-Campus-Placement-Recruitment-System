package com.campus.placement.controller;

import com.campus.placement.dto.ApplicationApplyRequest;
import com.campus.placement.dto.ApplicationDTO;
import com.campus.placement.dto.StatusUpdateRequest;
import com.campus.placement.model.Student;
import com.campus.placement.model.User;
import com.campus.placement.repository.ApplicationRepository;
import com.campus.placement.repository.StudentRepository;
import com.campus.placement.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired private ApplicationService applicationService;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private StudentRepository studentRepository;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> applyForJob(@AuthenticationPrincipal User currentUser, @RequestBody ApplicationApplyRequest request) {
        try {
            Student student = studentRepository.findByUser(currentUser)
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            ApplicationDTO app = applicationService.applyForJob(student, request);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyApplications(@AuthenticationPrincipal User currentUser) {
        try {
            Student student = studentRepository.findByUser(currentUser)
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            List<ApplicationDTO> apps = applicationService.getStudentApplications(student);
            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> getJobApplicants(@PathVariable Long jobId) {
        try {
            List<ApplicationDTO> applicants = applicationService.getJobApplicants(jobId);
            return ResponseEntity.ok(applicants);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            ApplicationDTO app = applicationService.updateStatus(id, request);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        return applicationRepository.findById(id)
                .map(app -> ResponseEntity.ok(applicationService.convertToDTO(app)))
                .orElse(ResponseEntity.notFound().build());
    }
}
