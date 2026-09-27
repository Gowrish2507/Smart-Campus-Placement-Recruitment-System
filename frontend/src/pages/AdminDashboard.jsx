import React, { useState, useEffect } from 'react';
import { analyticsAPI, studentAPI, jobsAPI } from '../services/api';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Briefcase, 
  Award, 
  TrendingUp, 
  GraduationCap, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, studentsRes] = await Promise.all([
        analyticsAPI.getDashboardStats().catch(() => ({ data: null })),
        studentAPI.getAllStudents().catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setStudents(studentsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading campus analytics...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
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
            <span className="badge badge-selected">
              <Award size={12} /> Campus Placement Cell
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Academic Year 2025-26</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Campus Recruitment Executive Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
            Holistic visibility over corporate drives, student eligibility, interview funnels, and final offers.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CAMPUS PLACEMENT RATE</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', letterSpacing: '-0.03em' }}>
            {stats?.placementRate || '78.5'}%
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>REGISTERED STUDENTS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
                {stats?.totalStudents || students.length}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <GraduationCap size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Final & pre-final year candidates
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>PARTNER COMPANIES</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {stats?.totalCompanies || 5}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Building2 size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Google, Microsoft, Amazon, Zoho, TCS
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>OFFERS EXTENDED</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {stats?.totalSelected || 3}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Award size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Highest Package: <strong style={{ color: '#34d399' }}>{stats?.highestSalary || '24.5 LPA'}</strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>AVERAGE CTC</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
                {stats?.averageSalary || '14.2 LPA'}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
            Across all engineering departments
          </div>
        </div>
      </div>

      {/* Recruitment Funnel Visualizer */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
          Campus Recruitment Pipeline Funnel
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>1. Applied</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#cbd5e1', marginTop: '4px' }}>
              {stats?.totalApplications || 5}
            </div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>2. Shortlisted</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
              {stats?.totalShortlisted || 2}
            </div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#818cf8' }}>3. Interviews Conducted</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
              {stats?.totalInterviews || 3}
            </div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#34d399' }}>4. Offers Extended</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              {stats?.totalSelected || 2}
            </div>
          </div>
        </div>
      </div>

      {/* Registered Students Directory */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
          Registered Students Master Directory
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 14px' }}>Roll Number</th>
                <th style={{ padding: '12px 14px' }}>Student Name</th>
                <th style={{ padding: '12px 14px' }}>Department</th>
                <th style={{ padding: '12px 14px' }}>CGPA</th>
                <th style={{ padding: '12px 14px' }}>Batch</th>
                <th style={{ padding: '12px 14px' }}>Email</th>
                <th style={{ padding: '12px 14px' }}>Resume</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr 
                  key={stu.id}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#818cf8' }}>
                    {stu.rollNumber}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#f8fafc' }}>
                    {stu.fullName}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="badge badge-applied">{stu.department}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#34d399' }}>
                    {stu.cgpa ? stu.cgpa.toFixed(2) : 'N/A'}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                    {stu.graduationYear}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                    {stu.email}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {stu.resumeUrl ? (
                      <a
                        href={stu.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                      >
                        Resume <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span style={{ color: '#64748b' }}>None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
