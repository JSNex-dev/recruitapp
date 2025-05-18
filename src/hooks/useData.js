import { useState, useEffect, useCallback } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

export const useData = () => {
  const [candidates, setCandidates] = useLocalStorage('candidates', []);
  const [users, setUsers] = useLocalStorage('users', [
    { id: '1', email: 'admin@example.com', password: 'password', role: 'admin', name: 'Admin User' },
    { id: '2', email: 'recruiter@example.com', password: 'password', role: 'recruiter', name: 'Recruiter User' },
    { id: '3', email: 'inplant@example.com', password: 'password', role: 'inplant', name: 'Inplant User' },
  ]);
  const [companies, setCompanies] = useLocalStorage('companies', [
    { id: 'comp1', name: 'Tech Solutions Inc.'},
    { id: 'comp2', name: 'Innovatech Ltd.'},
    { id: 'comp3', name: 'Global Corp.'},
  ]);

  const addCandidate = (candidate) => {
    setCandidates(prev => [...prev, { ...candidate, id: `cand-${Date.now()}`, registrationDate: new Date().toISOString().split('T')[0] }]);
  };

  const addUser = (user) => {
    setUsers(prev => [...prev, { ...user, id: `user-${Date.now()}` }]);
  };
  
  const addCompany = (company) => {
    setCompanies(prev => [...prev, { ...company, id: `comp-${Date.now()}` }]);
  };

  const updateCandidateStatus = (candidateId, newStatus) => {
    setCandidates(prevCandidates => 
      prevCandidates.map(candidate => 
        candidate.id === candidateId ? { ...candidate, estatus: newStatus } : candidate
      )
    );
  };
  
  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };


  return {
    candidates,
    addCandidate,
    updateCandidateStatus,
    users,
    addUser,
    getUserById,
    companies,
    addCompany,
  };
};