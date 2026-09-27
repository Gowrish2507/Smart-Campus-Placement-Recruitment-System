package com.campus.placement.controller;

import com.campus.placement.dto.StudentProfileDTO;
import com.campus.placement.model.Student;
import com.campus.placement.model.User;
import com.campus.placement.repository.StudentRepository;
import com.campus.placement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired private StudentService studentService;
    @Autowired private StudentRepository studentRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal User currentUser) {
        try {
            Student student = studentRepository.findByUser(currentUser)
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            return ResponseEntity.ok(studentService.getProfile(student));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User currentUser, @RequestBody StudentProfileDTO request) {
        try {
            Student student = studentRepository.findByUser(currentUser)
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            return ResponseEntity.ok(studentService.updateProfile(student, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PostMapping("/skills")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> addSkill(@AuthenticationPrincipal User currentUser, @RequestBody Map<String, String> body) {
        try {
            Student student = studentRepository.findByUser(currentUser)
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            String skillName = body.get("name");
            String proficiency = body.get("proficiency");
            return ResponseEntity.ok(studentService.addSkill(student, skillName, proficiency));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @DeleteMapping("/skills/{skillId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> removeSkill(@AuthenticationPrincipal User currentUser, @PathVariable Long skillId) {
        try {
            Student student = studentRepository.findByUser(currentUser)
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            return ResponseEntity.ok(studentService.removeSkill(student, skillId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<List<StudentProfileDTO>> getAllStudents() {
        List<StudentProfileDTO> list = studentRepository.findAll().stream()
                .map(studentService::getProfile)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}
