package com.campus.placement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 50)
    private String rollNumber;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(nullable = false)
    private Double cgpa;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    private String phone;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String githubUrl;
    private String linkedinUrl;

    @Column(columnDefinition = "TEXT")
    private String projects; // JSON or text summary of projects

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<StudentSkill> studentSkills = new ArrayList<>();

    public Student() {}

    public Student(User user, String fullName, String rollNumber, String department, Double cgpa, Integer graduationYear) {
        this.user = user;
        this.fullName = fullName;
        this.rollNumber = rollNumber;
        this.department = department;
        this.cgpa = cgpa;
        this.graduationYear = graduationYear;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }

    public List<StudentSkill> getStudentSkills() { return studentSkills; }
    public void setStudentSkills(List<StudentSkill> studentSkills) { this.studentSkills = studentSkills; }
}
