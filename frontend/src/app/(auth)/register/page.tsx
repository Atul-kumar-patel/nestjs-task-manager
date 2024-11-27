'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [validations, setValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false
  });

  useEffect(() => {
    setValidations({
      minLength: password.length >= 4,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password)
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { username, password });
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (err: AxiosError) {
      console.error('Frontend: Signup error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.response?.data?.message
      });
      const errorMessage = err.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        setError(errorMessage[0]);
      } else {
        setError(errorMessage || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-nightBlue to-nightBlueShadow">
      <ToastContainer />
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-nightBlue mb-8">
          Create Account
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-nightBlue">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-sandTanShadow focus:border-sandTanShadow bg-gray-50 text-nightBlue"
              required
              minLength={4}
              maxLength={15}
            />
            <p className="mt-1 text-gray-500 text-[10px]">
              Must be 4-15 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-nightBlue">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-sandTanShadow focus:border-sandTanShadow bg-gray-50 text-nightBlue"
              required
            />
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <ul className="text-sm space-y-1">
                {Object.entries(validations).map(([key, isValid]) => (
                  <li key={key} className="flex items-center space-x-2">
                    <span className={isValid ? "text-green-600" : "text-gray-400"}>
                      {isValid ? "✓" : "○"}
                    </span>
                    <span className="text-nightBlue text-[10px] space-y-0">
                      {key === 'minLength' && 'At least 4 characters'}
                      {key === 'hasUpper' && 'One uppercase letter'}
                      {key === 'hasLower' && 'One lowercase letter'}
                      {key === 'hasNumber' && 'One number'}
                      {key === 'hasSpecial' && 'One special character (!@#$%^&*)'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-sandTan hover:bg-sandTanShadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nightBlue transition duration-300"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-nightBlue">
          Already have an account?{' '}
          <Link href="/login" className="text-sandTan hover:text-sandTanShadow font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
