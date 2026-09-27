package com.campus.placement.dto;

import com.campus.placement.model.ApplicationStatus;
import java.time.LocalDateTime;
import java.util.List;

public class ApplicationDTO {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String jobRoleType;
    private String jobSalary;
    private String jobLocation;
    private Long companyId;
    private String companyName;
    private String companyLogo;

    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private String studentDepartment;
    private Double studentCgpa;
    private String studentEmail;
    private String studentPhone;
    private String studentResume;
    private String studentProjects;
    private List<String> studentSkills;

    private LocalDateTime appliedAt;
    private ApplicationStatus status;
    private String coverNote;
    private String resumeLink;
    private String recruiterNotes;
    private LocalDateTime updatedAt;
    private List<InterviewDTO> interviews;

    public ApplicationDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getJobRoleType() { return jobRoleType; }
    public void setJobRoleType(String jobRoleType) { this.jobRoleType = jobRoleType; }

    public String getJobSalary() { return jobSalary; }
    public void setJobSalary(String jobSalary) { this.jobSalary = jobSalary; }

    public String getJobLocation() { return jobLocation; }
    public void setJobLocation(String jobLocation) { this.jobLocation = jobLocation; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyLogo() { return companyLogo; }
    public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentRollNumber() { return studentRollNumber; }
    public void setStudentRollNumber(String studentRollNumber) { this.studentRollNumber = studentRollNumber; }

    public String getStudentDepartment() { return studentDepartment; }
    public void setStudentDepartment(String studentDepartment) { this.studentDepartment = studentDepartment; }

    public Double getStudentCgpa() { return studentCgpa; }
    public void setStudentCgpa(Double studentCgpa) { this.studentCgpa = studentCgpa; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentPhone() { return studentPhone; }
    public void setPhone(String studentPhone) { this.studentPhone = studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }

    public String getStudentResume() { return studentResume; }
    public void setStudentResume(String studentResume) { this.studentResume = studentResume; }

    public String getStudentProjects() { return studentProjects; }
    public void setStudentProjects(String studentProjects) { this.studentProjects = studentProjects; }

    public List<String> getStudentSkills() { return studentSkills; }
    public void setStudentSkills(List<String> studentSkills) { this.studentSkills = studentSkills; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public String getResumeLink() { return resumeLink; }
    public void setResumeLink(String resumeLink) { this.resumeLink = resumeLink; }

    public String getRecruiterNotes() { return recruiterNotes; }
    public void setRecruiterNotes(String recruiterNotes) { this.recruiterNotes = recruiterNotes; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<InterviewDTO> getInterviews() { return interviews; }
    public void setInterviews(List<InterviewDTO> interviews) { this.interviews = interviews; }
}
