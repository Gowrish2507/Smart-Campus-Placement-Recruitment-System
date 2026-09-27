import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, interviewAPI } from '../services/api';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Award, 
  Building2, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

const RecruiterDashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiterData();
  }, [user]);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const [jobsRes, intvRes] = await Promise.all([
        jobsAPI.getRecruiterJobs().catch(() => ({ data: [] })),
        interviewAPI.getRecruiterInterviews().catch(() => ({ data: [] }))
      ]);
      setJobs(jobsRes.data || []);
      setInterviews(intvRes.data || []);
    } catch (err) {
      console.error('Failed to load recruiter data', err);
    } finally {
      setLoading(false);
    }
  };

  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantsCount || 0), 0);
  const activePostings = jobs.filter(j => j.status === 'OPEN').length;

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading recruiter hub...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Recruiter Welcome Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-shortlisted">
              <Building2 size={12} /> {user?.companyName || 'Corporate Partner'}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Recruiter Portal</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Hello, {user?.fullName || 'Recruiter'}! 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
            Manage job postings, review eligible student profiles, and coordinate interviews.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('recruiter-jobs')} className="btn btn-primary">
            <PlusCircle size={16} /> Post New Job
          </button>
          <button onClick={() => setActiveTab('recruiter-applicants')} className="btn btn-secondary">
            <Users size={16} /> Review Applicants
          </button>
        </div>
      </div>

      {/* Recruiter Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>ACTIVE JOB DRIVES</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
                {activePostings}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Briefcase size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            {jobs.length} total postings created
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL APPLICANTS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {totalApplicants}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Users size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Candidate profiles in review pipeline
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>SCHEDULED INTERVIEWS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
                {interviews.length}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              <Calendar size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Technical and HR evaluations
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>SELECTIONS COMPLETED</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {interviews.filter(i => i.status === 'PASSED').length}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Award size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Offers extended to students
          </div>
        </div>
      </div>

      {/* Recruiter Active Postings */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              Your Active Campus Job Postings
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
              Track candidate submissions and shortlisting for each opening
            </p>
          </div>
          <button onClick={() => setActiveTab('recruiter-jobs')} className="btn btn-secondary btn-sm">
            Manage All Postings <ArrowRight size={14} />
          </button>
        </div>

        {jobs.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '30px' }}>
            No job postings created yet. Click "Post New Job" to begin hiring.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {jobs.map((job) => (
              <div
                key={job.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{job.title}</h4>
                    <span className={`badge ${job.status === 'OPEN' ? 'badge-selected' : 'badge-rejected'}`}>
                      {job.status}
                    </span>
                    <span className="badge badge-applied">{job.roleType}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
                    <span>💰 {job.salaryPackage}</span>
                    <span>📍 {job.location}</span>
                    <span>🎯 Min CGPA: {job.minCgpa}</span>
                    <span>👥 Depts: {job.eligibleDepartments}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8' }}>
                      {job.applicantsCount || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Applicants</div>
                  </div>

                  <button
                    onClick={() => setActiveTab('recruiter-applicants')}
                    className="btn btn-primary btn-sm"
                  >
                    View Applicants
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
