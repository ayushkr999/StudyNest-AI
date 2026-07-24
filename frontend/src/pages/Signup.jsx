import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Sparkles, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, err, loading, stopLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Creating your account...');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingMessage('Setting up your study space...');
    try {
      const res = await signup({ name: form.name, email: form.email, password: form.password });
      if (res) {
        setLoadingMessage('Welcome! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate('/');
          setTimeout(() => stopLoading(), 100);
        }, 500);
      }
    } catch (error) {
      setLoadingMessage('Creating your account...');
    }
  };

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#050816] flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl gradient-indigo-purple flex items-center justify-center mx-auto mb-6 shadow-xl"
                style={{ boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
                <Sparkles size={26} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text mb-3">StudyNest AI</h1>
              <div className="flex gap-2 justify-center mb-4">
                <div className="thinking-dot" />
                <div className="thinking-dot" />
                <div className="thinking-dot" />
              </div>
              <p className="text-slate-500 text-sm">{loadingMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page */}
      <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/8 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl gradient-indigo-purple flex items-center justify-center shadow-xl"
                style={{ boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
                <Sparkles size={22} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">
              Join <span className="gradient-text">StudyNest AI</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2">Create your account and start studying smarter</p>
          </div>

          {/* Card */}
          <div className="glass rounded-2xl border border-indigo-500/15 p-8"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(99,102,241,0.08)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-10 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {err && err !== 'Unauthorized' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  <span>⚠️</span>
                  {err}
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full btn btn-primary py-3 text-sm font-semibold"
                style={{ boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus size={16} />
                    Create Account
                  </span>
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;