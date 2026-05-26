import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50/50 dark:bg-slate-950 text-gray-800 dark:text-slate-100">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
