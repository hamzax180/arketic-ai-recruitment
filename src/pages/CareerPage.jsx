import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function CareerPage() {
  const { jobs } = useData();
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Shape the Future <br />
          <span className="text-gradient">With arketic.ai</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Join our world-class team and help us build AI-powered solutions that revolutionize industries.
        </p>
      </div>

      {/* Open Positions */}
      <div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          Open Positions ({jobs.length})
        </h2>
        
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <Link key={job.id} to={`/job/${job.id}`}>
              <div className="glass-panel job-card flex justify-between items-center animate-fade-in" style={{ animationDelay: `${job.id * 0.1}s` }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '8px' }}>{job.title}</h3>
                  <div className="flex items-center gap-6" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span className="flex items-center gap-2"><Briefcase size={16} /> {job.department}</span>
                    <span className="flex items-center gap-2"><MapPin size={16} /> {job.location}</span>
                    <span className="flex items-center gap-2"><Clock size={16} /> {job.type}</span>
                  </div>
                </div>
                <div>
                  <button className="btn btn-outline" style={{ borderRadius: 'var(--radius-sm)' }}>
                    View Roles →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
