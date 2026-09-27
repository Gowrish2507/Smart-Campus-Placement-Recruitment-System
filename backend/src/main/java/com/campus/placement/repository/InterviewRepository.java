package com.campus.placement.repository;

import com.campus.placement.model.Application;
import com.campus.placement.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplication(Application application);

    @Query("SELECT i FROM Interview i WHERE i.application.student.id = :studentId ORDER BY i.scheduledTime ASC")
    List<Interview> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT i FROM Interview i WHERE i.application.job.recruiter.id = :recruiterId ORDER BY i.scheduledTime ASC")
    List<Interview> findByRecruiterId(@Param("recruiterId") Long recruiterId);

    @Query("SELECT i FROM Interview i WHERE i.application.job.company.id = :companyId ORDER BY i.scheduledTime ASC")
    List<Interview> findByCompanyId(@Param("companyId") Long companyId);
}
