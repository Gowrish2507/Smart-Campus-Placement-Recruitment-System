import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationAPI, interviewAPI, studentAPI } from '../services/api';
import { 
  Briefcase, 
  FileCheck, 
  Calendar, 
  Award, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  MapPin,
  DollarSign
} from 'lucide-react';
import Modal from '../components/Modal';

const StudentDashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Apply Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profRes, jobsRes, appsRes, intvRes] = await Promise.all([
        studentAPI.getProfile().catch(() => ({ data: null })),
        jobsAPI.getAll().catch(() => ({ data: [] })),
        applicationAPI.getMyApplications().catch(() => ({ data: [] })),
        interviewAPI.getStudentInterviews().catch(() => ({ data: [] }))
      ]);

      setProfile(profRes.data);
      setJobs(jobsRes.data || []);
      setApplications(appsRes.data || []);
      setInterviews(intvRes.data || []);
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    try {
      setApplying(true);
      await applicationAPI.apply({
        jobId: selectedJob.id,
        coverNote,
        resumeLink: profile?.resumeUrl || ''
      });
      setFeedbackMsg('Application submitted successfully!');
      setTimeout(() => {
        setSelectedJob(null);
        setFeedbackMsg('');
        fetchDashboardData();
      }, 1200);
    } catch (err) {
      setFeedbackMsg(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const eligibleJobs = jobs.filter(j => j.eligible);
  const selectedApps = applications.filter(a => a.status === 'SELECTED');
  const scheduledInterviews = interviews.filter(i => i.status === 'SCHEDULED');

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
        Loading student dashboard...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Student Welcome Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          right: '-20px',
          top: '-20px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-interview">
                <Sparkles size={12} /> Student Portal
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Batch of {profile?.graduationYear || '2025'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Welcome back, {profile?.fullName || user?.fullName || 'Student'}! 👋
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
              Department: <strong style={{ color: '#f8fafc' }}>{profile?.department || 'CSE'}</strong> &nbsp;|&nbsp;
              Roll No: <strong style={{ color: '#f8fafc' }}>{profile?.rollNumber || 'N/A'}</strong> &nbsp;|&nbsp;
              CGPA: <strong style={{ color: '#34d399' }}>{profile?.cgpa ? profile.cgpa.toFixed(2) : 'N/A'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setActiveTab('jobs')} className="btn btn-primary">
              <Briefcase size={16} /> Explore Open Jobs
            </button>
            <button onClick={() => setActiveTab('profile')} className="btn btn-secondary">
              Update Profile / Skills
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>ELIGIBLE JOBS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
                {eligibleJobs.length}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Briefcase size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Based on your {profile?.department} dept & {profile?.cgpa} CGPA
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>MY APPLICATIONS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {applications.length}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <FileCheck size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            {applications.filter(a => a.status === 'SHORTLISTED').length} Shortlisted for next steps
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>SCHEDULED INTERVIEWS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
                {scheduledInterviews.length}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              <Calendar size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Live meeting links ready
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>OFFERS RECEIVED</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {selectedApps.length}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Award size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            {selectedApps.length > 0 ? "Congratulations on your selection!" : "Rounds in progress"}
          </div>
        </div>
      </div>

      {/* Upcoming Interviews Alert Card */}
      {scheduledInterviews.length > 0 && (
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            background: 'linear-gradient(135deg, rgba(20, 26, 44, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Calendar size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              Upcoming Interview Schedule
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {scheduledInterviews.map((intv) => (
              <div 
                key={intv.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                    {intv.jobTitle}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginTop: '2px' }}>
                    {intv.companyName} • {intv.roundName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', display: 'flex', gap: '14px' }}>
                    <span>⏰ {new Date(intv.scheduledTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                    <span>📍 {intv.location || intv.interviewMode}</span>
                  </div>
                </div>

                {intv.meetingLink && (
                  <a
                    href={intv.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Join Interview Meeting <ExternalLink size={16} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eligible Job Recommendations */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              Featured Opportunities For You
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              Matched according to your CGPA and department criteria
            </p>
          </div>
          <button onClick={() => setActiveTab('jobs')} className="btn btn-secondary btn-sm">
            View All ({jobs.length}) <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {eligibleJobs.slice(0, 3).map((job) => (
            <div 
              key={job.id} 
              className="glass-panel glass-panel-hover"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                      {job.companyName}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                      {job.title}
                    </h4>
                  </div>
                  <span className="badge badge-applied">{job.roleType}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', margin: '14px 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#64748b" /> {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399', fontWeight: 600 }}>
                    <DollarSign size={14} /> {job.salaryPackage}
                  </span>
                </div>

                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {job.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                  {job.requiredSkills?.map((skill, i) => (
                    <span key={i} style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      color: '#cbd5e1'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Min CGPA: <strong>{job.minCgpa}</strong>
                </span>

                {job.hasApplied ? (
                  <span className="badge badge-shortlisted">
                    <CheckCircle size={14} /> {job.myApplicationStatus || 'Applied'}
                  </span>
                ) : (
                  <button 
                    onClick={() => { setSelectedJob(job); setFeedbackMsg(''); }} 
                    className="btn btn-primary btn-sm"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Apply Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? `Apply to ${selectedJob.companyName} - ${selectedJob.title}` : 'Apply'}
      >
        {selectedJob && (
          <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{selectedJob.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                Package: {selectedJob.salaryPackage} • Location: {selectedJob.location}
              </div>
            </div>

            <div>
              <label className="form-label">Cover Note / Why are you a great fit?</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Highlight your key projects, skills, and why you are excited for this role..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Attached Resume Link</label>
              <input
                className="form-input"
                type="text"
                placeholder="https://example.com/my-resume.pdf"
                defaultValue={profile?.resumeUrl || ''}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Pre-filled from your student profile.
              </span>
            </div>

            {feedbackMsg && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                backgroundColor: feedbackMsg.includes('success') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: feedbackMsg.includes('success') ? '#34d399' : '#fb7185'
              }}>
                {feedbackMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => setSelectedJob(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={applying} className="btn btn-primary">
                {applying ? 'Submitting...' : 'Confirm Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default StudentDashboard;
