
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  INPLANT: 'inplant',
};

const MOCK_USERS = [
  { id: '1', email: 'admin@example.com', password: 'password', role: ROLES.ADMIN, name: 'Admin User' },
  { id: '2', email: 'recruiter@example.com', password: 'password', role: ROLES.RECRUITER, name: 'Recruiter User' },
  { id: '3', email: 'inplant@example.com', password: 'password', role: ROLES.INPLANT, name: 'Inplant User' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, role: foundUser.role, name: foundUser.name };
      localStorage.setItem('authUser', JSON.stringify(userData));
      setUser(userData);
      
      switch (foundUser.role) {
        case ROLES.ADMIN:
          navigate('/admin');
          break;
        case ROLES.RECRUITER:
          navigate('/recruiter');
          break;
        case ROLES.INPLANT:
          navigate('/inplant');
          break;
        default:
          navigate('/');
      }
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: loading,
    login,
    logout,
    ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
