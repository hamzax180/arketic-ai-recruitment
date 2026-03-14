import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('arketic_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:8001/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    // FastAPI OAuth2 expects form-data
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch('http://localhost:8001/token', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.access_token;
      
      // Decode JWT locally for immediate UI update (optional, or just fetch /me)
      // Here we just set the token and the effect will fetch the user
      localStorage.setItem('arketic_token', accessToken);
      setToken(accessToken);
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.detail || 'Login failed' };
    }
  };

  const signup = async (userData) => {
    const response = await fetch('http://localhost:8001/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      // After signup, we log them in
      return login(userData.email, userData.password);
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.detail || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('arketic_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
