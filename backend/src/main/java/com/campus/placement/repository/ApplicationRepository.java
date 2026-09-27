package com.campus.placement.repository;

import com.campus.placement.model.Application;
import com.campus.placement.model.ApplicationStatus;
import com.campus.placement.model.Job;
import com.campus.placement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentOrderByAppliedAtDesc(Student student);
    List<Application> findByJobOrderByAppliedAtDesc(Job job);
    List<Application> findByJobAndStatus(Job job, ApplicationStatus status);
    Optional<Application> findByJobAndStudent(Job job, Student student);
    boolean existsByJobAndStudent(Job job, Student student);
    long countByStatus(ApplicationStatus status);
    List<Application> findByStudentId(Long studentId);
}
