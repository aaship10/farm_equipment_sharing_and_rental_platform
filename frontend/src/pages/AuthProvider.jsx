import React, { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Initialize state by checking localStorage for BOTH token and ID
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    // If token exists, return the user object (with id), otherwise null
    return token ? { token, id } : null;
  });

  // Updated login function to accept and store userId
  const login = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setUser({ token, id: userId });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};