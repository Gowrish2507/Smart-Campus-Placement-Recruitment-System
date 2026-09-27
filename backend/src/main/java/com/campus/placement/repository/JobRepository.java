package com.campus.placement.repository;

import com.campus.placement.model.Company;
import com.campus.placement.model.Job;
import com.campus.placement.model.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(String status);
    List<Job> findByRecruiter(Recruiter recruiter);
    List<Job> findByCompany(Company company);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND j.minCgpa <= :cgpa AND (j.eligibleDepartments LIKE %:department% OR j.eligibleDepartments = 'ALL')")
    List<Job> findEligibleJobs(@Param("cgpa") Double cgpa, @Param("department") String department);

    @Query("SELECT j FROM Job j WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(j.company.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Job> searchJobs(@Param("query") String query);
}
