import React, { useState, useEffect } from 'react';
import { jobsAPI, applicationAPI, interviewAPI } from '../services/api';
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Award, 
  FileText, 
  ExternalLink, 
  Search,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import Modal from '../components/Modal';

const RecruiterApplicants = ({ preselectedJobId }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(preselectedJobId || '');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Schedule Interview Modal
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [roundName, setRoundName] = useState('Technical Round 1');
  const [scheduledTime, setScheduledTime] = useState('');
  const [interviewMode, setInterviewMode] = useState('ONLINE');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xyz-recruiter-demo');
  const [location, setLocation] = useState('Google Meet');
  const [scheduling, setScheduling] = useState(false);

  // Evaluate / Update Result Modal
  const [evaluatingApp, setEvaluatingApp] = useState(null);
  const [evaluatingInterviewId, setEvaluatingInterviewId] = useState(null);
  const [evalStatus, setEvalStatus] = useState('PASSED');
  const [evalScore, setEvalScore] = useState(9);
  const [evalFeedback, setEvalFeedback] = useState('Strong analytical problem-solving and clean code.');
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const res = await jobsAPI.getRecruiterJobs();
      setJobs(res.data || []);
      if (res.data?.length > 0 && !selectedJobId) {
        setSelectedJobId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load jobs for review', err);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setLoading(true);
      const res = await applicationAPI.getJobApplicants(jobId);
      setApplicants(res.data || []);
    } catch (err) {
      console.error('Failed to load applicants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus, notes) => {
    try {
      await applicationAPI.updateStatus(applicationId, {
        status: newStatus,
        recruiterNotes: notes || `Application marked as ${newStatus}`
      });
      fetchApplicants(selectedJobId);
    } catch (err) {
      alert('Failed to update applicant status');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!schedulingApp) return;
    try {
      setScheduling(true);
      await interviewAPI.schedule({
        applicationId: schedulingApp.id,
        roundName,
        scheduledTime: scheduledTime || new Date(Date.now() + 86400000).toISOString(),
        interviewMode,
        meetingLink,
        location
      });
      setSchedulingApp(null);
      fetchApplicants(selectedJobId);
    } catch (err) {
      alert('Failed to schedule interview');
    } finally {
      setScheduling(false);
    }
  };

  const handleEvaluateInterview = async (e) => {
    e.preventDefault();
    if (!evaluatingInterviewId) return;
    try {
      setEvaluating(true);
      await interviewAPI.updateResult(evaluatingInterviewId, {
        status: evalStatus,
        score: parseInt(evalScore),
        feedback: evalFeedback
      });
      setEvaluatingApp(null);
      setEvaluatingInterviewId(null);
      fetchApplicants(selectedJobId);
    } catch (err) {
      alert('Failed to evaluate result');
    } finally {
      setEvaluating(false);
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  const selectedJob = jobs.find(j => j.id.toString() === selectedJobId?.toString());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Job Selector */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              Candidate Review & Interview Pipeline
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              Screen applicants, schedule technical interviews, and issue selection decisions
            </p>
          </div>

          {/* Job Dropdown Selector */}
          <div style={{ minWidth: '260px' }}>
            <label className="form-label">Select Job Drive to Review</label>
            <select
              className="form-select"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.applicantsCount || 0} candidates)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                backgroundColor: filterStatus === st ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
                color: filterStatus === st ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease'
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Job Overview */}
      {selectedJob && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
              Reviewing: {selectedJob.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Min CGPA: {selectedJob.minCgpa} • Eligible Depts: {selectedJob.eligibleDepartments} • Package: {selectedJob.salaryPackage}
            </div>
          </div>
          <span className="badge badge-shortlisted">
            {applicants.length} Total Applications
          </span>
        </div>
      )}

      {/* Applicants List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          Loading applicants...
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <Users size={44} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>No Applicants in this Stage</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
            No candidate submissions matching filter "{filterStatus}".
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredApplicants.map((app) => (
            <div
              key={app.id}
              className="glass-panel"
              style={{
                padding: '24px',
                border: app.status === 'SELECTED' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {/* Candidate Info Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                      {app.studentName}
                    </h3>
                    <span className={`badge ${
                      app.status === 'SELECTED' ? 'badge-selected' :
                      app.status === 'INTERVIEW_SCHEDULED' ? 'badge-interview' :
                      app.status === 'SHORTLISTED' ? 'badge-shortlisted' :
                      app.status === 'REJECTED' ? 'badge-rejected' : 'badge-applied'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                    <span>Roll No: <strong style={{ color: '#f8fafc' }}>{app.studentRollNumber}</strong></span>
                    <span>Department: <strong style={{ color: '#818cf8' }}>{app.studentDepartment}</strong></span>
                    <span>CGPA: <strong style={{ color: '#34d399' }}>{app.studentCgpa?.toFixed(2)}</strong></span>
                    <span>Email: <strong style={{ color: '#cbd5e1' }}>{app.studentEmail}</strong></span>
                    {app.studentPhone && <span>Phone: {app.studentPhone}</span>}
                  </div>
                </div>

                {/* Resume Link */}
                {app.studentResume && (
                  <a
                    href={app.studentResume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    View Resume / Portfolio <ExternalLink size={14} />
                  </a>
                )}
              </div>

              {/* Skills and Projects */}
              <div style={{ margin: '14px 0', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {app.studentSkills?.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: '#a5b4fc',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {app.coverNote && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  fontSize: '0.85rem',
                  color: '#cbd5e1',
                  marginBottom: '14px'
                }}>
                  <strong style={{ color: '#94a3b8' }}>Candidate Cover Note:</strong> {app.coverNote}
                </div>
              )}

              {/* Recruiter Notes / Result info */}
              {app.recruiterNotes && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  fontSize: '0.825rem',
                  color: '#a5b4fc',
                  marginBottom: '14px'
                }}>
                  <strong>Recruiter Log:</strong> {app.recruiterNotes}
                </div>
              )}

              {/* Interviews History / Actions */}
              {app.interviews && app.interviews.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                    Interview Rounds
                  </div>
                  {app.interviews.map((intv) => (
                    <div
                      key={intv.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(30, 41, 59, 0.6)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, color: '#f8fafc' }}>{intv.roundName}</span> &nbsp;•&nbsp;
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          {new Date(intv.scheduledTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                        {intv.feedback && (
                          <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '2px' }}>
                            Feedback: {intv.feedback} (Score: {intv.score}/10)
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge ${intv.status === 'PASSED' ? 'badge-selected' : intv.status === 'FAILED' ? 'badge-rejected' : 'badge-interview'}`}>
                          {intv.status}
                        </span>

                        {intv.status === 'SCHEDULED' && (
                          <button
                            onClick={() => {
                              setEvaluatingApp(app);
                              setEvaluatingInterviewId(intv.id);
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            Evaluate Result
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recruiter Workflow Actions Toolbar */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {app.status === 'APPLIED' && (
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED', 'Resume and academic background shortlisted for interview.')}
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                  >
                    <CheckCircle size={14} /> Shortlist Candidate
                  </button>
                )}

                {(app.status === 'APPLIED' || app.status === 'SHORTLISTED' || app.status === 'INTERVIEW_SCHEDULED') && (
                  <button
                    onClick={() => {
                      setSchedulingApp(app);
                      setScheduledTime(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Calendar size={14} /> Schedule Interview
                  </button>
                )}

                {app.status !== 'SELECTED' && (
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'SELECTED', 'Candidate successfully passed all evaluation rounds. Offer letter extended!')}
                    className="btn btn-success btn-sm"
                  >
                    <Award size={14} /> Select & Extend Offer
                  </button>
                )}

                {app.status !== 'REJECTED' && app.status !== 'SELECTED' && (
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'REJECTED', 'Thank you for interviewing. We decided to proceed with other candidates at this time.')}
                    className="btn btn-danger btn-sm"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={!!schedulingApp}
        onClose={() => setSchedulingApp(null)}
        title={schedulingApp ? `Schedule Interview: ${schedulingApp.studentName}` : 'Schedule Interview'}
      >
        {schedulingApp && (
          <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">Interview Round Name</label>
              <select
                className="form-select"
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
              >
                <option value="Technical Round 1 - Problem Solving">Technical Round 1 - Problem Solving & DSA</option>
                <option value="Technical Round 2 - System Design">Technical Round 2 - System Design & Core CS</option>
                <option value="Coding Assessment Discussion">Coding Assessment Discussion</option>
                <option value="Managerial & Cultural Fit">Managerial & Cultural Fit</option>
                <option value="HR & Offer Discussion">HR & Offer Discussion</option>
              </select>
            </div>

            <div>
              <label className="form-label">Date & Time</label>
              <input
                className="form-input"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="form-label">Interview Mode</label>
                <select
                  className="form-select"
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value)}
                >
                  <option value="ONLINE">ONLINE (Video Call)</option>
                  <option value="OFFLINE">OFFLINE (Campus Room)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Location / Platform</label>
                <input
                  className="form-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Google Meet or Room 204"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Meeting URL (if online)</label>
              <input
                className="form-input"
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => setSchedulingApp(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={scheduling} className="btn btn-primary">
                {scheduling ? 'Scheduling...' : 'Send Interview Invite'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Evaluate Result Modal */}
      <Modal
        isOpen={!!evaluatingApp}
        onClose={() => setEvaluatingApp(null)}
        title="Evaluate Candidate Interview"
      >
        <form onSubmit={handleEvaluateInterview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Interview Outcome</label>
            <select
              className="form-select"
              value={evalStatus}
              onChange={(e) => setEvalStatus(e.target.value)}
            >
              <option value="PASSED">Passed (Proceed / Select candidate)</option>
              <option value="FAILED">Failed (Reject candidate)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Candidate Score (1 to 10)</label>
            <input
              className="form-input"
              type="number"
              min="1"
              max="10"
              value={evalScore}
              onChange={(e) => setEvalScore(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Interviewer Feedback & Notes</label>
            <textarea
              className="form-textarea"
              rows="4"
              value={evalFeedback}
              onChange={(e) => setEvalFeedback(e.target.value)}
              placeholder="Detailed notes on candidate's technical skills, problem solving, and communication..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={() => setEvaluatingApp(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={evaluating} className="btn btn-primary">
              {evaluating ? 'Saving...' : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruiterApplicants;
