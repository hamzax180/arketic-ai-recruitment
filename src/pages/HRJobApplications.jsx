import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, CheckCircle, Clock, Search, FileText, Briefcase, X, Mail, Phone, Download, Trash2 } from 'lucide-react';
import { useData, API_URL } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function HRJobApplications() {
  const { id } = useParams();
  const { jobs, applications, updateApplicationAI, deleteApplication } = useData();
  const { token } = useAuth();
  const job = jobs.find(j => j.id === id);
  const jobApplications = applications.filter(a => a.jobId === id);

  const [analyzingId, setAnalyzingId] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);

  if (!job) return <div>Job not found</div>;

  const handleAnalyzeCV = async (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    setAnalyzingId(appId);
    
    try {
      const response = await fetch(`${API_URL}/analyze-cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          application_id: appId,
          job_title: job.title,
          job_description: job.description,
          requirements: job.requirements,
          candidate_name: app.candidateName,
          candidate_skills: app.skills || [],
          cv_content: app.cvContent || `Full Name: ${app.candidateName}\nSkills: ${(app.skills || []).join(', ')}`
        }),
      });

      if (!response.ok) throw new Error('Backend failed');
      
      const result = await response.json();
      
      updateApplicationAI(appId, result.score, {
        summary: result.summary,
        pros: result.pros,
        cons: result.cons,
        keywordsMatched: result.matched_keywords
      });
    } catch (error) {
      console.error('AI Analysis Error:', error);
      alert('Failed to connect to AI backend. Make sure the Python server is running.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const getScoreColor = (score) => {
    if (!score) return 'var(--text-muted)';
    if (score >= 85) return 'var(--success)';
    if (score >= 70) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/hr" className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Applicants <span className="text-gradient">for {job.title}</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>{jobApplications.length} candidates applied to this position.</p>
          </div>
        </div>
      </div>

      {jobApplications.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center p-12 text-center" style={{ borderStyle: 'dashed' }}>
          <Search size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>No applicants yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Share the job link to attract candidates.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {jobApplications.map(app => (
            <div key={app.id} className="glass-panel animate-fade-in" style={{ padding: '24px', overflow: 'hidden', position: 'relative' }}>
              
              {/* Header Info */}
              <div className="flex justify-between items-start" style={{ marginBottom: '1.5rem' }}>
                <div className="flex gap-4 items-center">
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 600 }}>
                    {app.candidateName.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{app.candidateName}</h3>
                    <div className="flex items-center gap-4" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                      <span>{app.email}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      <span 
                        className="flex items-center gap-1" 
                        style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => {
                          if (app.cvFileUrl) {
                            window.open(app.cvFileUrl, '_blank');
                          } else {
                            setSelectedCV(app);
                          }
                        }}
                      >
                        <FileText size={14} /> {app.cvFileUrl ? 'Original CV' : (app.cvContent || 'CV.pdf')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score or Action Button */}
                <div>
                  {app.status === 'pending' && analyzingId !== app.id && (
                    <button 
                      onClick={() => handleAnalyzeCV(app.id)}
                      className="btn" 
                      style={{ 
                        background: 'var(--primary)',
                        color: 'black',
                        padding: '10px 20px', 
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px var(--primary-glow)'
                      }}
                    >
                      <BrainCircuit size={18} /> AI REVIEW NOW
                    </button>
                  )}
                  {analyzingId === app.id && (
                    <div className="flex items-center gap-3" style={{ color: 'var(--primary)', fontWeight: 600, padding: '10px 20px', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', background: 'var(--primary-glow)' }}>
                      <BrainCircuit size={18} className="animate-pulse" /> AI is reading CV...
                    </div>
                  )}
                  {app.status === 'reviewed' && (
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Fit Score</div>
                          <div style={{ fontSize: '2rem', fontWeight: 800, color: getScoreColor(app.aiScore), lineHeight: 1 }}>
                            {app.aiScore}%
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAnalyzeCV(app.id)}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'var(--text-muted)',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: analyzingId === app.id ? 'wait' : 'pointer'
                          }}
                          title="Re-analyze CV"
                        >
                          <BrainCircuit size={16} className={analyzingId === app.id ? 'animate-spin' : ''} />
                        </button>
                      </div>
                  )}
                </div>
              </div>

              {/* AI Analysis Results Section */}
              {app.status === 'reviewed' && app.aiAnalysis && (
                <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                    <BrainCircuit size={16} /> AI Analysis Summary
                  </div>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                    {app.aiAnalysis.summary}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h4 style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> Strengths
                      </h4>
                      <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {app.aiAnalysis.pros.map((pro, i) => <li key={i} style={{ marginBottom: '4px' }}>{pro}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--warning)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BrainCircuit size={14} /> AI Notes / Missing
                      </h4>
                      <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {app.aiAnalysis.cons.map((con, i) => <li key={i} style={{ marginBottom: '4px' }}>{con}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Detected Keywords:</span>
                    <div className="flex flex-wrap gap-2">
                      {app.aiAnalysis.keywordsMatched?.map((kw, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
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
