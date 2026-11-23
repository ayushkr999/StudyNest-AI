import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#FAF9F6] dark:bg-[#0D1117]">
      <span className="text-6xl font-black text-emerald-800 dark:text-emerald-500">404</span>
      <h1 className="mt-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">
        Page Not Found
      </h1>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
        The study page or resource you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => navigate('/dashboard')} variant="primary" size="md" icon={Home}>
        Back to Dashboard
      </Button>
    </div>
  );
};
