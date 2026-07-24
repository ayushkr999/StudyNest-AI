import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios.js';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [status, setStatus] = useState('Waking up backend...');
  const [dots, setDots] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 12;
    let dotsInterval;
    let timeInterval;

    dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    timeInterval = setInterval(() => {
      setTimeElapsed(prev => {
        const next = prev + 1;
        setProgress(Math.min((next / 60) * 100, 95));
        return next;
      });
    }, 1000);

    const wakeUpBackend = async () => {
      attempts++;
      try {
        let response;
        try {
          response = await axiosInstance.get('/api/health', { timeout: 5000 });
        } catch (healthError) {
          response = await axiosInstance.get('/api/auth/checkAuth', { timeout: 8000 });
        }
        setStatus('Server is ready!');
        setProgress(100);
        setTimeout(() => onLoadingComplete(), 800);
        return true;
      } catch (error) {
        if (attempts >= maxAttempts) {
          setStatus('Proceeding to app...');
          setProgress(100);
          setTimeout(() => onLoadingComplete(), 1500);
          return true;
        }
        if (attempts <= 3) setStatus('Waking up backend...');
        else if (attempts <= 6) setStatus('Almost there, hang tight...');
        else setStatus('Just a few more seconds...');
        const delay = Math.min(3000 + (attempts * 1000), 8000);
        setTimeout(wakeUpBackend, delay);
        return false;
      }
    };

    wakeUpBackend();

    return () => {
      clearInterval(dotsInterval);
      clearInterval(timeInterval);
    };
  }, [onLoadingComplete]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${s}s`;
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="text-center space-y-8 px-6 max-w-lg relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl gradient-indigo-purple flex items-center justify-center shadow-xl"
            style={{ boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
            <Sparkles size={30} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-[Space_Grotesk] mb-1">
              <span className="gradient-text">StudyNest AI</span>
            </h1>
            <p className="text-slate-500 text-sm">Your intelligent study companion</p>
          </div>
        </motion.div>

        {/* Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-900" />
            <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
          </div>

          <div>
            <p className="text-slate-300 font-medium text-lg">{status}{dots}</p>
            <p className="text-slate-600 text-sm mt-1">Time elapsed: {formatTime(timeElapsed)}</p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4f46e5, #a855f7, #06b6d4)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-4 border border-indigo-500/10 text-sm text-slate-500"
        >
          Free tier services sleep after inactivity. This typically takes 30–60 seconds on first load. Please wait.
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
