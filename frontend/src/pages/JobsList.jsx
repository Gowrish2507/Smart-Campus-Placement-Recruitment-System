import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationAPI, studentAPI } from '../services/api';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Briefcase, 
  Building2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Modal from '../components/Modal';

const JobsList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [onlyEligible, setOnlyEligible] = useState(false);

  // Modals
  const [activeJobModal, setActiveJobModal] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchJobs();
    if (user?.role === 'ROLE_STUDENT') {
      studentAPI.getProfile().then(res => {
        setProfile(res.data);
        setResumeLink(res.data.resumeUrl || '');
      }).catch(() => {});
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobsAPI.getAll();
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyingJob) return;
    try {
      setSubmitting(true);
      await applicationAPI.apply({
        jobId: applyingJob.id,
        coverNote,
        resumeLink
      });
      setFeedback('Application submitted successfully!');
      setTimeout(() => {
        setApplyingJob(null);
        setFeedback('');
        fetchJobs();
      }, 1200);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    const matchesDept = 
      !selectedDept || 
      job.eligibleDepartments.includes(selectedDept) || 
      job.eligibleDepartments.toUpperCase() === 'ALL';

    const matchesEligible = !onlyEligible || job.eligible;

    return matchesSearch && matchesDept && matchesEligible;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Controls */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              Campus Placement Opportunities
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              Discover active campus hiring drives and internship openings
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Showing <strong>{filteredJobs.length}</strong> of {jobs.length} roles
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              className="form-input"
              style={{ paddingLeft: '42px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="form-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>

          {user?.role === 'ROLE_STUDENT' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#cbd5e1', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
              />
              Only Show Eligible
            </label>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          Loading jobs board...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <Briefcase size={40} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700 }}>No Jobs Found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
            Try adjusting your search keywords or clearing filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredJobs.map((job) => (
            <div 
              key={job.id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: job.eligible ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(244, 63, 94, 0.2)'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: '4px'
                    }}>
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Building2 size={24} color="#818cf8" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                        {job.companyName}
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                        {job.title}
                      </h3>
                    </div>
                  </div>

                  <span className="badge badge-applied">{job.roleType}</span>
                </div>

                {/* Badges / Details */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', margin: '16px 0', fontSize: '0.825rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8' }}>
                    <MapPin size={15} color="#64748b" /> {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34d399', fontWeight: 600 }}>
                    <DollarSign size={15} /> {job.salaryPackage}
                  </span>
                  {job.deadline && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b' }}>
                      <Calendar size={15} /> Due {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Description snippet */}
                <p style={{
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  {job.description}
                </p>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {job.requiredSkills?.map((s, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Eligibility Pill */}
                {user?.role === 'ROLE_STUDENT' && (
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    backgroundColor: job.eligible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    border: `1px solid ${job.eligible ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                    color: job.eligible ? '#34d399' : '#fb7185',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '16px'
                  }}>
                    {job.eligible ? (
                      <>
                        <CheckCircle size={15} /> You meet all eligibility criteria (Min CGPA: {job.minCgpa})
                      </>
                    ) : (
                      <>
                        <XCircle size={15} /> CGPA or Department criteria not met (Requires {job.minCgpa} CGPA in {job.eligibleDepartments})
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px'
              }}>
                <button 
                  onClick={() => setActiveJobModal(job)}
                  className="btn btn-secondary btn-sm"
                >
                  View Full Details
                </button>

                {user?.role === 'ROLE_STUDENT' && (
                  job.hasApplied ? (
                    <span className="badge badge-shortlisted">
                      <CheckCircle size={14} /> {job.myApplicationStatus || 'Applied'}
                    </span>
                  ) : (
                    <button
                      onClick={() => { setApplyingJob(job); setFeedback(''); }}
                      disabled={!job.eligible}
                      className="btn btn-primary btn-sm"
                      style={{ opacity: job.eligible ? 1 : 0.5, cursor: job.eligible ? 'pointer' : 'not-allowed' }}
                    >
                      Apply Now
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Full Job Details Modal */}
      <Modal
        isOpen={!!activeJobModal}
        onClose={() => setActiveJobModal(null)}
        title={activeJobModal ? `${activeJobModal.companyName} - ${activeJobModal.title}` : ''}
        maxWidth="700px"
      >
        {activeJobModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="badge badge-applied">{activeJobModal.roleType}</span>
                <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
                  💰 {activeJobModal.salaryPackage}
                </span>
                <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
                  📍 {activeJobModal.location}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Posted by {activeJobModal.recruiterName}
              </span>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '8px' }}>
                Job Description
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {activeJobModal.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', padding: '16px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.5)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>MINIMUM CGPA</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                  {activeJobModal.minCgpa}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ELIGIBLE DEPARTMENTS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#818cf8', marginTop: '2px' }}>
                  {activeJobModal.eligibleDepartments}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>APPLICATION DEADLINE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f59e0b', marginTop: '2px' }}>
                  {activeJobModal.deadline ? new Date(activeJobModal.deadline).toLocaleDateString() : 'Rolling'}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '8px' }}>
                Required Skillsets
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {activeJobModal.requiredSkills?.map((s, idx) => (
                  <span key={idx} style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: '#a5b4fc',
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button onClick={() => setActiveJobModal(null)} className="btn btn-secondary">
                Close
              </button>
              {user?.role === 'ROLE_STUDENT' && !activeJobModal.hasApplied && (
                <button
                  disabled={!activeJobModal.eligible}
                  onClick={() => {
                    const j = activeJobModal;
                    setActiveJobModal(null);
                    setApplyingJob(j);
                  }}
                  className="btn btn-primary"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Apply Modal */}
      <Modal
        isOpen={!!applyingJob}
        onClose={() => setApplyingJob(null)}
        title={applyingJob ? `Submit Application: ${applyingJob.companyName}` : ''}
      >
        {applyingJob && (
          <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{applyingJob.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                {applyingJob.salaryPackage} • {applyingJob.location}
              </div>
            </div>

            <div>
              <label className="form-label">Cover Note / Why are you suited for this role?</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Describe your relevant skills, coding experience, projects, or why you want to join..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Resume URL (Drive, LinkedIn, or Portfolio)</label>
              <input
                className="form-input"
                type="text"
                placeholder="https://example.com/my-resume.pdf"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
              />
            </div>

            {feedback && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                backgroundColor: feedback.includes('success') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: feedback.includes('success') ? '#34d399' : '#fb7185'
              }}>
                {feedback}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setApplyingJob(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Submitting...' : 'Confirm Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default JobsList;
