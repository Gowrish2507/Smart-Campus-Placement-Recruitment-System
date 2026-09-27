import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import JobsList from './pages/JobsList';
import StudentApplications from './pages/StudentApplications';
import StudentProfile from './pages/StudentProfile';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterJobs from './pages/RecruiterJobs';
import RecruiterApplicants from './pages/RecruiterApplicants';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const MainLayout = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJobForReview, setSelectedJobForReview] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'ROLE_STUDENT') {
        setActiveTab('dashboard');
      } else if (user.role === 'ROLE_RECRUITER') {
        setActiveTab('recruiter-dashboard');
      } else if (user.role === 'ROLE_ADMIN') {
        setActiveTab('admin-dashboard');
      }
    } else {
      setActiveTab('login');
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Starting Placement System...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const renderContent = () => {
    if (!user) {
      return <Login onSuccess={() => {}} />;
    }

    switch (activeTab) {
      // Student Tabs
      case 'dashboard':
        return <StudentDashboard setActiveTab={setActiveTab} />;
      case 'jobs':
        return <JobsList />;
      case 'applications':
        return <StudentApplications />;
      case 'profile':
        return <StudentProfile />;

      // Recruiter Tabs
      case 'recruiter-dashboard':
        return <RecruiterDashboard setActiveTab={setActiveTab} />;
      case 'recruiter-jobs':
        return <RecruiterJobs setActiveTab={setActiveTab} setSelectedJobForReview={setSelectedJobForReview} />;
      case 'recruiter-applicants':
        return <RecruiterApplicants preselectedJobId={selectedJobForReview} />;

      // Admin & Analytics Tabs
      case 'admin-dashboard':
      case 'analytics':
      case 'students-directory':
        return <AdminDashboard />;

      default:
        return <StudentDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ display: 'flex', flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        {user && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
        
        <main style={{ flex: 1, padding: '28px 32px', minWidth: 0 }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
