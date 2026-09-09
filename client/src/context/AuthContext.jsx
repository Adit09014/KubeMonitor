import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`);
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (userData, token) => {
    if (token) {
      localStorage.setItem('jwt_token', token);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    navigate('/');
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

