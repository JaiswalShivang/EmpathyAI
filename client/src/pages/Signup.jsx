import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setMsg('Please agree to the terms and conditions.');
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      setMsg('Registration successful! ' + (role === 'DOCTOR' ? 'Please wait for admin approval before logging in.' : 'You can now sign in.'));
      setTimeout(() => nav('/login'), 2000);
    } catch (err) {
      setMsg(err.message || 'Error registering.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🌱</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Empathy AI</h1>
          <p className="text-gray-600">Start your journey towards better mental health</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">👤</span>
                </div>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">📧</span>
                </div>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔒</span>
                </div>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  type="password"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="PATIENT"
                    checked={role === 'PATIENT'}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-gray-700">Patient seeking support</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="DOCTOR"
                    checked={role === 'DOCTOR'}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-gray-700">Licensed healthcare professional</span>
                </label>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="ml-2">
                <p className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button type="button" className="text-green-600 hover:text-green-800 underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-green-600 hover:text-green-800 underline">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {msg && (
            <div className={`mt-6 p-4 rounded-lg ${msg.includes('successful') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center">
                <span className={msg.includes('successful') ? 'text-green-600 mr-2' : 'text-red-600 mr-2'}>
                  {msg.includes('successful') ? '✅' : '⚠️'}
                </span>
                <p className={`text-sm ${msg.includes('successful') ? 'text-green-700' : 'text-red-700'}`}>{msg}</p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => nav('/login')}
                className="text-green-600 hover:text-green-800 font-semibold"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Note:</span> Doctor accounts require admin approval before they can access the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
