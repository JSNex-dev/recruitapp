import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  INPLANT: 'inplant',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const MOCK_USERS = () => JSON.parse(localStorage.getItem('users')) || [
    { id: '1', email: 'admin@example.com', password: 'password', role: ROLES.ADMIN, name: 'Admin User' },
    { id: '2', email: 'recruiter@example.com', password: 'password', role: ROLES.RECRUITER, name: 'Recruiter User' },
    { id: '3', email: 'inplant@example.com', password: 'password', role: ROLES.INPLANT, name: 'Inplant User' },
  ];


  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(MOCK_USERS()));
    }
    if (!localStorage.getItem('companies')) {
        localStorage.setItem('companies', JSON.stringify([
            { id: 'comp1', name: 'Tech Solutions Inc.'},
            { id: 'comp2', name: 'Innovatech Ltd.'},
            { id: 'comp3', name: 'Global Corp.'},
        ]));
    }
     if (!localStorage.getItem('candidates')) {
        localStorage.setItem('candidates', JSON.stringify([]));
    }


    setLoading(false);
  }, []);

  const login = (email, password) => {
    const currentUsers = MOCK_USERS();
    const foundUser = currentUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, role: foundUser.role, name: foundUser.name };
      localStorage.setItem('authUser', JSON.stringify(userData));
      setUser(userData);
      
      let redirectTo = '/';
      switch (foundUser.role) {
        case ROLES.ADMIN:
          redirectTo = '/admin';
          break;
        case ROLES.RECRUITER:
          redirectTo = '/recruiter';
          break;
        case ROLES.INPLANT:
          redirectTo = '/inplant';
          break;
        default:
          redirectTo = '/';
      }
      return { success: true, message: 'Login successful', redirectTo };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    return { success: true, redirectTo: '/login' };
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