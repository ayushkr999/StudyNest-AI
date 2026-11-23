import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#0D1117]">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mb-4 shadow-lg animate-bounce">
          <span className="font-black text-xl">SN</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
          <span>Restoring StudyNest session...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
