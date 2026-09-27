package com.campus.placement.repository;

import com.campus.placement.model.Skill;
import com.campus.placement.model.Student;
import com.campus.placement.model.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByStudent(Student student);
    List<StudentSkill> findByStudentId(Long studentId);
    Optional<StudentSkill> findByStudentAndSkill(Student student, Skill skill);
    void deleteByStudent(Student student);
}
