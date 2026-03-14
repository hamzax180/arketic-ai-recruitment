import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CareerPage from './pages/CareerPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ApplicationPage from './pages/ApplicationPage';
import HRJobApplications from './pages/HRJobApplications';
import HRDashboard from './pages/HRDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Career Site */}
          <Route index element={<CareerPage />} />
          <Route path="job/:id" element={<JobDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          
          <Route path="apply/:id" element={
            <ProtectedRoute>
              <ApplicationPage />
            </ProtectedRoute>
          } />
          
          {/* HR Admin Panel */}
          <Route path="hr" element={
            <ProtectedRoute role="admin">
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="hr/job/:id/applications" element={
            <ProtectedRoute role="admin">
              <HRJobApplications />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
