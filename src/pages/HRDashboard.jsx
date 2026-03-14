import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  X, 
  FileText, 
  BrainCircuit, 
  Loader2, 
  Download,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useData, API_URL } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function HRDashboard() {
  const { jobs, applications, addJob, deleteApplication, deleteJob } = useData();
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [newJob, setNewJob] = useState({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: '' });

  const handleCreateJob = (e) => {
    e.preventDefault();
    addJob({
      ...newJob,
      requirements: newJob.requirements.split('\n').map(r => r.trim()).filter(Boolean)
    });
    setIsModalOpen(false);
    setNewJob({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: '' });
  };

  const handleAnalyze = async (app) => {
    const job = jobs.find(j => j.id === app.jobId);
    if (!job) return;

    setAnalyzingId(app.id);
    try {
      const response = await fetch(`${API_URL}/analyze-cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('arketic_token')}`
        },
        body: JSON.stringify({
          application_id: app.id,
          job_title: job.title,
          job_description: job.description,
          requirements: job.requirements,
          candidate_name: app.candidateName,
          candidate_skills: app.skills,
          cv_content: app.cvContent || `Full Name: ${app.candidateName}\nSkills: ${app.skills.join(', ')}`
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state (in a real app, this would be persisted to the backend)
        app.aiScore = result.score;
        app.aiAnalysis = result;
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzingId(null);
    }
  };

  const reviewedApps = applications.filter(a => a.status === 'reviewed');
  const avgMatch = reviewedApps.length > 0 
    ? Math.round(reviewedApps.reduce((acc, curr) => acc + (curr.aiScore || 0), 0) / reviewedApps.length)
    : 0;

  const stats = [
    { label: 'Total Postings', value: jobs.length, icon: FileText, color: 'var(--primary)' },
    { label: 'Total Applications', value: applications.length, icon: Users, color: 'var(--secondary)' },
    { label: 'Reviewed via AI', value: reviewedApps.length, icon: CheckCircle, color: 'var(--success)' },
    { label: 'Avg AI Match', value: `${avgMatch}%`, icon: Briefcase, color: 'var(--warning)' }, // Changed icon from TrendingUp to Briefcase
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>HR <span className="text-gradient">Dashboard</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your AI-powered recruitment pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel flex flex-col items-center justify-center p-6 text-center">
            <stat.icon size={32} color={stat.color} style={{ marginBottom: '16px' }} />
            <span style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, marginBottom: '8px' }}>{stat.value}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Job Postings Admin View */}
      <div>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.8rem' }}>Active Postings</h2>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '8px 16px' }}>+ New Posting</button>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Job Title</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Department</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Applicants</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const appsCount = applications.filter(a => a.jobId === job.id).length;
                return (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-[rgba(255,255,255,0.01)]">
                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{job.title}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{job.department}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {appsCount}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center gap-3">
                        <Link to={`/hr/job/${job.id}/applications`}>
                          <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                            Review
                          </button>
                        </Link>
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this job posting? This will also PERMANENTLY remove all associated applications.')) {
                              await deleteJob(job.id, token);
                            }
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            color: '#ef4444',
                            padding: '6px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                          title="Delete Job Posting"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Recent Applications */}
      <div>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.8rem' }}>Recent Submissions</h2>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Candidate</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Applied Job</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>CV</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>AI Score</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0).reverse().map((app) => {
                const jobTitle = jobs.find(j => j.id === app.jobId)?.title || 'Unknown Job';
                return (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-[rgba(255,255,255,0.01)]">
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600 }}>{app.candidateName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.email}</div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{jobTitle}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        background: app.status === 'reviewed' ? 'var(--success-glow)' : 'rgba(255,255,255,0.05)', 
                        color: app.status === 'reviewed' ? 'var(--success)' : 'var(--text-muted)', 
                        padding: '4px 12px', 
                        borderRadius: '99px', 
                        fontSize: '0.8rem', 
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {app.status || 'pending'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div 
                        className="flex items-center gap-2" 
                        style={{ 
                          color: 'var(--primary)', 
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onClick={() => {
                          if (app.cvFileUrl) {
                            window.open(app.cvFileUrl, '_blank');
                          } else {
                            setSelectedCV(app);
                          }
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <FileText size={14} />
                        <span style={{ 
                          maxWidth: '120px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                          textDecoration: 'underline'
                        }}>
                          {app.cvFileUrl ? 'Original CV' : (app.cvContent || 'CV.pdf')}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center gap-3">
                        <span style={{ fontWeight: 700, color: 'var(--primary)', minWidth: '40px' }}>
                          {app.aiScore ? `${app.aiScore}%` : '-'}
                        </span>
                        {!app.aiScore && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAnalyze(app);
                            }}
                            disabled={analyzingId === app.id}
                            style={{
                              background: 'var(--primary)',
                              border: 'none',
                              color: 'black',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: analyzingId === app.id ? 'wait' : 'pointer',
                              boxShadow: '0 4px 12px var(--primary-glow)'
                            }}
                          >
                            {analyzingId === app.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <>
                                <BrainCircuit size={14} />
                                AI REVIEW
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this application?')) {
                              await deleteApplication(app.id, token);
                            }
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            color: '#ef4444',
                            padding: '6px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                          title="Delete Application"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No applications received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Job Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Create New Job Posting</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateJob} className="flex flex-col gap-4">
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label">Job Title</label>
                <input className="form-input" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Senior Product Designer" />
              </div>
              <div className="flex gap-4">
                <div className="form-group flex-1" style={{ marginBottom: '8px' }}>
                  <label className="form-label">Department</label>
                  <input className="form-input" required value={newJob.department} onChange={e => setNewJob({...newJob, department: e.target.value})} placeholder="e.g. Design" />
                </div>
                <div className="form-group flex-1" style={{ marginBottom: '8px' }}>
                  <label className="form-label">Location</label>
                  <input className="form-input" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. Remote" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" required rows={4} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} placeholder="Describe the role..." style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label">Requirements (one per line)</label>
                <textarea className="form-input" required rows={4} value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} placeholder="- 5+ years experience\n- Figma expert" style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>Publish Job</button>
            </form>
          </div>
        </div>
      )}
      {/* CV Preview Modal */}
      {selectedCV && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#121212',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'var(--primary-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>CV Preview</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>File: {selectedCV.email}_CV.pdf</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCV(null)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '40px', overflowY: 'auto' }}>
              <div style={{ 
                background: 'white', 
                color: '#1a1a1a', 
                padding: '60px', 
                borderRadius: '4px',
                minHeight: '800px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                fontFamily: '"Inter", sans-serif'
              }}>
                <div style={{ borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 10px 0', color: '#111' }}>{selectedCV.candidateName}</h1>
                  <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '0.9rem' }}>
                    <span className="flex items-center gap-1"><Mail size={14} /> {selectedCV.email}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {selectedCV.phone}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', color: '#333', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>CV Content / Experience</h2>
                  <div style={{ lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>
                    {selectedCV.cvContent}
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', color: '#333', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Skills & Expertise</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedCV.skills.map((skill, i) => (
                      <span key={i} style={{ 
                        background: '#f0f0f0', 
                        color: '#333', 
                        padding: '4px 12px', 
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ 
                  marginTop: '40px', 
                  padding: '20px', 
                  background: '#f9f9f9', 
                  borderRadius: '8px', 
                  border: '1px solid #eee',
                  fontSize: '0.9rem',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  This CV was generated based on the candidate's submission via arketic.ai platform.
                </div>
              </div>
            </div>

            <div style={{
              padding: '20px 40px',
              borderTop: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
                {selectedCV.cvFileUrl && (
                  <a 
                    href={selectedCV.cvFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 24px',
                      borderRadius: '12px',
                      background: 'var(--primary)',
                      border: 'none',
                      color: 'black',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <Download size={18} /> View Original File
                  </a>
                )}
                <button 
                  onClick={() => setSelectedCV(null)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
