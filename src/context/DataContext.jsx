import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:8001' : '/api';

export function DataProvider({ children }) {
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/jobs`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    if (!token || user?.role !== 'admin') {
      setApplications([]);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }, [token, user]);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchApplications()]);
      setLoading(false);
    };
    initData();
  }, [fetchJobs, fetchApplications]);

  const addJob = async (jobData) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });
      if (response.ok) {
        const newJob = await response.json();
        setJobs(prev => [newJob, ...prev]);
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
    return { success: false };
  };

  const addApplication = async (appData) => {
    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      if (response.ok) {
        const newApp = await response.json();
        setApplications(prev => [newApp, ...prev]);
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding application:', error);
    }
    return { success: false };
  };

  const uploadCV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
    }
    return null;
  };

  const updateApplicationAI = (appId, aiScore, aiAnalysis) => {
    setApplications(apps => apps.map(app => 
      app.id === appId ? { ...app, status: 'reviewed', aiScore, aiAnalysis } : app
    ));
  };

  const deleteApplication = async (applicationId, token) => {
    try {
      const response = await fetch(`${API_URL}/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setApplications(prev => prev.filter(app => app.id !== applicationId));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error deleting application:', error);
      return { success: false };
    }
  };

  const deleteJob = async (jobId, token) => {
    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setJobs(prev => prev.filter(job => job.id !== jobId));
        // Cascading delete in local UI state
        setApplications(prev => prev.filter(app => app.jobId !== jobId));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error deleting job:', error);
      return { success: false };
    }
  };

  return (
    <DataContext.Provider value={{ 
      jobs, 
      applications, 
      setJobs, 
      setApplications, 
      addJob, 
      addApplication,
      uploadCV,
      updateApplicationAI,
      deleteApplication,
      deleteJob,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
