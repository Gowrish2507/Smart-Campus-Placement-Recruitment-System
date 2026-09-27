package com.campus.placement.service;

import com.campus.placement.dto.DashboardStatsDTO;
import com.campus.placement.model.ApplicationStatus;
import com.campus.placement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired private JobRepository jobRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private InterviewRepository interviewRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.findByStatus("OPEN").size();
        long totalStudents = studentRepository.count();
        long totalCompanies = companyRepository.count();
        long totalApplications = applicationRepository.count();
        long totalShortlisted = applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED);
        long totalInterviews = interviewRepository.count();
        long totalSelected = applicationRepository.countByStatus(ApplicationStatus.SELECTED);

        stats.setTotalJobs(totalJobs);
        stats.setActiveJobs(activeJobs);
        stats.setTotalStudents(totalStudents);
        stats.setTotalCompanies(totalCompanies);
        stats.setTotalApplications(totalApplications);
        stats.setTotalShortlisted(totalShortlisted);
        stats.setTotalInterviews(totalInterviews);
        stats.setTotalSelected(totalSelected);

        double rate = totalStudents > 0 ? ((double) totalSelected / totalStudents) * 100.0 : 0.0;
        stats.setPlacementRate(Math.round(rate * 10.0) / 10.0);
        stats.setAverageSalary("14.2 LPA");
        stats.setHighestSalary("24.5 LPA");

        // Map status counts
        Map<String, Long> statusMap = new HashMap<>();
        for (ApplicationStatus s : ApplicationStatus.values()) {
            statusMap.put(s.name(), applicationRepository.countByStatus(s));
        }
        stats.setApplicationsByStatus(statusMap);

        // Map students by department
        Map<String, Long> deptMap = new HashMap<>();
        studentRepository.findAll().forEach(s -> {
            String dept = s.getDepartment() != null ? s.getDepartment() : "General";
            deptMap.put(dept, deptMap.getOrDefault(dept, 0L) + 1);
        });
        stats.setStudentsByDepartment(deptMap);

        return stats;
    }
}
