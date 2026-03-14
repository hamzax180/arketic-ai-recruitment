import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      // Redirect based on what we expect (we can check user role in AuthContext or here)
      // For now, let's just go home, if admin the navbar will show dashboard
      navigate('/');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in" style={{ minHeight: '70vh' }}>
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-glow)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogIn size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Login to your arketic.ai account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '40px' }}
                placeholder="admin@arketic.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p style={{ color: 'var(--error)', fontSize: '0.9rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px' }} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
