import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Clock, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { jobs, loading } = useData();
  const job = jobs.find(j => j.id === id);

  if (loading) {
    return <div className="text-center p-20">Loading job details...</div>;
  }

  if (!job) {
    return <div className="text-center p-20">Job not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--text-muted)', alignSelf: 'flex-start' }}>
        <ArrowLeft size={16} /> Back to Careers
      </Link>

      <div className="glass-panel" style={{ padding: '40px' }}>
        <div className="flex justify-between items-start" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="text-gradient">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-6" style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              <span className="flex items-center gap-2"><Briefcase size={18} color="var(--primary)" /> {job.department}</span>
              <span className="flex items-center gap-2"><MapPin size={18} color="var(--primary)" /> {job.location}</span>
              <span className="flex items-center gap-2"><Clock size={18} color="var(--primary)" /> {job.type}</span>
              <span className="flex items-center gap-2"><Calendar size={18} color="var(--primary)" /> {job.postedAt}</span>
            </div>
          </div>
          <Link to={`/apply/${job.id}`}>
            <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
              Apply Now
            </button>
          </Link>
        </div>

        <div style={{ padding: '24px 0', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>About the Role</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '1.05rem' }}>
            {job.description}
          </p>

          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Requirements</h3>
          <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '20px', fontSize: '1.05rem' }}>
            {job.requirements.map((req, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{req}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
