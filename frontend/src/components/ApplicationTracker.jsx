import React, { useEffect } from 'react';
import { CheckCircle2, Clock, Calendar, Award, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

const STEPS = [
  { key: 'APPLIED', label: 'Applied', icon: FileText, desc: 'Application submitted successfully' },
  { key: 'SHORTLISTED', label: 'Shortlisted', icon: CheckCircle2, desc: 'Profile reviewed & shortlisted' },
  { key: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', icon: Calendar, desc: 'Interview round lined up' },
  { key: 'SELECTED', label: 'Offer Received', icon: Award, desc: 'Congratulations! Selection confirmed' }
];

const ApplicationTracker = ({ status, appliedAt, recruiterNotes, interviews = [] }) => {
  const isRejected = status === 'REJECTED';
  const isSelected = status === 'SELECTED';

  useEffect(() => {
    if (isSelected) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if confetti fails
      }
    }
  }, [isSelected]);

  const getStepIndex = (st) => {
    switch (st) {
      case 'APPLIED': return 0;
      case 'SHORTLISTED': return 1;
      case 'INTERVIEW_SCHEDULED': return 2;
      case 'SELECTED': return 3;
      case 'REJECTED': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div style={{ marginTop: '16px' }}>
      {/* Stepper Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        margin: '24px 0 32px 0'
      }}>
        {/* Background Track Line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '30px',
          right: '30px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0
        }} />

        {/* Active Fill Line */}
        {!isRejected && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            width: `${Math.min(100, (currentIndex / (STEPS.length - 1)) * 100)}%`,
            maxWidth: 'calc(100% - 60px)',
            height: '4px',
            backgroundColor: isSelected ? '#10b981' : '#6366f1',
            boxShadow: isSelected ? '0 0 12px rgba(16, 185, 129, 0.7)' : '0 0 12px rgba(99, 102, 241, 0.7)',
            transition: 'width 0.4s ease',
            zIndex: 1
          }} />
        )}

        {/* Steps */}
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = !isRejected && idx <= currentIndex;
          const isCurrent = !isRejected && idx === currentIndex;

          return (
            <div 
              key={step.key} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
                flex: 1
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDone
                  ? (isSelected && idx === 3 ? '#10b981' : '#6366f1')
                  : '#1e293b',
                border: isCurrent
                  ? `3px solid ${isSelected ? '#34d399' : '#818cf8'}`
                  : '2px solid rgba(255, 255, 255, 0.15)',
                color: isDone ? '#ffffff' : '#64748b',
                boxShadow: isCurrent ? '0 0 20px rgba(99, 102, 241, 0.5)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                <Icon size={20} />
              </div>
              <span style={{
                marginTop: '10px',
                fontSize: '0.8rem',
                fontWeight: isCurrent ? 700 : 500,
                color: isDone ? '#f8fafc' : '#64748b',
                textAlign: 'center'
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rejection Alert */}
      {isRejected && (
        <div style={{
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fb7185',
          marginBottom: '16px'
        }}>
          <AlertCircle size={22} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Application Not Selected</div>
            <div style={{ fontSize: '0.8rem', color: '#fda4af', marginTop: '2px' }}>
              {recruiterNotes || "Thank you for participating. We encourage you to apply for future opportunities."}
            </div>
          </div>
        </div>
      )}

      {/* Selection Celebration Banner */}
      {isSelected && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: '#34d399',
          marginBottom: '16px'
        }}>
          <Award size={26} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Congratulations! You have received an Offer!</div>
            <div style={{ fontSize: '0.825rem', color: '#a7f3d0', marginTop: '2px' }}>
              {recruiterNotes || "Your offer letter details will be coordinated through the Campus Placement Cell."}
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Notes */}
      {recruiterNotes && !isRejected && !isSelected && (
        <div style={{
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '16px',
          fontSize: '0.85rem'
        }}>
          <span style={{ color: '#818cf8', fontWeight: 600 }}>Recruiter Note: </span>
          <span style={{ color: '#cbd5e1' }}>{recruiterNotes}</span>
        </div>
      )}

      {/* Interview Rounds Detail */}
      {interviews && interviews.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8', marginBottom: '10px' }}>
            Interview Rounds
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {interviews.map((intv) => (
              <div 
                key={intv.id}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{intv.roundName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', display: 'flex', gap: '12px' }}>
                    <span>📅 {new Date(intv.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    <span>📍 {intv.location || intv.interviewMode}</span>
                  </div>
                  {intv.feedback && (
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px' }}>
                      <span style={{ color: '#818cf8' }}>Feedback:</span> {intv.feedback} (Score: {intv.score}/10)
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${
                    intv.status === 'PASSED' ? 'badge-selected' :
                    intv.status === 'FAILED' ? 'badge-rejected' : 'badge-interview'
                  }`}>
                    {intv.status}
                  </span>

                  {intv.meetingLink && intv.status === 'SCHEDULED' && (
                    <a
                      href={intv.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Join Meeting <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
