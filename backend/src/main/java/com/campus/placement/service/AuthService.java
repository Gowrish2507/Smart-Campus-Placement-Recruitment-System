package com.campus.placement.service;

import com.campus.placement.config.JwtTokenProvider;
import com.campus.placement.dto.AuthRequest;
import com.campus.placement.dto.AuthResponse;
import com.campus.placement.dto.RegisterRequest;
import com.campus.placement.model.*;
import com.campus.placement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private RecruiterRepository recruiterRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_STUDENT;
        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail(),
                role
        );
        user = userRepository.save(user);

        if (role == Role.ROLE_STUDENT) {
            Student student = new Student(
                    user,
                    request.getFullName() != null ? request.getFullName() : request.getUsername(),
                    request.getRollNumber() != null ? request.getRollNumber() : "R" + System.currentTimeMillis() % 100000,
                    request.getDepartment() != null ? request.getDepartment() : "CSE",
                    request.getCgpa() != null ? request.getCgpa() : 7.0,
                    request.getGraduationYear() != null ? request.getGraduationYear() : 2025
            );
            studentRepository.save(student);
        } else if (role == Role.ROLE_RECRUITER) {
            Company company;
            if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
                company = companyRepository.findByName(request.getCompanyName())
                        .orElseGet(() -> companyRepository.save(new Company(
                                request.getCompanyName(), "Technology", "", "India", "", "Campus Hiring Partner"
                        )));
            } else {
                company = companyRepository.findAll().stream().findFirst()
                        .orElseGet(() -> companyRepository.save(new Company("Tech Corp", "IT", "", "Bengaluru", "", "")));
            }

            Recruiter recruiter = new Recruiter(
                    user,
                    request.getFullName() != null ? request.getFullName() : request.getUsername(),
                    request.getDesignation() != null ? request.getDesignation() : "Talent Acquisition",
                    request.getPhone() != null ? request.getPhone() : "",
                    company
            );
            recruiterRepository.save(recruiter);
        }

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    public AuthResponse buildAuthResponse(User user, String token) {
        AuthResponse res = new AuthResponse();
        res.setToken(token);
        res.setUserId(user.getId());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole());

        if (user.getRole() == Role.ROLE_STUDENT) {
            studentRepository.findByUser(user).ifPresent(s -> {
                res.setFullName(s.getFullName());
                res.setStudentId(s.getId());
            });
        } else if (user.getRole() == Role.ROLE_RECRUITER) {
            recruiterRepository.findByUser(user).ifPresent(r -> {
                res.setFullName(r.getFullName());
                res.setRecruiterId(r.getId());
                res.setCompanyId(r.getCompany().getId());
                res.setCompanyName(r.getCompany().getName());
            });
        } else {
            res.setFullName("Campus Placement Officer");
        }

        return res;
    }
}
