package com.campus.placement.dto;

import com.campus.placement.model.ApplicationStatus;

public class StatusUpdateRequest {
    private ApplicationStatus status;
    private String recruiterNotes;

    public StatusUpdateRequest() {}

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getRecruiterNotes() { return recruiterNotes; }
    public void setRecruiterNotes(String recruiterNotes) { this.recruiterNotes = recruiterNotes; }
}
