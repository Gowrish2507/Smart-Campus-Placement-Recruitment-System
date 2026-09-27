import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getMe()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await authAPI.login({ username, password });
    const authData = res.data;
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData));
    setUser(authData);
    return authData;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const authData = res.data;
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData));
    setUser(authData);
    return authData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const quickLogin = async (roleType) => {
    let username = '';
    let password = '';

    switch (roleType) {
      case 'student_arun':
        username = 'student_arun';
        password = 'student123';
        break;
      case 'student_ananya':
        username = 'student_ananya';
        password = 'student123';
        break;
      case 'recruiter_google':
        username = 'recruiter_google';
        password = 'google123';
        break;
      case 'recruiter_zoho':
        username = 'recruiter_zoho';
        password = 'zoho123';
        break;
      case 'admin':
        username = 'admin';
        password = 'admin123';
        break;
      default:
        return;
    }

    return await login(username, password);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, quickLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
