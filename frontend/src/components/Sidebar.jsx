import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar, 
  User, 
  PlusCircle, 
  Users, 
  BarChart3, 
  Building2 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  let menuItems = [];

  if (role === 'ROLE_STUDENT') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'jobs', label: 'Eligible Jobs', icon: Briefcase },
      { id: 'applications', label: 'My Applications', icon: FileText },
      { id: 'profile', label: 'My Profile & Skills', icon: User },
    ];
  } else if (role === 'ROLE_RECRUITER') {
    menuItems = [
      { id: 'recruiter-dashboard', label: 'Recruiter Hub', icon: LayoutDashboard },
      { id: 'recruiter-jobs', label: 'Manage Jobs & Post', icon: Briefcase },
      { id: 'recruiter-applicants', label: 'Review Applicants', icon: Users },
      { id: 'analytics', label: 'Campus Insights', icon: BarChart3 }
    ];
  } else if (role === 'ROLE_ADMIN') {
    menuItems = [
      { id: 'admin-dashboard', label: 'Placement Analytics', icon: BarChart3 },
      { id: 'jobs', label: 'All Job Postings', icon: Briefcase },
      { id: 'recruiter-applicants', label: 'Applications Master', icon: FileText },
      { id: 'students-directory', label: 'Students Directory', icon: Users },
    ];
  }

  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      borderRight: '1px solid var(--border-subtle)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        padding: '0 12px 12px 12px',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Navigation
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)' 
                : 'transparent',
              color: isActive ? '#ffffff' : '#94a3b8',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#f8fafc';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            <Icon size={18} color={isActive ? '#818cf8' : '#94a3b8'} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Campus Info Widget in Sidebar */}
      <div style={{ marginTop: 'auto', padding: '16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: 600, fontSize: '0.8rem' }}>
          <Building2 size={16} /> Placement Season 2025-26
        </div>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
          Over 45+ companies scheduled this month. Ensure your profile and resume are up-to-date.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
