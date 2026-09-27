package com.campus.placement.service;

import com.campus.placement.dto.StudentProfileDTO;
import com.campus.placement.model.Skill;
import com.campus.placement.model.Student;
import com.campus.placement.model.StudentSkill;
import com.campus.placement.repository.SkillRepository;
import com.campus.placement.repository.StudentRepository;
import com.campus.placement.repository.StudentSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired private StudentRepository studentRepository;
    @Autowired private SkillRepository skillRepository;
    @Autowired private StudentSkillRepository studentSkillRepository;

    public StudentProfileDTO getProfile(Student student) {
        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setId(student.getId());
        dto.setUserId(student.getUser().getId());
        dto.setUsername(student.getUser().getUsername());
        dto.setEmail(student.getUser().getEmail());
        dto.setFullName(student.getFullName());
        dto.setRollNumber(student.getRollNumber());
        dto.setDepartment(student.getDepartment());
        dto.setCgpa(student.getCgpa());
        dto.setGraduationYear(student.getGraduationYear());
        dto.setPhone(student.getPhone());
        dto.setResumeUrl(student.getResumeUrl());
        dto.setBio(student.getBio());
        dto.setGithubUrl(student.getGithubUrl());
        dto.setLinkedinUrl(student.getLinkedinUrl());
        dto.setProjects(student.getProjects());

        List<StudentSkill> skills = studentSkillRepository.findByStudent(student);
        dto.setSkills(skills.stream().map(s -> new StudentProfileDTO.SkillDTO(
                s.getSkill().getId(),
                s.getSkill().getName(),
                s.getSkill().getCategory(),
                s.getProficiency()
        )).collect(Collectors.toList()));

        return dto;
    }

    @Transactional
    public StudentProfileDTO updateProfile(Student student, StudentProfileDTO req) {
        if (req.getFullName() != null) student.setFullName(req.getFullName());
        if (req.getDepartment() != null) student.setDepartment(req.getDepartment());
        if (req.getCgpa() != null) student.setCgpa(req.getCgpa());
        if (req.getGraduationYear() != null) student.setGraduationYear(req.getGraduationYear());
        if (req.getPhone() != null) student.setPhone(req.getPhone());
        if (req.getResumeUrl() != null) student.setResumeUrl(req.getResumeUrl());
        if (req.getBio() != null) student.setBio(req.getBio());
        if (req.getGithubUrl() != null) student.setGithubUrl(req.getGithubUrl());
        if (req.getLinkedinUrl() != null) student.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getProjects() != null) student.setProjects(req.getProjects());

        student = studentRepository.save(student);

        // Update skills if provided
        if (req.getSkills() != null) {
            studentSkillRepository.deleteByStudent(student);
            for (StudentProfileDTO.SkillDTO s : req.getSkills()) {
                Skill skill = skillRepository.findByNameIgnoreCase(s.getName().trim())
                        .orElseGet(() -> skillRepository.save(new Skill(s.getName().trim(), s.getCategory() != null ? s.getCategory() : "Technical")));
                studentSkillRepository.save(new StudentSkill(student, skill, s.getProficiency() != null ? s.getProficiency() : "Intermediate"));
            }
        }

        return getProfile(student);
    }

    @Transactional
    public StudentProfileDTO addSkill(Student student, String skillName, String proficiency) {
        Skill skill = skillRepository.findByNameIgnoreCase(skillName.trim())
                .orElseGet(() -> skillRepository.save(new Skill(skillName.trim(), "General")));

        if (studentSkillRepository.findByStudentAndSkill(student, skill).isEmpty()) {
            studentSkillRepository.save(new StudentSkill(student, skill, proficiency != null ? proficiency : "Intermediate"));
        }
        return getProfile(student);
    }

    @Transactional
    public StudentProfileDTO removeSkill(Student student, Long skillId) {
        Skill skill = skillRepository.findById(skillId).orElse(null);
        if (skill != null) {
            studentSkillRepository.findByStudentAndSkill(student, skill)
                    .ifPresent(studentSkillRepository::delete);
        }
        return getProfile(student);
    }
}
