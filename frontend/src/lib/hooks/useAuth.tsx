'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';

interface LoginCredentials {
  username: string;
  password: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/signin', credentials);
      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);
      setIsAuthenticated(true);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    try {
      await api.get('/tasks');
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, isLoading, login, logout, checkAuth };
};
