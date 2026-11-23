import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Toast } from '../common/Toast';

export const AppLayout = () => {
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0D1117] transition-colors duration-200">
      <Toast />
      <Sidebar />
      <Navbar />
      <main
        className={`p-6 transition-all duration-300 min-h-[calc(100vh-4rem)] ${
          sidebarOpen ? 'pl-[17.5rem]' : 'pl-24'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
