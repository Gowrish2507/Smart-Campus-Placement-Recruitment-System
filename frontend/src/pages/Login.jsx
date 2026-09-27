import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Briefcase, 
  Shield, 
  Lock, 
  User, 
  Mail, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const Login = ({ onSuccess }) => {
  const { login, register, quickLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ROLE_STUDENT');

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [cgpa, setCgpa] = useState('8.5');
  const [companyName, setCompanyName] = useState('Google');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          username,
          password,
          email,
          role: selectedRole,
          fullName,
          department: selectedRole === 'ROLE_STUDENT' ? department : undefined,
          cgpa: selectedRole === 'ROLE_STUDENT' ? parseFloat(cgpa) : undefined,
          companyName: selectedRole === 'ROLE_RECRUITER' ? companyName : undefined
        });
      } else {
        await login(username, password);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleKey) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(roleKey);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Demo login failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '20px auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: '30px',
      alignItems: 'start'
    }}>
      {/* Left Column: One-Click Demo Accounts */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-interview">
            <Sparkles size={13} /> Instant Test Access
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Explore Full Stack Workflows
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.5 }}>
          Click any role below to immediately log in and test the student, recruiter, or admin recruitment processes.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          {/* Demo Student 1 */}
          <button
            onClick={() => handleQuickDemo('student_arun')}
            disabled={loading}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '14px 18px',
              textAlign: 'left',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#6366f1', color: '#fff' }}>
                <GraduationCap size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                  Student: Arun Kumar
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginTop: '2px' }}>
                  CSE • 8.85 CGPA • Has Active Offer & Interviews
                </div>
              </div>
            </div>
            <ArrowRight size={16} color="#818cf8" />
          </button>

          {/* Demo Student 2 */}
          <button
            onClick={() => handleQuickDemo('student_ananya')}
            disabled={loading}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '14px 18px',
              textAlign: 'left',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              backgroundColor: 'rgba(139, 92, 246, 0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#8b5cf6', color: '#fff' }}>
                <GraduationCap size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                  Student: Ananya Sharma
                </div>
                <div style={{ fontSize: '0.75rem', color: '#c4b5fd', marginTop: '2px' }}>
                  IT • 9.20 CGPA • Shortlisted Candidate
                </div>
              </div>
            </div>
            <ArrowRight size={16} color="#a78bfa" />
          </button>

          {/* Demo Recruiter 1 */}
          <button
            onClick={() => handleQuickDemo('recruiter_google')}
            disabled={loading}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '14px 18px',
              textAlign: 'left',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#06b6d4', color: '#fff' }}>
                <Briefcase size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                  Recruiter: Google
                </div>
                <div style={{ fontSize: '0.75rem', color: '#67e8f9', marginTop: '2px' }}>
                  Sarah Jenkins • Post Jobs, Shortlist & Schedule
                </div>
              </div>
            </div>
            <ArrowRight size={16} color="#22d3ee" />
          </button>

          {/* Demo Recruiter 2 */}
          <button
            onClick={() => handleQuickDemo('recruiter_zoho')}
            disabled={loading}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '14px 18px',
              textAlign: 'left',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f59e0b', color: '#fff' }}>
                <Briefcase size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                  Recruiter: Zoho Corporation
                </div>
                <div style={{ fontSize: '0.75rem', color: '#fde68a', marginTop: '2px' }}>
                  Priya Raman • Developer Hiring Drives
                </div>
              </div>
            </div>
            <ArrowRight size={16} color="#fbbf24" />
          </button>

          {/* Demo Admin */}
          <button
            onClick={() => handleQuickDemo('admin')}
            disabled={loading}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '14px 18px',
              textAlign: 'left',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff' }}>
                <Shield size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                  Placement Admin / Officer
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a7f3d0', marginTop: '2px' }}>
                  Campus Analytics, Drive Monitoring & Reports
                </div>
              </div>
            </div>
            <ArrowRight size={16} color="#34d399" />
          </button>
        </div>
      </div>

      {/* Right Column: Custom Login / Register Form */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
            {isRegister ? 'Create Your Account' : 'Sign In with Credentials'}
          </h2>
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#818cf8',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isRegister ? 'Already have an account? Sign In' : 'New here? Register'}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <div>
              <label className="form-label">I am registering as</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRole('ROLE_STUDENT')}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedRole === 'ROLE_STUDENT' ? '#6366f1' : 'var(--border-subtle)'}`,
                    backgroundColor: selectedRole === 'ROLE_STUDENT' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: selectedRole === 'ROLE_STUDENT' ? '#818cf8' : '#94a3b8',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('ROLE_RECRUITER')}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedRole === 'ROLE_RECRUITER' ? '#f59e0b' : 'var(--border-subtle)'}`,
                    backgroundColor: selectedRole === 'ROLE_RECRUITER' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: selectedRole === 'ROLE_RECRUITER' ? '#f59e0b' : '#94a3b8',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  💼 Corporate Recruiter
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Rahul Verma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '38px' }}
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  type="email"
                  placeholder="name@campus.edu or name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {isRegister && selectedRole === 'ROLE_STUDENT' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                </select>
              </div>
              <div>
                <label className="form-label">Current CGPA</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                />
              </div>
            </div>
          )}

          {isRegister && selectedRole === 'ROLE_RECRUITER' && (
            <div>
              <label className="form-label">Company Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Google, Microsoft, Adobe..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '38px' }}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Complete Registration' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
