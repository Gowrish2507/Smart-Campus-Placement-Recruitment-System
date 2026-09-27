import React, { useState, useEffect } from 'react';
import { jobsAPI } from '../services/api';
import { 
  Briefcase, 
  PlusCircle, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Users, 
  Clock,
  Layers
} from 'lucide-react';
import Modal from '../components/Modal';

const RecruiterJobs = ({ setActiveTab, setSelectedJobForReview }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Job Form State
  const [formData, setFormData] = useState({
    title: '',
    roleType: 'Full-Time',
    location: 'Bengaluru, India',
    salaryPackage: '12 LPA',
    minCgpa: 7.0,
    eligibleDepartments: 'CSE,IT,ECE',
    deadline: '',
    description: '',
    skillInput: 'Java, Spring Boot, React.js'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobsAPI.getRecruiterJobs();
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to load recruiter jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const skills = formData.skillInput.split(',').map(s => s.trim()).filter(Boolean);
      await jobsAPI.create({
        ...formData,
        skillNames: skills
      });
      setIsCreateModalOpen(false);
      // Reset form
      setFormData({
        title: '',
        roleType: 'Full-Time',
        location: 'Bengaluru, India',
        salaryPackage: '12 LPA',
        minCgpa: 7.0,
        eligibleDepartments: 'CSE,IT,ECE',
        deadline: '',
        description: '',
        skillInput: 'Java, Spring Boot, React.js'
      });
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create job posting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await jobsAPI.updateStatus(jobId, newStatus);
      fetchJobs();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Post Button */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              Manage Campus Recruitment Drives
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              Create targeted job postings and define academic eligibility thresholds
            </p>
          </div>

          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
            <PlusCircle size={16} /> Post New Job Drive
          </button>
        </div>
      </div>

      {/* Postings List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          Loading your job postings...
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <Briefcase size={44} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>No Postings Created Yet</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
            Click "Post New Job Drive" to open recruitment for students.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                      {job.title}
                    </h3>
                    <span className={`badge ${job.status === 'OPEN' ? 'badge-selected' : 'badge-rejected'}`}>
                      {job.status}
                    </span>
                    <span className="badge badge-applied">{job.roleType}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={15} color="#64748b" /> {job.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34d399', fontWeight: 600 }}>
                      <DollarSign size={15} /> {job.salaryPackage}
                    </span>
                    <span>
                      🎯 Min CGPA: <strong style={{ color: '#f8fafc' }}>{job.minCgpa}</strong>
                    </span>
                    <span>
                      🏛️ Depts: <strong style={{ color: '#818cf8' }}>{job.eligibleDepartments}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => {
                      if (setSelectedJobForReview) setSelectedJobForReview(job.id);
                      setActiveTab('recruiter-applicants');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Users size={14} /> Review Applicants ({job.applicantsCount || 0})
                  </button>

                  <button
                    onClick={() => handleToggleStatus(job.id, job.status)}
                    className="btn btn-secondary btn-sm"
                  >
                    {job.status === 'OPEN' ? 'Close Drive' : 'Reopen Drive'}
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {job.description}
              </p>

              {/* Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {job.requiredSkills?.map((skill, idx) => (
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
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post New Job Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Campus Recruitment Drive"
        maxWidth="650px"
      >
        <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Job Title / Designation</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Software Engineer (Campus Graduate)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Role Type</label>
              <select
                className="form-select"
                value={formData.roleType}
                onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship (6 Months)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Compensation / Package</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. 14 LPA or 45,000 / month"
                value={formData.salaryPackage}
                onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Work Location</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Bengaluru, Hyderabad, or Hybrid"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Application Deadline</label>
              <input
                className="form-input"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          {/* Academic Eligibility Controls */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '12px' }}>
              Academic Eligibility Thresholds
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="form-label">Minimum CGPA Required</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.minCgpa}
                  onChange={(e) => setFormData({ ...formData, minCgpa: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Allowed Departments</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="CSE,IT,ECE or ALL"
                  value={formData.eligibleDepartments}
                  onChange={(e) => setFormData({ ...formData, eligibleDepartments: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Required Skills (Comma separated)</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Java, Spring Boot, React.js, SQL, Docker"
              value={formData.skillInput}
              onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Job Description & Responsibilities</label>
            <textarea
              className="form-textarea"
              rows="4"
              placeholder="Outline the role expectations, key duties, and qualifications..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Publishing...' : 'Publish Job Drive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruiterJobs;
