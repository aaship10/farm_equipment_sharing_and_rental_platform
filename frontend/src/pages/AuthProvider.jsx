import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Initialize state by checking localStorage for token, ID and name
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    // If token exists, return the user object (with id and name), otherwise null
    return token ? { token, id, name } : null;
  });

  // Updated login function to accept and store userId and name
  const login = (token, userId, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    if (name) localStorage.setItem('name', name);
    setUser({ token, id: userId, name });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    setUser(null);
  };

  // If we have a user but no name stored, fetch the profile to get the full name
  useEffect(() => {
    const fetchProfileName = async () => {
      if (user && !user.name && user.id) {
        try {
          const res = await fetch(`http://localhost:3000/api/users/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.full_name) {
              localStorage.setItem('name', data.full_name);
              setUser(prev => ({ ...prev, name: data.full_name }));
            }
          }
        } catch (err) {
          console.error('Failed to fetch user profile', err);
        }
      }
    };
    fetchProfileName();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};