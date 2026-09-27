package com.campus.placement.service;

import com.campus.placement.dto.ApplicationApplyRequest;
import com.campus.placement.dto.ApplicationDTO;
import com.campus.placement.dto.InterviewDTO;
import com.campus.placement.dto.StatusUpdateRequest;
import com.campus.placement.model.*;
import com.campus.placement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private StudentSkillRepository studentSkillRepository;
    @Autowired private InterviewRepository interviewRepository;

    @Transactional
    public ApplicationDTO applyForJob(Student student, ApplicationApplyRequest req) {
        Job job = jobRepository.findById(req.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found: " + req.getJobId()));

        if ("CLOSED".equalsIgnoreCase(job.getStatus())) {
            throw new RuntimeException("This job is no longer accepting applications");
        }

        if (applicationRepository.existsByJobAndStudent(job, student)) {
            throw new RuntimeException("You have already applied for this job");
        }

        // Eligibility validation
        if (job.getMinCgpa() != null && student.getCgpa() != null && student.getCgpa() < job.getMinCgpa()) {
            throw new RuntimeException(String.format("Minimum CGPA required is %.2f. Your CGPA is %.2f", job.getMinCgpa(), student.getCgpa()));
        }

        if (job.getEligibleDepartments() != null && !job.getEligibleDepartments().equalsIgnoreCase("ALL")
                && !job.getEligibleDepartments().contains(student.getDepartment())) {
            throw new RuntimeException(String.format("This job is restricted to %s departments. Your department is %s",
                    job.getEligibleDepartments(), student.getDepartment()));
        }

        String resume = req.getResumeLink() != null && !req.getResumeLink().isBlank()
                ? req.getResumeLink() : student.getResumeUrl();

        Application app = new Application(job, student, req.getCoverNote(), resume);
        app = applicationRepository.save(app);
        return convertToDTO(app);
    }

    public List<ApplicationDTO> getStudentApplications(Student student) {
        return applicationRepository.findByStudentOrderByAppliedAtDesc(student).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getJobApplicants(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
        return applicationRepository.findByJobOrderByAppliedAtDesc(job).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDTO updateStatus(Long applicationId, StatusUpdateRequest req) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        if (req.getStatus() != null) {
            app.setStatus(req.getStatus());
        }
        if (req.getRecruiterNotes() != null) {
            app.setRecruiterNotes(req.getRecruiterNotes());
        }
        app.setUpdatedAt(LocalDateTime.now());
        app = applicationRepository.save(app);
        return convertToDTO(app);
    }

    public ApplicationDTO convertToDTO(Application app) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(app.getId());

        Job job = app.getJob();
        dto.setJobId(job.getId());
        dto.setJobTitle(job.getTitle());
        dto.setJobRoleType(job.getRoleType());
        dto.setJobSalary(job.getSalaryPackage());
        dto.setJobLocation(job.getLocation());
        dto.setCompanyId(job.getCompany().getId());
        dto.setCompanyName(job.getCompany().getName());
        dto.setCompanyLogo(job.getCompany().getLogoUrl());

        Student student = app.getStudent();
        dto.setStudentId(student.getId());
        dto.setStudentName(student.getFullName());
        dto.setStudentRollNumber(student.getRollNumber());
        dto.setStudentDepartment(student.getDepartment());
        dto.setStudentCgpa(student.getCgpa());
        dto.setStudentEmail(student.getUser().getEmail());
        dto.setStudentPhone(student.getPhone());
        dto.setStudentResume(app.getResumeLink() != null ? app.getResumeLink() : student.getResumeUrl());
        dto.setStudentProjects(student.getProjects());

        List<StudentSkill> skills = studentSkillRepository.findByStudent(student);
        dto.setStudentSkills(skills.stream().map(s -> s.getSkill().getName()).collect(Collectors.toList()));

        dto.setAppliedAt(app.getAppliedAt());
        dto.setStatus(app.getStatus());
        dto.setCoverNote(app.getCoverNote());
        dto.setResumeLink(app.getResumeLink());
        dto.setRecruiterNotes(app.getRecruiterNotes());
        dto.setUpdatedAt(app.getUpdatedAt());

        List<Interview> interviews = interviewRepository.findByApplication(app);
        dto.setInterviews(interviews.stream().map(this::convertInterviewToDTO).collect(Collectors.toList()));

        return dto;
    }

    public InterviewDTO convertInterviewToDTO(Interview interview) {
        InterviewDTO dto = new InterviewDTO();
        dto.setId(interview.getId());
        dto.setApplicationId(interview.getApplication().getId());
        dto.setJobId(interview.getApplication().getJob().getId());
        dto.setJobTitle(interview.getApplication().getJob().getTitle());
        dto.setCompanyName(interview.getApplication().getJob().getCompany().getName());
        dto.setCompanyLogo(interview.getApplication().getJob().getCompany().getLogoUrl());
        dto.setStudentId(interview.getApplication().getStudent().getId());
        dto.setStudentName(interview.getApplication().getStudent().getFullName());
        dto.setStudentRollNumber(interview.getApplication().getStudent().getRollNumber());
        dto.setStudentDepartment(interview.getApplication().getStudent().getDepartment());
        dto.setRoundName(interview.getRoundName());
        dto.setScheduledTime(interview.getScheduledTime());
        dto.setInterviewMode(interview.getInterviewMode());
        dto.setMeetingLink(interview.getMeetingLink());
        dto.setLocation(interview.getLocation());
        dto.setStatus(interview.getStatus());
        dto.setFeedback(interview.getFeedback());
        dto.setScore(interview.getScore());
        return dto;
    }
}
