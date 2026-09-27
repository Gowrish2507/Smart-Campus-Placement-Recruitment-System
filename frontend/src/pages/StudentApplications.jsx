import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';
import { 
  FileText, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Award,
  Sparkles
} from 'lucide-react';
import ApplicationTracker from '../components/ApplicationTracker';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationAPI.getMyApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              My Applications & Recruitment Pipeline
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              Track each stage of your application from initial review to interviews and offers
            </p>
          </div>

          {/* Status Filter Tabs */}
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
      </div>

      {/* Applications List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          Loading your applications...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <FileText size={44} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>No Applications Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
            {filterStatus === 'ALL' 
              ? "You haven't applied to any jobs yet. Check the 'Eligible Jobs' tab to find open drives!"
              : `No applications with status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map((app) => (
            <div 
              key={app.id} 
              className="glass-panel"
              style={{
                padding: '24px',
                border: app.status === 'SELECTED' 
                  ? '1px solid rgba(16, 185, 129, 0.4)' 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: app.status === 'SELECTED' ? '0 10px 30px rgba(16, 185, 129, 0.15)' : 'none'
              }}
            >
              {/* Top Row: Company Info & Status Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '6px'
                  }}>
                    {app.companyLogo ? (
                      <img src={app.companyLogo} alt={app.companyName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <Building2 size={24} color="#818cf8" />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                      {app.companyName}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                      {app.jobTitle}
                    </h3>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      <span>📍 {app.jobLocation}</span>
                      <span style={{ color: '#34d399', fontWeight: 600 }}>💰 {app.jobSalary}</span>
                      <span>📅 Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${
                    app.status === 'SELECTED' ? 'badge-selected' :
                    app.status === 'INTERVIEW_SCHEDULED' ? 'badge-interview' :
                    app.status === 'SHORTLISTED' ? 'badge-shortlisted' :
                    app.status === 'REJECTED' ? 'badge-rejected' : 'badge-applied'
                  }`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Cover Note */}
              {app.coverNote && (
                <div style={{
                  margin: '16px 0',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  fontSize: '0.825rem',
                  color: '#cbd5e1'
                }}>
                  <strong style={{ color: '#94a3b8' }}>My Cover Note:</strong> {app.coverNote}
                </div>
              )}

              {/* Recruitment Workflow Stepper */}
              <ApplicationTracker 
                status={app.status}
                appliedAt={app.appliedAt}
                recruiterNotes={app.recruiterNotes}
                interviews={app.interviews}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
