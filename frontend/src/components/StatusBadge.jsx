import React from 'react';

export default function StatusBadge({ status, type }) {
  let bgClass = 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  let dotClass = '';

  const s = String(status).toLowerCase();

  if (type === 'role') {
    switch (s) {
      case 'patient':
        bgClass = 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60';
        break;
      case 'doctor':
        bgClass = 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60';
        break;
      case 'admin':
        bgClass = 'bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60';
        break;
      default:
        bgClass = 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  } else if (type === 'user-type') {
    // Normal User / Prime
    if (s === 'prime') {
      bgClass = 'bg-amber-50 text-amber-700 border border-amber-200 font-medium flex items-center gap-1 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60';
    } else {
      bgClass = 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  } else {
    // Standard Statuses
    switch (s) {
      case 'active':
      case 'delivered':
      case 'success':
        bgClass = 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60';
        dotClass = 'bg-emerald-500';
        break;
      case 'inactive':
      case 'cancelled':
      case 'failed':
        bgClass = 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60';
        dotClass = 'bg-rose-500';
        break;
      case 'pending':
      case 'processing':
      case 'shipped':
        bgClass = 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60';
        dotClass = 'bg-amber-500';
        break;
      default:
        bgClass = 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgClass}`}>
      {dotClass && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass}`}></span>}
      {status}
    </span>
  );
}
