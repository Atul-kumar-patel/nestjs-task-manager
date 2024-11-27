'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginError {
  message: string;
  statusCode: number;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate input length according to DTO constraints
    if (username.length < 4 || username.length > 15) {
      setError('Username must be between 4 and 15 characters');
      toast.error('Username must be between 4 and 15 characters');
      return;
    }

    if (password.length < 4 || password.length > 15) {
      setError('Password must be between 4 and 15 characters');
      toast.error('Password must be between 4 and 15 characters');
      return;
    }

    try {
      const response = await api.post('/auth/signin', { username, password });
      const { accessToken } = response.data;
      
      // Store token
      localStorage.setItem('token', accessToken);
      
      // Show success message
      toast.success('Login successful! Redirecting to dashboard...');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err.response?.data);
      
      const errorData: LoginError = err.response?.data;
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        setError('Invalid username or password');
        toast.error('Invalid username or password');
      } else if (err.response?.status === 400) {
        setError(errorData.message || 'Invalid input data');
        toast.error(errorData.message || 'Invalid input data');
      } else {
        setError('Login failed. Please try again later.');
        toast.error('Login failed. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-nightBlue to-nightBlueShadow">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-nightBlue mb-8">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sandTan focus:border-sandTan text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sandTan focus:border-sandTan text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sandTan hover:bg-sandTanShadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sandTan"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-sandTan hover:text-sandTanShadow">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
