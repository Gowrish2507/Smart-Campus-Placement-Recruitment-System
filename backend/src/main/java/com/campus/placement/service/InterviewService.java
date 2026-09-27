package com.campus.placement.service;

import com.campus.placement.dto.InterviewDTO;
import com.campus.placement.dto.InterviewScheduleRequest;
import com.campus.placement.model.*;
import com.campus.placement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    @Autowired private InterviewRepository interviewRepository;
    @Autowired private ApplicationRepository applicationRepository;

    @Transactional
    public InterviewDTO scheduleInterview(InterviewScheduleRequest req) {
        Application app = applicationRepository.findById(req.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found: " + req.getApplicationId()));

        Interview interview = new Interview(
                app,
                req.getRoundName() != null ? req.getRoundName() : "Technical Interview Round",
                req.getScheduledTime(),
                req.getInterviewMode() != null ? req.getInterviewMode() : "ONLINE",
                req.getMeetingLink(),
                req.getLocation() != null ? req.getLocation() : "Campus Placement Cell"
        );
        interview = interviewRepository.save(interview);

        // Update application status to INTERVIEW_SCHEDULED
        app.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(app);

        return convertToDTO(interview);
    }

    public List<InterviewDTO> getStudentInterviews(Long studentId) {
        return interviewRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InterviewDTO> getRecruiterInterviews(Long recruiterId) {
        return interviewRepository.findByRecruiterId(recruiterId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewDTO updateInterviewResult(Long interviewId, InterviewStatus status, String feedback, Integer score) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

        interview.setStatus(status);
        if (feedback != null) interview.setFeedback(feedback);
        if (score != null) interview.setScore(score);
        interview = interviewRepository.save(interview);

        // Automatically update the application status if Passed or Failed
        Application app = interview.getApplication();
        if (status == InterviewStatus.PASSED) {
            app.setStatus(ApplicationStatus.SELECTED);
            app.setRecruiterNotes("Cleared interview with score: " + (score != null ? score : "N/A") + "/10. " + (feedback != null ? feedback : ""));
            applicationRepository.save(app);
        } else if (status == InterviewStatus.FAILED) {
            app.setStatus(ApplicationStatus.REJECTED);
            app.setRecruiterNotes("Did not meet required criteria in round: " + interview.getRoundName() + ". " + (feedback != null ? feedback : ""));
            applicationRepository.save(app);
        }

        return convertToDTO(interview);
    }

    public InterviewDTO convertToDTO(Interview interview) {
        InterviewDTO dto = new InterviewDTO();
        dto.setId(interview.getId());
        dto.setApplicationId(interview.getApplication().getId());
        dto.setJobId(interview.getApplication().getJob().getId());
        dto.setJobTitle(interview.getApplication().getJob().getTitle());
        dto.setCompanyName(interview.getApplication().getJob().getCompany().getName());
        dto.setCompanyLogo(interview.getApplication().getJob().getCompany().getLogoUrl());
        dto.setStudentId(interview.getApplication().getStudent().getId());
        dto.setStudentName(interview.getApplication().getStudent().getFullName());
        dto.setStudentRollNumber(interview.getApplication().getStudent().getRollNumber());
        dto.setStudentDepartment(interview.getApplication().getStudent().getDepartment());
        dto.setRoundName(interview.getRoundName());
        dto.setScheduledTime(interview.getScheduledTime());
        dto.setInterviewMode(interview.getInterviewMode());
        dto.setMeetingLink(interview.getMeetingLink());
        dto.setLocation(interview.getLocation());
        dto.setStatus(interview.getStatus());
        dto.setFeedback(interview.getFeedback());
        dto.setScore(interview.getScore());
        return dto;
    }
}
