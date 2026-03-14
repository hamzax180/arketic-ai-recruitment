import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Building2, UserCircle, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHR = location.pathname.startsWith('/hr');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '12px 0',
      background: 'rgba(18, 18, 18, 0.1)', 
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div className="flex items-center justify-between" style={{ padding: '0 40px', width: '100%' }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
            <Building2 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0 }} className="text-gradient">
              arketic.ai
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Careers Platform</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" style={{ color: !isHR ? 'var(--primary)' : 'var(--text-main)', fontWeight: 500 }}>
            Jobs
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link to="/hr" style={{ color: isHR ? 'var(--secondary)' : 'var(--text-main)', fontWeight: 500 }} className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              )}
              
              <div className="flex items-center gap-2 glass-panel" style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}>
                <User size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
              </div>

              <button onClick={handleLogout} className="flex items-center gap-2" style={{ color: 'var(--error)', fontSize: '0.9rem', fontWeight: 500 }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
