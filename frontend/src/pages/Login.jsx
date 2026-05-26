import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Pill, Activity, ShieldAlert, Lock, Mail } from 'lucide-react';
import { Input } from '../components/FormElements';

export default function Login() {
  const navigate = useNavigate();
  const { login, token, error, loading } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim() || !password.trim()) {
      setValidationError('Please provide both email and password');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* SVG Logo approximating the actual Jiva Health logo style */}
        <div className="flex justify-center mb-4 select-none">
          <svg viewBox="0 0 200 50" className="w-48 h-12">
            <path d="M12 25 C12 12, 28 12, 28 25 S44 38, 44 25" stroke="#10B981" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M28 15 L28 35" stroke="#EF4444" strokeWidth="3" fill="none" />
            {/* Heartbeat spikes */}
            <path d="M18 25 L24 25 L27 10 L31 40 L34 22 L37 28 L43 25" stroke="#EF4444" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="52" y="32" fontFamily="'Outfit', sans-serif" fontSize="24" fontWeight="800" fill="#10B981">
              Jiva
            </text>
            <text x="105" y="32" fontFamily="'Outfit', sans-serif" fontSize="24" fontWeight="400" fill="#EF4444">
              Health
            </text>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">
          Access the clinic administrative console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow-sm border border-gray-100 dark:border-slate-700 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-gray-400 dark:text-slate-500" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jivahealth.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/70 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-gray-400 dark:placeholder-slate-500 text-gray-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-gray-400 dark:text-slate-500" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/70 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-gray-400 dark:placeholder-slate-500 text-gray-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Errors block */}
            {(validationError || error) && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800/50 rounded-xl flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs font-medium">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <p className="leading-relaxed">{validationError || error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-gray-100 dark:border-slate-700 pt-6">
            <div className="text-center text-xs text-gray-400 dark:text-slate-500 font-medium leading-relaxed bg-gray-50/80 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-50 dark:border-slate-800">
              <p className="font-semibold text-gray-600 dark:text-slate-400">Administrative Demo Accounts:</p>
              <p className="mt-1">Admin: <span className="font-mono text-emerald-700 dark:text-emerald-400 selection:bg-emerald-100 dark:selection:bg-emerald-900">admin@jivahealth.com</span> / <span className="font-mono">adminpassword123</span></p>
              <p className="mt-0.5">Nurse: <span className="font-mono text-emerald-700 dark:text-emerald-400 selection:bg-emerald-100 dark:selection:bg-emerald-900">nurse@jivahealth.com</span> / <span className="font-mono">nursepassword123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
