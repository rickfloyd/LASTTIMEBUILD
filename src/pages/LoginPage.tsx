
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      // On successful login, redirect to a private page, e.g., /community/private
      navigate('/community/private');
    } catch (err) {
      // Error is already logged by the useAuth hook, but you can add UI feedback here
      console.error("Failed to login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="neon-card p-8">
          <h1 className="text-3xl font-bold text-center mb-6 neon-card-title">
            Access Private Terminal
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-cyan-300 block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 border border-cyan-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="user@qubit.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold text-cyan-300 block mb-2">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 border border-cyan-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="************"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 disabled:bg-gray-600 transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:shadow-[0_0_25px_rgba(0,255,255,0.9)]"
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          <div className="text-center mt-6">
            <a href="/register" className="text-sm text-gray-400 hover:text-cyan-300">Don't have an account? Register</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
