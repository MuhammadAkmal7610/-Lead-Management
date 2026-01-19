import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../stores/authStore'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/login`, {
        email,
        password,
      });
      login(res.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
  <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
    
    {/* Header */}
    <div className="text-center mb-8">
      <h2 className="text-3xl font-semibold text-gray-800">Welcome back</h2>
      <p className="text-sm text-gray-500 mt-1">
        Sign in to continue to <span className="font-medium text-gray-700">PropNest</span>
      </p>
    </div>

    {/* Error */}
    {error && (
      <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          required
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span />
        <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 transition"
      >
        Sign In
      </button>
    </form>

    {/* Footer */}
    <div className="mt-6 text-center text-sm text-gray-600">
      Don’t have an account?{" "}
      <a href="/register" className="font-medium text-blue-600 hover:underline">
        Create one
      </a>
    </div>
  </div>
</div>

  );
}