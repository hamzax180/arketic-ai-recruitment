import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, UploadCloud, FileText, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function ApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, addApplication, uploadCV, loading } = useData();
  const { user } = useAuth();
  
  const job = jobs.find(j => j.id === id);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    skills: '',
    cvText: '' 
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  if (loading) return <div className="text-center p-20">Loading application details...</div>;
  if (!job) return <div className="text-center p-20">Job not found</div>;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else if (e.type === 'dragleave') setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload your CV before submitting!");
      return;
    }
    
    setIsSubmitting(true);
    
    let cvFileUrl = null;
    try {
      const uploadResult = await uploadCV(file);
      if (uploadResult && uploadResult.url) {
        cvFileUrl = uploadResult.url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      alert("Failed to upload CV. Please try again.");
      setIsSubmitting(false);
      return;
    }
    
    const result = await addApplication({
      jobId: job.id,
      candidateName: formData.name,
      email: formData.email,
      phone: formData.phone,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      cvContent: formData.cvText || `Full Name: ${formData.name}\nEmail: ${formData.email}\nSkills: ${formData.skills}`,
      cvFileUrl: cvFileUrl
    });

    setIsSubmitting(false);

    if (result.success) {
      alert("Application submitted successfully!");
      navigate('/');
    } else {
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to={`/job/${job.id}`} className="flex items-center gap-2" style={{ color: 'var(--text-muted)', alignSelf: 'flex-start' }}>
        <ArrowLeft size={16} /> Back to Job Details
      </Link>

      <div className="glass-panel" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Apply for <span className="text-gradient">{job.title}</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please fill out the form below and upload your CV.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              required
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              className="form-input" 
              required
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skills (Comma separated)</label>
            <input 
              type="text" 
              className="form-input" 
              required
              placeholder="React, Node.js, Python, Figma..."
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">CV Summary / Professional Experience</label>
            <textarea 
              className="form-input" 
              required
              rows={6}
              placeholder="Paste your CV text or summarize your experience here..."
              value={formData.cvText}
              onChange={(e) => setFormData({...formData, cvText: e.target.value})}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label className="form-label">Upload CV (PDF)</label>
            <div 
              className={`cv-dropzone flex flex-col items-center justify-center gap-4 ${isDragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
              
              {!file ? (
                <>
                  <UploadCloud size={48} color="var(--primary)" />
                  <p style={{ fontSize: '1.1rem' }}>Drag & Drop your CV here<br/>or click to browse</p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Supported formats: PDF, DOCX (Max 5MB)</span>
                </>
              ) : (
                <div className="flex items-center gap-4 p-4" style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid var(--success)', width: '100%', justifyContent: 'center' }}>
                  <FileText size={32} color="var(--success)" />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: 600, color: 'var(--success)' }}>{file.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <CheckCircle color="var(--success)" size={24} style={{ marginLeft: 'auto' }} />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '2rem', padding: '16px', fontSize: '1.1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
