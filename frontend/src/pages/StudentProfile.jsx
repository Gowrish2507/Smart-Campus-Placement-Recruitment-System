import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { 
  User, 
  GraduationCap, 
  FileText, 
  Plus, 
  Trash2, 
  Github, 
  Linkedin, 
  Save, 
  Check, 
  Code2, 
  BookOpen 
} from 'lucide-react';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Add Skill Inputs
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await studentAPI.getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await studentAPI.updateProfile(profile);
      setProfile(res.data);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      const res = await studentAPI.addSkill({
        name: newSkillName.trim(),
        proficiency: newSkillProficiency
      });
      setProfile(res.data);
      setNewSkillName('');
    } catch (err) {
      console.error('Failed to add skill', err);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      const res = await studentAPI.removeSkill(skillId);
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to remove skill', err);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading profile...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              Student Profile & Skill Inventory
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              Your profile is matched by automated eligibility filters for campus placement drives
            </p>
          </div>

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <Check size={16} /> {successMsg}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Main Details Form */}
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#818cf8" /> Academic & Personal Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                value={profile?.fullName || ''}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Roll Number</label>
              <input
                className="form-input"
                type="text"
                value={profile?.rollNumber || ''}
                disabled
                style={{ opacity: 0.7 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={profile?.department || 'CSE'}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
            <div>
              <label className="form-label">Current CGPA</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={profile?.cgpa || ''}
                onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="form-label">Graduation Year</label>
              <input
                className="form-input"
                type="number"
                value={profile?.graduationYear || 2025}
                onChange={(e) => setProfile({ ...profile, graduationYear: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                type="text"
                value={profile?.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="form-label">Resume Link (PDF URL / Google Drive)</label>
              <input
                className="form-input"
                type="url"
                value={profile?.resumeUrl || ''}
                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          <div>
            <label className="form-label">Professional Summary / Bio</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={profile?.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Brief summary of your technical interests and aspirations..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">GitHub Profile</label>
              <div style={{ position: 'relative' }}>
                <Github size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  type="url"
                  value={profile?.githubUrl || ''}
                  onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div>
              <label className="form-label">LinkedIn Profile</label>
              <div style={{ position: 'relative' }}>
                <Linkedin size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  type="url"
                  value={profile?.linkedinUrl || ''}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Key Projects (Listed for Recruiters)</label>
            <textarea
              className="form-textarea"
              rows="4"
              value={profile?.projects || ''}
              onChange={(e) => setProfile({ ...profile, projects: e.target.value })}
              placeholder="1. E-Commerce Microservice using Spring Boot&#10;2. Distributed Cache with Redis"
            />
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>

        {/* Skills & Badges Manager */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Add Skill Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Code2 size={18} color="#818cf8" /> Add Technical Skill
            </h3>

            <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Skill Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Docker, Kubernetes, React, Python..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Proficiency Level</label>
                <select
                  className="form-select"
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <button type="submit" className="btn btn-secondary" style={{ marginTop: '4px' }}>
                <Plus size={16} /> Add Skill to Profile
              </button>
            </form>
          </div>

          {/* Current Skills List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                My Skills ({profile?.skills?.length || 0})
              </h3>
            </div>

            {profile?.skills && profile.skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {profile.skills.map((s) => (
                  <div
                    key={s.skillId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{s.name}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: s.proficiency === 'Advanced' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      color: s.proficiency === 'Advanced' ? '#34d399' : '#818cf8'
                    }}>
                      {s.proficiency}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s.skillId)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#fb7185'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No skills added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
