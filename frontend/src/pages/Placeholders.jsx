import React from 'react';
import { Construction, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce">
        <Construction className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mb-6">
        This section is currently under development. Check back soon for full integration.
      </p>
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
      >
        <LayoutDashboard className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
