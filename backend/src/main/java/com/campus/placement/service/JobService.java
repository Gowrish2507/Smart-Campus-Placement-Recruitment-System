package com.campus.placement.service;

import com.campus.placement.dto.JobCreateRequest;
import com.campus.placement.dto.JobDTO;
import com.campus.placement.model.*;
import com.campus.placement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired private JobRepository jobRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private RecruiterRepository recruiterRepository;
    @Autowired private SkillRepository skillRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private StudentRepository studentRepository;

    public List<JobDTO> getAllJobs(User currentUser, String search, String department) {
        List<Job> jobs;
        if (search != null && !search.isBlank()) {
            jobs = jobRepository.searchJobs(search.trim());
        } else {
            jobs = jobRepository.findAll();
        }

        Student student = null;
        if (currentUser != null && currentUser.getRole() == Role.ROLE_STUDENT) {
            student = studentRepository.findByUser(currentUser).orElse(null);
        }

        final Student currentStudent = student;
        return jobs.stream()
                .filter(j -> department == null || department.isBlank() || 
                             j.getEligibleDepartments().contains(department) || 
                             j.getEligibleDepartments().equalsIgnoreCase("ALL"))
                .map(job -> convertToDTO(job, currentStudent))
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .collect(Collectors.toList());
    }

    public List<JobDTO> getRecruiterJobs(Recruiter recruiter) {
        return jobRepository.findByRecruiter(recruiter).stream()
                .map(job -> convertToDTO(job, null))
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .collect(Collectors.toList());
    }

    public JobDTO getJobById(Long jobId, User currentUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        Student student = null;
        if (currentUser != null && currentUser.getRole() == Role.ROLE_STUDENT) {
            student = studentRepository.findByUser(currentUser).orElse(null);
        }

        return convertToDTO(job, student);
    }

    @Transactional
    public JobDTO createJob(Recruiter recruiter, JobCreateRequest req) {
        Job job = new Job();
        job.setCompany(recruiter.getCompany());
        job.setRecruiter(recruiter);
        job.setTitle(req.getTitle());
        job.setDescription(req.getDescription());
        job.setRoleType(req.getRoleType() != null ? req.getRoleType() : "Full-Time");
        job.setLocation(req.getLocation() != null ? req.getLocation() : "Campus");
        job.setSalaryPackage(req.getSalaryPackage());
        job.setMinCgpa(req.getMinCgpa() != null ? req.getMinCgpa() : 6.0);
        job.setEligibleDepartments(req.getEligibleDepartments() != null ? req.getEligibleDepartments() : "CSE,IT,ECE,EEE,MECH,CIVIL");
        job.setDeadline(req.getDeadline());
        job.setStatus("OPEN");

        if (req.getSkillNames() != null && !req.getSkillNames().isEmpty()) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : req.getSkillNames()) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName.trim())
                        .orElseGet(() -> skillRepository.save(new Skill(skillName.trim(), "General")));
                skills.add(skill);
            }
            job.setRequiredSkills(skills);
        }

        job = jobRepository.save(job);
        return convertToDTO(job, null);
    }

    @Transactional
    public JobDTO updateJobStatus(Long jobId, String status) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
        job.setStatus(status);
        job = jobRepository.save(job);
        return convertToDTO(job, null);
    }

    public JobDTO convertToDTO(Job job, Student student) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setCompanyId(job.getCompany().getId());
        dto.setCompanyName(job.getCompany().getName());
        dto.setCompanyLogo(job.getCompany().getLogoUrl());
        dto.setCompanyLocation(job.getCompany().getLocation());
        dto.setRecruiterId(job.getRecruiter().getId());
        dto.setRecruiterName(job.getRecruiter().getFullName());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setRoleType(job.getRoleType());
        dto.setLocation(job.getLocation());
        dto.setSalaryPackage(job.getSalaryPackage());
        dto.setMinCgpa(job.getMinCgpa());
        dto.setEligibleDepartments(job.getEligibleDepartments());
        dto.setDeadline(job.getDeadline());
        dto.setStatus(job.getStatus());
        dto.setCreatedAt(job.getCreatedAt());

        if (job.getRequiredSkills() != null) {
            dto.setRequiredSkills(job.getRequiredSkills().stream()
                    .map(Skill::getName)
                    .collect(Collectors.toList()));
        } else {
            dto.setRequiredSkills(new ArrayList<>());
        }

        dto.setApplicantsCount(applicationRepository.findByJobOrderByAppliedAtDesc(job).size());

        if (student != null) {
            boolean deptOk = job.getEligibleDepartments() == null ||
                             job.getEligibleDepartments().equalsIgnoreCase("ALL") ||
                             job.getEligibleDepartments().contains(student.getDepartment());
            boolean cgpaOk = student.getCgpa() != null && student.getCgpa() >= (job.getMinCgpa() != null ? job.getMinCgpa() : 0.0);
            dto.setEligible(deptOk && cgpaOk);

            Optional<Application> appOpt = applicationRepository.findByJobAndStudent(job, student);
            dto.setHasApplied(appOpt.isPresent());
            appOpt.ifPresent(app -> dto.setMyApplicationStatus(app.getStatus().name()));
        } else {
            dto.setEligible(true);
            dto.setHasApplied(false);
        }

        return dto;
    }
}
