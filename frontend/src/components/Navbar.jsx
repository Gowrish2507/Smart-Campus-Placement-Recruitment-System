import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Briefcase, UserCheck, Shield, LogOut, ChevronDown, User, Sparkles } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout, quickLogin } = useAuth();
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_STUDENT':
        return <span className="badge badge-interview"><GraduationCap size={14} /> Student</span>;
      case 'ROLE_RECRUITER':
        return <span className="badge badge-shortlisted"><Briefcase size={14} /> Recruiter</span>;
      case 'ROLE_ADMIN':
        return <span className="badge badge-selected"><Shield size={14} /> Placement Admin</span>;
      default:
        return null;
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)'
          }}>
            <GraduationCap size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Campus<span style={{ color: '#818cf8' }}>Recruit</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em' }}>
              SMART PLACEMENT SYSTEM
            </div>
          </div>
        </div>

        {/* Center / Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Quick Demo Role Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="btn btn-secondary btn-sm"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                fontWeight: 600
              }}
            >
              <Sparkles size={14} color="#818cf8" />
              <span>Switch Demo Role</span>
              <ChevronDown size={14} />
            </button>

            {demoMenuOpen && (
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '260px',
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 30px rgba(0, 0, 0, 0.6)',
                  borderRadius: '12px',
                  padding: '8px',
                  zIndex: 200
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                  EXPERIENCE AS:
                </div>
                
                <button
                  onClick={() => { quickLogin('student_arun'); setDemoMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <GraduationCap size={16} color="#6366f1" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Arun (Student - CSE)</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>8.85 CGPA • Applied / Offer</div>
                  </div>
                </button>

                <button
                  onClick={() => { quickLogin('student_ananya'); setDemoMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <GraduationCap size={16} color="#8b5cf6" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Ananya (Student - IT)</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>9.20 CGPA • AI & Cloud</div>
                  </div>
                </button>

                <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

                <button
                  onClick={() => { quickLogin('recruiter_google'); setDemoMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Briefcase size={16} color="#06b6d4" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Google Recruiter</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Sarah Jenkins • SDE Jobs</div>
                  </div>
                </button>

                <button
                  onClick={() => { quickLogin('recruiter_zoho'); setDemoMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Briefcase size={16} color="#f59e0b" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Zoho Recruiter</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Priya Raman • Dev Roles</div>
                  </div>
                </button>

                <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

                <button
                  onClick={() => { quickLogin('admin'); setDemoMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Shield size={16} color="#10b981" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Placement Admin</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Campus Overall Analytics</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Info & Role */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
                  {user.fullName || user.username}
                </span>
                <div style={{ marginTop: '2px' }}>
                  {getRoleBadge(user.role)}
                </div>
              </div>

              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setActiveTab('login')} 
              className="btn btn-primary btn-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
