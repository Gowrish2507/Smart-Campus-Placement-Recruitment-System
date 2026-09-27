package com.campus.placement.repository;

import com.campus.placement.model.Company;
import com.campus.placement.model.Recruiter;
import com.campus.placement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    Optional<Recruiter> findByUser(User user);
    Optional<Recruiter> findByUserId(Long userId);
    List<Recruiter> findByCompany(Company company);
}
