import React from 'react';

export default function StatusBadge({ status, type }) {
  let bgClass = 'bg-gray-100 text-gray-800';
  let dotClass = '';

  const s = String(status).toLowerCase();

  if (type === 'role') {
    switch (s) {
      case 'patient':
        bgClass = 'bg-purple-50 text-purple-700 border border-purple-200';
        break;
      case 'doctor':
        bgClass = 'bg-blue-50 text-blue-700 border border-blue-200';
        break;
      case 'admin':
        bgClass = 'bg-teal-50 text-teal-700 border border-teal-200';
        break;
      default:
        bgClass = 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  } else if (type === 'user-type') {
    // Normal User / Prime
    if (s === 'prime') {
      bgClass = 'bg-amber-50 text-amber-700 border border-amber-200 font-medium flex items-center gap-1';
    } else {
      bgClass = 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  } else {
    // Standard Statuses
    switch (s) {
      case 'active':
      case 'delivered':
      case 'success':
        bgClass = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
        dotClass = 'bg-emerald-500';
        break;
      case 'inactive':
      case 'cancelled':
      case 'failed':
        bgClass = 'bg-rose-50 text-rose-700 border border-rose-100';
        dotClass = 'bg-rose-500';
        break;
      case 'pending':
      case 'processing':
      case 'shipped':
        bgClass = 'bg-amber-50 text-amber-700 border border-amber-100';
        dotClass = 'bg-amber-500';
        break;
      default:
        bgClass = 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgClass}`}>
      {dotClass && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass}`}></span>}
      {status}
    </span>
  );
}
