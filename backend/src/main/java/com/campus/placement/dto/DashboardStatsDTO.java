package com.campus.placement.dto;

import java.util.Map;

public class DashboardStatsDTO {
    private long totalJobs;
    private long activeJobs;
    private long totalStudents;
    private long totalCompanies;
    private long totalApplications;
    private long totalShortlisted;
    private long totalInterviews;
    private long totalSelected;
    private double placementRate;
    private String averageSalary;
    private String highestSalary;
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> studentsByDepartment;

    public DashboardStatsDTO() {}

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getActiveJobs() { return activeJobs; }
    public void setActiveJobs(long activeJobs) { this.activeJobs = activeJobs; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getTotalShortlisted() { return totalShortlisted; }
    public void setTotalShortlisted(long totalShortlisted) { this.totalShortlisted = totalShortlisted; }

    public long getTotalInterviews() { return totalInterviews; }
    public void setTotalInterviews(long totalInterviews) { this.totalInterviews = totalInterviews; }

    public long getTotalSelected() { return totalSelected; }
    public void setTotalSelected(long totalSelected) { this.totalSelected = totalSelected; }

    public double getPlacementRate() { return placementRate; }
    public void setPlacementRate(double placementRate) { this.placementRate = placementRate; }

    public String getAverageSalary() { return averageSalary; }
    public void setAverageSalary(String averageSalary) { this.averageSalary = averageSalary; }

    public String getHighestSalary() { return highestSalary; }
    public void setHighestSalary(String highestSalary) { this.highestSalary = highestSalary; }

    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }

    public Map<String, Long> getStudentsByDepartment() { return studentsByDepartment; }
    public void setStudentsByDepartment(Map<String, Long> studentsByDepartment) { this.studentsByDepartment = studentsByDepartment; }
}
